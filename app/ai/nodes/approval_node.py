from langgraph.types import interrupt


def approval_node(state):

    approval = interrupt(
        {
            "message": "Approve AI recommendation?",
            "incident": state["title"],
            "priority": state["priority"],
            "category": state["category"],
            "summary": state["summary"],
        }
    )
    

    return {
        "approval_status": approval["status"],
        "approved_by": approval["approved_by"],
    }