from langchain_groq import ChatGroq

from app.config.settings import get_settings

settings = get_settings()


class LLMProvider:

    _llm = None

    @classmethod
    def get_llm(cls):

        if cls._llm is None:

            cls._llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                api_key=settings.groq_api_key,
                temperature=0,
            )

        return cls._llm