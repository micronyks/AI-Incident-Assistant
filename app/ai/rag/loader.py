from pathlib import Path

from langchain_community.document_loaders import TextLoader


class DocumentLoader:

    def load_directory(self, directory: str):

        documents = []

        path = Path(directory)

        for file in path.rglob("*.md"):

            loader = TextLoader(str(file), encoding="utf-8")

            documents.extend(loader.load())

        return documents