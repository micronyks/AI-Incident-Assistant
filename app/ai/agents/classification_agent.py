from langchain_core.prompts import ChatPromptTemplate

from app.ai.prompts.classification_prompt import SYSTEM_PROMPT
from app.ai.schemas.classification import ClassificationResult
from app.ai.workflows.state import IncidentState
from app.ai.providers.llm_provider import LLMProvider


class ClassificationAgent:

    def __init__(self):

        llm = LLMProvider.get_llm()

        self.structured_llm = llm.with_structured_output(
            ClassificationResult
        )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                (
                    "human",
                    """
                        Title:
                        {title}

                        Description:
                        {description}
                    """,
                ),
            ]
        )

    def run(self, state: IncidentState):

        chain = self.prompt | self.structured_llm

        result = chain.invoke(
            {
                "title": state["title"],
                "description": state["description"],
            }
        )

        return {
            "category": result.category.value,
            "category_confidence": result.confidence,
            "category_reason": result.reason,
        }