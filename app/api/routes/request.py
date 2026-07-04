from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.request import CreateRequest, RequestResponse
from app.services.request_service import RequestService

router = APIRouter(
    prefix="/requests",
    tags=["Requests"],
)

service = RequestService()


@router.post("", response_model=RequestResponse)
def create_request(
    request: CreateRequest,
    db: Session = Depends(get_db),
):
    entity = service.create(db, request)

    return RequestResponse.model_validate(entity)