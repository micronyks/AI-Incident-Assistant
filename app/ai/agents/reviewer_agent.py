from langchain_core.prompts import ChatPromptTemplate

from app.ai.prompts.reviewer_propmpt import SYSTEM_PROMPT
from app.ai.schemas.reviewer import ReviewerResponse
from app.ai.workflows.state import IncidentState
from app.ai.providers.llm_provider import LLMProvider


class ReviewerAgent:

    def __init__(self):

        llm = LLMProvider.get_llm()

        self.structured_llm = llm.with_structured_output(
            ReviewerResponse
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

                        result of agents:
                        {result_of_agents}
                    """,
                ),
            ]
        )

    def run(self, state: IncidentState):

        chain = self.prompt | self.structured_llm

        result_of_agents = f"""
                                Classification Agent

                                Category: {state["category"]}
                                Confidence: {state["category_confidence"]}
                                Reason: {state["category_reason"]}

                                Knowledge Agent

                                Summary: {state["summary"]}

                                Root Cause: {state["root_cause"]}

                                Resolution Steps:
                                {chr(10).join(state["resolution_steps"])}

                                Escalation Team:
                                {state["escalation_team"]}

                                Confidence:
                                {state["knowledge_confidence"]}

                                Priority Agent

                                Priority:
                                {state["priority"]}

                                Confidence:
                                {state["priority_confidence"]}

                                Reason:
                                {state["priority_reason"]}
                            """

        result = chain.invoke(
            {
                "title": state["title"],
                "description": state["description"],
                "result_of_agents": result_of_agents

            }
        )

        return {
            "review_approved": result.approved,
            "review_comments": result.review_comments,
            "review_confidence": result.confidence,
        }