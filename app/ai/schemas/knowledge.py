from unittest import result

from pydantic import BaseModel

from app.ai.schemas.incident import SourceModel

class KnowledgeRequest(BaseModel):
    question: str


class KnowledgeResponse(BaseModel):
     summary: str
     root_cause: str
     resolution_steps: list[str]
     escalation_team: str
     knowledge_confidence: float
     sources: list[SourceModel]