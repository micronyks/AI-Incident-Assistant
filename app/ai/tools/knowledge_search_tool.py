from langchain_core.documents import Document

from app.ai.rag.retriever import KnowledgeRetriever


class KnowledgeSearchTool:
    """
    Tool responsible for semantic search
    over the enterprise knowledge base.
    """

    def __init__(self):

        self.retriever = KnowledgeRetriever()

    def search(
        self,
        query: str,
        k: int = 3,
    ) -> list[Document]:

        return self.retriever.search(
            query=query,
            k=k,
        )