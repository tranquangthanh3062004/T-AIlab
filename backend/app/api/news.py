from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import NewsArticle
from app.schemas.news import NewsArticleSchema, NewsIngestionTriggerResponse
from app.services.news_radar import ingest_upstream_feeds, SOURCE_REGISTRY

router = APIRouter(prefix="/news", tags=["AI News Radar"])

@router.get("/articles", response_model=list[NewsArticleSchema])
def list_articles(
    category: str | None = Query(None),
    difficulty: str | None = Query(None),
    source: str | None = Query(None),
    search: str | None = Query(None),
    bookmarked_only: bool = Query(False),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(NewsArticle)

    if category:
        query = query.filter(NewsArticle.category == category)
    if difficulty:
        query = query.filter(NewsArticle.difficulty == difficulty)
    if source:
        query = query.filter(NewsArticle.source == source)
    if bookmarked_only:
        query = query.filter(NewsArticle.bookmarked == True)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (NewsArticle.title.ilike(search_fmt)) |
            (NewsArticle.summary_what.ilike(search_fmt))
        )

    articles = query.order_by(NewsArticle.published_at.desc()).limit(limit).all()
    return articles

@router.post("/articles/{article_id}/bookmark")
def toggle_bookmark(article_id: str, db: Session = Depends(get_db)):
    art = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")

    art.bookmarked = not art.bookmarked
    db.commit()
    return {"id": art.id, "bookmarked": art.bookmarked}

@router.post("/ingest", response_model=NewsIngestionTriggerResponse)
async def trigger_ingestion(db: Session = Depends(get_db)):
    return await ingest_upstream_feeds(db)

@router.get("/sources")
def get_sources():
    return SOURCE_REGISTRY
