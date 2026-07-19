import uuid
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from fastapi import APIRouter
from app.services.request_service import RequestService
from app.domain.enums import RequestPriority
from app.ai.schemas.incident import (
    IncidentAnalysisRequest,
    IncidentAnalysisResponse,
)
from app.ai.workflows.incident_analysis import incident_workflow
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.request_service import RequestService
from app.services.ingestion_service import IngestionService
from app.domain.enums import RequestStatus
from langgraph.types import Command

from app.schemas.resume import ResumeRequest

router = APIRouter(
    prefix="/api/v1/incidents",
    tags=["Incident AI"],
)


@router.post(
    "/analyze",
    response_model=IncidentAnalysisResponse,
)
def analyze_incident(
    request: IncidentAnalysisRequest,
    db: Session = Depends(get_db)  # Add db session dependency
):
    config = {
        "configurable": {
            "thread_id": str(uuid.uuid4())
        }
    }

   

    print(f"Thread ID: {config['configurable']['thread_id']}")
    result = incident_workflow.invoke(
        {
            "title": request.title,
            "description": request.description,
        },
        config=config
    )

    # If request_id was provided, write back the Jira Key and final calculated priority to MySQL
    jira_key = result.get("jira_issue_key")
    if request.request_id and jira_key:
        service = RequestService(db)
        
        # Map agent priority string (P1-P4) to RequestPriority enum
        calculated_priority_str = result.get("priority", "P3")
        try:
            calculated_priority = RequestPriority[calculated_priority_str]
        except KeyError:
            calculated_priority = RequestPriority.P3
        service.update_jira_key(
            request_id=request.request_id,
            jira_key=jira_key,
            priority=calculated_priority
        )

    return IncidentAnalysisResponse(
        summary=result["summary"],
        root_cause=result["root_cause"],
        resolution_steps=result["resolution_steps"],
        escalation_team=result["escalation_team"],
        knowledge_confidence=result["knowledge_confidence"], 
        sources=result["sources"],    
        category=result["category"],
        category_confidence=result["category_confidence"],
        category_reason=result["category_reason"],
        priority=result["priority"],
        priority_confidence=result["priority_confidence"],  
        priority_reason=result["priority_reason"],
        jira_issue_key=result.get("jira_issue_key"),  # New mapped field
    )




@router.post("/resume")
def resume_incident(
    request: ResumeRequest,
):

    config = {
        "configurable": {
            "thread_id": request.thread_id
        }
    }

    result = incident_workflow.invoke(
        Command(
            resume={
                "status": request.status.value,
                "approved_by": request.approved_by,
            }
        ),
        config=config,
    )

    return result