from langchain_chroma import Chroma

from app.ai.providers.embedding_provider import EmbeddingProvider


class VectorStoreProvider:

    _vector_store = None

    @classmethod
    def get_vector_store(cls):

        if cls._vector_store is None:

            cls._vector_store = Chroma(
                collection_name="enterprise_kb",
                embedding_function=EmbeddingProvider.get_embeddings(),
                persist_directory="./data/chroma",
            )

        return cls._vector_store