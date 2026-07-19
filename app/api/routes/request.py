from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.request import CreateRequest
from app.schemas.request import RequestResponse
from app.services.request_service import RequestService

router = APIRouter(
    prefix="/api/v1/requests",
    tags=["Requests"],
)


@router.post(
    "",
    response_model=RequestResponse,
)
def create_request(
    request: CreateRequest,
    db: Session = Depends(get_db),
):

    service = RequestService(db)

    entity = service.create(request)

    return RequestResponse.model_validate(entity)