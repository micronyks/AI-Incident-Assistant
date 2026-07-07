from enum import Enum

from pydantic import BaseModel, Field


class IncidentPriority(str, Enum):
   P1= "P1"
   P2= "P2"
   P3= "P3"
   P4= "P4"


class PriorityResult(BaseModel):
    priority: IncidentPriority
    priority_confidence: float = Field(ge=0.0, le=1.0)
    priority_reason: str