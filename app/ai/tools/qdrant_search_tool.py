from langchain_core.tools import tool
from app.ai.providers.vector_store_provider import VectorStoreProvider
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

@tool
def search_similar_incidents(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Searches the Qdrant vector database for historically similar incidents.
    
    Args:
        query: The semantic description of the current incident.
        limit: Number of similar incidents to retrieve.
        
    Returns:
        A list of dictionaries representing the most similar incidents found.
    """
    logger.info(f"Querying Qdrant for similar incidents: {query}")
    try:
        # Retrieve the Qdrant vector store
        qdrant_store = VectorStoreProvider.get_vector_store("qdrant")
        
        # Perform similarity search with scores
        docs_with_scores = qdrant_store.similarity_search_with_score(query, k=limit)
        
        results = []
        for doc, score in docs_with_scores:
            results.append({
                "page_content": doc.page_content,
                "metadata": doc.metadata,
                "score": float(score)
            })
            
        logger.info(f"Qdrant query returned {len(results)} matches.")
        return results

    except Exception as e:
        logger.error(f"Failed to query Qdrant: {e}")
        return [{"error": f"Failed to perform search: {str(e)}"}]
