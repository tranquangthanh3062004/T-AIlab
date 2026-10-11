from app.schemas.curriculum import (
    Track, Module, Lesson, LessonInteractiveWidget,
    QuizQuestion, QuizOption, CodeExercise,
    QuizResult, DiagnosticResult,
    FormulaGuide, FormulaSymbol, FormulaStep
)

# -------------------------------------------------------------
# 7 Core Curriculum Tracks with In-Depth Pedagogical Content
# -------------------------------------------------------------

CURRICULUM_TRACKS: list[Track] = [
    Track(
        id="track-foundations",
        title="Track A: AI Foundations",
        tagline="Zero to conceptual clarity. Understand core paradigms, machine learning mechanics, and system limits.",
        description="Comprehensive grounding in AI terminology, supervised vs unsupervised vs reinforcement learning, overfitting, generalization, and responsible AI.",
        level="Beginner",
        estimated_hours=6,
        modules=[
            Module(
                id="mod-foundations-1",
                track_id="track-foundations",
                title="Foundational Paradigms & The ML Lifecycle",
                description="Understand how machines learn from patterns rather than explicit if-else rules.",
                lessons=[
                    Lesson(
                        id="lesson-foundations-what-is-ai",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        title="What is AI? Demystifying AI, ML, Deep Learning & Generative AI",
                        estimated_minutes=15,
                        difficulty="Beginner",
                        prerequisites=[],
                        objectives=[
                            "Differentiate clearly between Artificial Intelligence, Machine Learning, Deep Learning, and Generative AI.",
                            "Identify the input-feature-label lifecycle of predictive systems.",
                            "Recognize why traditional rule-based software fails on high-dimensional perception problems."
                        ],
                        intuitive_explanation="Imagine writing a computer program to recognize a handwritten digit '8'. In traditional programming, you would try writing hundreds of if/else rules about loops and curves. But human handwriting varies endlessly. Machine Learning flips this equation: instead of programming rules, you feed thousands of examples of '8's and non-'8's, and the computer calculates its own statistical decision boundary.",
                        formal_explanation="Trong học máy có giám sát (Supervised Learning), mô hình tìm kiếm các hệ số trọng số w và độ lệch b sao cho hàm dự đoán f(x) tạo ra sai số nhỏ nhất so với nhãn thực tế y.",
                        formula_guide=FormulaGuide(
                            title="Mô hình Dự đoán Tuyến tính & Ranh giới Quyết định (Linear Decision)",
                            latex_expression="y = sign(w_1 * x_1 + w_2 * x_2 + b)",
                            plain_english="Dự đoán = Dấu của [ (Trọng số 1 * Đặc trưng 1) + (Trọng số 2 * Đặc trưng 2) + Độ lệch nền ]",
                            symbols=[
                                FormulaSymbol(symbol="w", name="Trọng số (Weight)", meaning="Mức độ ảnh hưởng tích cực hay tiêu cực của đặc trưng đến quyết định", sample_value="0.5"),
                                FormulaSymbol(symbol="x", name="Đặc trưng đầu vào (Input feature)", meaning="Giá trị dữ liệu đo đạc (ví dụ: diện tích, chiều cao, tần suất)", sample_value="2.0"),
                                FormulaSymbol(symbol="b", name="Độ lệch nền (Bias)", meaning="Ngưỡng khởi điểm cho phép dịch chuyển đường biên quyết định", sample_value="-0.4"),
                                FormulaSymbol(symbol="y", name="Nhãn dự đoán (Output Label)", meaning="Kết quả phân loại (1 nếu tổng > 0, ngược lại 0)", sample_value="1")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Nhân trọng số với đặc trưng", calculation="(0.5 * 2.0) + (-0.2 * 1.0) = 1.0 - 0.2 = 0.8", result_meaning="Tổng đóng góp của các đặc trưng vào quyết định"),
                                FormulaStep(step_number=2, title="Cộng thêm độ lệch nền bias", calculation="0.8 + (-0.4) = 0.4", result_meaning="Điểm số kích hoạt tổng hợp"),
                                FormulaStep(step_number=3, title="Đưa qua ngưỡng quyết định sign()", calculation="0.4 > 0 -> y = 1", result_meaning="Mô hình kết luận dự đoán thuộc Nhãn 1")
                            ]
                        ),
                        worked_example_code="""# Traditional Software vs Machine Learning Paradigm
# In ML, we define a model family and fit parameters to data:
def predict(features, weights, bias):
    # Linear hypothesis: y = w1*x1 + w2*x2 + ... + b
    return sum(f * w for f, w in zip(features, weights)) + bias

sample_features = [0.8, 1.2, 0.4]  # e.g., word frequencies or normalized pixel values
weights = [0.5, -0.2, 1.1]
bias = 0.05

score = predict(sample_features, weights, bias)
prediction = 1 if score > 0 else 0
print(f"Computed Score: {score:.3f} -> Class Prediction: {prediction}")""",
                        common_misconceptions=[
                            "Misconception: AI systems 'think' or understand meaning like humans. Reality: AI systems optimize numerical correlation patterns and token probability distributions.",
                            "Misconception: More parameters always mean a smarter model. Reality: Without adequate data and regularization, large models merely memorize noise (overfitting)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="2D Linear Decision Boundary Explorer",
                            description="Adjust weight parameters (W1, W2, Bias) to separate blue circles from red squares.",
                            initial_params={"w1": 0.5, "w2": -0.8, "bias": 0.2}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-foundations-1",
                                question="What is the key difference between classical programming and Machine Learning?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-1",
                                        text="Classical programming uses Python, while ML only uses Assembly.",
                                        is_correct=False,
                                        explanation="Both paradigms can be implemented in any modern language."
                                    ),
                                    QuizOption(
                                        id="opt-2",
                                        text="In classical programming humans write explicit rules; in ML, algorithms learn rules from data.",
                                        is_correct=True,
                                        explanation="Correct! Classical programming combines Data + Rules -> Answers. Machine Learning combines Data + Answers -> Rules (learned parameters)."
                                    ),
                                    QuizOption(
                                        id="opt-3",
                                        text="ML models never make mistakes once compiled.",
                                        is_correct=False,
                                        explanation="ML models are statistical approximations and invariably carry uncertainty and residual error."
                                    )
                                ]
                            ),
                            QuizQuestion(
                                id="q-foundations-2",
                                question="Which subset relationship correctly reflects modern AI terminology?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-2a",
                                        text="AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI / Large Language Models",
                                        is_correct=True,
                                        explanation="Correct! Deep Learning is a subset of ML using deep neural networks, and modern Generative AI models are deep neural architectures."
                                    ),
                                    QuizOption(
                                        id="opt-2b",
                                        text="Deep Learning ⊃ AI ⊃ Machine Learning",
                                        is_correct=False,
                                        explanation="Deep Learning is a specific subfield of Machine Learning, not the parent domain."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-foundations-linear-predict",
                            instructions="Complete the function `simple_linear_predict(x, weight, bias)` that computes `weight * x + bias` and returns `1` if the result is greater than 0, otherwise returns `0`.",
                            starter_code="""def simple_linear_predict(x: float, weight: float, bias: float) -> int:
    # TODO: Calculate linear activation and return binary threshold (1 or 0)
    pass
""",
                            solution_code="""def simple_linear_predict(x: float, weight: float, bias: float) -> int:
    val = weight * x + bias
    return 1 if val > 0 else 0
""",
                            test_assertions_code="""assert simple_linear_predict(2.0, 1.0, -1.0) == 1, "Expected 1 for 2*1 - 1 = 1 > 0"
assert simple_linear_predict(0.0, 1.0, -1.0) == 0, "Expected 0 for 0*1 - 1 = -1 <= 0"
assert simple_linear_predict(-5.0, 2.0, 5.0) == 0, "Expected 0 for -10 + 5 = -5 <= 0"
print("SUCCESS: simple_linear_predict verified!")
"""
                        ),
                        summary="Artificial Intelligence is the broad study of rational agents. Machine Learning solves problems by learning parameter weights from data. Deep Learning uses multi-layer neural networks to automatically discover representations.",
                        next_lesson_id="lesson-foundations-generalization"
                    ),
                    Lesson(
                        id="lesson-foundations-generalization",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        title="Generalization, Overfitting & Underfitting",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Define what generalization means in statistical learning.",
                            "Understand why high train accuracy can coexist with catastrophic test failure (overfitting).",
                            "Identify the role of train, validation, and test splits."
                        ],
                        intuitive_explanation="Think of preparing for a high school math exam. If a student memorizes the exact answers to the 50 practice problems without learning the underlying formulas, they will score 100% on the practice set. But on exam day with new numbers, they fail completely. Overfitting is exact memorization of noise; generalization is learning the genuine underlying principle.",
                        formal_explanation="Khoảng cách tổng quát hóa (Generalization Gap) là hiệu số giữa sai số thực tế trên tập kiểm tra (Test Error) và sai số trên tập huấn luyện (Train Error). Khi khoảng cách này lớn bất thường, mô hình đang bị quá khớp (overfitting).",
                        formula_guide=FormulaGuide(
                            title="Khoảng Cách Tổng Quát Hóa & Sai Số Kiểm Tra (Generalization Gap)",
                            latex_expression="Gap = | E_test - E_train |",
                            plain_english="Khoảng cách Tổng quát hóa = Độ lệch tuyệt đối giữa [Sai số trên tập Kiểm tra mới] và [Sai số trên tập Huấn luyện cũ]",
                            symbols=[
                                FormulaSymbol(symbol="E_train", name="Sai số Huấn luyện (Train Error)", meaning="Tỷ lệ dự đoán sai của mô hình trên tập dữ liệu đã dùng để huấn luyện", sample_value="0.02 (2%)"),
                                FormulaSymbol(symbol="E_test", name="Sai số Kiểm tra (Test Error)", meaning="Tỷ lệ sai sót khi mô hình dự đoán trên dữ liệu hoàn toàn mới chưa từng thấy", sample_value="0.35 (35%)"),
                                FormulaSymbol(symbol="Gap", name="Khoảng cách Tổng quát hóa (Generalization Gap)", meaning="Thước đo mức độ 'học vẹt'. Gap càng lớn, mô hình càng phụ thuộc vào dữ liệu cũ và mất khả năng thích ứng", sample_value="0.33 (33%)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Đo lường sai số tập huấn luyện", calculation="E_train = 0.02 (Chỉ sai 2% trên tập quen thuộc)", result_meaning="Mô hình ghi nhớ rất tốt dữ liệu học"),
                                FormulaStep(step_number=2, title="Đo lường sai số tập dữ liệu mới", calculation="E_test = 0.35 (Sai tới 35% trên dữ liệu mới)", result_meaning="Hiệu năng thực tế sụt giảm nghiêm trọng"),
                                FormulaStep(step_number=3, title="Tính khoảng cách tổng quát hóa", calculation="Gap = |0.35 - 0.02| = 0.33 (33% chênh lệch)", result_meaning="Báo động Overfitting: Cần áp dụng Early Stopping hoặc L2 Regularization!")
                            ]
                        ),
                        worked_example_code="""# Diagnosing Overfitting via Training vs Validation Loss
train_losses = [0.82, 0.45, 0.22, 0.11, 0.04, 0.01]
val_losses   = [0.85, 0.49, 0.31, 0.29, 0.35, 0.52]

# At epoch 4 (index 3), validation loss hits minimum (0.29).
# Beyond epoch 4, validation loss begins rising while train loss drops -> Overfitting!
best_epoch = val_losses.index(min(val_losses)) + 1
print(f"Optimal early-stopping checkpoint: Epoch {best_epoch}")""",
                        common_misconceptions=[
                            "Misconception: If training loss is 0.0, the model is perfect. Reality: Zero training loss almost always signals severe overfitting or data leakage."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Polynomial Degree & Overfitting Visualizer",
                            description="Compare Degree 1 (Underfitting), Degree 3 (Balanced), and Degree 15 (Overfitting) curves against noisy data points.",
                            initial_params={"degree": 3, "regularization_lambda": 0.01}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-generalization-1",
                                question="What is the primary sign that a machine learning model is overfitting?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-g1",
                                        text="Training error is very high and test error is very high.",
                                        is_correct=False,
                                        explanation="This describes underfitting (high bias)."
                                    ),
                                    QuizOption(
                                        id="opt-g2",
                                        text="Training error continues decreasing, but validation/test error begins increasing.",
                                        is_correct=True,
                                        explanation="Correct! The model is memorizing training-set noise at the expense of out-of-sample generalization."
                                    ),
                                    QuizOption(
                                        id="opt-g3",
                                        text="The model takes too little time to compute predictions.",
                                        is_correct=False,
                                        explanation="Inference speed is unrelated to generalization error."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-generalization-gap",
                            instructions="Write a function `detect_overfitting_point(val_losses: list[float]) -> int` that returns the 0-indexed epoch where validation loss starts strictly increasing for the first time.",
                            starter_code="""def detect_overfitting_point(val_losses: list[float]) -> int:
    # Return index where val_losses[i] > val_losses[i-1] for the first time
    pass
""",
                            solution_code="""def detect_overfitting_point(val_losses: list[float]) -> int:
    for i in range(1, len(val_losses)):
        if val_losses[i] > val_losses[i-1]:
            return i - 1
    return len(val_losses) - 1
""",
                            test_assertions_code="""assert detect_overfitting_point([0.9, 0.7, 0.5, 0.6, 0.8]) == 2
assert detect_overfitting_point([0.8, 0.6, 0.4, 0.2]) == 3
print("SUCCESS: detect_overfitting_point verified!")
"""
                        ),
                        summary="Generalization is the defining metric of any ML system. Training loss only indicates capacity to fit given data; validation and holdout test sets reveal whether the model has learned reusable structure.",
                        next_lesson_id="lesson-python-vectorization"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-python",
        title="Track B: Python for AI & Numerical Computing",
        tagline="NumPy arrays, vectorized operations, tensors, and memory-efficient data processing.",
        description="Master the computational backbone of modern AI: fast vectorized operations, array broadcasting, memory layouts, and matrix manipulations in Python.",
        level="Beginner",
        estimated_hours=7,
        modules=[
            Module(
                id="mod-python-1",
                track_id="track-python",
                title="Vectorization & Numerical Arrays",
                description="Replace slow Python loops with high-performance C-contiguous array manipulations.",
                lessons=[
                    Lesson(
                        id="lesson-python-vectorization",
                        module_id="mod-python-1",
                        track_id="track-python",
                        title="Vectorized Computing: Why Python Loops Fail in AI",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Understand why standard Python for-loops introduce massive overhead (dynamic typing & GIL).",
                            "Implement vectorized dot products and broadcasting operations.",
                            "Compare execution throughput of scalar vs vectorized code."
                        ],
                        intuitive_explanation="In pure Python, computing 1 million additions executes 1 million type checks and dynamic object lookups. Vectorized computing bypasses this by allocating contiguous blocks of memory and dispatching SIMD (Single Instruction Multiple Data) CPU instructions that crunch 8 or 16 numbers in a single clock cycle.",
                        formal_explanation="Tích vô hướng vector (Dot Product) biểu diễn việc nhân từng cặp giá trị tương ứng của hai vector rồi cộng dồn lại. Khi áp dụng SIMD (Single Instruction Multiple Data), CPU xử lý toàn bộ phép tính trong một nhịp xung nhịp.",
                        formula_guide=FormulaGuide(
                            title="Tích Vô Hướng Vector & Tính Toán Song Song (Vector Dot Product)",
                            latex_expression="x · w = ∑_{i=1}^d (x_i · w_i)",
                            plain_english="Tích vô hướng = Tổng của tích từng cặp phần tử tương ứng giữa Vector đặc trưng x và Vector trọng số w",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Vector Đặc trưng (Feature Vector)", meaning="Chuỗi các giá trị đầu vào gom thành mảng 1 chiều", sample_value="[1.5, 2.0, 3.0]"),
                                FormulaSymbol(symbol="w", name="Vector Trọng số (Weight Vector)", meaning="Chuỗi các hệ số tầm quan trọng tương ứng", sample_value="[0.5, 1.0, 2.0]"),
                                FormulaSymbol(symbol="d", name="Số chiều (Dimensions)", meaning="Độ dài của vector (số lượng đặc trưng)", sample_value="3 chiều"),
                                FormulaSymbol(symbol="∑", name="Tổng tích lũy (Summation ∑)", meaning="Cộng dồn toàn bộ các tích thành một số thực vô hướng duy nhất", sample_value="8.75")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Nhân từng cặp phần tử tương ứng", calculation="(1.5 * 0.5) = 0.75; (2.0 * 1.0) = 2.0; (3.0 * 2.0) = 6.0", result_meaning="Nhận được 3 giá trị thành phần"),
                                FormulaStep(step_number=2, title="Cộng dồn các giá trị thành phần", calculation="0.75 + 2.0 + 6.0 = 8.75", result_meaning="Kết quả tích vô hướng cuối cùng"),
                                FormulaStep(step_number=3, title="Hiệu năng phần cứng SIMD", calculation="1 lệnh vector thay vì 3 vòng lặp Python", result_meaning="Tăng tốc độ tính toán gấp hàng chục lần so với vòng for thông thường")
                            ]
                        ),
                        worked_example_code="""# Comparing Scalar vs Vectorized Concept
def scalar_dot(a, b):
    total = 0.0
    for x, y in zip(a, b):
        total += x * y
    return total

v1 = [1.5, 2.0, 3.5, 4.0]
v2 = [0.5, 1.0, -0.5, 2.0]
result = scalar_dot(v1, v2)
print(f"Dot product computed: {result:.2f}")
""",
                        common_misconceptions=[
                            "Misconception: Python is inherently too slow for AI. Reality: Python acts as a high-level orchestration layer, while heavy tensor computations run in optimized C++/CUDA kernels."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Vector Operations Inspector",
                            description="Visualize how 2D vectors combine linearly to produce a scalar output.",
                            initial_params={"w1": 1.0, "w2": 2.0, "bias": 0.0}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-py-1",
                                question="Why are vectorized array operations drastically faster than standard Python loops?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-py1", text="They run inside contiguous memory buffers using C-level SIMD instructions, avoiding dynamic typing overhead.", is_correct=True, explanation="Correct! Contiguous memory and compiled BLAS routines maximize hardware efficiency."),
                                    QuizOption(id="opt-py2", text="They automatically compile Python code into JavaScript.", is_correct=False, explanation="Array vectorization operates at C/Assembly level.")
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-py-vector-norm",
                            instructions="Write a function `vector_l2_norm(vec: list[float]) -> float` that computes the Euclidean L2 norm sqrt(sum(x_i^2)) rounded to 3 decimal places.",
                            starter_code="""import math

def vector_l2_norm(vec: list[float]) -> float:
    # TODO: Calculate Euclidean L2 norm
    pass
""",
                            solution_code="""import math

def vector_l2_norm(vec: list[float]) -> float:
    return round(math.sqrt(sum(x * x for x in vec)), 3)
""",
                            test_assertions_code="""assert vector_l2_norm([3.0, 4.0]) == 5.0
assert vector_l2_norm([1.0, 2.0, 2.0]) == 3.0
print("SUCCESS: vector_l2_norm verified!")
"""
                        ),
                        summary="Vectorization is the computational foundation of AI engineering. Understanding memory layout and array operations is essential before training neural networks.",
                        next_lesson_id="lesson-math-gradient-descent"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-math",
        title="Track C: Mathematics for AI",
        tagline="Visual intuition for vectors, matrices, calculus, and optimization landscapes.",
        description="Build strong conceptual foundations in linear algebra, derivatives, gradients, and optimization without intimidating jargon.",
        level="Beginner",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-math-1",
                track_id="track-math",
                title="Calculus & Gradient Descent",
                description="Understand how models calculate the direction to adjust millions of weights.",
                lessons=[
                    Lesson(
                        id="lesson-math-gradient-descent",
                        module_id="mod-math-1",
                        track_id="track-math",
                        title="Gradient Descent Demystified: Stepping Down the Loss Landscape",
                        estimated_minutes=25,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Explain the physical intuition of a gradient as the steepest direction uphill.",
                            "Understand why we subtract the gradient multiplied by a learning rate \\(\\eta\\).",
                            "Identify the hazards of too large vs too small learning rates."
                        ],
                        intuitive_explanation="Imagine being blindfolded on a foggy mountain and wanting to find the lowest valley. You cannot see the landscape, but with your feet you can feel which direction slopes downward steepest. You take a step in that direction. Gradient descent does exactly this: the gradient tells the model which way is uphill, so the model steps in the opposite direction.",
                        formal_explanation="Gradient Descent (Hạ độ dốc) là thuật toán tối ưu hóa lặp. Tại mỗi bước, thuật toán tính toán đạo hàm (độ dốc) của hàm mất mát theo từng trọng số, rồi cập nhật trọng số theo hướng ngược lại với một bước nhảy tỷ lệ với tốc độ học eta.",
                        formula_guide=FormulaGuide(
                            title="Quy Tắc Cập Nhật Trọng Số Gradient Descent (Parameter Update Rule)",
                            latex_expression="w_{mới} = w_{cũ} - η · (∂L / ∂w)",
                            plain_english="Trọng số mới = Trọng số cũ - [ Tốc độ học η · Đạo hàm độ dốc ∂L/∂w ]",
                            symbols=[
                                FormulaSymbol(symbol="w_{cũ}", name="Trọng số hiện tại (Current Weight w_{cũ})", meaning="Giá trị tham số trước khi thực hiện bước cập nhật", sample_value="5.0"),
                                FormulaSymbol(symbol="η", name="Tốc độ học (Learning Rate η)", meaning="Hệ số quy định độ dài của mỗi bước chân hạ dốc. Thường nằm trong khoảng 0.001 đến 0.1", sample_value="0.1"),
                                FormulaSymbol(symbol="∂L / ∂w", name="Đạo hàm độ dốc (Gradient of Loss ∂L/∂w)", meaning="Độ nghiêng của hàm mất mát tại vị trí hiện tại. Hướng dốc đi lên (uphill)", sample_value="10.0 (dương nghĩa là dốc lên)"),
                                FormulaSymbol(symbol="w_{mới}", name="Trọng số mới (Updated Weight w_{mới})", meaning="Giá trị tham số sau khi bước một bước xuống đáy thung lũng mất mát", sample_value="4.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Tính độ dốc hàm mất mát (dL/dw)", calculation="Với hàm L = w^2, đạo hàm dL/dw = 2*w = 2 * 5.0 = 10.0", result_meaning="Hàm số đang dốc lên về bên phải"),
                                FormulaStep(step_number=2, title="Nhân độ dốc với tốc độ học", calculation="eta * (dL/dw) = 0.1 * 10.0 = 1.0", result_meaning="Kích thước bước nhảy cần dịch chuyển"),
                                FormulaStep(step_number=3, title="Trừ bước nhảy khỏi trọng số cũ", calculation="w_moi = 5.0 - 1.0 = 4.0", result_meaning="Mất mát giảm từ 5^2=25 xuống 4^2=16. Mô hình tiến gần cực tiểu hơn!")
                            ]
                        ),
                        worked_example_code="""# 1D Gradient Descent on L(w) = w^2 (minimum is at w=0)
# Derivative: dL/dw = 2*w
w = 5.0
learning_rate = 0.1

print(f"Initial weight: {w:.3f}")
for step in range(5):
    grad = 2.0 * w
    w = w - learning_rate * grad
    loss = w ** 2
    print(f"Step {step+1}: w = {w:.4f}, Loss = {loss:.4f}")""",
                        common_misconceptions=[
                            "Misconception: A higher learning rate always trains the model faster. Reality: If \\(\\eta\\) is too large, the updates overshoot the valley and diverge into infinity (NaN loss)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Interactive Loss Landscape Descent",
                            description="Drag the learning rate slider to observe convergence, slow progress, or divergence.",
                            initial_params={"learning_rate": 0.1, "initial_w": 4.0}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-gd-1",
                                question="Why does gradient descent subtract the gradient instead of adding it?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-gd1",
                                        text="Because the gradient points uphill (steepest increase), but we want to minimize loss.",
                                        is_correct=True,
                                        explanation="Correct! The gradient points toward higher loss, so taking negative steps moves toward minimum loss."
                                    ),
                                    QuizOption(
                                        id="opt-gd2",
                                        text="It is an arbitrary historical convention with no mathematical meaning.",
                                        is_correct=False,
                                        explanation="Subtracting points in the direction of steepest descent."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-gd-step",
                            instructions="Implement `gradient_descent_step(current_w, learning_rate, gradient)` which returns the updated weight value using the standard update formula.",
                            starter_code="""def gradient_descent_step(current_w: float, learning_rate: float, gradient: float) -> float:
    # TODO: compute and return updated weight
    pass
""",
                            solution_code="""def gradient_descent_step(current_w: float, learning_rate: float, gradient: float) -> float:
    return current_w - learning_rate * gradient
""",
                            test_assertions_code="""assert abs(gradient_descent_step(10.0, 0.1, 4.0) - 9.6) < 1e-6
assert abs(gradient_descent_step(0.0, 0.05, -2.0) - 0.1) < 1e-6
print("SUCCESS: gradient_descent_step verified!")
"""
                        ),
                        summary="Gradient descent is the engine powering modern deep learning. Every neural network, from simple MLPs to frontier LLMs, optimizes its billions of parameters using variants of this principle (e.g., AdamW).",
                        next_lesson_id="lesson-ml-decision-trees"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-ml",
        title="Track D: Classical Machine Learning",
        tagline="Regression, Decision Trees, Ensembles, and Feature Engineering.",
        description="Master foundational machine learning algorithms, bias-variance tradeoff, tree partitioning, and cross-validation pipelines with Scikit-Learn style principles.",
        level="Intermediate",
        estimated_hours=9,
        modules=[
            Module(
                id="mod-ml-1",
                track_id="track-ml",
                title="Supervised Learning & Tree Ensembles",
                description="Understand hierarchical decision spaces, information entropy, and ensemble bagging/boosting.",
                lessons=[
                    Lesson(
                        id="lesson-ml-decision-trees",
                        module_id="mod-ml-1",
                        track_id="track-ml",
                        title="Decision Trees & Information Entropy",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Calculate Shannon Entropy and Gini Impurity to quantify node disorder.",
                            "Understand how decision trees greedily partition feature space.",
                            "Explain why single decision trees overfit and how Random Forests alleviate this."
                        ],
                        intuitive_explanation="Imagine playing a game of '20 Questions'. At each question, you want to pick the query that splits remaining possibilities roughly in half, eliminating the greatest uncertainty. Decision trees do this mathematically by evaluating feature thresholds and picking the split that maximizes Information Gain.",
                        formal_explanation="Độ hỗn loạn thông tin Shannon (Information Entropy) đo lường mức độ bất định hoặc xáo trộn trong phân phối nhãn dữ liệu. Khi tất cả các mẫu cùng một nhãn, Entropy bằng 0 (thuần khiết). Cây quyết định chọn điểm cắt sao cho làm giảm Entropy nhiều nhất (Information Gain lớn nhất).",
                        formula_guide=FormulaGuide(
                            title="Độ Hỗn Loạn Thông Tin Shannon (Shannon Entropy)",
                            latex_expression="H(S) = - [ p · log₂(p) + (1 - p) · log₂(1 - p) ]",
                            plain_english="Độ hỗn loạn Entropy = Âm của tổng [ Tỷ lệ lớp p · log₂(p) + (1 - p) · log₂(1 - p) ]",
                            symbols=[
                                FormulaSymbol(symbol="p", name="Xác suất lớp dương (Probability of Class 1)", meaning="Tỷ lệ mẫu thuộc về nhãn thứ nhất trong nút lá", sample_value="0.5 (hỗn loạn tối đa)"),
                                FormulaSymbol(symbol="1 - p", name="Xác suất lớp âm (Probability of Class 0)", meaning="Tỷ lệ mẫu thuộc về nhãn còn lại", sample_value="0.5"),
                                FormulaSymbol(symbol="log₂", name="Logarit cơ số 2 (log₂)", meaning="Hàm đo lường số bit thông tin cần thiết để mã hóa trạng thái", sample_value="log₂(0.5) = -1.0"),
                                FormulaSymbol(symbol="H(S)", name="Chỉ số Entropy H(S)", meaning="Bằng 0 khi dữ liệu thuần nhất 100%; bằng 1.0 khi dữ liệu chia đều 50/50", sample_value="1.0 bit")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Xác định xác suất 2 lớp khi chia đều 50/50", calculation="p = 0.5; (1 - p) = 0.5", result_meaning="Trạng thái không chắc chắn cao nhất"),
                                FormulaStep(step_number=2, title="Tính logarit cơ số 2", calculation="log2(0.5) = -1.0", result_meaning="Mỗi phần tử đóng góp 0.5 * (-1.0) = -0.5"),
                                FormulaStep(step_number=3, title="Lấy dấu trừ tổng tích lũy", calculation="H(S) = - [ -0.5 + -0.5 ] = 1.0 bit", result_meaning="Nút đang hỗn loạn cực đại. Cây quyết định bắt buộc phải phân tách tiếp!")
                            ]
                        ),
                        worked_example_code="""import math

def binary_entropy(p):
    if p <= 0.0 or p >= 1.0:
        return 0.0
    return - (p * math.log2(p) + (1 - p) * math.log2(1 - p))

print(f"Entropy of 50/50 split (maximum disorder): {binary_entropy(0.5):.2f} bits")
print(f"Entropy of 90/10 split (high certainty): {binary_entropy(0.9):.2f} bits")
""",
                        common_misconceptions=[
                            "Misconception: Deep trees with 100% leaf purity are optimal. Reality: Deep unpruned trees suffer from severe variance and memorize training outliers."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Decision Tree Feature Split Explorer",
                            description="Observe how axis-aligned orthogonal boundaries separate class clusters.",
                            initial_params={"threshold": 0.5}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-ml-1",
                                question="What is the Shannon Entropy of a binary dataset where all samples belong to the same class?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-ml1", text="0.0 (Zero uncertainty / complete purity)", is_correct=True, explanation="Correct! When all items share one label, there is zero ambiguity, so entropy is 0."),
                                    QuizOption(id="opt-ml2", text="1.0 (Maximum entropy)", is_correct=False, explanation="Entropy of 1.0 occurs at a 50/50 split.")
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-ml-entropy",
                            instructions="Write a function `compute_binary_entropy(p: float) -> float` that returns Shannon entropy in bits, rounded to 3 decimal places. Handle edge cases p <= 0 or p >= 1 by returning 0.0.",
                            starter_code="""import math

def compute_binary_entropy(p: float) -> float:
    # TODO: Calculate binary Shannon entropy
    pass
""",
                            solution_code="""import math

def compute_binary_entropy(p: float) -> float:
    if p <= 0.0 or p >= 1.0:
        return 0.0
    val = - (p * math.log2(p) + (1.0 - p) * math.log2(1.0 - p))
    return round(val, 3)
""",
                            test_assertions_code="""assert compute_binary_entropy(0.5) == 1.0
assert compute_binary_entropy(0.0) == 0.0
assert compute_binary_entropy(1.0) == 0.0
print("SUCCESS: compute_binary_entropy verified!")
"""
                        ),
                        summary="Decision trees partition high-dimensional space into orthogonal decision regions. Controlling max depth and using ensemble forests forms the workhorse of tabular ML.",
                        next_lesson_id="lesson-dl-neural-activations"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-dl",
        title="Track E: Deep Learning & Neural Architectures",
        tagline="Perceptrons, Multi-Layer Perceptrons, Activation Functions, and PyTorch Tensors.",
        description="Build intuition for stacked representation learning: non-linear activations, hidden layers, forward pass graphs, and backpropagation mechanics.",
        level="Intermediate",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-dl-1",
                track_id="track-dl",
                title="Neural Units & Activations",
                description="Why non-linearities are mandatory to escape simple linear combinations.",
                lessons=[
                    Lesson(
                        id="lesson-dl-neural-activations",
                        module_id="mod-dl-1",
                        track_id="track-dl",
                        title="Non-Linear Activations: ReLU, Sigmoid & GELU",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Demonstrate why stacking multiple linear layers without activations collapses into a single linear map.",
                            "Understand the vanishing gradient problem in deep Sigmoid networks.",
                            "Implement Rectified Linear Unit (ReLU) and explain why it enables training deep networks."
                        ],
                        intuitive_explanation="If you stack 100 linear functions W2*(W1*x), algebra proves that (W2*W1) is just another single matrix W3. Without non-linearities, no matter how deep your network is, it cannot learn anything curved or complex like an XOR gate. Activation functions bend space between layers.",
                        formal_explanation="Hàm kích hoạt phi tuyến tính (Activation Function) uốn cong không gian đặc trưng giữa các tầng neuron. Nếu không có hàm phi tuyến, mạng dù sâu bao nhiêu tầng cũng chỉ tương đương với một phép nhân ma trận đơn lớp thông thường.",
                        formula_guide=FormulaGuide(
                            title="Hàm Kích Hoạt Tuyến Tính Từng Phần (Rectified Linear Unit - ReLU)",
                            latex_expression="ReLU(x) = max(0, x)   |   σ(x) = 1 / (1 + e⁻ˣ)",
                            plain_english="Đầu ra neuron = Giữ nguyên x nếu x > 0, triệt tiêu về 0 nếu x ≤ 0 (với ReLU) hoặc nén về khoảng (0, 1) với Sigmoid σ(x)",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Đầu vào kích hoạt (Net Input)", meaning="Tổng có trọng số cộng với bias: x = w₁·a₁ + w₂·a₂ + b", sample_value="2.5 (hoặc -3.0)"),
                                FormulaSymbol(symbol="max(0, x)", name="Hàm so sánh chặn dưới", meaning="Phép toán so sánh đầu vào với số 0 để loại bỏ giá trị âm", sample_value="max(0, 2.5) = 2.5"),
                                FormulaSymbol(symbol="σ(x)", name="Hàm Sigmoid σ(x)", meaning="Hàm nén giá trị vào khoảng (0, 1), thường dùng cho phân loại nhị phân", sample_value="1 / (1 + e⁻²·⁵) ≈ 0.92"),
                                FormulaSymbol(symbol="ReLU(x)", name="Tín hiệu đầu ra neuron", meaning="Giá trị kích hoạt neuron phát ra để truyền tiếp sang tầng sâu hơn", sample_value="2.5 (nếu kích hoạt) / 0.0 (nếu tắt)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Trường hợp tín hiệu dương (x > 0)", calculation="x = 2.5 -> ReLU(2.5) = max(0, 2.5) = 2.5", result_meaning="Neuron kích hoạt hoàn toàn, đạo hàm bằng 1.0 giúp lan truyền ngược dễ dàng"),
                                FormulaStep(step_number=2, title="Trường hợp tín hiệu âm (x <= 0)", calculation="x = -3.0 -> ReLU(-3.0) = max(0, -3.0) = 0.0", result_meaning="Neuron tắt hoàn toàn, tạo ra tính thưa (sparsity) tự nhiên"),
                                FormulaStep(step_number=3, title="Lợi thế so với Sigmoid", calculation="Đạo hàm = 1.0 (khi x>0) không bị bão hòa triệt tiêu đạo hàm", result_meaning="Cho phép huấn luyện các mạng nơ-ron sâu hàng trăm tầng!")
                            ]
                        ),
                        worked_example_code="""# Common Deep Learning Activations in Python
def relu(x):
    return max(0.0, x)

def leaky_relu(x, alpha=0.01):
    return x if x > 0 else alpha * x

sample_inputs = [-3.0, -0.5, 0.0, 1.5, 4.0]
relu_outputs = [relu(x) for x in sample_inputs]
print(f"Inputs:  {sample_inputs}")
print(f"ReLU:    {relu_outputs}")
""",
                        common_misconceptions=[
                            "Misconception: More hidden layers always make a model better. Reality: Without skip-connections (ResNets) or proper normalization (LayerNorm), ultra-deep networks suffer gradient degradation."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Non-Linear Decision Boundary Simulator",
                            description="Observe how non-linear activations allow separating arbitrary non-linear point distributions.",
                            initial_params={"activation": "relu"}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-dl-1",
                                question="What happens if a neural network has 50 hidden layers but uses NO activation functions (pure linear layers)?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-dl1", text="It mathematically collapses into an ordinary single-layer linear model.", is_correct=True, explanation="Correct! Matrix multiplications compose into a single linear transformation, losing all non-linear expressive capacity."),
                                    QuizOption(id="opt-dl2", text="It automatically achieves super-human vision accuracy.", is_correct=False, explanation="Linear models cannot learn non-linear patterns.")
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-dl-relu",
                            instructions="Implement the function `relu(x: float) -> float` which returns `x` if `x > 0`, otherwise returns `0.0`.",
                            starter_code="""def relu(x: float) -> float:
    # TODO: Implement ReLU activation
    pass
""",
                            solution_code="""def relu(x: float) -> float:
    return max(0.0, x)
""",
                            test_assertions_code="""assert relu(5.5) == 5.5
assert relu(-3.2) == 0.0
assert relu(0.0) == 0.0
print("SUCCESS: relu verified!")
"""
                        ),
                        summary="Activation functions are the secret ingredient that gives deep learning its expressive power. ReLU and GELU are the industry standards in vision and language transformers.",
                        next_lesson_id="lesson-llm-embeddings-vector-search"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-llm",
        title="Track F: LLM Engineering",
        tagline="Tokens, Embeddings, RAG, Structured Outputs, and AI Agent Architectures.",
        description="Master modern Large Language Model system engineering: vector embeddings, similarity search, prompt engineering, retrieval pipelines, and citation grounding.",
        level="Intermediate",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-llm-1",
                track_id="track-llm",
                title="Embeddings, Vector Search & RAG",
                description="Bridge natural language to high-dimensional geometry and build hallucination-resistant architectures.",
                lessons=[
                    Lesson(
                        id="lesson-llm-embeddings-vector-search",
                        module_id="mod-llm-1",
                        track_id="track-llm",
                        title="Semantic Vector Spaces & Cosine Similarity Search",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Understand how text embeddings represent semantic meaning as dense vectors in \\(\\mathbb{R}^d\\).",
                            "Calculate Cosine Similarity between vector representations.",
                            "Implement nearest-neighbor semantic search over documents."
                        ],
                        intuitive_explanation="Keyword search fails when words differ: searching for 'feline illness' won't find a document titled 'sick cat'. Embeddings map every piece of text into a high-dimensional space where concepts with similar meanings cluster together. The angle between the vectors reveals their semantic closeness.",
                        formal_explanation="Độ tương đồng Cosine (Cosine Similarity) đo góc giữa hai vector ngữ nghĩa trong không gian d chiều, chuẩn hóa theo độ dài Euclid của từng vector. Giá trị dao động từ -1.0 đến +1.0, trong đó 1.0 nghĩa là hai đoạn văn bản có ngữ nghĩa hoàn toàn trùng khớp.",
                        formula_guide=FormulaGuide(
                            title="Độ Tương Đồng Cosine Giữa Hai Vector Ngữ Nghĩa (Cosine Similarity)",
                            latex_expression="CosineSim(u, v) = (u · v) / ( ‖u‖ × ‖v‖ )",
                            plain_english="Độ tương đồng = Tích vô hướng (u · v) chia cho Tích độ dài hình học Euclid (‖u‖ × ‖v‖)",
                            symbols=[
                                FormulaSymbol(symbol="u", name="Vector truy vấn (Query Vector u)", meaning="Tọa độ ngữ nghĩa số hóa của câu hỏi người dùng nhập vào", sample_value="[1.0, 0.0]"),
                                FormulaSymbol(symbol="v", name="Vector tài liệu (Document Vector v)", meaning="Tọa độ ngữ nghĩa của đoạn văn bản lưu trong cơ sở dữ liệu Vector DB", sample_value="[0.8, 0.6]"),
                                FormulaSymbol(symbol="u · v", name="Tích vô hướng (Dot Product ·)", meaning="Độ thẳng hàng giữa các hướng đặc trưng ngữ nghĩa của 2 vector", sample_value="1.0*0.8 + 0.0*0.6 = 0.8"),
                                FormulaSymbol(symbol="‖u‖", name="Độ dài chuẩn Euclid (Vector Norm ‖u‖)", meaning="Căn bậc hai tổng bình phương các tọa độ để triệt tiêu ảnh hưởng của độ dài văn bản", sample_value="√(1² + 0²) = 1.0"),
                                FormulaSymbol(symbol="CosineSim", name="Chỉ số tương đồng Cosine", meaning="Gần 1.0 nghĩa là rất đồng nghĩa; 0.0 nghĩa là không liên quan", sample_value="0.80 (80% tương đồng)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Tính tích vô hướng u . v", calculation="(1.0 * 0.8) + (0.0 * 0.6) = 0.8", result_meaning="Phản ánh mức độ trùng khớp các chiều từ khóa"),
                                FormulaStep(step_number=2, title="Tính độ dài hai vector ||u|| và ||v||", calculation="||u|| = 1.0; ||v|| = sqrt(0.8^2 + 0.6^2) = sqrt(1.0) = 1.0", result_meaning="Chuẩn hóa để văn bản dài ngắn khác nhau đều công bằng"),
                                FormulaStep(step_number=3, title="Tính tỷ số độ tương đồng", calculation="CosineSim = 0.8 / (1.0 * 1.0) = 0.80", result_meaning="Độ tương đồng 80%: Hệ thống RAG tự động chọn đoạn tài liệu này đưa vào ngữ cảnh Prompt!")
                            ]
                        ),
                        worked_example_code="""import math

def dot_product(v1, v2):
    return sum(a * b for a, b in zip(v1, v2))

def magnitude(v):
    return math.sqrt(sum(a * a for a in v))

def cosine_similarity(v1, v2):
    mag = magnitude(v1) * magnitude(v2)
    return dot_product(v1, v2) / mag if mag > 0 else 0.0

# Mock 3D embeddings:
doc_cat = [0.85, 0.45, 0.12]
doc_dog = [0.82, 0.50, 0.10]
doc_car = [0.05, 0.10, 0.95]

query   = [0.88, 0.42, 0.08]  # "cute pet kitten"

print(f"Similarity (Query vs Cat): {cosine_similarity(query, doc_cat):.4f}")
print(f"Similarity (Query vs Dog): {cosine_similarity(query, doc_dog):.4f}")
print(f"Similarity (Query vs Car): {cosine_similarity(query, doc_car):.4f}")""",
                        common_misconceptions=[
                            "Misconception: Vector databases replace relational databases entirely. Reality: Vector indices specialize in approximate nearest-neighbor search, but relational databases remain superior for structured filters, metadata consistency, and ACID guarantees."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="attention",
                            title="Semantic Distance & Vector Neighborhood",
                            description="Inspect how token embeddings position synonymous concepts close together in vector space.",
                            initial_params={"dimensions": 3, "metric": "cosine"}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-emb-1",
                                question="What value does cosine similarity yield for two vectors pointing in the exact identical direction?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-emb1",
                                        text="1.0",
                                        is_correct=True,
                                        explanation="Correct! \\(\\cos(0^\\circ) = 1.0\\), indicating maximum directional alignment."
                                    ),
                                    QuizOption(
                                        id="opt-emb2",
                                        text="0.0",
                                        is_correct=False,
                                        explanation="0.0 indicates orthogonal (perpendicular / unrelated) vectors."
                                    ),
                                    QuizOption(
                                        id="opt-emb3",
                                        text="-1.0",
                                        is_correct=False,
                                        explanation="-1.0 indicates diametrically opposite vectors."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-emb-cosine",
                            instructions="Write a function `compute_cosine_sim(v1: list[float], v2: list[float]) -> float` that returns the cosine similarity between two non-zero vectors rounded to 4 decimal places.",
                            starter_code="""import math

def compute_cosine_sim(v1: list[float], v2: list[float]) -> float:
    # TODO: calculate dot product and magnitude product, return rounded to 4 decimals
    pass
""",
                            solution_code="""import math

def compute_cosine_sim(v1: list[float], v2: list[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 * mag2 == 0:
        return 0.0
    return round(dot / (mag1 * mag2), 4)
""",
                            test_assertions_code="""assert compute_cosine_sim([1.0, 0.0], [1.0, 0.0]) == 1.0
assert compute_cosine_sim([1.0, 0.0], [0.0, 1.0]) == 0.0
assert compute_cosine_sim([3.0, 4.0], [6.0, 8.0]) == 1.0
print("SUCCESS: compute_cosine_sim verified!")
"""
                        ),
                        summary="Vector embeddings convert unstructured text into geometric coordinates. Calculating cosine similarity allows systems to retrieve relevant context for Retrieval-Augmented Generation.",
                        next_lesson_id="lesson-mlops-latency-profiling"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-mlops",
        title="Track G: AI Systems & MLOps",
        tagline="Serving, Quantization, Caching, and Continuous Performance Monitoring.",
        description="Bridge experimental models to resilient production systems: low-latency serving (vLLM/TGI), FP16/INT8/INT4 quantization, cache invalidation, and SLA observability.",
        level="Advanced",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-mlops-1",
                track_id="track-mlops",
                title="Production Serving & Benchmarking",
                description="Profile tail latencies, batch scheduling, and inference memory bandwidth.",
                lessons=[
                    Lesson(
                        id="lesson-mlops-latency-profiling",
                        module_id="mod-mlops-1",
                        track_id="track-mlops",
                        title="Inference Latency, Throughput & Quantization",
                        estimated_minutes=25,
                        difficulty="Advanced",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Distinguish between TTFT (Time To First Token) and TPOT (Time Per Output Token).",
                            "Explain how INT8 weight quantization reduces GPU memory bandwidth bottlenecks.",
                            "Calculate P95 and P99 latency percentiles to measure service reliability."
                        ],
                        intuitive_explanation="In web apps, average latency hides the truth: if 1 in 100 requests takes 10 seconds, thousands of active users will experience broken UI. In AI serving, tail latency (P95/P99) is dominated by memory bandwidth fetching multi-gigabyte weights. Quantization shrinks weights from 16-bit to 4-bit, quadrupling throughput.",
                        formal_explanation="Độ trễ phân vị P99 (99th Percentile Latency) phản ánh thời gian phản hồi mà 99% người dùng được phục vụ nhanh hơn mức này. Trong hệ thống AI suy luận (Serving), P99 giúp phát hiện các hiện tượng nghẽn băng thông bộ nhớ GPU hoặc tranh chấp hàng đợi.",
                        formula_guide=FormulaGuide(
                            title="Độ Trễ Đuôi Phân Vị P99 (P99 Tail Latency)",
                            latex_expression="P99 = Giá_trị_độ_trễ( ⌊0.99 × N⌋ ) (sau khi sắp xếp tăng dần)",
                            plain_english="Độ trễ phân vị P99 = Thời gian phản hồi của 99% số request người dùng (ngưỡng cắt trường hợp đuôi chậm nhất)",
                            symbols=[
                                FormulaSymbol(symbol="N", name="Tổng số lượt request đo đạc", meaning="Số lượng yêu cầu suy luận mô hình được ghi nhận trong phiên giám sát", sample_value="100 requests"),
                                FormulaSymbol(symbol="⌊0.99 × N⌋", name="Chỉ số vị trí phân vị 99%", meaning="Vị trí phần tử cắt ngưỡng 99% trường hợp tốt nhất", sample_value="Vị trí thứ 99"),
                                FormulaSymbol(symbol="P99", name="Độ trễ đuôi SLA (Tail Latency P99)", meaning="Chỉ số cam kết SLA (Service Level Agreement). Nếu P99 vượt ngưỡng, trải nghiệm người dùng bị đứt gãy", sample_value="120 ms")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Thu thập và sắp xếp độ trễ (ms)", calculation="[45, 47, 48, 49, 51, 52, 55, 60, 120, 500]", result_meaning="Dữ liệu mẫu gồm 10 request"),
                                FormulaStep(step_number=2, title="Tìm vị trí phân vị 90%", calculation="0.90 * 10 = 9 -> Vị trí thứ 9 (0-indexed: index 8)", result_meaning="Độ trễ tương ứng là 120 ms"),
                                FormulaStep(step_number=3, title="So sánh với trung bình cộng (Mean)", calculation="Trung bình = 98.7 ms (bị request 500 ms kéo lên)", result_meaning="P90/P99 giúp kỹ sư thấy rõ 90% người dùng thực tế chỉ mất <= 120 ms, và cô lập lỗi ở request cá biệt 500 ms!")
                            ]
                        ),
                        worked_example_code="""# Calculating P90 and P99 Service Latency Percentiles
def calculate_percentile(data, p):
    sorted_d = sorted(data)
    idx = int(len(sorted_d) * (p / 100.0))
    idx = min(idx, len(sorted_d) - 1)
    return sorted_d[idx]

request_latencies_ms = [45, 52, 48, 55, 60, 49, 120, 51, 47, 500]
print(f"P50 (Median) Latency: {calculate_percentile(request_latencies_ms, 50)} ms")
print(f"P90 Tail Latency:    {calculate_percentile(request_latencies_ms, 90)} ms")
""",
                        common_misconceptions=[
                            "Misconception: More GPU cores always make inference faster. Reality: For small batch sizes, inference is strictly memory-bandwidth bound, not compute-bound."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Serving Throughput vs Latency Landscape",
                            description="Simulate how dynamic batch size affects memory throughput vs P99 tail latency.",
                            initial_params={"batch_size": 16}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-mlops-1",
                                question="Why is P99 latency preferred over average (mean) latency when evaluating production AI endpoints?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-m1", text="Because average latency obscures severe latency spikes and worst-case SLA violations experienced by users.", is_correct=True, explanation="Correct! Outliers skew real-world user satisfaction; percentiles reflect true quality-of-service guarantees."),
                                    QuizOption(id="opt-m2", text="Because P99 is always lower than the average.", is_correct=False, explanation="P99 is higher than the mean in right-skewed latency distributions.")
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-mlops-p99",
                            instructions="Write a function `compute_p99_latency(latencies: list[float]) -> float` that sorts values and returns the 99th percentile item (using 0-indexed index = int(len * 0.99) capped at len - 1).",
                            starter_code="""def compute_p99_latency(latencies: list[float]) -> float:
    # TODO: Calculate P99 tail latency
    pass
""",
                            solution_code="""def compute_p99_latency(latencies: list[float]) -> float:
    if not latencies:
        return 0.0
    sorted_l = sorted(latencies)
    idx = min(int(len(sorted_l) * 0.99), len(sorted_l) - 1)
    return sorted_l[idx]
""",
                            test_assertions_code="""sample = [10.0] * 99 + [500.0]
assert compute_p99_latency(sample) == 500.0
assert compute_p99_latency([5.0, 15.0]) == 15.0
print("SUCCESS: compute_p99_latency verified!")
"""
                        ),
                        summary="MLOps transitions machine learning from science experiment to dependable infrastructure. Monitoring tail latency, quantization, and memory bandwidth is the hallmark of senior AI engineers.",
                        next_lesson_id=None
                    )
                ]
            )
        ]
    )
]

# -------------------------------------------------------------
# Diagnostic Assessment Question Bank
# -------------------------------------------------------------

DIAGNOSTIC_QUESTIONS: list[QuizQuestion] = [
    QuizQuestion(
        id="diag-1",
        question="Which paradigm best describes an algorithm learning by receiving scalar reward signals from environment interactions?",
        type="single_choice",
        options=[
            QuizOption(id="d1-a", text="Supervised Learning", is_correct=False, explanation="Uses explicit input-label pairs."),
            QuizOption(id="d1-b", text="Unsupervised Learning", is_correct=False, explanation="Discovers latent patterns without labels."),
            QuizOption(id="d1-c", text="Reinforcement Learning", is_correct=True, explanation="Optimizes cumulative rewards via agent-environment interactions.")
        ]
    ),
    QuizQuestion(
        id="diag-2",
        question="In Python, what is the primary computational benefit of NumPy vectorized operations over Python `for` loops?",
        type="single_choice",
        options=[
            QuizOption(id="d2-a", text="Contiguous C-level memory buffers and SIMD hardware acceleration without Python interpreter overhead.", is_correct=True, explanation="Vectorized arrays bypass GIL and interpreter looping."),
            QuizOption(id="d2-b", text="NumPy code uses more CPU threads automatically for every line.", is_correct=False, explanation="Not all operations are multi-threaded.")
        ]
    ),
    QuizQuestion(
        id="diag-3",
        question="What does the gradient vector \\(\\nabla f(x)\\) represent at a point \\(x\\)?",
        type="single_choice",
        options=[
            QuizOption(id="d3-a", text="The global minimum of the function.", is_correct=False, explanation="A gradient is a local directional slope."),
            QuizOption(id="d3-b", text="The vector pointing in the direction of steepest rate of increase.", is_correct=True, explanation="Correct mathematical definition of the gradient.")
        ]
    ),
    QuizQuestion(
        id="diag-4",
        question="Why is Retrieval-Augmented Generation (RAG) utilized in production LLM systems?",
        type="single_choice",
        options=[
            QuizOption(id="d4-a", text="To inject verified external domain knowledge into context, mitigating hallucinations and stale training data.", is_correct=True, explanation="RAG grounds generation in authoritative retrieved texts."),
            QuizOption(id="d4-b", text="To completely prevent the model from using GPU memory.", is_correct=False, explanation="RAG does not alter GPU execution.")
        ]
    )
]

# -------------------------------------------------------------
# Evaluation Helper Functions
# -------------------------------------------------------------

def evaluate_lesson_quiz(lesson_id: str, submissions: dict[str, str]) -> QuizResult:
    # Find lesson
    target_lesson = None
    for track in CURRICULUM_TRACKS:
        for mod in track.modules:
            for lsn in mod.lessons:
                if lsn.id == lesson_id:
                    target_lesson = lsn
                    break

    if not target_lesson or not target_lesson.quiz:
        return QuizResult(
            lesson_id=lesson_id,
            score_percentage=100.0,
            passed=True,
            feedback=[{"info": "No quiz attached to this lesson."}],
            unlocked_next_lesson_id=target_lesson.next_lesson_id if target_lesson else None
        )

    correct_count = 0
    feedback_items = []

    for q in target_lesson.quiz:
        selected_opt_id = submissions.get(q.id)
        chosen_opt = next((o for o in q.options if o.id == selected_opt_id), None)
        correct_opt = next((o for o in q.options if o.is_correct), None)

        is_correct = bool(chosen_opt and chosen_opt.is_correct)
        if is_correct:
            correct_count += 1

        feedback_items.append({
            "question_id": q.id,
            "question": q.question,
            "selected_id": selected_opt_id,
            "is_correct": is_correct,
            "explanation": chosen_opt.explanation if chosen_opt else (correct_opt.explanation if correct_opt else "")
        })

    total_q = len(target_lesson.quiz)
    score_pct = round((correct_count / total_q) * 100, 1)
    passed = score_pct >= 70.0

    return QuizResult(
        lesson_id=lesson_id,
        score_percentage=score_pct,
        passed=passed,
        feedback=feedback_items,
        unlocked_next_lesson_id=target_lesson.next_lesson_id if passed else None
    )

def evaluate_diagnostic_assessment(answers: dict[str, str]) -> DiagnosticResult:
    correct_count = 0
    for q in DIAGNOSTIC_QUESTIONS:
        chosen_id = answers.get(q.id)
        chosen_opt = next((o for o in q.options if o.id == chosen_id), None)
        if chosen_opt and chosen_opt.is_correct:
            correct_count += 1

    total = len(DIAGNOSTIC_QUESTIONS)
    pct = round((correct_count / total) * 100, 1)

    if pct >= 75.0:
        recommended_track = "track-llm"
        track_title = "Track F: LLM Engineering"
        analysis = "Strong foundational mastery in ML and optimization demonstrated! You are ready to dive directly into high-dimensional vector spaces, RAG architectures, and AI systems."
        starting_lesson = "lesson-llm-embeddings-vector-search"
    elif pct >= 50.0:
        recommended_track = "track-math"
        track_title = "Track C: Mathematics for AI"
        analysis = "Good conceptual intuition. We recommend starting with calculus, gradients, and optimization landscapes to reinforce formal mechanics."
        starting_lesson = "lesson-math-gradient-descent"
    else:
        recommended_track = "track-foundations"
        track_title = "Track A: AI Foundations"
        analysis = "Welcome to AI! We recommend starting at the beginning with core learning paradigms, the ML lifecycle, and generalization principles."
        starting_lesson = "lesson-foundations-what-is-ai"

    return DiagnosticResult(
        score_percentage=pct,
        recommended_track_id=recommended_track,
        track_title=track_title,
        analysis=analysis,
        suggested_starting_lesson_id=starting_lesson
    )
