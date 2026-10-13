from app.services.curriculum import (
    CURRICULUM_TRACKS, evaluate_lesson_quiz, evaluate_diagnostic_assessment
)

def test_curriculum_tracks_integrity():
    assert len(CURRICULUM_TRACKS) == 12
    track_ids = {t.id for t in CURRICULUM_TRACKS}
    expected_ids = {
        "track-foundations", "track-python", "track-math",
        "track-data-science", "track-ml", "track-dl",
        "track-computer-vision", "track-llm", "track-ai-agents",
        "track-mlops", "track-research-engineering", "track-capstone-portfolio"
    }
    assert track_ids == expected_ids
    foundations = next((t for t in CURRICULUM_TRACKS if t.id == "track-foundations"), None)
    assert foundations is not None
    assert len(foundations.modules) > 0
    first_lesson = foundations.modules[0].lessons[0]
    assert first_lesson.id == "lesson-foundations-what-is-ai"
    assert len(first_lesson.quiz) > 0

def test_quiz_deterministic_evaluation():
    # Pass quiz
    submissions = {
        "q-foundations-1": "opt-2",  # correct
        "q-foundations-2": "opt-2a"  # correct
    }
    result = evaluate_lesson_quiz("lesson-foundations-what-is-ai", submissions)
    assert result.passed is True
    assert result.score_percentage == 100.0
    assert result.unlocked_next_lesson_id == "lesson-foundations-generalization"

    # Fail quiz
    fail_submissions = {
        "q-foundations-1": "opt-1",  # incorrect
        "q-foundations-2": "opt-2b"  # incorrect
    }
    fail_result = evaluate_lesson_quiz("lesson-foundations-what-is-ai", fail_submissions)
    assert fail_result.passed is False
    assert fail_result.score_percentage == 0.0

def test_diagnostic_assessment_recommendation():
    # Score 100% -> recommended track-llm
    all_correct = {
        "diag-1": "d1-c",
        "diag-2": "d2-a",
        "diag-3": "d3-b",
        "diag-4": "d4-a"
    }
    high_res = evaluate_diagnostic_assessment(all_correct)
    assert high_res.score_percentage == 100.0
    assert high_res.recommended_track_id == "track-llm"

    # Score 0% -> recommended track-foundations
    all_wrong = {
        "diag-1": "d1-a",
        "diag-2": "d2-b",
        "diag-3": "d3-a",
        "diag-4": "d4-b"
    }
    low_res = evaluate_diagnostic_assessment(all_wrong)
    assert low_res.score_percentage == 0.0
    assert low_res.recommended_track_id == "track-foundations"

def test_curriculum_formula_guides():
    all_lessons = [
        lesson
        for track in CURRICULUM_TRACKS
        for module in track.modules
        for lesson in module.lessons
    ]
    assert len(all_lessons) >= 7
    for lesson in all_lessons:
        assert lesson.formula_guide is not None, f"Lesson {lesson.id} missing formula_guide"
        assert len(lesson.formula_guide.title) > 0
        assert len(lesson.formula_guide.latex_expression) > 0
        assert len(lesson.formula_guide.plain_english) > 0
        assert len(lesson.formula_guide.symbols) >= 2, f"Lesson {lesson.id} should have at least 2 symbols explained"
        assert len(lesson.formula_guide.steps) >= 2, f"Lesson {lesson.id} should have at least 2 calculation steps"
        for sym in lesson.formula_guide.symbols:
            assert sym.symbol and sym.name and sym.meaning and sym.sample_value
        for st in lesson.formula_guide.steps:
            assert st.step_number > 0 and st.title and st.calculation and st.result_meaning
