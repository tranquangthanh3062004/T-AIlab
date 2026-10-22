import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import WorkspaceProject, ProjectFile, ExperimentRun
from app.schemas.workspace import (
    WorkspaceProjectSchema, ProjectFileSchema,
    FileCreateRequest, FileUpdateRequest, ProjectCreateRequest,
    DatasetSummary, ExperimentRunSchema
)
from app.services.workspace import seed_starter_project, get_dataset_summary, DEFAULT_PROJECT_ID

router = APIRouter(prefix="/workspace", tags=["Engineering Workspace"])

@router.get("/projects", response_model=list[WorkspaceProjectSchema])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(WorkspaceProject).all()
    if not projects:
        p = seed_starter_project(db)
        projects = [p]

    result = []
    for p in projects:
        files = [
            ProjectFileSchema(
                id=f.id,
                name=f.name,
                content=f.content,
                language=f.language,
                updated_at=f.updated_at.isoformat()
            )
            for f in p.files
        ]
        result.append(WorkspaceProjectSchema(
            id=p.id,
            name=p.name,
            description=p.description,
            files=files,
            created_at=p.created_at.isoformat(),
            updated_at=p.updated_at.isoformat()
        ))
    return result

@router.get("/projects/{project_id}", response_model=WorkspaceProjectSchema)
def get_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(WorkspaceProject).filter(WorkspaceProject.id == project_id).first()
    if not p:
        if project_id == DEFAULT_PROJECT_ID:
            p = seed_starter_project(db)
        else:
            raise HTTPException(status_code=404, detail="Project not found")

    files = [
        ProjectFileSchema(
            id=f.id,
            name=f.name,
            content=f.content,
            language=f.language,
            updated_at=f.updated_at.isoformat()
        )
        for f in p.files
    ]
    return WorkspaceProjectSchema(
        id=p.id,
        name=p.name,
        description=p.description,
        files=files,
        created_at=p.created_at.isoformat(),
        updated_at=p.updated_at.isoformat()
    )

@router.post("/projects/{project_id}/files", response_model=ProjectFileSchema)
def create_file(project_id: str, req: FileCreateRequest, db: Session = Depends(get_db)):
    p = db.query(WorkspaceProject).filter(WorkspaceProject.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    file_id = f"file-{int(datetime.now(timezone.utc).timestamp())}"
    new_file = ProjectFile(
        id=file_id,
        project_id=project_id,
        name=req.name,
        content=req.content,
        language=req.language
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return ProjectFileSchema(
        id=new_file.id,
        name=new_file.name,
        content=new_file.content,
        language=new_file.language,
        updated_at=new_file.updated_at.isoformat()
    )

@router.put("/files/{file_id}", response_model=ProjectFileSchema)
def update_file(file_id: str, req: FileUpdateRequest, db: Session = Depends(get_db)):
    f = db.query(ProjectFile).filter(ProjectFile.id == file_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="File not found")

    f.content = req.content
    f.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(f)
    return ProjectFileSchema(
        id=f.id,
        name=f.name,
        content=f.content,
        language=f.language,
        updated_at=f.updated_at.isoformat()
    )

@router.get("/dataset/summary", response_model=DatasetSummary)
def get_sample_dataset_summary(db: Session = Depends(get_db)):
    data_file = db.query(ProjectFile).filter(ProjectFile.name.like("%.csv")).first()
    csv_text = data_file.content if data_file else ""
    return get_dataset_summary(csv_text)

@router.get("/experiments", response_model=list[ExperimentRunSchema])
def list_experiments(project_id: str = DEFAULT_PROJECT_ID, db: Session = Depends(get_db)):
    runs = db.query(ExperimentRun).filter(ExperimentRun.project_id == project_id).all()
    result = []
    for r in runs:
        try:
            hp = json.loads(r.hyperparameters_json)
        except Exception:
            hp = {}
        try:
            met = json.loads(r.metrics_json)
        except Exception:
            met = {}
        result.append(ExperimentRunSchema(
            id=r.id,
            project_id=r.project_id,
            name=r.name,
            model_name=r.model_name,
            hyperparameters=hp,
            metrics=met,
            status=r.status,
            created_at=r.created_at.isoformat()
        ))
    return result
