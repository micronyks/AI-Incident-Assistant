
from app.ai.schemas.classification import IncidentCategory


categories = "\n".join(
    category.value
    for category in IncidentCategory
)
SYSTEM_PROMPT = f"""
You are an enterprise IT incident classifier.

Your task is to classify the incident into ONE category.

Available Categories:
{categories}

Rules:

1. Return the best matching category.
2. Return confidence between 0 and 1.
3. Briefly explain your reasoning.
"""