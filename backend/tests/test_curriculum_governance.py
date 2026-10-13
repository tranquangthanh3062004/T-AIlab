from fastapi.testclient import TestClient
from app.main import app
from app.schemas.curriculum import Lesson, QuizQuestion, QuizOption
from app.services.curriculum import get_tracks_by_lang
from app.services.curriculum_governance import (
    VERIFIED_OER_REGISTRY,
    evaluate_lesson_rubric,
    validate_curriculum_prerequisite_dag,
    compute_mastery_and_recommendations
)
from app.services.execution import execute_sandboxed_code

client = TestClient(app)


def test_12_track_bilingual_curriculum_and_dag_integrity():
    for lang in ("vi", "en"):
        tracks = get_tracks_by_lang(lang)
        assert len(tracks) == 12, f"Expected 12 tracks for lang={lang}, got {len(tracks)}"
        audit = validate_curriculum_prerequisite_dag(tracks)
        assert audit["duplicate_lesson_ids"] == []
        assert audit["missing_prerequisites"] == []
        assert audit["dag_cycles"] == []
        assert audit["all_lessons_passed_rubric"] is True
        assert audit["average_rubric_score"] >= 9.5


def test_all_lesson_code_exercises_pass_sandbox_unit_assertions():
    tracks = get_tracks_by_lang("vi")
    executed_count = 0
    for tr in tracks:
        for mod in tr.modules:
            for lsn in mod.lessons:
                assert lsn.real_dataset is not None, f"Lesson {lsn.id} missing verified dataset"
                assert lsn.source_references and len(lsn.source_references) >= 1
                if lsn.code_exercise:
                    res = execute_sandboxed_code(
                        code=lsn.code_exercise.solution_code,
                        timeout_seconds=5,
                        test_assertions=lsn.code_exercise.test_assertions_code
                    )
                    assert res.success is True, f"Solution failed in {lsn.id}: {res.stderr}"
                    assert res.passed_tests is True
                    executed_count += 1
    assert executed_count >= 12


def test_13_criterion_rubric_hard_blocking_gate():
    bad_lesson = Lesson(
        id="lesson-bad-test",
        module_id="mod-1",
        track_id="track-1",
        title="Broken Lesson",
        estimated_minutes=10,
        difficulty="Beginner",
        objectives=["Only 1 objective"],
        intuitive_explanation="Too short",
        formal_explanation="Short",
        license_provenance="",  # Violates license compliance gate
        quiz=[
            QuizQuestion(
                id="q1",
                question="Invalid question with no correct answer",
                options=[
                    QuizOption(id="o1", text="Wrong 1", is_correct=False, explanation="No"),
                    QuizOption(id="o2", text="Wrong 2", is_correct=False, explanation="No"),
                ]
            )
        ],
        summary="Summary"
    )
    eval_res = evaluate_lesson_rubric(bad_lesson)
    assert eval_res.passed_blocking_gates is False
    assert eval_res.review_status == "BLOCKED"
    assert eval_res.overall_score == 0.0
    assert len(eval_res.blocking_reasons) >= 2


def test_oer_registry_and_explainable_recommendations_api():
    oer_res = client.get("/api/learn/oer/resources")
    assert oer_res.status_code == 200
    oer_list = oer_res.json()
    assert len(oer_list) >= 10
    assert all(item["canonical_url"].startswith("https://") for item in oer_list)

    audit_res = client.get("/api/learn/governance/audit?lang=vi")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    assert audit_data["all_lessons_passed_rubric"] is True

    prog_res = client.get("/api/learn/progress?lang=vi&persona=beginner")
    assert prog_res.status_code == 200
    prog_data = prog_res.json()
    assert "mastery_dimensions" in prog_data
    assert "recommendations" in prog_data
    assert len(prog_data["recommendations"]) >= 1
    assert len(prog_data["recommendations"][0]["rationale"]) > 20


def test_remediation_recommendation_when_quiz_score_low():
    tracks = get_tracks_by_lang("en")
    mastery, recs = compute_mastery_and_recommendations(
        tracks=tracks,
        completed_lesson_ids=["lesson-foundations-what-is-ai"],
        quiz_scores={"lesson-foundations-what-is-ai": 50.0},
        code_passed_lesson_ids=[],
        persona="beginner",
        lang="en"
    )
    assert mastery.confidence_level in ("LOW", "MODERATE", "HIGH")
    assert any(r.recommendation_type == "REMEDIATION" and r.lesson_id == "lesson-foundations-what-is-ai" for r in recs)
