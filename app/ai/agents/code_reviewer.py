import json
import httpx
from langchain_core.prompts import ChatPromptTemplate
from app.ai.providers.llm_provider import LLMProvider
from app.ai.mcp.mcp_client import GitHubMCPClient

class CodeReviewerAgent:
    """
    Agent responsible for reviewing Pull Requests on GitHub.
    Uses MCP tools to fetch diffs and post review comments.
    """

    def __init__(self):
        self.llm = LLMProvider.get_llm()
        self.mcp_client = GitHubMCPClient()
        
        self.system_prompt = """You are a Principal Software Architect and code reviewer.
Your job is to review the code changes (diff) for a Pull Request and provide high-quality review comments.

Review criteria:
1. **SOLID Principles**: Verify that classes and modules adhere to Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
2. **Clean Code**: Check for DRY (Don't Repeat Yourself), readability, naming conventions, and logical simplicity.
3. **Security**: Identify hardcoded credentials, SQL injection, or unvalidated inputs.
4. **Performance**: Spot inefficient loops, database connection leaks, or redundant calls.

Respond with a JSON block containing list of comments you want to make on the code.
Format your output exactly as a JSON list of objects:
[
  {{
    "path": "relative/path/to/file.py",
    "position": 10, 
    "body": "Your review suggestion, explanation, and example fix."
  }}
]
Only return the valid JSON array of objects. Do not include markdown code block syntax (like ```json) in your raw response.
"""
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Please review this Pull Request diff:\n\n{diff}")
        ])

    def _filter_and_truncate_diff(self, diff_text: str, max_chars: int = 25000) -> str:
        """
        Filters the raw diff to remove lockfiles, build logs, and third-party files.
        Truncates the diff if it exceeds max_chars.
        """
        file_diffs = diff_text.split("diff --git ")
        filtered_diffs = []
        
        ALLOWED_EXTENSIONS = [".py", ".ts", ".tsx", ".js", ".scss", ".css", ".html"]
        SKIP_FILES = ["package-lock.json", "uv.lock", "yarn.lock", ".gitignore", "tsconfig.json"]

        for file_diff in file_diffs:
            if not file_diff.strip():
                continue
            
            header_line = file_diff.split("\n")[0]
            
            skip = False
            for skip_file in SKIP_FILES:
                if skip_file in header_line:
                    skip = True
                    break
                    
            if skip:
                continue
                
            has_allowed_ext = False
            for ext in ALLOWED_EXTENSIONS:
                if header_line.strip().endswith(ext) or (ext + " ") in header_line:
                    has_allowed_ext = True
                    break
                    
            if has_allowed_ext:
                filtered_diffs.append("diff --git " + file_diff)
                
        reconstructed_diff = "\n".join(filtered_diffs)
        
        if len(reconstructed_diff) > max_chars:
            print(f"Diff length ({len(reconstructed_diff)} chars) exceeds limit. Truncating to {max_chars} chars.")
            reconstructed_diff = reconstructed_diff[:max_chars] + "\n\n... [Diff Truncated due to size] ..."
            
        return reconstructed_diff

    async def review_pull_request(self, owner: str, repo: str, pull_number: int):
        """
        Executes the code review flow:
        1. Fetch PR metadata using MCP tool.
        2. Retrieve Diff content using HTTP client.
        3. Filter out irrelevant files (lockfiles, etc.)
        4. Run LLM review chain.
        5. Post comments using MCP tool.
        """
        print(f"Starting review for PR #{pull_number} in {owner}/{repo}...")

        # 1. Fetch Pull Request Metadata to get diff_url
        pr_result = await self.mcp_client.call_tool(
            tool_name="get_pull_request",
            arguments={"owner": owner, "repo": repo, "pull_number": pull_number}
        )
        
        pr_json_text = ""
        if pr_result and isinstance(pr_result, list):
            pr_json_text = pr_result[0].text if hasattr(pr_result[0], 'text') else str(pr_result[0])
        else:
            pr_json_text = str(pr_result)

        try:
            pr_data = json.loads(pr_json_text)
            diff_url = pr_data.get("diff_url")
        except Exception as e:
            print(f"Failed to parse PR metadata: {e}")
            return "Failed to parse PR metadata."

        if not diff_url:
            print("No diff_url found in PR metadata.")
            return "No diff_url found."

        # 2. Fetch the actual raw diff via HTTP client
        print(f"Fetching diff from: {diff_url}")
        headers = {}
        if self.mcp_client.token:
            headers["Authorization"] = f"token {self.mcp_client.token}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(diff_url, headers=headers, follow_redirects=True)
            if response.status_code != 200:
                print(f"Failed to fetch diff: HTTP {response.status_code}")
                return "Failed to fetch diff."
            diff_text = response.text

        if not diff_text.strip():
            print("No diff found or PR is empty.")
            return "No changes to review."

        # 3. Filter the diff to only keep relevant code files
        diff_text = self._filter_and_truncate_diff(diff_text)
        print(f"Filtered diff size: {len(diff_text)} characters.")

        if not diff_text.strip() or diff_text.startswith("... [Diff"):
            print("No reviewable code changes found after filtering.")
            return "No reviewable code changes."

        # 4. Invoke the LLM to get the structured reviews
        chain = self.prompt | self.llm
        response = chain.invoke({"diff": diff_text})
        
        # Parse the structured comment array
        raw_content = response.content.strip()
        # Strip any formatting markdown if generated
        if raw_content.startswith("```json"):
            raw_content = raw_content[7:]
        if raw_content.endswith("```"):
            raw_content = raw_content[:-3]
        raw_content = raw_content.strip()

        try:
            review_comments = json.loads(raw_content)
        except Exception as e:
            print(f"Failed to parse LLM response as JSON. Raw response:\n{raw_content}")
            return "Failed to parse review output."

        # 5. Post review comments back to GitHub using the MCP tool
        if review_comments:
            # We construct a review payload matching the MCP 'create_pull_request_review' tool requirements
            await self.mcp_client.call_tool(
                tool_name="create_pull_request_review",
                arguments={
                    "owner": owner,
                    "repo": repo,
                    "pull_number": pull_number,
                    "event": "COMMENT",
                    "body": "👋 Code review completed by AI Architect Agent. See detailed suggestions below:",
                    "comments": review_comments
                }
            )
            print(f"Successfully posted {len(review_comments)} review comments to PR #{pull_number}.")
        else:
            print("No issues found. LGTM!")
            await self.mcp_client.call_tool(
                tool_name="create_issue_comment",
                arguments={
                    "owner": owner,
                    "repo": repo,
                    "number": pull_number,
                    "body": "🎉 AI Architect Code Review: LGTM (Looks Good To Me)! No architectural or SOLID violations detected."
                }
            )

        return review_comments
