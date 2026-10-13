from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    auth_provider = Column(String, default="local")  # "local", "google", "local+google"
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="AI Explorer")
    google_accounts_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, default=datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default-learner")
    lesson_id = Column(String, index=True)
    completed = Column(Boolean, default=False)
    quiz_score = Column(Float, nullable=True)
    code_exercise_passed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    user_id = Column(String, primary_key=True, index=True)
    diagnostic_completed = Column(Boolean, default=False)
    diagnostic_score = Column(Float, default=0.0)
    recommended_track = Column(String, default="track-foundations")
    active_mode = Column(String, default="learn")  # "learn" or "engineer"
    theme = Column(String, default="light")
    xp = Column(Integer, default=150)
    level = Column(Integer, default=2)
    streak_days = Column(Integer, default=3)
    last_activity_date = Column(String, nullable=True)
    badges_json = Column(Text, default='["first_step", "quiz_master"]')
    daily_goal_xp = Column(Integer, default=50)
    today_xp = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkspaceProject(Base):
    __tablename__ = "workspace_projects"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default-learner")
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")

class ProjectFile(Base):
    __tablename__ = "project_files"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("workspace_projects.id"), index=True)
    name = Column(String, nullable=False)
    content = Column(Text, default="")
    language = Column(String, default="python")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("WorkspaceProject", back_populates="files")

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(String, primary_key=True, index=True)
    canonical_url = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    source = Column(String, index=True)
    author = Column(String, nullable=True)
    published_at = Column(String, nullable=False)  # ISO string or date
    first_seen_at = Column(DateTime, default=datetime.utcnow)
    category = Column(String, index=True)
    difficulty = Column(String, index=True)  # Beginner Friendly, Applied Engineering, Deep Research
    summary_what = Column(Text, nullable=False)
    summary_new = Column(Text, nullable=False)
    summary_impact = Column(Text, nullable=False)
    summary_action = Column(Text, nullable=False)
    claim_status = Column(String, default="VERIFIED")  # VERIFIED, VENDOR_CLAIM, SPECULATIVE
    content_hash = Column(String, index=True)
    bookmarked = Column(Boolean, default=False)

class ExperimentRun(Base):
    __tablename__ = "experiment_runs"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True)
    name = Column(String, nullable=False)
    model_name = Column(String, default="Baseline ML")
    hyperparameters_json = Column(Text, default="{}")
    metrics_json = Column(Text, default="{}")
    status = Column(String, default="COMPLETED")  # RUNNING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)

class EducationalResourceRecord(Base):
    __tablename__ = "educational_resources"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    canonical_url = Column(String, unique=True, index=True, nullable=False)
    resource_type = Column(String, index=True, default="DOCUMENTATION")  # DOCUMENTATION, UNIVERSITY_COURSE, OPEN_BOOK, GITHUB_REPO, DATASET, PAPER
    spdx_license = Column(String, nullable=False, default="CC-BY-4.0")
    attribution_requirements = Column(Text, nullable=False, default="Attribution required")
    redistribution_allowed = Column(Boolean, default=False)
    modification_allowed = Column(Boolean, default=False)
    commercial_use_allowed = Column(Boolean, default=True)
    lifecycle_status = Column(String, index=True, default="PUBLISHED")  # DISCOVERED, METADATA_VERIFIED, SOURCE_ACCESSED, CONTENT_INGESTED, CONTENT_PARSED, CONTENT_REVIEWED, CURRICULUM_MAPPED, PUBLISHED, NEEDS_REVIEW, ARCHIVED
    mapped_tracks_json = Column(Text, default="[]")
    quality_score = Column(Float, default=9.5)
    last_verified_date = Column(String, default="2026-10-12")
    created_at = Column(DateTime, default=datetime.utcnow)

class ContentReviewRecord(Base):
    __tablename__ = "content_reviews"

    id = Column(String, primary_key=True, index=True)
    lesson_id = Column(String, index=True, nullable=False)
    content_version = Column(String, default="2.1.0")
    review_status = Column(String, index=True, default="PUBLISHED")  # PUBLISHED, NEEDS_REVIEW, BLOCKED
    overall_score = Column(Float, default=9.6)
    passed_blocking_gates = Column(Boolean, default=True)
    criteria_scores_json = Column(Text, default="{}")
    blocking_reasons_json = Column(Text, default="[]")
    reviewer = Column(String, default="CHINAI Pedagogical & Security Gatekeeper v2.1")
    verified_at = Column(DateTime, default=datetime.utcnow)

class LearnerMasteryRecord(Base):
    __tablename__ = "learner_mastery"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default-learner")
    track_id = Column(String, index=True, nullable=False)
    completion_rate = Column(Float, default=0.0)
    assessment_performance = Column(Float, default=0.0)
    estimated_mastery = Column(Float, default=0.0)
    confidence_level = Column(String, default="LOW")  # LOW, MODERATE, HIGH
    demonstrated_project_skill = Column(Float, default=0.0)
    weak_concepts_json = Column(Text, default="[]")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

