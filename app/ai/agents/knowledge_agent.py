from chromadb import db
from fastapi.params import Depends
from langchain_core.prompts import ChatPromptTemplate
from sqlalchemy.orm import Session

from app.ai.providers.llm_provider import LLMProvider
from app.ai.rag.retriever import KnowledgeRetriever
from app.ai.prompts.knowledge_prompt import SYSTEM_PROMPT
from app.ai.schemas.knowledge import KnowledgeResponse
from app.ai.tools.incident_history_tool import IncidentHistoryTool
from app.ai.tools.knowledge_search_tool import KnowledgeSearchTool
from sqlalchemy.orm import Session

from app.database.base import SessionLocal


class KnowledgeAgent:

    def __init__(self):
        
        self.knowledge_tool = KnowledgeSearchTool()

        self.incident_history_tool = IncidentHistoryTool()

        self.llm = LLMProvider.get_llm()

        self.structured_llm = self.llm.with_structured_output(
            KnowledgeResponse
        )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                (
                    "human",
                    """
                        Question:

                        {question}

                        Enterprise Knowledge:

                        {knowledge_context}

                        Historical Similar Incidents

                        {incident_history_context}
                                            
                    """,
                ),
            ]
        )

    def run(self, question: str, title: str):

        docs = self.knowledge_tool.search(question)

        context_docs = "\n\n".join(
            doc.page_content for doc in docs
        )


        db_result = self.incident_history_tool.search(
            query=title,
            limit=5,
        )

        context_db = "\n\n".join(
                                            f"""
                                                Title: {incident.title}

                                                Description: {incident.description}

                                                Category: {incident.category.value}

                                                Priority: {incident.priority.value}

                                                Resolution:
                                                {incident.resolution_summary}

                                                Assigned Team:
                                                {incident.assigned_team}
                                             """
                                        for incident in db_result
                                    )

        chain = self.prompt | self.structured_llm

        response = chain.invoke(
            {
                "question": question,
                "knowledge_context": context_docs,
                "incident_history_context": context_db,
            }
        )

        return {
            "summary": response.summary,
            "root_cause": response.root_cause,
            "resolution_steps": response.resolution_steps,
            "escalation_team": response.escalation_team,
            "knowledge_confidence": response.knowledge_confidence,
            "sources": [
                {
                    "file": doc.metadata.get("source").split("\\")[-1],
                    "category":doc.metadata.get("source").split("\\")[-2],
                    "score": response.knowledge_confidence
                }
                for doc in docs
            ],
            
        }