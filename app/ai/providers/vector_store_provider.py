from langchain_chroma import Chroma
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

from app.ai.providers.embedding_provider import EmbeddingProvider
from app.config.settings import settings


class VectorStoreProvider:
    """
    Factory class providing access to different vector database configurations.
    """

    _chroma_store = None
    _qdrant_store = None

    @classmethod
    def get_chroma_store(cls):
        """Returns the Chroma instance for the Knowledge Base."""
        if cls._chroma_store is None:
            cls._chroma_store = Chroma(
                collection_name="enterprise_kb",
                embedding_function=EmbeddingProvider.get_embeddings(),
                persist_directory="./data/chroma",
            )
        return cls._chroma_store

    @classmethod
    def get_qdrant_store(cls):
        """Returns the Qdrant instance for Incident Management."""
        if cls._qdrant_store is None:
            client = QdrantClient(url=settings.qdrant_url)
            
            # Auto-create collection if it doesn't exist
            collection_name = settings.qdrant_collection_name
            if not client.collection_exists(collection_name):
                # Retrieve embedding dimension size
                embeddings = EmbeddingProvider.get_embeddings()
                # Dummy embedding query to determine the dimensions programmatically
                dummy_vector = embeddings.embed_query("test")
                dimension = len(dummy_vector)
                
                from qdrant_client.models import VectorParams, Distance
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=dimension, distance=Distance.COSINE),
                )
            
            cls._qdrant_store = QdrantVectorStore(
                client=client,
                collection_name=collection_name,
                embedding=EmbeddingProvider.get_embeddings(),
            )
        return cls._qdrant_store

    @classmethod
    def get_vector_store(cls, provider: str = "chroma"):
        """
        Dynamic resolver keeping backwards compatibility with the existing code.
        """
        if provider.lower() == "qdrant":
            return cls.get_qdrant_store()
        return cls.get_chroma_store()
