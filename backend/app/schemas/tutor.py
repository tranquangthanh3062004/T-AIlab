from pydantic import BaseModel, Field

class CitationItem(BaseModel):
    id: str
    type: str  # lesson, news, documentation
    title: str
    url_or_ref: str
    excerpt: str

class TutorQueryRequest(BaseModel):
    query: str
    mode: str = "learn"  # "learn" or "engineer"
    current_lesson_id: str | None = None
    code_context: str | None = None

class TutorQueryResponse(BaseModel):
    answer: str
    citations: list[CitationItem]
    suggested_actions: list[str]
    confidence_level: str  # High, Moderate, Formative
    has_unverified_claims: bool = False
