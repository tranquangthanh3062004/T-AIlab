from pydantic import BaseModel, Field

class FileCreateRequest(BaseModel):
    name: str
    content: str = ""
    language: str = "python"

class FileUpdateRequest(BaseModel):
    content: str

class ProjectCreateRequest(BaseModel):
    name: str
    description: str | None = None
    starter_template: str | None = "python_baseline"

class ProjectFileSchema(BaseModel):
    id: str
    name: str
    content: str
    language: str
    updated_at: str

class WorkspaceProjectSchema(BaseModel):
    id: str
    name: str
    description: str | None = None
    files: list[ProjectFileSchema] = []
    created_at: str
    updated_at: str

class DatasetSummary(BaseModel):
    name: str
    rows: int
    columns: list[str]
    column_types: dict[str, str]
    missing_counts: dict[str, int]
    sample_data: list[dict]

class ExperimentRunSchema(BaseModel):
    id: str
    project_id: str
    name: str
    model_name: str
    hyperparameters: dict
    metrics: dict
    status: str
    created_at: str
