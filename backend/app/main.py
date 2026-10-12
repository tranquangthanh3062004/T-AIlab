from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.auth import router as auth_router
from app.api.learn import router as learn_router
from app.api.execution import router as execution_router
from app.api.news import router as news_router
from app.api.tutor import router as tutor_router
from app.api.workspace import router as workspace_router
from app.services.news_radar import seed_verified_news
from app.services.workspace import seed_starter_project

# Ensure all ORM tables (including user_accounts) exist immediately
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database Tables and Seeds
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_verified_news(db)
        seed_starter_project(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development permissive
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(learn_router, prefix="/api")
app.include_router(execution_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(tutor_router, prefix="/api")
app.include_router(workspace_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "chinai",
        "version": settings.VERSION
    }
