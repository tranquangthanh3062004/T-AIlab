import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

WORKSPACE_DIR = BASE_DIR / "user_workspaces"
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "T Lab AI")
    VERSION: str = "2.3.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'platform.db'}")
    EXECUTION_TIMEOUT_SECONDS: int = 6
    MAX_OUTPUT_BYTES: int = 65536  # 64 KB
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://t-lab-ai.pages.dev",
        "https://*.pages.dev",
        "https://*.vercel.app"
    ]

settings = Settings()
