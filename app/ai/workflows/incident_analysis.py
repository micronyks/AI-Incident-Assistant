from langgraph.graph import StateGraph, START, END

from app.ai.agents.reviewer_agent import ReviewerAgent, ReviewerAgent
from app.ai.agents.knowledge_agent import KnowledgeAgent
from app.ai.nodes.approval_node import approval_node
from app.ai.nodes.approval_router import approval_router
from app.ai.workflows.state import IncidentState
from app.ai.agents.classification_agent import ClassificationAgent
from app.ai.agents.priority_agent import PriorityAgent

from app.ai.providers.checkpointer_provider import CheckpointerProvider

from app.ai.tools.qdrant_search_tool import search_similar_incidents
from app.ai.tools.jira_ticket_tool import create_jira_incident

knowledge_agent = KnowledgeAgent()
priority_agent = PriorityAgent()

classification_agent = ClassificationAgent()
reviewer_agent = ReviewerAgent()

def classification_node(state: IncidentState):
    return classification_agent.run(state)

def priority_node(state: IncidentState):
    return priority_agent.run(state)

def review_node(state: IncidentState):
    return reviewer_agent.run(state)

def qdrant_retrieval_node(state: IncidentState):
    """Retrieves similar tickets from Qdrant to provide context."""
    query = f"{state['title']} {state['description']}"
    # Invoke the qdrant tool
    similar_docs = search_similar_incidents.invoke({"query": query, "limit": 2})
    
    # Store summaries of similar incidents to state
    summaries = []
    for doc in similar_docs:
        if "error" not in doc:
            summaries.append(f"- [{doc['metadata'].get('issue_key', 'Unknown')}]: {doc['page_content']} (Score: {doc['score']:.2f})")
            
    return {
        "similar_incidents": summaries
    }

def jira_creation_node(state: IncidentState):
    """Submits the validated incident to Jira."""
    # Build AI summary block combining knowledge base and classification reasons
    ai_summary = f"{state['summary']}\n\n*Reviewer Feedback*: {state['review_comments']}"
    
    issue_key = create_jira_incident.invoke({
        "title": state["title"],
        "description": state["description"],
        "category": state["category"],
        "priority": state["priority"],
        "escalation_team": state["escalation_team"],
        "ai_summary": ai_summary
    })
    
    return {
        "jira_issue_key": issue_key
    }

def knowledge_node(state: IncidentState):

    question = f"""
                    Title:
                    {state['title']}

                    Description:
                    {state['description']}
                """

    result = knowledge_agent.run(question, state['title'])

    return {
        "summary": result["summary"],
        "root_cause": result["root_cause"],
        "resolution_steps": result["resolution_steps"],
        "escalation_team": result["escalation_team"],
        "knowledge_confidence": result["knowledge_confidence"],
        "sources": result["sources"],
    }


builder = StateGraph(IncidentState)

builder.add_node("classification", classification_node)
builder.add_node("knowledge",  knowledge_node)
builder.add_node("priority", priority_node)
builder.add_node("qdrant_retrieval", qdrant_retrieval_node) # New
builder.add_node("review", review_node)
builder.add_node("approval", approval_node)
builder.add_node("jira_creation", jira_creation_node) # New

builder.add_edge(START,"knowledge")
builder.add_edge(START, "classification")
builder.add_edge(START, "priority")
builder.add_edge(START, "qdrant_retrieval") # New

builder.add_edge("knowledge", "review")
builder.add_edge("classification", "review")
builder.add_edge("priority", "review")
builder.add_edge("qdrant_retrieval", "review") # New

builder.add_edge("approval", "jira_creation")
builder.add_edge("jira_creation", END)

builder.add_conditional_edges(
    "review",
    approval_router
)

incident_workflow = builder.compile(
    checkpointer=CheckpointerProvider.get_checkpointer()
)

