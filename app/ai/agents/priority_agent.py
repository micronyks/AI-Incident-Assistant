from langchain_core.prompts import ChatPromptTemplate

from app.ai.prompts.priority_prompt import SYSTEM_PROMPT
from app.ai.schemas.prirority import PriorityResult
from app.ai.workflows.state import IncidentState
from app.ai.providers.llm_provider import LLMProvider


class PriorityAgent:

    def __init__(self):

        llm = LLMProvider.get_llm()

        self.structured_llm = llm.with_structured_output(
            PriorityResult
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
            "priority": result.priority.value,
            "priority_confidence": result.priority_confidence,
            "priority_reason": result.priority_reason,
        }