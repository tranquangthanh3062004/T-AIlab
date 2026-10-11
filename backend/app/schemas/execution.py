from pydantic import BaseModel, Field

class CodeExecutionRequest(BaseModel):
    code: str = Field(..., description="Python source code to execute")
    timeout_seconds: int = Field(default=5, ge=1, le=10, description="Max execution time in seconds")
    exercise_id: str | None = Field(default=None, description="Optional exercise identifier for test assertion validation")

class CodeExecutionResponse(BaseModel):
    success: bool
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float
    security_flagged: bool = False
    security_reason: str | None = None
    passed_tests: bool | None = None
    test_feedback: str | None = None
