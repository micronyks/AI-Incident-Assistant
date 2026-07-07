from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration."""

    app_name: str = "Enterprise AI Request Platformmmmmmmmmmmm"
    app_version: str = "0.1.0"
    environment: str = "development"

    database_host: str = "localhost"
    database_port: int = 3306
    database_name: str = "enterprise_ai"
    database_user: str
    database_password: str
    

    # ===========================
    # Embedding Model
    # ===========================
    embed_model: str = "nomic-ai/nomic-embed-text-v1.5"

    # ===========================
    # Groq
    # ===========================
    groq_api_key: str

    # ===========================
    # OpenAI
    # ===========================
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"

    # ===========================
    # Google
    # ===========================
    google_api_key: str | None = None
    google_model: str = "gemini-2.5-flash"

    # ===========================
    # Hugging Face
    # ===========================
    hf_token: str | None = None

    # ===========================
    # Tavily
    # ===========================
    search_provider: str = "tavily"
    tavily_api_key: str | None = None

    # ===========================
    # Pinecone
    # ===========================
    pinecone_api_key: str | None = None

    # ===========================
    # LangSmith
    # ===========================
    langsmith_tracing: bool = False
    langsmith_endpoint: str | None = None
    langsmith_api_key: str | None = None
    langsmith_project: str = "enterprise-ai-platform"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Returns a singleton Settings instance.

    The configuration is loaded only once and reused
    throughout the application's lifetime.
    """
    return Settings()


settings = get_settings()