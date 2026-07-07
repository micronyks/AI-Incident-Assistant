from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.request import Request


class RequestRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        request: Request,
    ) -> Request:

        self.db.add(request)

        self.db.commit()

        self.db.refresh(request)

        return request

    def search_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> list[Request]:

        return (
            self.db.query(Request)
            .filter(
                or_(
                    Request.title.ilike(f"%{query}%"),
                    Request.description.ilike(f"%{query}%"),
                )
            )
            .limit(limit)
            .all()
        )