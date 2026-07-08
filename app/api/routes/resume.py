
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.resume import ResumeRequest
from app.services.request_service import RequestService


router = APIRouter(
    prefix="/requests",
    tags=["Requests"],
)

@router.post("/resume")
def resume(request: ResumeRequest):

    return workflow_service.resume(request)


router = APIRouter(
    prefix="/requests",
    tags=["Requests"],
)