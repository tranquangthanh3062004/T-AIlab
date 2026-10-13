from pydantic import BaseModel

class QuizOption(BaseModel):
    id: str
    text: str
    is_correct: bool
    explanation: str

class QuizQuestion(BaseModel):
    id: str
    question: str
    type: str = "single_choice"  # single_choice, multiple_choice, code_check
    options: list[QuizOption]
    hint: str | None = None

class CodeExercise(BaseModel):
    id: str
    instructions: str
    starter_code: str
    solution_code: str
    test_assertions_code: str

class LessonInteractiveWidget(BaseModel):
    type: str  # gradient_descent, perceptron, attention, token_visualizer
    title: str
    description: str
    initial_params: dict

class FormulaSymbol(BaseModel):
    symbol: str               # e.g. "w"
    name: str                 # e.g. "Trọng số (Weight)"
    meaning: str              # e.g. "Mức độ ảnh hưởng của đặc trưng đến quyết định"
    sample_value: str         # e.g. "0.5"

class FormulaStep(BaseModel):
    step_number: int          # 1, 2, 3
    title: str                # e.g. "Nhân đặc trưng với trọng số"
    calculation: str          # e.g. "0.5 * 2.0 = 1.0"
    result_meaning: str       # e.g. "Đóng góp 1.0 điểm vào ngưỡng kích hoạt"

class FormulaGuide(BaseModel):
    title: str
    latex_expression: str
    plain_english: str
    symbols: list[FormulaSymbol]
    steps: list[FormulaStep]

class LessonDataset(BaseModel):
    name: str
    source_org: str
    source_url: str
    license: str
    description: str
    columns: list[str]
    sample_rows: list[dict[str, str | float | int]]

class SourceReference(BaseModel):
    title: str
    organization: str
    url: str
    resource_type: str = "PRIMARY_DOC"  # PRIMARY_DOC, UNIVERSITY_COURSE, OPEN_BOOK, PEER_REVIEWED_PAPER, GITHUB_REPO
    license: str = "CC BY 4.0 / BSD-3"
    lifecycle_status: str = "PUBLISHED"

class CapstoneProjectSpec(BaseModel):
    problem_statement: str
    dataset_and_license: str
    acceptance_criteria: list[str]
    baseline_model: str
    evaluation_metrics: list[str]
    implementation_steps: list[str]
    error_analysis_guide: str
    security_considerations: str
    deployment_plan: str
    rubric_dimensions: list[dict[str, str]]

class FlashcardItem(BaseModel):
    question: str
    answer: str

class Lesson(BaseModel):
    # Phase 3: Complete 16-Section & 27-Field Standard Lesson Schema
    id: str
    module_id: str
    title: str
    track_id: str
    target_audience: str = "beginner"  # "beginner" or "engineer"
    estimated_minutes: int
    difficulty: str  # Beginner, Intermediate, Advanced, Research/Expert
    prerequisites: list[str] = []
    objectives: list[str]
    why_this_matters: str = "Cung cấp nền tảng toán học, tư duy dữ liệu và kỹ năng lập trình kiểm chứng được trong các hệ thống AI thực tế."
    intuitive_explanation: str
    deep_dive_notes: list[str] = []
    formal_explanation: str
    formula_guide: FormulaGuide | None = None
    real_dataset: LessonDataset | None = None
    worked_example_code: str | None = None
    output_analysis: str = ""
    common_misconceptions: list[str] = []
    when_to_use_and_not_use: list[str] = []
    guided_practice: list[str] = []
    interactive_widget: LessonInteractiveWidget | None = None
    quiz: list[QuizQuestion] = []
    code_exercise: CodeExercise | None = None
    capstone_spec: CapstoneProjectSpec | None = None
    flashcards: list[FlashcardItem] = []
    mastery_criteria: list[str] = [
        "Đạt tối thiểu 70% bài kiểm tra trắc nghiệm định lượng (Active Recall Quiz).",
        "Vượt qua 100% kiểm thử đơn vị (Unit Assertions) trong môi trường Python Sandbox."
    ]
    further_reading: list[str] = []
    source_references: list[SourceReference] = []
    content_version: str = "2.3.0"
    review_status: str = "PUBLISHED"  # DISCOVERED, METADATA_VERIFIED, CONTENT_REVIEWED, CURRICULUM_MAPPED, PUBLISHED
    last_verified_date: str = "2026-10-13"
    license_provenance: str = "Original CHINAI Pedagogical Content (CC BY 4.0) grounded in verified open-source documentation & datasets."
    summary: str
    next_lesson_id: str | None = None

