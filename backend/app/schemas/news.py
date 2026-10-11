from pydantic import BaseModel, Field

class NewsArticleSchema(BaseModel):
    id: str
    canonical_url: str
    title: str
    source: str
    author: str | None = None
    published_at: str
    category: str
    difficulty: str
    summary_what: str
    summary_new: str
    summary_impact: str
    summary_action: str
    claim_status: str
    bookmarked: bool = False

class NewsFilterParams(BaseModel):
    category: str | None = None
    difficulty: str | None = None
    source: str | None = None
    search: str | None = None
    bookmarked_only: bool = False

class NewsIngestionTriggerResponse(BaseModel):
    articles_fetched: int
    new_articles_persisted: int
    duplicates_skipped: int
    sources_polled: int
    errors: list[str] = []
