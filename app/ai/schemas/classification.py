from enum import Enum

from pydantic import BaseModel, Field


class IncidentCategory(str, Enum):
    BUG = "BUG"
    FEATURE = "FEATURE"
    HARDWARE = "HARDWARE"
    SOFTWARE = "SOFTWARE"
    NETWORK = "NETWORK"
    ACCESS = "ACCESS"


class ClassificationResult(BaseModel):
    category: IncidentCategory
    confidence: float = Field(ge=0.0, le=1.0)
    reason: str