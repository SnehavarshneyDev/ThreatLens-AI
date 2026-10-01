from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.scanner import router as scanner_router
from app.website_analyzer import router as website_analyzer_router
from app.email_analyzer import router as email_analyzer_router
from app.scam_analyzer import router as scam_analyzer_router
from app.link_analyzer import router as link_analyzer_router
from app.history import router as history_router

app = FastAPI(
    title="ThreatLens AI",
    description="AI-powered Cyber Threat Detection & Safety Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(scanner_router)
app.include_router(website_analyzer_router)
app.include_router(email_analyzer_router)
app.include_router(scam_analyzer_router)
app.include_router(link_analyzer_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "message": "ThreatLens AI API is running",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ThreatLens AI Backend",
    }