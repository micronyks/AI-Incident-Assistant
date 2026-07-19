from uuid import uuid4

from sqlalchemy.orm import Session

from app.domain.enums import RequestStatus
from app.models.request import Request
from app.repositories.request_repository import RequestRepository
from app.schemas.request import CreateRequest
from app.domain.enums import RequestPriority


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
    
    def get_by_jira_key(self, jira_key: str) -> Request | None:
        """Finds a request matching the Jira issue key."""
        return self.repository.db.query(Request).filter(Request.jira_issue_key == jira_key).first()

    def update_status(self, request_id: str, status: RequestStatus) -> None:
        """Updates the status of an existing request."""
        entity = self.repository.db.query(Request).filter(Request.id == request_id).first()
        if entity:
            entity.status = status
            self.repository.db.commit()

    def update_jira_key(self, request_id: str, jira_key: str, priority: RequestPriority | None = None) -> None:
        """Saves the created Jira issue key back to the database record."""
        entity = self.repository.db.query(Request).filter(Request.id == request_id).first()
        if entity:
            entity.jira_issue_key = jira_key
            if priority:
                entity.priority = priority
            self.repository.db.commit()
