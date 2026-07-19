from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domain.enums import (
    RequestCategory,
    RequestPriority,
    RequestStatus,
)


class CreateRequest(BaseModel):
    """Request submitted by an end user."""

    title: str = Field(..., min_length=5, max_length=200)

    description: str = Field(..., min_length=10)

    category: RequestCategory

    priority: RequestPriority

class RequestResponse(BaseModel):
    id: UUID

    title: str

    description: str

    category: RequestCategory

    priority: RequestPriority

    status: RequestStatus

    resolution_summary: str | None

    assigned_team: str | None

    model_config = ConfigDict(from_attributes=True)