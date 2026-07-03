from fastapi import FastAPI

app = FastAPI(title="Enterprise AI Request Platform")

@app.get("/health")
def health():
    return {"status":"UP"}
