from app.ai.providers.vector_store_provider import VectorStoreProvider


class KnowledgeRetriever:

    def __init__(self):
        self.vector_store = VectorStoreProvider.get_vector_store()

    def search(self, query: str, k: int = 3):
        return self.vector_store.similarity_search(query, k=k)
    