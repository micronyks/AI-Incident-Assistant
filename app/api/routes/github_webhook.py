from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
from app.ai.agents.code_reviewer import CodeReviewerAgent

router = APIRouter(
    prefix="/api/v1/github",
    tags=["GitHub Webhook"],
)

reviewer_agent = CodeReviewerAgent()

async def run_async_review(owner: str, repo: str, pull_number: int):
    """Asynchronous background task to run the code reviewer agent"""
    try:
        await reviewer_agent.review_pull_request(owner, repo, pull_number)
    except Exception as e:
        print(f"Error during async code review execution: {str(e)}")

@router.post("/webhook")
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Accepts GitHub Webhook events.
    Listens for 'pull_request' actions (opened, synchronized) to trigger review.
    """
    # 1. Parse payload
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # 2. Check header or payload fields
    action = payload.get("action")
    pull_request = payload.get("pull_request")
    repository = payload.get("repository")

    if not pull_request or not repository:
        return {"status": "ignored", "reason": "Not a pull request webhook event"}

    # We trigger the review when a PR is opened or new code is pushed (synchronize)
    if action in ["opened", "synchronize", "reopened"]:
        pull_number = pull_request.get("number")
        repo_name = repository.get("name")
        owner = repository.get("owner", {}).get("login")

        if pull_number and repo_name and owner:
            # 3. Add to FastAPI background tasks so we return immediately to GitHub
            background_tasks.add_task(run_async_review, owner, repo_name, pull_number)
            return {
                "status": "triggered",
                "action": action,
                "repo": f"{owner}/{repo_name}",
                "pull_number": pull_number
            }

    return {"status": "ignored", "action": action, "reason": "Action type does not require review"}
