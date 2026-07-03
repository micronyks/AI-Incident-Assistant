from fastapi import FastAPI

app = FastAPI(
    title="Enterprise AI Request Platform",
    description="Production-grade AI powered enterprise request management platform.",
    version="0.1.0",
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Enterprise AI Request Platform"
    }


@app.get("/health")
async def health():
    return {
        "status": "UP"
    }
