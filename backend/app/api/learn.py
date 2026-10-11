import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UserProgress, LearnerProfile
from app.schemas.curriculum import (
    Track, Lesson, QuizSubmission, QuizResult,
    DiagnosticSubmission, DiagnosticResult,
    BadgeInfo, LearnerProgressResponse
)
from app.services.curriculum import (
    CURRICULUM_TRACKS, DIAGNOSTIC_QUESTIONS,
    evaluate_lesson_quiz, evaluate_diagnostic_assessment
)

router = APIRouter(prefix="/learn", tags=["Learning Curriculum"])

ALL_BADGES = [
    {"id": "first_step", "title": "Khởi đầu Vững chắc", "description": "Hoàn thành bài học lý thuyết hoặc thực hành đầu tiên", "icon": "Rocket"},
    {"id": "quiz_master", "title": "Bậc thầy Trắc nghiệm", "description": "Đạt điểm số tuyệt đối 100% trong bài kiểm tra", "icon": "Award"},
    {"id": "code_ninja", "title": "Kỹ sư Code AI", "description": "Chạy và vượt qua toàn bộ kiểm thử mã nguồn bài tập", "icon": "Code"},
    {"id": "streak_champion", "title": "Kiên trì Bền bỉ", "description": "Duy trì chuỗi học tập liên tục ít nhất 3 ngày", "icon": "Flame"},
    {"id": "deep_thinker", "title": "Tư duy Sâu sắc", "description": "Hoàn thành bài đánh giá năng lực Diagnostic Placement", "icon": "Brain"},
    {"id": "ai_builder", "title": "Nhà phát triển AI", "description": "Khởi tạo mã nguồn trong không gian Engineer Workspace", "icon": "Terminal"},
]

def get_level_info(xp: int) -> tuple[int, str]:
    if xp >= 1000:
        return 5, "Senior AI Architect"
    elif xp >= 500:
        return 4, "Applied AI Engineer"
    elif xp >= 250:
        return 3, "ML Practitioner"
    elif xp >= 100:
        return 2, "AI Explorer"
    else:
        return 1, "Novice Learner"

