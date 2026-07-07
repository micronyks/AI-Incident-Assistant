from langchain_huggingface import HuggingFaceEmbeddings
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

            cls._model = HuggingFaceEmbeddings(
                model_name=settings.embed_model
                
            )

        return cls._model