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

    priority: RequestPriority = RequestPriority.P3

    resolution_summary: str | None = Field(None, min_length=10)

    assigned_team: str | None = Field(None, min_length=3, max_length=100)


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