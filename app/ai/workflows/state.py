from typing import TypedDict

from app.ai.schemas.incident import SourceModel
from app.domain.enums import RequestCategory


class IncidentState(TypedDict):
    title: str
    description: str
    request_Id: str
    thread_Id: str
    reported_category: RequestCategory

    # Knowledge Agent
    summary: str
    root_cause: str
    resolution_steps: list[str]
    escalation_team: str
    knowledge_confidence: float
    sources: list[SourceModel]
    similar_incidents: list[str]  # List of similar incidents with their details
    assigned_team: str  # The team assigned to handle the incident

    # Classification Agent
    category: str
    category_confidence: float
    category_reason: str

    # Priority Agent
    priority: str
    priority_confidence: float
    priority_reason: str

    # Reviewer
    review_approved: bool
    review_comments: str
    review_confidence: float
    requires_human_approval: bool

    # HITL
    approval_status: str
    approved_by: str

    # Jira
    jira_issue_key: str