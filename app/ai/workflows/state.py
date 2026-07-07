from typing import TypedDict

from app.ai.schemas.incident import SourceModel


class IncidentState(TypedDict):
    title: str
    description: str

    # Knowledge Agent
    summary: str
    root_cause: str
    resolution_steps: list[str]
    escalation_team: str
    knowledge_confidence: float
    sources: list[SourceModel]

    # Classification Agent
    category: str
    category_confidence: float
    category_reason: str

    # Priority Agent
    priority: str
    priority_confidence: float
    priority_reason: str