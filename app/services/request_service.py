from uuid import uuid4

from sqlalchemy.orm import Session

from app.domain.enums import RequestStatus
from app.models.request import Request
from app.repositories.request_repository import RequestRepository
from app.schemas.request import CreateRequest


class RequestService:

    def __init__(self):

        self.repository = RequestRepository()

    def create(
        self,
        db: Session,
        request: CreateRequest,
    ) -> Request:

        entity = Request(

            id=str(uuid4()),

            title=request.title,

            description=request.description,

            category=request.category,

            priority=request.priority,

            status=RequestStatus.SUBMITTED,
        )

        return self.repository.create(
            db,
            entity,
        )