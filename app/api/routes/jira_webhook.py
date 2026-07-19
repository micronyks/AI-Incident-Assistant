from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.request_service import RequestService
from app.services.ingestion_service import IngestionService
from app.domain.enums import RequestStatus
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/jira",
    tags=["Jira Webhook"],
)

def run_async_ingestion(issue_key: str, title: str, description: str, resolution_summary: str, category: str):
    """Runs the Qdrant ingestion in the background to prevent blocking the HTTP response."""
    try:
        ingestion_service = IngestionService()
        ingestion_service.ingest_resolved_incident(
            issue_key=issue_key,
            title=title,
            description=description,
            resolution_summary=resolution_summary,
            category=category
        )
    except Exception as e:
        logger.error(f"Async ingestion failed for {issue_key}: {e}")

@router.post("/webhook")
async def jira_webhook(
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Receives issue updates from Jira Cloud Webhooks.
    """
    logger.info("Received webhook trigger from Jira.")
    
    # Verify the webhook structure contains the issue details
    issue = payload.get("issue")
    if not issue:
        logger.warning("Invalid webhook payload: 'issue' object missing.")
        raise HTTPException(status_code=400, detail="Invalid payload")

    issue_key = issue.get("key")  # e.g., "IM-123"
    fields = issue.get("fields", {})
    
    # 1. Parse Status
    status_object = fields.get("status", {})
    status_name = status_object.get("name", "").upper()  # e.g. "IN PROGRESS", "DONE", "RESOLVED"
    
    logger.info(f"Processing webhook for issue: {issue_key} with status: {status_name}")

    # Map Jira status to our database RequestStatus Enum
    # Adjust mappings depending on your Jira workflows
    status_mapping = {
        "TO DO": RequestStatus.OPEN,
        "IN PROGRESS": RequestStatus.IN_PROGRESS,
        "DONE": RequestStatus.RESOLVED,
        "RESOLVED": RequestStatus.RESOLVED,
    }
    target_status = status_mapping.get(status_name)

    # 2. Update local MySQL Database
    request_service = RequestService(db)
    # Fetch the request matching this Jira key
    db_request = request_service.get_by_jira_key(issue_key)
    
    if not db_request:
        logger.warning(f"No corresponding local request found in MySQL for Jira ticket {issue_key}.")
        return {"status": "ignored", "message": "Ticket key not recognized locally."}

    if target_status:
        request_service.update_status(db_request.id, target_status)
        logger.info(f"Updated MySQL request {db_request.id} status to {target_status.name}.")

    # 3. Handle Qdrant Ingestion if Resolved/Done
    if target_status == RequestStatus.RESOLVED:
        resolution_notes = fields.get("resolutioncomment", {}).get("body", "") or "No resolution details provided."
        
        # Trigger async ingestion
        background_tasks.add_task(
            run_async_ingestion,
            issue_key=issue_key,
            title=fields.get("summary", ""),
            description=fields.get("description", ""),
            resolution_summary=resolution_notes,
            category=db_request.category.name if db_request.category else "OTHER"
        )

    return {"status": "processed"}
