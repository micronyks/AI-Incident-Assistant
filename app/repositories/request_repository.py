from sqlalchemy.orm import Session

from app.models.request import Request


class RequestRepository:

    def create(
        self,
        db: Session,
        request: Request,
    ) -> Request:

        db.add(request)

        db.commit()

        db.refresh(request)

        return request