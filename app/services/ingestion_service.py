from langchain_core.documents import Document
from app.ai.providers.vector_store_provider import VectorStoreProvider
import logging

logger = logging.getLogger(__name__)

class IngestionService:
    """
    Service responsible for embedding and ingesting resolved incident tickets 
    into the Qdrant vector database.
    """

    def __init__(self):
        self.qdrant_store = VectorStoreProvider.get_vector_store("qdrant")

    def ingest_resolved_incident(
        self, issue_key: str, title: str, description: str, resolution_summary: str, category: str
    ) -> None:
        """
        Formats a resolved incident, generates embeddings, and inserts it into Qdrant.
        """
        logger.info(f"Ingesting resolved ticket {issue_key} into Qdrant...")
        
        # We format the document body to contain both the problem description and the resolution
        document_content = f"""
        Ticket Key: {issue_key}
        Title: {title}
        Description: {description}
        Resolution Summary: {resolution_summary}
        Category: {category}
        """

        # Populate metadata so the search tool can filter information easily
        metadata = {
            "issue_key": issue_key,
            "category": category,
            "type": "resolved_incident"
        }

        # Create LangChain Document
        doc = Document(
            page_content=document_content.strip(),
            metadata=metadata
        )

        try:
            # Upsert into Qdrant
            self.qdrant_store.add_documents([doc])
            logger.info(f"Successfully ingested ticket {issue_key} into Qdrant database.")
        except Exception as e:
            logger.error(f"Failed to ingest resolved ticket {issue_key} into Qdrant: {e}")
            raise e
