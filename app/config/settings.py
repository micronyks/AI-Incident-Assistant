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