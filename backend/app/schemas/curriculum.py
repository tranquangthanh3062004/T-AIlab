from pydantic import BaseModel, Field

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

class Lesson(BaseModel):
    id: str
    module_id: str
    title: str
    track_id: str
    estimated_minutes: int
    difficulty: str  # Beginner, Intermediate, Advanced
    prerequisites: list[str] = []
    objectives: list[str]
    intuitive_explanation: str
    formal_explanation: str
    formula_guide: FormulaGuide | None = None
    worked_example_code: str | None = None
    common_misconceptions: list[str] = []
    interactive_widget: LessonInteractiveWidget | None = None
    quiz: list[QuizQuestion] = []
    code_exercise: CodeExercise | None = None
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
    title: str
    tagline: str
    description: str
    level: str  # Beginner, Intermediate, Advanced
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
    track_title: str
    analysis: str
    suggested_starting_lesson_id: str

class BadgeInfo(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked: bool = False

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
