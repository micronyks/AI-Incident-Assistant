from pydantic import BaseModel


class IncidentAnalysisRequest(BaseModel):
    title: str
    description: str


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