class Module(BaseModel):
    id: str
    track_id: str
    title: str
    description: str
    lessons: list[Lesson] = []

class Track(BaseModel):
    id: str
    track_number: int = 0
    title: str
    tagline: str
    description: str
    level: str  # Beginner, Intermediate, Advanced, Research/Expert
    target_audience: str = "beginner"  # "beginner" or "engineer"
    specialization_branch: str = "CORE"  # CORE_FOUNDATION, CORE_ENGINEERING, ELECTIVE_SPECIALIZATION, CAPSTONE_PORTFOLIO
    prerequisites: list[str] = []
    learning_outcomes: list[str] = []
    completion_criteria: str = "Hoàn thành toàn bộ bài tập Python Sandbox và đạt >= 70% điểm Quiz của các mô-đun."
    estimated_hours: int
    modules: list[Module] = []

class QuizSubmission(BaseModel):
    lesson_id: str
    selected_option_ids: dict[str, str]  # question_id -> option_id

class QuizResult(BaseModel):
    lesson_id: str
    score_percentage: float
    passed: bool
    feedback: list[dict]
    unlocked_next_lesson_id: str | None = None

class DiagnosticSubmission(BaseModel):
    answers: dict[str, str]  # question_id -> option_id

class DiagnosticResult(BaseModel):
    score_percentage: float
    recommended_track_id: str
    recommended_persona: str = "beginner"
    track_title: str
    analysis: str
    suggested_starting_lesson_id: str

class BadgeInfo(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked: bool = False

class MasteryDimensionBreakdown(BaseModel):
    completion_rate: float
    assessment_performance: float
    estimated_mastery: float
    confidence_level: str  # LOW, MODERATE, HIGH
    confidence_note: str
    demonstrated_project_skill: float

class AdaptiveRecommendationItem(BaseModel):
    lesson_id: str
    lesson_title: str
    track_id: str
    track_title: str
    target_audience: str
    priority: str  # HIGH, MEDIUM, REVIEW
    recommendation_type: str  # REMEDIATION, NEXT_PREREQUISITE, SPACED_REVIEW, CAPSTONE_CHALLENGE
    rationale: str
    estimated_minutes: int

class OERResourceSchema(BaseModel):
    id: str
    title: str
    organization: str
    canonical_url: str
    resource_type: str
    access_model: str = "FREE_OPEN"  # FREE_OPEN, FREEMIUM_AUDIT, OPEN_SOURCE_DOCS
    spdx_license: str
    attribution_requirements: str
    lifecycle_status: str
    mapped_tracks: list[str]
    quality_score: float
    last_verified_date: str

class LessonRubricEvaluation(BaseModel):
    lesson_id: str
    content_version: str
    review_status: str
    overall_score: float
    passed_blocking_gates: bool
    criteria_scores: dict[str, float]
    blocking_reasons: list[str]
    last_verified_date: str

class LearnerProgressResponse(BaseModel):
    completed_lesson_ids: list[str]
    quiz_scores: dict[str, float]
    diagnostic_completed: bool
    recommended_track: str
    total_lessons_count: int
    xp: int
    level: int
    level_title: str
    streak_days: int
    daily_goal_xp: int
    today_xp: int
    badges: list[BadgeInfo]
    mastery_dimensions: MasteryDimensionBreakdown | None = None
    recommendations: list[AdaptiveRecommendationItem] = []
