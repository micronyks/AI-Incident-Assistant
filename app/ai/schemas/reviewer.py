from pydantic import BaseModel, Field


class ReviewerResponse(BaseModel):
    approved: bool = Field(
        description="Whether the previous agent responses are approved."
    )

    review_comments: str = Field(
        description="Reasoning behind the review."
    )

    confidence: float = Field(
        description="Confidence in the review.",
        ge=0,
        le=1,
    )