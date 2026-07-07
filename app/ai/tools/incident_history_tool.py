from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.services.request_service import RequestService


class IncidentHistoryTool:

    def __init__(
        self
    ):

        db = SessionLocal()
        self.service = RequestService(db)

    def search(
        self,
        query: str,
        limit: int = 5,
    ):

        return self.service.search_similar(
            query=query,
            limit=limit,
        )