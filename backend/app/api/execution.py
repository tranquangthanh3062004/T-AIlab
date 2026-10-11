from fastapi import APIRouter
from app.schemas.execution import CodeExecutionRequest, CodeExecutionResponse
from app.services.execution import execute_sandboxed_code
from app.services.curriculum import CURRICULUM_TRACKS

router = APIRouter(prefix="/execution", tags=["Code Execution"])

@router.post("/run", response_model=CodeExecutionResponse)
def run_code(req: CodeExecutionRequest):
    test_assertions = None
    if req.exercise_id:
        # Find exercise test assertions
        for track in CURRICULUM_TRACKS:
            for mod in track.modules:
                for lsn in mod.lessons:
                    if lsn.code_exercise and lsn.code_exercise.id == req.exercise_id:
                        test_assertions = lsn.code_exercise.test_assertions_code
                        break

    return execute_sandboxed_code(
        code=req.code,
        timeout_seconds=req.timeout_seconds,
        test_assertions=test_assertions
    )
