from pydantic import BaseModel, Field


class IncidentAnalysisRequest(BaseModel):
    title: str
    description: str
    request_id: str | None = None  # Add this field


# 1. Define the new inner structure
class SourceModel(BaseModel):
    file: str
    category: str
    score: float


class IncidentAnalysisResponse(BaseModel):
    summary: str
    root_cause: str
    resolution_steps: list[str]
    escalation_team: str
    knowledge_confidence: float
    sources: list[SourceModel]

    category: str
    category_confidence: float
    category_reason: str

    priority: str = "UNKNOWN"
    priority_confidence: float
    priority_reason: str
    
    jira_issue_key: str | None = Field(default=None, description="The created Jira ticket reference key.")