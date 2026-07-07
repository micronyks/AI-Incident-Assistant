from fastapi import APIRouter

from app.ai.schemas.incident import (
    IncidentAnalysisRequest,
    IncidentAnalysisResponse,
)
from app.ai.workflows.incident_analysis import incident_workflow

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
    result = incident_workflow.invoke(
        {
            "title": request.title,
            "description": request.description,
        }
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
