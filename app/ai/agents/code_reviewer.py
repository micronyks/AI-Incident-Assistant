import json
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
  {
    "path": "relative/path/to/file.py",
    "position": 10, 
    "body": "Your review suggestion, explanation, and example fix."
  }
]
Only return the valid JSON array of objects. Do not include markdown code block syntax (like ```json) in your raw response.
"""
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "Please review this Pull Request diff:\n\n{diff}")
        ])

    async def review_pull_request(self, owner: str, repo: str, pull_number: int):
        """
        Executes the code review flow:
        1. Fetch PR diff using MCP tool.
        2. Run LLM review chain.
        3. Post comments using MCP tool.
        """
        print(f"Starting review for PR #{pull_number} in {owner}/{repo}...")

        # 1. Fetch the Pull Request Diff using the MCP tool
        # The GitHub MCP server exposes 'get_pull_request_diff'
        diff_result = await self.mcp_client.call_tool(
            tool_name="get_pull_request_diff",
            arguments={"owner": owner, "repo": repo, "pull_number": pull_number}
        )
        
        diff_text = ""
        if diff_result and isinstance(diff_result, list):
            diff_text = diff_result[0].text if hasattr(diff_result[0], 'text') else str(diff_result[0])
        else:
            diff_text = str(diff_result)

        if not diff_text.strip():
            print("No diff found or PR is empty.")
            return "No changes to review."

        # 2. Invoke the LLM to get the structured reviews
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

        # 3. Post review comments back to GitHub using the MCP tool
        # The GitHub MCP server exposes 'create_pull_request_review' or 'create_pull_request_comment'
        # We will create a pull request review with multiple comments
        if review_comments:
            # We construct a review payload matching the MCP 'create_pull_request_review' tool requirements
            # Tool parameters: owner, repo, pull_number, event (e.g. COMMENT), comments, body (optional)
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
