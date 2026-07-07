from langgraph.graph import StateGraph, START, END

from app.ai.agents.knowledge_agent import KnowledgeAgent
from app.ai.workflows.state import IncidentState
from app.ai.agents.classification_agent import ClassificationAgent
from app.ai.agents.priority_agent import PriorityAgent


knowledge_agent = KnowledgeAgent()
priority_agent = PriorityAgent()

classification_agent = ClassificationAgent()

def classification_node(state: IncidentState):
    return classification_agent.run(state)

def priority_node(state: IncidentState):
    return priority_agent.run(state)


def knowledge_node(state: IncidentState):

    question = f"""
                    Title:
                    {state['title']}

                    Description:
                    {state['description']}
                """

    result = knowledge_agent.run(question)

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

builder.add_edge(START,"knowledge")
builder.add_edge(START, "classification")
builder.add_edge(START, "priority")

builder.add_edge("knowledge", END)
builder.add_edge("classification", END)
builder.add_edge("priority", END)

incident_workflow = builder.compile()

