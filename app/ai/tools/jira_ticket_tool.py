from langchain_core.tools import tool
from app.services.jira_provider import JiraProvider
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

@tool
def create_jira_incident(
    title: str,
    description: str,
    category: str,
    priority: str,
    escalation_team: str,
    ai_summary: str
) -> str:
    """
    Creates a new incident ticket in the JIRA Incident-Management (IM) project.
    
    Args:
        title: The brief title of the incident.
        description: The detailed description of the incident.
        category: The classified category (e.g. BUG, FEATURE, HARDWARE).
        priority: The assigned priority level (P1, P2, P3, P4).
        escalation_team: The designated resolver team.
        ai_summary: The generated AI analysis summary.
        
    Returns:
        The created Jira Issue key (e.g. "IM-123") or an error message.
    """
    jira_client = JiraProvider.get_client()
    
    if jira_client is None:
        logger.warning(f"Jira client not active. Mocking issue creation for: {title}")
        return f"MOCK-IM-{hash(title) % 1000}"

    try:
        # Map P1-P4 priorities to standard Jira priority names or custom values
        # If your Jira uses custom priorities, adjust the mapping accordingly.
        jira_priority_map = {
            "P1": "Highest",
            "P2": "High",
            "P3": "Medium",
            "P4": "Low"
        }
        jira_priority = jira_priority_map.get(priority, "Medium")

        # Define ticket payload fields
        issue_dict = {
            'project': {'key': settings.jira_project_key},
            'summary': title,
            'description': f"{description}\n\n---\n*AI Assistant Analysis*:\n{ai_summary}\n*Suggested Team*: {escalation_team}\n*Auto-Classified Category*: {category}",
            'issuetype': {'name': 'Task'},  # Jira defaults: 'Bug', 'Task', 'Story'. 
            'priority': {'name': jira_priority},
        }

        # Create the ticket in Jira
        new_issue = jira_client.create_issue(fields=issue_dict)
        logger.info(f"Successfully created JIRA issue: {new_issue.key}")
        
        # Add an initial comment with the AI Summary
        comment_text = f"🤖 Incident analyzed. Assigned to: {escalation_team} with priority: {priority}."
        jira_client.add_comment(new_issue.key, comment_text)
        
        return new_issue.key

    except Exception as e:
        logger.error(f"Error creating JIRA issue: {e}")
        return f"Error creating JIRA issue: {str(e)}"
