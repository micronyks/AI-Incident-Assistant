from app.ai.providers.vector_store_provider import VectorStoreProvider
from app.ai.rag.loader import DocumentLoader
from app.ai.rag.splitter import DocumentSplitter
from pathlib import Path

def ingest():

    BASE_DIR = Path(__file__).resolve().parents[3]

    KB_PATH = BASE_DIR / "data" / "knowledge_base"

    loader = DocumentLoader()

    splitter = DocumentSplitter()

    docs = loader.load_directory(str(KB_PATH))

    chunks = splitter.split(docs)

    vector_store = VectorStoreProvider.get_vector_store()

    vector_store.add_documents(chunks)

    print(f"Ingested {len(chunks)} chunks.")


if __name__ == "__main__":
    ingest()