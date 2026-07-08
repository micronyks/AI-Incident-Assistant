import uuid

from fastapi import APIRouter

from app.ai.schemas.incident import (
    IncidentAnalysisRequest,
    IncidentAnalysisResponse,
)
from app.ai.workflows.incident_analysis import incident_workflow

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