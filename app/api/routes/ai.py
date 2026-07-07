from fastapi import APIRouter

from app.ai.agents.knowledge_agent import KnowledgeAgent
from app.ai.schemas.knowledge import (
    KnowledgeRequest,
    KnowledgeResponse,
)

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
)

agent = KnowledgeAgent()


@router.post(
    "/knowledge",
    response_model=KnowledgeResponse,
)
def ask_knowledge(
    request: KnowledgeRequest,
):

    result = agent.run(request.question)

    return KnowledgeResponse(
        summary=result["summary"],
        root_cause=result["root_cause"],
        resolution_steps=result["resolution_steps"],
        escalation_team=result["escalation_team"],
        knowledge_confidence=result["knowledge_confidence"],
        sources=result["sources"],
    )