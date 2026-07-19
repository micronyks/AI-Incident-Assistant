from sqlalchemy import text
from app.database.session import SessionLocal
from app.ai.providers.vector_store_provider import VectorStoreProvider
from app.services.jira_provider import JiraProvider
import logging

logger = logging.getLogger(__name__)

def start_up() -> None:
    """
    Validates connections to critical external systems (MySQL, Qdrant, Jira).
    Raises RuntimeError if any check fails to prevent app startup.
    """
    logger.info("Initializing application dependency checks...")

    # 1. Verify MySQL Database
    try:
        logger.info("Checking MySQL Database connectivity...")
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("MySQL Database is healthy.")
    except Exception as e:
        logger.critical(f"FATAL: MySQL Connection check failed: {e}")
        raise RuntimeError("Database connection failure aborting startup.") from e

    # 2. Verify Qdrant Vector DB
    try:
        logger.info("Checking Qdrant connectivity...")
        qdrant_store = VectorStoreProvider.get_qdrant_store()
        # Query collection lists to test client communication
        qdrant_store.client.get_collections()
        logger.info("Qdrant Vector Store is healthy.")
    except Exception as e:
        logger.critical(f"FATAL: Qdrant Connection check failed: {e}")
        raise RuntimeError("Vector database connection failure aborting startup.") from e

    # 3. Verify Jira connectivity
    try:
        logger.info("Checking Jira connectivity...")
        jira_client = JiraProvider.get_client()
        if jira_client is not None:
            # Ping user profile endpoint
            jira_client.myself()
            logger.info("Jira integration is healthy.")
        else:
            logger.warning("Jira client credentials not configured. Running in offline mode.")
    except Exception as e:
        logger.critical(f"FATAL: Jira Connection check failed: {e}")
        raise RuntimeError("Jira issue tracker connection failure aborting startup.") from e

    logger.info("All dependency checks passed successfully.")
