from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.tutor import TutorQueryRequest, TutorQueryResponse
from app.services.tutor import generate_grounded_tutor_response

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])

@router.post("/query", response_model=TutorQueryResponse)
def query_tutor(req: TutorQueryRequest, db: Session = Depends(get_db)):
    return generate_grounded_tutor_response(req, db)
