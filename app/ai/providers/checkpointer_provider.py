from langgraph.checkpoint.memory import MemorySaver


class CheckpointerProvider:
    """
    Responsible for providing the LangGraph checkpoint implementation.

    Currently uses in-memory checkpoints.

    Later this can be replaced with a persistent implementation
    (Redis, PostgreSQL, DynamoDB, S3, etc.) without changing
    the workflow.
    """

    _checkpointer = None

    @classmethod
    def get_checkpointer(cls):
        if cls._checkpointer is None:
            cls._checkpointer = MemorySaver()

        return cls._checkpointer