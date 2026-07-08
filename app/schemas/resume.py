from enum import Enum

from pydantic import BaseModel


class ApprovalStatus(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ResumeRequest(BaseModel):
    thread_id: str
    approved_by: str
    status: ApprovalStatus