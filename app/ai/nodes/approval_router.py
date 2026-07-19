from langgraph.graph import END

from app.ai.workflows.state import IncidentState
from app.domain.enums import RequestCategory


def approval_router(state: IncidentState):

    if state["category"] == RequestCategory.HARDWARE:
        return "approval"

    return 'jira_creation'