def get_or_create_profile(db: Session, user_id: str = "default-learner") -> LearnerProfile:
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        profile = LearnerProfile(
            user_id=user_id,
            diagnostic_completed=False,
            diagnostic_score=0.0,
            recommended_track="track-foundations",
            xp=150,
            level=2,
            streak_days=3,
            badges_json=json.dumps(["first_step", "streak_champion"]),
            daily_goal_xp=50,
            today_xp=30
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("/tracks", response_model=list[Track])
def get_all_tracks():
    return CURRICULUM_TRACKS

@router.get("/tracks/{track_id}", response_model=Track)
def get_track_by_id(track_id: str):
    track = next((t for t in CURRICULUM_TRACKS if t.id == track_id), None)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return track

@router.get("/lessons/{lesson_id}", response_model=Lesson)
def get_lesson_by_id(lesson_id: str):
    for track in CURRICULUM_TRACKS:
        for mod in track.modules:
            for lsn in mod.lessons:
                if lsn.id == lesson_id:
                    return lsn
    raise HTTPException(status_code=404, detail="Lesson not found")

@router.post("/quiz/submit", response_model=QuizResult)
def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    result = evaluate_lesson_quiz(submission.lesson_id, submission.selected_option_ids)

    # Persist progress
    progress_id = f"prog-{submission.lesson_id}"
    prog = db.query(UserProgress).filter(UserProgress.id == progress_id).first()
    if not prog:
        prog = UserProgress(
            id=progress_id,
            user_id="default-learner",
            lesson_id=submission.lesson_id,
            completed=result.passed,
            quiz_score=result.score_percentage,
            xp_earned=40 if result.passed else 10
        )
        db.add(prog)
    else:
        if result.passed:
            prog.completed = True
        prog.quiz_score = max(prog.quiz_score or 0.0, result.score_percentage)
        prog.xp_earned = max(prog.xp_earned or 0, 40 if result.passed else 10)

    # Award XP & Badges
    profile = get_or_create_profile(db)
    xp_to_add = 40 if result.passed else 10
    profile.xp = (profile.xp or 0) + xp_to_add
    profile.today_xp = (profile.today_xp or 0) + xp_to_add
    
    # Update badges
    current_badges = set(json.loads(profile.badges_json or "[]"))
    current_badges.add("first_step")
    if result.score_percentage >= 100.0:
        current_badges.add("quiz_master")
    profile.badges_json = json.dumps(list(current_badges))
    
    # Update level
    new_lvl, _ = get_level_info(profile.xp)
    profile.level = new_lvl

    db.commit()
    return result

@router.post("/exercise/pass")
def submit_exercise_pass(payload: dict, db: Session = Depends(get_db)):
    lesson_id = payload.get("lesson_id", "")
    if not lesson_id:
        raise HTTPException(status_code=400, detail="lesson_id required")
    
    progress_id = f"prog-{lesson_id}"
    prog = db.query(UserProgress).filter(UserProgress.id == progress_id).first()
    if not prog:
        prog = UserProgress(
            id=progress_id,
            user_id="default-learner",
            lesson_id=lesson_id,
            completed=True,
            code_exercise_passed=True,
            xp_earned=30
        )
        db.add(prog)
    else:
        prog.code_exercise_passed = True
        prog.xp_earned = (prog.xp_earned or 0) + 30

    profile = get_or_create_profile(db)
    profile.xp = (profile.xp or 0) + 30
    profile.today_xp = (profile.today_xp or 0) + 30
    badges = set(json.loads(profile.badges_json or "[]"))
    badges.add("code_ninja")
    profile.badges_json = json.dumps(list(badges))
    new_lvl, _ = get_level_info(profile.xp)
    profile.level = new_lvl

    db.commit()
    return {"success": True, "xp_awarded": 30, "total_xp": profile.xp}

@router.get("/diagnostic/questions")
def get_diagnostic_questions():
    return [
        {
            "id": q.id,
            "question": q.question,
            "type": q.type,
            "options": [{"id": o.id, "text": o.text} for o in q.options]
        }
        for q in DIAGNOSTIC_QUESTIONS
    ]

@router.post("/diagnostic/submit", response_model=DiagnosticResult)
def submit_diagnostic(sub: DiagnosticSubmission, db: Session = Depends(get_db)):
    result = evaluate_diagnostic_assessment(sub.answers)

    profile = get_or_create_profile(db)
    profile.diagnostic_completed = True
    profile.diagnostic_score = result.score_percentage
    profile.recommended_track = result.recommended_track_id
    profile.xp = (profile.xp or 0) + 30
    profile.today_xp = (profile.today_xp or 0) + 30

    badges = set(json.loads(profile.badges_json or "[]"))
    badges.add("deep_thinker")
    profile.badges_json = json.dumps(list(badges))
    new_lvl, _ = get_level_info(profile.xp)
    profile.level = new_lvl

    db.commit()
    return result

@router.get("/progress", response_model=LearnerProgressResponse)
def get_learner_progress(db: Session = Depends(get_db)):
    records = db.query(UserProgress).filter(UserProgress.user_id == "default-learner").all()
    completed_ids = [r.lesson_id for r in records if r.completed]
    scores = {r.lesson_id: r.quiz_score for r in records if r.quiz_score is not None}

    profile = get_or_create_profile(db)
    earned_badge_ids = set(json.loads(profile.badges_json or "[]"))
    badges_list = [
        BadgeInfo(
            id=b["id"],
            title=b["title"],
            description=b["description"],
            icon=b["icon"],
            unlocked=b["id"] in earned_badge_ids
        )
        for b in ALL_BADGES
    ]

    total_lessons = sum(len(m.lessons) for t in CURRICULUM_TRACKS for m in t.modules)
    lvl_num, lvl_title = get_level_info(profile.xp or 150)

    return LearnerProgressResponse(
        completed_lesson_ids=completed_ids,
        quiz_scores=scores,
        diagnostic_completed=bool(profile.diagnostic_completed),
        recommended_track=profile.recommended_track or "track-foundations",
        total_lessons_count=total_lessons,
        xp=profile.xp or 150,
        level=lvl_num,
        level_title=lvl_title,
        streak_days=profile.streak_days or 3,
        daily_goal_xp=profile.daily_goal_xp or 50,
        today_xp=profile.today_xp or 30,
        badges=badges_list
    )

