from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.base import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Creates a database session for each request.

    FastAPI automatically closes the session after
    the request is completed.
    """
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()