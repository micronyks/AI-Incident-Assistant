from jira import JIRA
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class JiraProvider:
    """
    Provider class responsible for configuring and initializing the Jira client connection.
    """

    _jira_client = None

    @classmethod
    def get_client(cls) -> JIRA:
        """
        Returns a singleton instance of the configured JIRA client.
        """
        if cls._jira_client is None:
            if not settings.jira_username or not settings.jira_api_token:
                logger.warning("Jira credentials are not fully configured. Using dummy/offline mode.")
                return None
            
            try:
                # Jira Cloud uses Basic Auth with Username + API Token
                cls._jira_client = JIRA(
                    server=settings.jira_server,
                    basic_auth=(settings.jira_username, settings.jira_api_token)
                )
                logger.info("JIRA client successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize JIRA client: {e}")
                raise e

        return cls._jira_client
