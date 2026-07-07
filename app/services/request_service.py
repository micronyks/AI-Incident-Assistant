from uuid import uuid4

from sqlalchemy.orm import Session

from app.domain.enums import RequestStatus
from app.models.request import Request
from app.repositories.request_repository import RequestRepository
from app.schemas.request import CreateRequest


class RequestService:

    def __init__(
        self,
        db: Session,
    ):

        self.repository = RequestRepository(db)

    def create(
        self,
        request: CreateRequest,
    ) -> Request:

        entity = Request(

            id=str(uuid4()),

            title=request.title,

            description=request.description,

            category=request.category,

            priority=request.priority,

            status=RequestStatus.SUBMITTED,

            resolution_summary=None,

            assigned_team=None,
        )

        return self.repository.create(entity)

    def search_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> list[Request]:

        return self.repository.search_similar(
            query=query,
            limit=limit,
        )