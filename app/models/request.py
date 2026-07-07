from sqlalchemy import Enum
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.database.base import Base
from app.domain.enums import RequestCategory
from app.domain.enums import RequestPriority
from app.domain.enums import RequestStatus
from app.models.base import BaseEntity


class Request(BaseEntity):
    """Request entity."""

    __tablename__ = "requests"

    title: Mapped[str] = mapped_column(String(200), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False)

    category: Mapped[RequestCategory] = mapped_column(
        Enum(RequestCategory),
        nullable=False,
    )

    priority: Mapped[RequestPriority] = mapped_column(
        Enum(RequestPriority),
        default=RequestPriority.P3,
        nullable=False,
    )

    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus),
        default=RequestStatus.SUBMITTED,
        nullable=False,
    )

    resolution_summary = mapped_column(Text, nullable=True)
    assigned_team = mapped_column(String(100), nullable=True)