from langchain_ollama import OllamaEmbeddings
from app.config.settings import get_settings

settings = get_settings()


class EmbeddingProvider:
    """
    Provides embedding models for the application.
    """

    _model = None

    @classmethod
    def get_embeddings(cls):

        if cls._model is None:

            cls._model = OllamaEmbeddings(
                model=settings.llama_model,
                base_url=settings.ollama_base_url,
            )

        return cls._model
