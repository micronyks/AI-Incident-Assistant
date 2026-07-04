from enum import Enum


class RequestCategory(str, Enum):
    BUG = "BUG"
    FEATURE = "FEATURE"
    HARDWARE = "HARDWARE"
    SOFTWARE = "SOFTWARE"
    ACCESS = "ACCESS"
    SECURITY = "SECURITY"
    OTHER = "OTHER"


class RequestPriority(str, Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"
    P4 = "P4"


class RequestStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    IN_PROGRESS = "IN_PROGRESS"
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"