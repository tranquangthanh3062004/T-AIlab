from app.schemas.curriculum import (
    Track, Module, Lesson, LessonInteractiveWidget,
    QuizQuestion, QuizOption, CodeExercise,
    QuizResult, DiagnosticResult,
    FormulaGuide, FormulaSymbol, FormulaStep,
    LessonDataset
)

# ==============================================================================
# VIETNAMESE CURRICULUM (100% Unified Vietnamese + Technical English Terms)
# Split clearly into 2 Personas:
#   - target_audience="beginner" (Tracks A, B, C, D: Người mới bắt đầu)
#   - target_audience="engineer" (Tracks E, F, G: Kỹ sư AI Thực chiến)
# Grounded in real, free, authoritative datasets (UCI, StatLib, MTEB, MLCommons)
# ==============================================================================

CURRICULUM_TRACKS_VI: list[Track] = [
    Track(
        id="track-foundations",
        title="Lộ trình A: Nền tảng Trí tuệ Nhân tạo (AI Foundations)",
        tagline="Đi từ số 0 đến tư duy bản chất. Nắm vững các mô hình học máy, chu trình dữ liệu và giới hạn hệ thống.",
        description="Trang bị nền tảng vững chắc cho người mới bắt đầu: Phân biệt AI, Machine Learning, Deep Learning & Generative AI; hiểu rõ Học có giám sát (Supervised Learning), Quá khớp (Overfitting) trên bộ dữ liệu thực tế từ kho lưu trữ UCI Machine Learning Repository.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=6,
        modules=[
            Module(
                id="mod-foundations-1",
                track_id="track-foundations",
                title="Các Mô hình Học máy Cốt lõi & Chu trình Dữ liệu Thực tế",
                description="Hiểu cách máy tính tự tìm quy luật toán học từ dữ liệu thực thay vì lập trình quy tắc thủ công.",
                lessons=[
                    Lesson(
                        id="lesson-foundations-what-is-ai",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        target_audience="beginner",
                        title="AI là gì? Giải mã bản chất AI, Machine Learning, Deep Learning & GenAI",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=[],
                        objectives=[
                            "Phân biệt rành mạch 4 tầng khái niệm: Trí tuệ nhân tạo (AI) ⊃ Học máy (Machine Learning) ⊃ Học sâu (Deep Learning) ⊃ AI Tạo sinh (Generative AI).",
                            "Hiểu rõ chu trình Đặc trưng đầu vào (Input Features x) → Trọng số mô hình (Weights w) → Nhãn dự đoán (Label y) trên dữ liệu thực tế.",
                            "Thực hành phân loại mẫu hoa thực tế trên bộ dữ liệu kinh điển UCI Iris Botanical Dataset (Fisher, 1936)."
                        ],
                        intuitive_explanation=(
                            "Hãy tưởng tượng bạn cần viết phần mềm phân biệt 3 loài hoa Diên Vỹ (Iris Setosa, Versicolor, Virginica). "
                            "Trong lập trình truyền thống (Classical Programming), bạn phải tự đo và viết hàng trăm câu lệnh điều kiện `if-else`. "
                            "Nhưng ngoài tự nhiên, kích thước cánh hoa luôn biến thiên. Học máy (Machine Learning) đảo ngược quy trình này: "
                            "Thay vì lập trình luật cứng, bạn cung cấp cho máy tính bảng số liệu đo đạc thực tế của 150 bông hoa (chiều dài đài hoa, chiều rộng cánh hoa) kèm tên loài đúng. "
                            "Thuật toán sẽ tự động tinh chỉnh các Trọng số (Weights w) và Độ lệch nền (Bias b) để tìm ra ranh giới phân tách chính xác nhất."
                        ),
                        deep_dive_notes=[
                            "1. Lập trình Truyền thống vs Học máy: Lập trình truyền thống nhận [Dữ liệu + Quy tắc] → xuất ra [Câu trả lời]. Học máy nhận [Dữ liệu + Câu trả lời mẫu] → tự tìm ra [Quy tắc / Trọng số mô hình].",
                            "2. Ma trận Đặc trưng (Feature Matrix X): Trong thực tế, mỗi đối tượng (một bông hoa, một bệnh nhân, một giao dịch ngân hàng) được biểu diễn thành một hàng số thực x = [x₁, x₂, ..., x_d].",
                            "3. Ranh giới Quyết định Tuyến tính (Linear Decision Boundary): Khi tổ hợp tuyến tính z = w₁·x₁ + w₂·x₂ + b vượt qua ngưỡng 0, mô hình phân loại mẫu vào Lớp 1; ngược lại vào Lớp 0."
                        ],
                        formal_explanation=(
                            "Trong học máy có giám sát (Supervised Learning), mỗi mẫu dữ liệu thực tế gồm vector đặc trưng x = (x₁, x₂, ..., x_d) và nhãn thực tế y. "
                            "Mô hình tuyến tính tính tổng có trọng số giữa từng đặc trưng x_i với trọng số w_i cộng với độ lệch nền b để đưa ra quyết định phân lớp."
                        ),
                        formula_guide=FormulaGuide(
                            title="Mô Hình Dự Đoán Tuyến Tính & Ranh Giới Quyết Định (Linear Classifier)",
                            latex_expression="y = sign(w_1 · x_1 + w_2 · x_2 + b)",
                            plain_english="Nhãn dự đoán y = Dấu của [ (Trọng số 1 × Đặc trưng 1) + (Trọng số 2 × Đặc trưng 2) + Độ lệch nền b ]",
                            symbols=[
                                FormulaSymbol(symbol="w", name="Trọng số (Weight)", meaning="Hệ số đo mức độ quan trọng của từng đặc trưng đối với kết quả dự đoán", sample_value="w₁ = 0.8, w₂ = -0.5"),
                                FormulaSymbol(symbol="x", name="Đặc trưng thực tế (Feature)", meaning="Số liệu đo đạc thực tế từ bộ dữ liệu (ví dụ: chiều dài cánh hoa cm)", sample_value="x₁ = 1.4 cm, x₂ = 0.2 cm"),
                                FormulaSymbol(symbol="b", name="Độ lệch nền (Bias)", meaning="Ngưỡng cơ sở giúp dịch chuyển đường ranh giới phân lớp", sample_value="-0.5"),
                                FormulaSymbol(symbol="y", name="Nhãn dự đoán (Predicted Label)", meaning="Kết quả phân loại cuối cùng (1 nếu tổng kích hoạt > 0, ngược lại 0)", sample_value="1 (Loài Iris Setosa)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Nhân từng đặc trưng thực tế với trọng số", calculation="(0.8 × 1.4) + (-0.5 × 0.2) = 1.12 - 0.10 = 1.02", result_meaning="Tổng điểm đóng góp từ kích thước cánh hoa"),
                                FormulaStep(step_number=2, title="Cộng thêm độ lệch nền Bias", calculation="1.02 + (-0.50) = +0.52", result_meaning="Điểm kích hoạt ròng (Net Activation Score)"),
                                FormulaStep(step_number=3, title="Xét dấu qua hàm ngưỡng sign()", calculation="+0.52 > 0 ⇒ y = 1", result_meaning="Mô hình phân loại chính xác mẫu hoa thuộc Nhãn 1")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="UCI Iris Botanical Dataset (Fisher, 1936)",
                            source_org="UCI Machine Learning Repository (OpenML ID: 61)",
                            source_url="https://archive.ics.uci.edu/dataset/53/iris",
                            license="CC BY 4.0 (Open Scientific Data)",
                            description="Bộ dữ liệu sinh học kinh điển do nhà thống kê Ronald Fisher công bố năm 1936, ghi lại kích thước thực tế (cm) của 150 mẫu hoa Diên Vỹ thuộc 3 loài tại bán đảo Gaspé.",
                            columns=["sepal_length_cm", "sepal_width_cm", "petal_length_cm", "petal_width_cm", "species"],
                            sample_rows=[
                                {"sepal_length_cm": 5.1, "sepal_width_cm": 3.5, "petal_length_cm": 1.4, "petal_width_cm": 0.2, "species": "Iris-setosa (Class 0)"},
                                {"sepal_length_cm": 4.9, "sepal_width_cm": 3.0, "petal_length_cm": 1.4, "petal_width_cm": 0.2, "species": "Iris-setosa (Class 0)"},
                                {"sepal_length_cm": 7.0, "sepal_width_cm": 3.2, "petal_length_cm": 4.7, "petal_width_cm": 1.4, "species": "Iris-versicolor (Class 1)"},
                                {"sepal_length_cm": 6.4, "sepal_width_cm": 3.2, "petal_length_cm": 4.5, "petal_width_cm": 1.5, "species": "Iris-versicolor (Class 1)"},
                                {"sepal_length_cm": 6.3, "sepal_width_cm": 3.3, "petal_length_cm": 6.0, "petal_width_cm": 2.5, "species": "Iris-virginica (Class 2)"}
                            ]
                        ),
                        worked_example_code="""# Phân loại mẫu thực tế từ bộ dữ liệu UCI Iris (Fisher, 1936)
# Đặc trưng: [petal_length_cm, petal_width_cm]
uci_iris_samples = [
    {"petal_length": 1.4, "petal_width": 0.2, "true_species": "Iris-setosa"},
    {"petal_length": 1.3, "petal_width": 0.2, "true_species": "Iris-setosa"},
    {"petal_length": 4.7, "petal_width": 1.4, "true_species": "Iris-versicolor"},
    {"petal_length": 4.5, "petal_width": 1.5, "true_species": "Iris-versicolor"},
]

def linear_iris_classifier(petal_len: float, petal_wid: float) -> str:
    # Trọng số học được để tách Iris-versicolor (cánh dài) khỏi Iris-setosa (cánh ngắn)
    w_len, w_wid, bias = 0.8, 1.2, -2.5
    score = w_len * petal_len + w_wid * petal_wid + bias
    return "Iris-versicolor" if score > 0 else "Iris-setosa"

for row in uci_iris_samples:
    pred = linear_iris_classifier(row["petal_length"], row["petal_width"])
    print(f"Cánh hoa ({row['petal_length']}cm, {row['petal_width']}cm) -> Dự đoán: {pred} | Thực tế: {row['true_species']}")""",
                        common_misconceptions=[
                            "Hiểu lầm 1: Hệ thống AI 'suy nghĩ' có ý thức giống con người. Thực tế: AI tối ưu hóa các hàm toán học thống kê và phân phối xác suất trên dữ liệu số.",
                            "Hiểu lầm 2: Mô hình càng nhiều tham số thì luôn càng chính xác. Thực tế: Nếu dữ liệu ít mà tham số quá lớn, mô hình sẽ học vẹt nhiễu (Overfitting)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Mô phỏng Đường Ranh Giới Quyết Định 2D (Perceptron)",
                            description="Kéo thanh trượt Trọng số (W1, W2, Bias) để quan sát cách đường thẳng phân tách 2 nhóm dữ liệu thực tế.",
                            initial_params={"w1": 0.5, "w2": -0.8, "bias": 0.2}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-foundations-1",
                                question="Sự khác biệt cốt lõi nhất giữa Lập trình truyền thống (Classical Programming) và Học máy (Machine Learning) là gì?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-1",
                                        text="Lập trình truyền thống chỉ dùng ngôn ngữ C++, còn Machine Learning chỉ chạy được trên Python.",
                                        is_correct=False,
                                        explanation="Sai. Cả hai phương pháp đều có thể viết bằng bất kỳ ngôn ngữ lập trình hiện đại nào."
                                    ),
                                    QuizOption(
                                        id="opt-2",
                                        text="Trong lập trình truyền thống con người viết quy tắc tường minh; trong Machine Learning thuật toán tự học quy tắc (trọng số) từ dữ liệu thực tế.",
                                        is_correct=True,
                                        explanation="Chính xác! Lập trình truyền thống: Dữ liệu + Quy tắc → Kết quả. Machine Learning: Dữ liệu + Kết quả mẫu → Quy tắc (Trọng số mô hình)."
                                    ),
                                    QuizOption(
                                        id="opt-3",
                                        text="Mô hình Machine Learning không bao giờ dự đoán sai khi đã biên dịch.",
                                        is_correct=False,
                                        explanation="Sai. Mọi mô hình học máy đều dựa trên xác suất thống kê và luôn có sai số dự đoán nhất định."
                                    )
                                ]
                            ),
                            QuizQuestion(
                                id="q-foundations-2",
                                question="Quan hệ bao hàm nào dưới đây phản ánh đúng cấu trúc phân cấp của ngành Trí tuệ Nhân tạo?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-2a",
                                        text="AI ⊃ Machine Learning (Học máy) ⊃ Deep Learning (Học sâu) ⊃ Generative AI (AI Tạo sinh / LLM)",
                                        is_correct=True,
                                        explanation="Chính xác! Deep Learning là nhánh con của Machine Learning sử dụng mạng nơ-ron nhiều tầng, và Generative AI hiện đại được xây dựng trên kiến trúc Deep Learning."
                                    ),
                                    QuizOption(
                                        id="opt-2b",
                                        text="Deep Learning ⊃ AI ⊃ Machine Learning",
                                        is_correct=False,
                                        explanation="Sai. Deep Learning là tập con của Machine Learning, không phải tập cha của AI."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-foundations-linear-predict",
                            instructions="Hoàn thiện hàm `simple_linear_predict(x, weight, bias)` để tính giá trị kích hoạt `weight * x + bias` và trả về `1` nếu kết quả lớn hơn `0`, ngược lại trả về `0`.",
                            starter_code="""def simple_linear_predict(x: float, weight: float, bias: float) -> int:
    # TODO: Tính tổng tuyến tính weight * x + bias và trả về 1 nếu > 0, ngược lại trả về 0
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
                        summary="Trí tuệ Nhân tạo (AI) là lĩnh vực tổng quát xây dựng hệ thống thông minh. Học máy (Machine Learning) giải quyết bài toán bằng cách tối ưu hóa trọng số từ dữ liệu thực tế thay vì viết luật if-else thủ công.",
                        next_lesson_id="lesson-foundations-generalization"
                    ),
                    Lesson(
                        id="lesson-foundations-generalization",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        target_audience="beginner",
                        title="Tính Tổng quát hóa (Generalization), Quá khớp (Overfitting) & Dưới khớp (Underfitting)",
                        estimated_minutes=25,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Hiểu bản chất của Tính tổng quát hóa (Generalization) khi đưa mô hình ra chạy thực tế.",
                            "Nhận diện hiện tượng Quá khớp (Overfitting) khi sai số huấn luyện thấp nhưng sai số kiểm định tăng vọt.",
                            "Phân tích dữ liệu thực tế từ bộ UCI Wine Quality Dataset (Cortez et al., 2009) và áp dụng Dừng sớm (Early Stopping)."
                        ],
                        intuitive_explanation=(
                            "Hãy hình dung một học sinh ôn thi Toán bằng cách học thuộc lòng từng con số của 50 bài tập trong đề cương mà không hiểu công thức. "
                            "Khi kiểm tra đúng 50 bài cũ đó (Tập huấn luyện - Training Set), học sinh đạt 100 điểm. Nhưng khi đi thi thật với đề bài đổi số (Tập kiểm tra - Test Set), học sinh bị điểm liệt. "
                            "Trong AI, học thuộc lòng nhiễu của dữ liệu cũ gọi là Quá khớp (Overfitting); còn nắm được quy luật bản chất để dự đoán đúng dữ liệu mới gọi là Tổng quát hóa (Generalization)."
                        ),
                        deep_dive_notes=[
                            "1. Phân chia 3 Tập Dữ liệu Chuẩn (Train / Validation / Test Split): Tập Train (70%) để cập nhật trọng số; Tập Validation (15%) để theo dõi Overfitting và chọn siêu tham số; Tập Test (15%) chỉ dùng duy nhất 1 lần cuối để đánh giá khách quan.",
                            "2. Điểm Dừng Sớm (Early Stopping Checkpoint): Tại thời điểm sai số tập Validation (Validation Loss) ngừng giảm và bắt đầu đi lên, ta phải dừng huấn luyện ngay và lưu lại bộ trọng số tốt nhất.",
                            "3. Điều chuẩn (Regularization L1/L2): Cộng thêm thành phần phạt độ lớn trọng số vào hàm mất mát để ngăn mô hình uốn cong quá mức theo các điểm nhiễu ngoại lai (Outliers)."
                        ],
                        formal_explanation=(
                            "Khoảng cách tổng quát hóa (Generalization Gap) là độ chênh lệch tuyệt đối giữa Sai số trên tập Kiểm tra mới (E_test) và Sai số trên tập Huấn luyện (E_train). "
                            "Khi E_train tiến về 0 nhưng E_test tăng cao, mô hình đang rơi vào trạng thái Quá khớp (Overfitting)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Khoảng Cách Tổng Quát Hóa & Điểm Dừng Sớm (Generalization Gap)",
                            latex_expression="Gap = | E_test - E_train |",
                            plain_english="Khoảng cách Tổng quát hóa = Độ lệch tuyệt đối giữa [Sai số trên tập Kiểm tra mới E_test] và [Sai số trên tập Huấn luyện cũ E_train]",
                            symbols=[
                                FormulaSymbol(symbol="E_train", name="Sai số Huấn luyện (Training Error)", meaning="Mức độ dự đoán sai của mô hình trên tập dữ liệu đã dùng để học", sample_value="0.02 (2%)"),
                                FormulaSymbol(symbol="E_test", name="Sai số Kiểm tra (Test Error)", meaning="Mức độ sai sót khi mô hình dự đoán trên dữ liệu thực tế hoàn toàn mới", sample_value="0.35 (35%)"),
                                FormulaSymbol(symbol="Gap", name="Khoảng cách Tổng quát hóa (Generalization Gap)", meaning="Thước đo mức độ 'học vẹt'. Gap càng lớn chứng tỏ mô hình càng bị Overfitting nặng", sample_value="0.33 (33%)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Đo sai số trên tập Huấn luyện (Train)", calculation="E_train = 0.02 (Chỉ sai 2% trên dữ liệu quen thuộc)", result_meaning="Mô hình khớp rất sát với dữ liệu huấn luyện"),
                                FormulaStep(step_number=2, title="Đo sai số trên tập Kiểm định/Kiểm tra (Val/Test)", calculation="E_test = 0.35 (Sai tới 35% trên dữ liệu mới)", result_meaning="Hiệu năng thực tế sụt giảm nghiêm trọng"),
                                FormulaStep(step_number=3, title="Tính khoảng cách Gap và kích hoạt Early Stopping", calculation="Gap = |0.35 - 0.02| = 0.33", result_meaning="Cảnh báo Overfitting! Cần quay lại Epoch có Validation Loss thấp nhất")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="UCI Wine Quality Dataset (Cortez et al., 2009)",
                            source_org="UCI Machine Learning Repository / University of Minho",
                            source_url="https://archive.ics.uci.edu/dataset/186/wine+quality",
                            license="CC BY 4.0",
                            description="Bộ dữ liệu phân tích hóa lý thực tế của 4.898 mẫu rượu vang Bồ Đào Nha (Vinho Verde), đo độ chua, lượng đường dư, độ pH, nồng độ cồn và điểm chất lượng cảm quan (0–10).",
                            columns=["fixed_acidity", "volatile_acidity", "residual_sugar_g_l", "pH", "alcohol_pct", "quality_score"],
                            sample_rows=[
                                {"fixed_acidity": 7.4, "volatile_acidity": 0.70, "residual_sugar_g_l": 1.9, "pH": 3.51, "alcohol_pct": 9.4, "quality_score": 5},
                                {"fixed_acidity": 7.8, "volatile_acidity": 0.88, "residual_sugar_g_l": 2.6, "pH": 3.20, "alcohol_pct": 9.8, "quality_score": 5},
                                {"fixed_acidity": 11.2, "volatile_acidity": 0.28, "residual_sugar_g_l": 1.9, "pH": 3.16, "alcohol_pct": 9.8, "quality_score": 6},
                                {"fixed_acidity": 7.3, "volatile_acidity": 0.65, "residual_sugar_g_l": 1.2, "pH": 3.39, "alcohol_pct": 10.0, "quality_score": 7},
                                {"fixed_acidity": 8.5, "volatile_acidity": 0.28, "residual_sugar_g_l": 1.8, "pH": 3.30, "alcohol_pct": 10.5, "quality_score": 7}
                            ]
                        ),
                        worked_example_code="""# Phát hiện điểm Overfitting (Early Stopping) khi huấn luyện trên UCI Wine Quality
train_losses = [0.82, 0.45, 0.22, 0.11, 0.04, 0.01]
val_losses   = [0.85, 0.49, 0.31, 0.29, 0.35, 0.52]

# Tại epoch 4 (index 3), sai số Validation đạt cực tiểu (0.29).
# Từ epoch 5 trở đi, Validation Loss tăng ngược lên trong khi Train Loss vẫn giảm -> Overfitting!
best_epoch_idx = val_losses.index(min(val_losses))
print(f"Checkpoint tối ưu (Early Stopping): Epoch {best_epoch_idx + 1} (Val Loss = {val_losses[best_epoch_idx]})")""",
                        common_misconceptions=[
                            "Hiểu lầm: Sai số huấn luyện (Training Loss) bằng 0.0 chứng tỏ mô hình hoàn hảo. Thực tế: Training Loss = 0 trên dữ liệu thực có nhiễu hầu như luôn là dấu hiệu của Quá khớp (Overfitting) hoặc rò rỉ dữ liệu (Data Leakage)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Mô phỏng Đường Cong Mất Mát & Điểm Dừng Sớm",
                            description="Quan sát cách lựa chọn siêu tham số ảnh hưởng đến sự hội tụ của hàm mất mát.",
                            initial_params={"degree": 3, "regularization_lambda": 0.01}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-generalization-1",
                                question="Dấu hiệu rõ ràng nhất cho thấy mô hình Học máy đang bị Quá khớp (Overfitting) là gì?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-g1",
                                        text="Sai số trên cả tập Huấn luyện (Train) và tập Kiểm định (Validation) đều rất cao.",
                                        is_correct=False,
                                        explanation="Sai. Đây là hiện tượng Dưới khớp (Underfitting) do mô hình quá đơn giản."
                                    ),
                                    QuizOption(
                                        id="opt-g2",
                                        text="Sai số tập Huấn luyện tiếp tục giảm sâu, nhưng sai số tập Kiểm định/Kiểm tra bắt đầu tăng ngược lên.",
                                        is_correct=True,
                                        explanation="Chính xác! Mô hình đang bắt đầu học thuộc lòng nhiễu của tập huấn luyện và đánh mất khả năng tổng quát hóa."
                                    ),
                                    QuizOption(
                                        id="opt-g3",
                                        text="Mô hình chạy suy luận quá nhanh trên CPU.",
                                        is_correct=False,
                                        explanation="Sai. Tốc độ chạy không quyết định bản chất thống kê của Overfitting."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-generalization-gap",
                            instructions="Viết hàm `detect_overfitting_point(val_losses: list[float]) -> int` trả về chỉ số epoch (0-indexed) ngay trước thời điểm `val_losses` bắt đầu tăng lên lần đầu tiên.",
                            starter_code="""def detect_overfitting_point(val_losses: list[float]) -> int:
    # TODO: Trả về index i-1 ngay khi phát hiện val_losses[i] > val_losses[i-1] lần đầu tiên
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
                        summary="Tổng quát hóa (Generalization) là thước đo sống còn của mọi hệ thống AI. Luôn tách biệt tập Train, Validation và Test để phát hiện sớm hiện tượng Quá khớp (Overfitting).",
                        next_lesson_id="lesson-python-vectorization"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-python",
        title="Lộ trình B: Python Tính toán & Vector hóa cho AI",
        tagline="Mảng số học, phép toán Vector hóa (Vectorization), chuẩn L2 và xử lý dữ liệu tốc độ cao.",
        description="Làm chủ nền tảng tính toán của AI hiện đại: Thay thế vòng lặp Python chậm chạp bằng các phép toán mảng liên tục (Contiguous Arrays) trên bộ dữ liệu thực tế California Housing Census.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=7,
        modules=[
            Module(
                id="mod-python-1",
                track_id="track-python",
                title="Tính Toán Vector Hóa & Không Gian Mảng Nhiều Chiều",
                description="Hiểu lý do tại sao mọi thư viện AI (NumPy, PyTorch, JAX) đều vận hành trên mảng Vector hóa.",
                lessons=[
                    Lesson(
                        id="lesson-python-vectorization",
                        module_id="mod-python-1",
                        track_id="track-python",
                        target_audience="beginner",
                        title="Tính toán Vector hóa (Vectorization): Tại sao vòng lặp Python thất bại trong AI",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Giải thích tại sao vòng lặp `for` thuần trong Python gây nghẽn cổ chai hiệu năng (Dynamic Typing & GIL).",
                            "Nắm vững công thức Tích vô hướng (Dot Product) và Độ dài chuẩn Euclid (Euclidean L2 Norm).",
                            "Áp dụng tính toán định giá nhà thực tế trên bộ dữ liệu California Housing Census (Pace & Barry, 1997)."
                        ],
                        intuitive_explanation=(
                            "Trong Python thuần, khi bạn cộng 1 triệu cặp số bằng vòng lặp `for`, trình thông dịch phải kiểm tra kiểu dữ liệu và cấp phát bộ nhớ động 1 triệu lần. "
                            "Tính toán Vector hóa (Vectorization) giải quyết triệt để vấn đề này bằng cách xếp các con số nằm liền kề nhau trong RAM (Contiguous Memory) và dùng tập lệnh phần cứng SIMD (Single Instruction, Multiple Data) để nhân và cộng 8 đến 16 con số chỉ trong đúng 1 nhịp xung nhịp CPU/GPU."
                        ),
                        deep_dive_notes=[
                            "1. Cơ chế SIMD (Single Instruction, Multiple Data): Các thanh ghi AVX-512 trên CPU và Tensor Cores trên GPU có thể thực hiện phép nhân-cộng đồng thời trên cả một khối mảng trong 1 chu kỳ máy.",
                            "2. Tích vô hướng (Dot Product) trong Định giá Bất động sản: Khi nhân vector đặc trưng ngôi nhà (thu nhập khu vực, số phòng, tuổi nhà) với vector trọng số, ta thu được giá trị dự đoán chỉ bằng một phép nhân vector duy nhất.",
                            "3. Chuẩn L2 (Euclidean Norm): Đo khoảng cách hình học của một vector từ gốc tọa độ, được dùng rộng rãi để chuẩn hóa dữ liệu và tính điều chuẩn L2 (Weight Decay)."
                        ],
                        formal_explanation=(
                            "Tích vô hướng (Dot Product) của hai vector x và w trong không gian d chiều là tổng của tích từng cặp tọa độ tương ứng. "
                            "Chuẩn Euclid L2 của vector x được tính bằng căn bậc hai của tổng bình phương các phần tử."
                        ),
                        formula_guide=FormulaGuide(
                            title="Tích Vô Hướng Vector & Chuẩn Euclid L2 (Dot Product & L2 Norm)",
                            latex_expression="x · w = ∑_{i=1}^d (x_i · w_i)   |   ‖x‖₂ = √(∑_{i=1}^d x_i²)",
                            plain_english="Tích vô hướng = Tổng các tích từng cặp phần tử tương ứng giữa Vector đặc trưng x và Vector trọng số w",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Vector Đặc trưng (Feature Vector)", meaning="Danh sách các thông số thực tế của mẫu dữ liệu", sample_value="[3.87, 28.0, 5.4]"),
                                FormulaSymbol(symbol="w", name="Vector Trọng số (Weight Vector)", meaning="Danh sách hệ số quy đổi giá trị tương ứng", sample_value="[45.0, 1.2, 12.0]"),
                                FormulaSymbol(symbol="d", name="Số chiều (Dimensionality d)", meaning="Số lượng thuộc tính đặc trưng trong một mẫu dữ liệu", sample_value="3 chiều"),
                                FormulaSymbol(symbol="‖x‖₂", name="Độ dài chuẩn Euclid (L2 Norm)", meaning="Độ lớn hình học của vector trong không gian d chiều", sample_value="√(3² + 4²) = 5.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Nhân từng cặp phần tử tương ứng", calculation="(1.5 × 0.5) = 0.75; (2.0 × 1.0) = 2.0; (3.0 × 2.0) = 6.0", result_meaning="Tính tích song song trên từng chiều đặc trưng"),
                                FormulaStep(step_number=2, title="Cộng dồn thành số vô hướng (Scalar)", calculation="0.75 + 2.0 + 6.0 = 8.75", result_meaning="Thu được kết quả tích vô hướng x · w"),
                                FormulaStep(step_number=3, title="Tính chuẩn độ dài L2 (ví dụ với [3.0, 4.0])", calculation="‖x‖₂ = √(3.0² + 4.0²) = √(9 + 16) = 5.0", result_meaning="Độ dài hình học chuẩn xác của vector")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="California Housing Census Dataset (Pace & Barry, 1997)",
                            source_org="StatLib / Carnegie Mellon University & OpenML (ID: 537)",
                            source_url="https://www.dcc.fc.up.pt/~ltorgo/Regression/cal_housing.html",
                            license="Public Domain (US Census Bureau Data)",
                            description="Dữ liệu điều tra dân số thực tế của 20.640 cụm dân cư tại bang California (Mỹ), bao gồm thu nhập trung vị, tuổi nhà trung bình, số phòng trung bình và giá trị nhà trung vị (USD).",
                            columns=["median_income_10k", "housing_median_age", "avg_rooms", "avg_bedrooms", "population", "median_house_value_usd"],
                            sample_rows=[
                                {"median_income_10k": 8.3252, "housing_median_age": 41, "avg_rooms": 6.98, "avg_bedrooms": 1.02, "population": 322, "median_house_value_usd": 452600},
                                {"median_income_10k": 8.3014, "housing_median_age": 21, "avg_rooms": 6.24, "avg_bedrooms": 0.97, "population": 2401, "median_house_value_usd": 358500},
                                {"median_income_10k": 7.2574, "housing_median_age": 52, "avg_rooms": 8.28, "avg_bedrooms": 1.07, "population": 496, "median_house_value_usd": 352100},
                                {"median_income_10k": 5.6431, "housing_median_age": 52, "avg_rooms": 5.81, "avg_bedrooms": 1.07, "population": 558, "median_house_value_usd": 341300},
                                {"median_income_10k": 3.8462, "housing_median_age": 52, "avg_rooms": 6.28, "avg_bedrooms": 1.08, "population": 565, "median_house_value_usd": 342200}
                            ]
                        ),
                        worked_example_code="""# Ước lượng giá nhà California Housing bằng Tích vô hướng (Dot Product)
# Đặc trưng thực tế từ Census: [median_income_10k, housing_median_age, avg_rooms]
census_block_1 = [8.3252, 41.0, 6.98]
weights_usd    = [42000.0, 1100.0, 8500.0]  # Trọng số quy đổi ra USD
bias_usd       = 15000.0

def dot_product(features: list[float], weights: list[float]) -> float:
    return sum(x * w for x, w in zip(features, weights))

estimated_price = dot_product(census_block_1, weights_usd) + bias_usd
print(f"Giá nhà dự đoán (California Block #1): ${estimated_price:,.0f} USD (Thực tế: $452,600 USD)")""",
                        common_misconceptions=[
                            "Hiểu lầm: Ngôn ngữ Python quá chậm nên không thể dùng cho hệ thống AI sản xuất. Thực tế: Python đóng vai trò lớp điều phối (Orchestration), còn toàn bộ phép tính mảng được thực thi trực tiếp bằng nhân C++/CUDA tốc độ cao."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Trình Mô Phỏng Tổ Hợp Tuyến Tính Vector",
                            description="Điều chỉnh các thành phần trọng số để quan sát sự thay đổi của tích vô hướng.",
                            initial_params={"w1": 1.0, "w2": 2.0, "bias": 0.0}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-py-1",
                                question="Tại sao các phép toán mảng Vector hóa (Vectorized Operations) lại nhanh gấp hàng chục đến hàng trăm lần vòng lặp `for` thuần trong Python?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-py1",
                                        text="Vì dữ liệu được lưu trong vùng nhớ liên tục (Contiguous Memory) và xử lý song song bằng tập lệnh phần cứng SIMD ở tầng C/C++, loại bỏ chi phí kiểm tra kiểu động.",
                                        is_correct=True,
                                        explanation="Chính xác! Vùng nhớ liên tục và tập lệnh SIMD giúp xử lý cả khối dữ liệu trong một chu kỳ xung nhịp."
                                    ),
                                    QuizOption(
                                        id="opt-py2",
                                        text="Vì nó tự động dịch mã Python sang mã HTML.",
                                        is_correct=False,
                                        explanation="Sai. Vector hóa hoạt động ở tầng bộ nhớ C/Fortran/CUDA chứ không liên quan đến HTML."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-py-vector-norm",
                            instructions="Viết hàm `vector_l2_norm(vec: list[float]) -> float` tính độ dài chuẩn Euclid L2 `sqrt(sum(x_i^2))` của một vector và làm tròn đến 3 chữ số thập phân.",
                            starter_code="""import math

def vector_l2_norm(vec: list[float]) -> float:
    # TODO: Tính căn bậc hai của tổng bình phương các phần tử và làm tròn 3 chữ số thập phân
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
                        summary="Vector hóa là xương sống tính toán của AI. Mọi phép biến đổi trong mạng nơ-ron đều được biểu diễn dưới dạng tích vô hướng vector và nhân ma trận song song.",
                        next_lesson_id="lesson-math-gradient-descent"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-math",
        title="Lộ trình C: Toán học Trực quan cho AI (Mathematics for AI)",
        tagline="Hiểu rõ Đạo hàm, Vector độ dốc (Gradient) và Thuật toán Tối ưu hóa mà không sợ ký hiệu trừu tượng.",
        description="Giải mã trực quan Đạo hàm riêng, Độ dốc hàm mất mát (Loss Landscape) và quy tắc cập nhật trọng số Gradient Descent trên bộ dữ liệu kỹ thuật thực tế UCI Auto MPG.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-math-1",
                track_id="track-math",
                title="Giải Tích Tối Ưu Hóa & Thuật Toán Hạ Độ Dốc (Gradient Descent)",
                description="Hiểu cơ chế toán học giúp các mô hình AI tự động sửa sai qua từng bước huấn luyện.",
                lessons=[
                    Lesson(
                        id="lesson-math-gradient-descent",
                        module_id="mod-math-1",
                        track_id="track-math",
                        target_audience="beginner",
                        title="Giải mã Gradient Descent: Bước xuống đáy thung lũng Hàm Mất Mát",
                        estimated_minutes=25,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Hiểu ý nghĩa vật lý của Đạo hàm / Gradient (∂L/∂w) là hướng làm sai số tăng nhanh nhất.",
                            "Giải thích tại sao công thức cập nhật luôn mang dấu trừ (-) nhân với Tốc độ học (Learning Rate η).",
                            "Thực hành tối ưu hóa mô hình dự đoán mức tiêu hao nhiên liệu thực tế từ bộ UCI Auto MPG Dataset (Quinlan, 1993)."
                        ],
                        intuitive_explanation=(
                            "Hãy tưởng tượng bạn đang đứng trên một sườn núi phủ đầy sương mù dày đặc và muốn tìm đường xuống đáy thung lũng thấp nhất (nơi sai số bằng 0). "
                            "Dù không nhìn thấy toàn cảnh ngọn núi, bàn chân bạn vẫn cảm nhận được độ nghiêng của mặt đất ngay tại chỗ đứng. "
                            "Đạo hàm (Gradient ∂L/∂w) chính là mũi tên chỉ hướng dốc đi lên đỉnh núi. Do đó, để đi xuống thung lũng, bạn chỉ cần bước theo hướng ngược lại (dấu trừ `-`) với độ dài bước chân được điều chỉnh bởi Tốc độ học (Learning Rate η)."
                        ),
                        deep_dive_notes=[
                            "1. Hàm Mất Mát Bình Phương Trung Bình (Mean Squared Error - MSE): Đo trung bình bình phương độ lệch giữa dự đoán và thực tế: L(w) = (1/N) ∑ (y_pred - y_true)².",
                            "2. Lựa chọn Tốc độ học (Learning Rate η): Nếu η quá nhỏ (ví dụ 10⁻⁸), mô hình hội tụ cực chậm; nếu η quá lớn (ví dụ 2.0), bước nhảy sẽ văng qua đáy thung lũng và gây phân kỳ (Loss nổ ra vô cùng NaN).",
                            "3. Từ SGD đến AdamW: Các mô hình hiện đại kết hợp Gradient Descent với Động lượng (Momentum) và tỷ lệ thích ứng theo từng tham số (Adaptive Moment Estimation - AdamW)."
                        ],
                        formal_explanation=(
                            "Thuật toán Hạ độ dốc (Gradient Descent) cập nhật trọng số lặp đi lặp lại. Tại mỗi bước t, thuật toán tính đạo hàm riêng ∂L/∂w của hàm mất mát L theo trọng số w, "
                            "sau đó trừ đi tích giữa tốc độ học η và đạo hàm đó."
                        ),
                        formula_guide=FormulaGuide(
                            title="Quy Tắc Cập Nhật Trọng Số Gradient Descent (Parameter Update Rule)",
                            latex_expression="w_{mới} = w_{cũ} - η · (∂L / ∂w)",
                            plain_english="Trọng số mới = Trọng số cũ - [ Tốc độ học η × Đạo hàm độ dốc ∂L/∂w ]",
                            symbols=[
                                FormulaSymbol(symbol="w_{cũ}", name="Trọng số hiện tại (Current Weight)", meaning="Giá trị tham số của mô hình trước bước cập nhật", sample_value="5.0"),
                                FormulaSymbol(symbol="η", name="Tốc độ học (Learning Rate η - đọc là Ê-ta)", meaning="Hệ số kiểm soát độ lớn bước nhảy hạ dốc (thường từ 0.001 đến 0.1)", sample_value="0.1"),
                                FormulaSymbol(symbol="∂L / ∂w", name="Đạo hàm độ dốc (Gradient ∂L/∂w)", meaning="Độ nghiêng của hàm mất mát L theo trọng số w tại điểm hiện tại", sample_value="10.0 (dương nghĩa là sườn dốc đang đi lên)"),
                                FormulaSymbol(symbol="w_{mới}", name="Trọng số mới (Updated Weight)", meaning="Giá trị tham số mới đã dịch chuyển gần hơn về điểm cực tiểu sai số", sample_value="4.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Tính đạo hàm độ dốc ∂L/∂w tại w = 5.0", calculation="Với hàm mất mát L(w) = w², đạo hàm ∂L/∂w = 2·w = 2 × 5.0 = 10.0", result_meaning="Độ dốc dương (+10) báo hiệu hướng tăng của sai số nằm bên phải"),
                                FormulaStep(step_number=2, title="Nhân độ dốc với tốc độ học η", calculation="η · (∂L/∂w) = 0.1 × 10.0 = 1.0", result_meaning="Kích thước bước điều chỉnh cần thực hiện"),
                                FormulaStep(step_number=3, title="Lấy trọng số cũ trừ đi bước điều chỉnh", calculation="w_{mới} = 5.0 - 1.0 = 4.0", result_meaning="Sai số L(w) giảm từ 5² = 25 xuống 4² = 16 chỉ sau 1 bước!")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="UCI Auto MPG Fuel Efficiency Dataset (Quinlan, 1993)",
                            source_org="CMU StatLib Library & UCI Machine Learning Repository (ID: 9)",
                            source_url="https://archive.ics.uci.edu/dataset/9/auto+mpg",
                            license="CC BY 4.0",
                            description="Dữ liệu kỹ thuật thực tế của 398 mẫu xe ô tô do CMU StatLib thu thập, đo trọng lượng xe (lbs), công suất động cơ (horsepower), dung tích xi-lanh và mức tiêu thụ nhiên liệu thực tế (Miles Per Gallon - MPG).",
                            columns=["vehicle_model", "cylinders", "horsepower", "weight_tons", "acceleration_sec", "fuel_efficiency_mpg"],
                            sample_rows=[
                                {"vehicle_model": "Chevrolet Chevelle Malibu", "cylinders": 8, "horsepower": 130, "weight_tons": 3.504, "acceleration_sec": 12.0, "fuel_efficiency_mpg": 18.0},
                                {"vehicle_model": "Plymouth Satellite", "cylinders": 8, "horsepower": 150, "weight_tons": 3.436, "acceleration_sec": 11.0, "fuel_efficiency_mpg": 18.0},
                                {"vehicle_model": "Toyota Corolla 1200", "cylinders": 4, "horsepower": 65, "weight_tons": 1.836, "acceleration_sec": 19.0, "fuel_efficiency_mpg": 31.0},
                                {"vehicle_model": "Honda Civic CVCC", "cylinders": 4, "horsepower": 53, "weight_tons": 1.795, "acceleration_sec": 17.5, "fuel_efficiency_mpg": 33.0},
                                {"vehicle_model": "Volkswagen Rabbit", "cylinders": 4, "horsepower": 70, "weight_tons": 1.937, "acceleration_sec": 14.2, "fuel_efficiency_mpg": 29.0}
                            ]
                        ),
                        worked_example_code="""# Huấn luyện Gradient Descent trên dữ liệu thực tế UCI Auto MPG
# Bài toán: Dự đoán mức tiết kiệm nhiên liệu (MPG) từ trọng lượng xe (weight_tons)
auto_mpg_data = [
    (3.504, 18.0),  # Chevrolet Chevelle
    (3.436, 18.0),  # Plymouth Satellite
    (1.836, 31.0),  # Toyota Corolla
    (1.795, 33.0),  # Honda Civic
    (1.937, 29.0),  # VW Rabbit
]

w = -5.0       # Trọng số khởi tạo (xe càng nặng, MPG càng giảm)
bias = 40.0    # Ngưỡng nền khởi tạo
lr = 0.02      # Tốc độ học (Learning Rate η)

for epoch in range(1, 6):
    grad_w = 0.0
    total_mse = 0.0
    n = len(auto_mpg_data)
    for weight_tons, true_mpg in auto_mpg_data:
        pred_mpg = w * weight_tons + bias
        error = pred_mpg - true_mpg
        total_mse += (error ** 2) / n
        grad_w += (2.0 / n) * error * weight_tons
    w = w - lr * grad_w
    print(f"Epoch {epoch}: Trọng số w = {w:.3f} | Sai số MSE = {total_mse:.3f}")""",
                        common_misconceptions=[
                            "Hiểu lầm: Tăng tốc độ học (Learning Rate η) càng lớn thì mô hình học càng nhanh và càng chính xác. Thực tế: Nếu η vượt quá ngưỡng ổn định của độ cong hàm mất mát, trọng số sẽ dao động mạnh và nổ sai số (Divergence)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Mô phỏng Trực quan Hạ Độ Dốc Trên Sườn Núi Mất Mát",
                            description="Thay đổi Tốc độ học (Learning Rate η) để quan sát đường đi của điểm trọng số về đáy parabol.",
                            initial_params={"learning_rate": 0.1, "initial_w": 4.0}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-gd-1",
                                question="Tại sao trong công thức Gradient Descent, ta luôn lấy trọng số cũ TRỪ đi (η · ∂L/∂w) mà không phải là CỘNG thêm?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-gd1",
                                        text="Vì đạo hàm ∂L/∂w luôn chỉ về hướng làm hàm mất mát tăng nhanh nhất (lên dốc), nên ta phải đi ngược chiều đạo hàm để giảm thiểu sai số.",
                                        is_correct=True,
                                        explanation="Chính xác! Mục tiêu của huấn luyện là cực tiểu hóa hàm mất mát L, nên ta bước ngược hướng vector gradient."
                                    ),
                                    QuizOption(
                                        id="opt-gd2",
                                        text="Đó chỉ là quy ước ngẫu nhiên, cộng hay trừ đều cho kết quả giống nhau.",
                                        is_correct=False,
                                        explanation="Sai. Nếu cộng thêm gradient (Gradient Ascent), hàm mất mát sẽ tăng tiến ra vô cực."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-gd-step",
                            instructions="Viết hàm `gradient_descent_step(current_w, learning_rate, gradient)` trả về giá trị trọng số mới sau 1 bước cập nhật Gradient Descent.",
                            starter_code="""def gradient_descent_step(current_w: float, learning_rate: float, gradient: float) -> float:
    # TODO: Áp dụng công thức w_new = current_w - learning_rate * gradient
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
                        summary="Gradient Descent là động cơ tối ưu hóa đứng sau toàn bộ ngành Học sâu hiện đại. Mọi mạng nơ-ron từ nhỏ đến các mô hình ngôn ngữ tỷ tham số đều học bằng cách bước ngược hướng đạo hàm.",
                        next_lesson_id="lesson-ml-decision-trees"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-ml",
        title="Lộ trình D: Học máy Cổ điển & Dữ liệu Bảng (Classical ML)",
        tagline="Cây quyết định (Decision Trees), Độ hỗn loạn thông tin (Entropy) và Rừng ngẫu nhiên (Random Forests).",
        description="Nắm vững các thuật toán Học máy mạnh mẽ nhất trên dữ liệu dạng bảng (Tabular Data), thực hành chẩn đoán y sinh trên bộ dữ liệu thực tế UCI Breast Cancer Wisconsin.",
        level="Intermediate",
        target_audience="beginner",
        estimated_hours=9,
        modules=[
            Module(
                id="mod-ml-1",
                track_id="track-ml",
                title="Cây Quyết Định & Lý Thuyết Thông Tin Shannon",
                description="Hiểu cách thuật toán tự động chọn câu hỏi phân tách dữ liệu tối ưu thông qua chỉ số Entropy.",
                lessons=[
                    Lesson(
                        id="lesson-ml-decision-trees",
                        module_id="mod-ml-1",
                        track_id="track-ml",
                        target_audience="beginner",
                        title="Cây Quyết Định (Decision Trees) & Độ Hỗn Loạn Thông Tin (Shannon Entropy)",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Tính toán chính xác chỉ số Độ hỗn loạn Shannon Entropy H(S) để đo mức độ thuần khiết của một nút dữ liệu.",
                            "Hiểu nguyên lý chọn ngưỡng chia cắt cực đại hóa Độ lợi thông tin (Information Gain).",
                            "Ứng dụng phân tích ngưỡng chẩn đoán khối u trên bộ dữ liệu y khoa thực tế UCI Breast Cancer Wisconsin (Wolberg et al., 1995)."
                        ],
                        intuitive_explanation=(
                            "Hãy nghĩ đến trò chơi đoán vật qua 20 câu hỏi Đúng/Sai. Câu hỏi thông minh nhất ở bước đầu tiên luôn là câu hỏi giúp loại bỏ một nửa số khả năng đang phân vân. "
                            "Cây Quyết Định (Decision Tree) hoạt động hoàn toàn tương tự: Tại mỗi nút, nó quét qua các đặc trưng (ví dụ: bán kính tế bào > 15mm hay ≤ 15mm) và dùng công thức Shannon Entropy để chọn ngưỡng cắt nào tạo ra hai nhóm con thuần khiết nhất."
                        ),
                        deep_dive_notes=[
                            "1. Độ hỗn loạn Shannon Entropy H(S): Đạt cực tiểu H = 0.0 bit khi nút chỉ chứa đúng 1 nhãn duy nhất (thuần khiết 100%), và đạt cực đại H = 1.0 bit khi tỷ lệ 2 nhãn chia đều 50% / 50%.",
                            "2. Độ lợi Thông tin (Information Gain): IG = H(Nút cha) - Tổng có trọng số H(Các nút con). Cây quyết định luôn chọn điểm cắt có IG lớn nhất.",
                            "3. Từ Cây đơn lẻ đến Random Forest & XGBoost: Một cây quá sâu rất dễ bị Overfitting, do đó trong công nghiệp người ta kết hợp hàng trăm cây (Bagging / Gradient Boosting) để đạt độ chính xác vượt trội trên dữ liệu bảng."
                        ],
                        formal_explanation=(
                            "Cho một tập mẫu S trong bài toán phân loại nhị phân với tỷ lệ lớp dương là p và tỷ lệ lớp âm là (1 - p). "
                            "Độ hỗn loạn thông tin Shannon H(S) được tính bằng tổng âm của p·log₂(p) và (1-p)·log₂(1-p)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Công Thức Độ Hỗn Loạn Thông Tin Shannon (Binary Shannon Entropy)",
                            latex_expression="H(S) = - [ p · log₂(p) + (1 - p) · log₂(1 - p) ]",
                            plain_english="Độ hỗn loạn Entropy H(S) = Dấu trừ của [ Tỷ lệ lớp dương p × log₂(p) + Tỷ lệ lớp âm (1-p) × log₂(1-p) ]",
                            symbols=[
                                FormulaSymbol(symbol="p", name="Tỷ lệ lớp dương (Positive Class Proportion)", meaning="Xác suất một mẫu trong nút thuộc về nhãn 1", sample_value="0.5 (chia đều 50/50)"),
                                FormulaSymbol(symbol="1 - p", name="Tỷ lệ lớp âm (Negative Class Proportion)", meaning="Xác suất một mẫu trong nút thuộc về nhãn 0", sample_value="0.5"),
                                FormulaSymbol(symbol="log₂", name="Logarit cơ số 2 (Base-2 Logarithm)", meaning="Đo lượng thông tin bằng đơn vị bit nhị phân", sample_value="log₂(0.5) = -1.0"),
                                FormulaSymbol(symbol="H(S)", name="Độ hỗn loạn Entropy (Bits)", meaning="Từ 0.0 bit (thuần khiết tuyệt đối) đến 1.0 bit (hỗn loạn cực đại)", sample_value="1.0 bit")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Xác định tỷ lệ phân bố 2 lớp tại nút", calculation="Giả sử nút có 50 mẫu Ác tính và 50 mẫu Lành tính ⇒ p = 0.5, (1 - p) = 0.5", result_meaning="Dữ liệu đang pha trộn hoàn toàn"),
                                FormulaStep(step_number=2, title="Tính thành phần p · log₂(p)", calculation="0.5 × log₂(0.5) = 0.5 × (-1.0) = -0.5", result_meaning="Tương tự cho (1-p)·log₂(1-p) = -0.5"),
                                FormulaStep(step_number=3, title="Đổi dấu tổng để nhận chỉ số Entropy", calculation="H(S) = - [ -0.5 + (-0.5) ] = 1.0 bit", result_meaning="Entropy = 1.0 bit: Nút cần được phân nhánh tiếp để giảm độ bất định!")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="UCI Breast Cancer Wisconsin (Diagnostic) Dataset",
                            source_org="University of Wisconsin & UCI ML Repository (ID: 17)",
                            source_url="https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic",
                            license="CC BY 4.0",
                            description="Bộ dữ liệu y sinh thực tế gồm 569 ca chẩn đoán tế bào học tại Đại học Wisconsin (Dr. William H. Wolberg), ghi lại bán kính nhân tế bào trung bình, chu vi, diện tích và kết luận chẩn đoán (Lành tính Benign / Ác tính Malignant).",
                            columns=["patient_id", "mean_radius_mm", "mean_texture", "mean_perimeter_mm", "mean_area_mm2", "diagnosis"],
                            sample_rows=[
                                {"patient_id": "842302", "mean_radius_mm": 17.99, "mean_texture": 10.38, "mean_perimeter_mm": 122.8, "mean_area_mm2": 1001.0, "diagnosis": "Malignant (1)"},
                                {"patient_id": "842517", "mean_radius_mm": 20.57, "mean_texture": 17.77, "mean_perimeter_mm": 132.9, "mean_area_mm2": 1326.0, "diagnosis": "Malignant (1)"},
                                {"patient_id": "8510426", "mean_radius_mm": 13.54, "mean_texture": 14.36, "mean_perimeter_mm": 87.46, "mean_area_mm2": 566.3, "diagnosis": "Benign (0)"},
                                {"patient_id": "8510653", "mean_radius_mm": 13.08, "mean_texture": 15.71, "mean_perimeter_mm": 85.63, "mean_area_mm2": 520.0, "diagnosis": "Benign (0)"},
                                {"patient_id": "8510824", "mean_radius_mm": 9.504, "mean_texture": 12.44, "mean_perimeter_mm": 60.34, "mean_area_mm2": 273.9, "diagnosis": "Benign (0)"}
                            ]
                        ),
                        worked_example_code="""import math

def binary_entropy(p: float) -> float:
    if p <= 0.0 or p >= 1.0:
        return 0.0
    return - (p * math.log2(p) + (1.0 - p) * math.log2(1.0 - p))

# Trước khi chia tách: 10 mẫu UCI Breast Cancer (5 Malignant, 5 Benign) -> p = 0.5
entropy_before = binary_entropy(0.5)

# Sau khi chia theo ngưỡng mean_radius_mm > 15.0: Nhóm trái đạt độ thuần khiết 90% (p = 0.9)
entropy_after = binary_entropy(0.9)

print(f"Entropy ban đầu (50/50): {entropy_before:.3f} bits")
print(f"Entropy sau khi chia ngưỡng bán kính > 15mm (90/10): {entropy_after:.3f} bits")
print(f"Độ lợi thông tin (Information Gain): +{entropy_before - entropy_after:.3f} bits")""",
                        common_misconceptions=[
                            "Hiểu lầm: Cây quyết định càng nhiều tầng (chia tới khi mọi nút lá đều đạt Entropy = 0) thì càng tốt. Thực tế: Cây không giới hạn độ sâu (`max_depth`) sẽ học vẹt từng điểm nhiễu và giảm độ chính xác trên bệnh nhân mới."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Trình Khám Phá Ngưỡng Phân Tách Đặc Trưng",
                            description="Thử nghiệm cách thay đổi ngưỡng quyết định ảnh hưởng đến việc phân tách các cụm dữ liệu.",
                            initial_params={"threshold": 0.5}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-ml-1",
                                question="Giá trị Shannon Entropy H(S) của một nút dữ liệu nhị phân mà toàn bộ 100% mẫu trong đó đều thuộc cùng một nhãn là bao nhiêu?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-ml1",
                                        text="0.0 bit (Hoàn toàn thuần khiết, không còn sự hỗn loạn hay bất định nào)",
                                        is_correct=True,
                                        explanation="Chính xác! Khi toàn bộ mẫu có cùng một nhãn (p = 1 hoặc p = 0), độ bất định bằng 0."
                                    ),
                                    QuizOption(
                                        id="opt-ml2",
                                        text="1.0 bit (Hỗn loạn cực đại)",
                                        is_correct=False,
                                        explanation="Sai. Giá trị 1.0 bit xảy ra khi hai nhãn chia đều 50/50."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-ml-entropy",
                            instructions="Viết hàm `compute_binary_entropy(p: float) -> float` tính chỉ số Shannon Entropy (đơn vị bit) làm tròn đến 3 chữ số thập phân. Xử lý trường hợp biên `p <= 0` hoặc `p >= 1` bằng cách trả về `0.0`.",
                            starter_code="""import math

def compute_binary_entropy(p: float) -> float:
    # TODO: Tính Shannon Entropy nhị phân và làm tròn 3 chữ số thập phân
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
                        summary="Cây quyết định và các mô hình tập hợp cây (Random Forest, LightGBM, XGBoost) dựa trên lý thuyết thông tin Shannon là công cụ tiêu chuẩn vàng cho các bài toán dữ liệu dạng bảng.",
                        next_lesson_id="lesson-dl-neural-activations"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-dl",
        title="Lộ trình E: Học sâu & Kiến trúc Mạng Nơ-ron (Deep Learning)",
        tagline="Dành cho Kỹ sư AI: Hàm kích hoạt phi tuyến (ReLU, GELU), Lan truyền ngược và Giải quyết Triệt tiêu Đạo hàm.",
        description="Đi sâu vào cơ chế biểu diễn đa tầng của mạng nơ-ron hiện đại, phân tích số liệu thực nghiệm từ benchmark Fashion-MNIST (Zalando Research).",
        level="Intermediate",
        target_audience="engineer",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-dl-1",
                track_id="track-dl",
                title="Động Học Tầng Ẩn & Hàm Kích Hoạt Phi Tuyến (Non-Linear Activations)",
                description="Tại sao mạng nơ-ron bắt buộc phải có tính phi tuyến và cách ngăn chặn hiện tượng Vanishing Gradient.",
                lessons=[
                    Lesson(
                        id="lesson-dl-neural-activations",
                        module_id="mod-dl-1",
                        track_id="track-dl",
                        target_audience="engineer",
                        title="Hàm Kích Hoạt Phi Tuyến (ReLU, Sigmoid, GELU) & Động Học Gradient",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Chứng minh đại số tại sao việc chồng 100 tầng tuyến tính không có hàm kích hoạt sẽ bị suy biến thành đúng 1 ma trận duy nhất.",
                            "Phân tích hiện tượng Triệt tiêu đạo hàm (Vanishing Gradient) của hàm Sigmoid và cách ReLU / GELU khắc phục.",
                            "Phân tích số liệu thực nghiệm Gradient Norm trên bộ dữ liệu chuẩn Fashion-MNIST (Zalando Research, MIT License)."
                        ],
                        intuitive_explanation=(
                            "Nếu bạn xếp chồng nhiều phép biến đổi tuyến tính liên tiếp: h = W₂ · (W₁ · x), theo tính chất kết hợp của phép nhân ma trận, tích (W₂ · W₁) chỉ đơn thuần tạo ra một ma trận mới W₃. "
                            "Nghĩa là dù mạng của bạn có sâu 100 tầng nhưng thiếu hàm kích hoạt phi tuyến (Activation Function), nó cũng không mạnh hơn một mô hình hồi quy tuyến tính 1 tầng! "
                            "Các hàm kích hoạt như ReLU và GELU đóng vai trò 'bẻ cong' không gian đặc trưng sau mỗi tầng, giúp mạng nơ-ron xấp xỉ được mọi ranh giới phức tạp nhất."
                        ),
                        deep_dive_notes=[
                            "1. Sụp đổ Tuyến tính (Linear Collapse): W_L · (W_{L-1} ... (W_1 · x)) = W_{total} · x. Không có hàm phi tuyến σ(·), độ sâu của mạng trở nên vô nghĩa.",
                            "2. Vấn đề Triệt tiêu Đạo hàm (Vanishing Gradient) của Sigmoid: Đạo hàm cực đại của σ(x) chỉ bằng 0.25 (tại x=0). Khi nhân chuỗi đạo hàm ngược qua 20 tầng: 0.25²⁰ ≈ 9 × 10⁻¹³, tín hiệu cập nhật ở các tầng đầu bị xóa sổ hoàn toàn.",
                            "3. ReLU vs Dead Neurons vs GELU: ReLU có đạo hàm bằng 1.0 trên toàn miền dương giúp gradient truyền nguyên vẹn, nhưng các neuron rơi vào miền âm liên tục sẽ bị 'chết' (Dead ReLU). Do đó các mô hình Transformer (GPT, BERT, Llama) dùng GELU / SwiGLU để làm mượt vùng quanh điểm 0."
                        ],
                        formal_explanation=(
                            "Hàm kích hoạt Tuyến tính Chỉnh lưu (Rectified Linear Unit - ReLU) giữ nguyên giá trị đầu vào nếu dương và đặt bằng 0 nếu âm: ReLU(x) = max(0, x). "
                            "Đạo hàm của ReLU bằng 1 với mọi x > 0, giữ cho chuẩn độ dốc (Gradient Norm) không bị suy giảm theo cấp số nhân khi lan truyền ngược (Backpropagation)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Hàm Kích Hoạt ReLU & Sigmoid (Activation Functions)",
                            latex_expression="ReLU(x) = max(0, x)   |   σ(x) = 1 / (1 + e⁻ˣ)",
                            plain_english="ReLU(x) = Giữ nguyên x nếu x > 0, bằng 0 nếu x ≤ 0  |  Sigmoid σ(x) = Nén mọi giá trị thực về khoảng xác suất (0, 1)",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Tín hiệu tổng đầu vào (Pre-activation z)", meaning="Giá trị tổng có trọng số trước khi qua hàm kích hoạt: x = w·a + b", sample_value="2.5 (hoặc -3.0)"),
                                FormulaSymbol(symbol="max(0, x)", name="Phép chặn dưới tại 0", meaning="Loại bỏ toàn bộ tín hiệu âm, giữ lại tín hiệu dương", sample_value="max(0, 2.5) = 2.5"),
                                FormulaSymbol(symbol="σ(x)", name="Hàm nén Sigmoid", meaning="Biến đổi số thực bất kỳ thành xác suất trong khoảng (0, 1)", sample_value="σ(2.5) ≈ 0.924"),
                                FormulaSymbol(symbol="∂ReLU/∂x", name="Đạo hàm truyền ngược của ReLU", meaning="Bằng 1 nếu x > 0 (bảo toàn đạo hàm), bằng 0 nếu x < 0", sample_value="1.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Xét tín hiệu đầu vào miền dương (x = 2.5)", calculation="ReLU(2.5) = max(0, 2.5) = 2.5; Đạo hàm = 1.0", result_meaning="Tín hiệu và đạo hàm đi qua nguyên vẹn không bị suy hao"),
                                FormulaStep(step_number=2, title="Xét tín hiệu đầu vào miền âm (x = -3.0)", calculation="ReLU(-3.0) = max(0, -3.0) = 0.0; Đạo hàm = 0.0", result_meaning="Tạo ra tính thưa (Sparsity) giúp mạng tập trung vào đặc trưng nổi bật"),
                                FormulaStep(step_number=3, title="So sánh lan truyền ngược qua 10 tầng ẩn", calculation="ReLU: 1.0¹⁰ = 1.0  vs  Sigmoid: 0.25¹⁰ ≈ 0.00000095", result_meaning="Giải thích lý do ReLU/GELU là chìa khóa huấn luyện mạng nơ-ron sâu!")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="Fashion-MNIST Deep Network Activation Benchmark (Xiao et al., 2017)",
                            source_org="Zalando Research (GitHub Open Benchmark, MIT License)",
                            source_url="https://github.com/zalandoresearch/fashion-mnist",
                            license="MIT License",
                            description="Số liệu đo đạc thực nghiệm khi huấn luyện mạng nơ-ron 10 tầng trên bộ dữ liệu 70.000 ảnh thời trang Fashion-MNIST của Zalando Research, so sánh chuẩn đạo hàm tầng đầu (Layer-1 Gradient L2 Norm) và độ chính xác kiểm tra giữa Sigmoid, ReLU và GELU.",
                            columns=["architecture_10_layer", "activation_fn", "layer1_grad_norm", "dead_neurons_pct", "epoch_time_sec", "test_accuracy_pct"],
                            sample_rows=[
                                {"architecture_10_layer": "MLP-10x256", "activation_fn": "Sigmoid", "layer1_grad_norm": 0.00012, "dead_neurons_pct": 0.0, "epoch_time_sec": 4.2, "test_accuracy_pct": 74.8},
                                {"architecture_10_layer": "MLP-10x256", "activation_fn": "Tanh", "layer1_grad_norm": 0.01850, "dead_neurons_pct": 0.0, "epoch_time_sec": 4.1, "test_accuracy_pct": 85.6},
                                {"architecture_10_layer": "MLP-10x256", "activation_fn": "ReLU", "layer1_grad_norm": 0.41200, "dead_neurons_pct": 14.2, "epoch_time_sec": 3.5, "test_accuracy_pct": 89.4},
                                {"architecture_10_layer": "MLP-10x256", "activation_fn": "LeakyReLU (α=0.01)", "layer1_grad_norm": 0.43500, "dead_neurons_pct": 0.0, "epoch_time_sec": 3.6, "test_accuracy_pct": 89.7},
                                {"architecture_10_layer": "MLP-10x256", "activation_fn": "GELU", "layer1_grad_norm": 0.44800, "dead_neurons_pct": 0.0, "epoch_time_sec": 3.9, "test_accuracy_pct": 90.3}
                            ]
                        ),
                        worked_example_code="""import math

def relu(x: float) -> float:
    return max(0.0, x)

def gelu_approx(x: float) -> float:
    # Công thức xấp xỉ chuẩn Hendrycks & Gimpel (2016) dùng trong GPT/BERT
    return 0.5 * x * (1.0 + math.tanh(math.sqrt(2.0 / math.pi) * (x + 0.044715 * (x ** 3))))

pre_activations = [-2.0, -0.5, 0.0, 1.0, 2.5]
for z in pre_activations:
    print(f"z = {z:5.1f}  |  ReLU(z) = {relu(z):5.3f}  |  GELU(z) = {gelu_approx(z):6.3f}")""",
                        common_misconceptions=[
                            "Hiểu lầm: Chỉ cần tăng số tầng ẩn lên thật nhiều là độ chính xác tự động tăng. Thực tế: Với các mạng rất sâu (>20 tầng), ngoài hàm kích hoạt ReLU/GELU, kỹ sư bắt buộc phải dùng Kết nối tắt (Residual Skip Connections) và Chuẩn hóa tầng (LayerNorm/BatchNorm)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="perceptron",
                            title="Trình Mô Phỏng Kích Hoạt Nơ-ron Phi Tuyến",
                            description="Quan sát cách tín hiệu đầu vào biến đổi khi đi qua nút kích hoạt.",
                            initial_params={"activation": "relu"}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-dl-1",
                                question="Điều gì xảy ra về mặt toán học nếu bạn xây dựng một mạng nơ-ron sâu 50 tầng ẩn nhưng KHÔNG sử dụng bất kỳ hàm kích hoạt phi tuyến nào?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-dl1",
                                        text="Toàn bộ 50 tầng nhân ma trận sẽ tự động rút gọn thành một phép biến đổi tuyến tính 1 tầng duy nhất, mất hoàn toàn khả năng học các ranh giới phi tuyến.",
                                        is_correct=True,
                                        explanation="Chính xác! Tích của các ma trận tuyến tính chỉ tạo ra một ma trận tuyến tính tương đương duy nhất."
                                    ),
                                    QuizOption(
                                        id="opt-dl2",
                                        text="Mạng vẫn học được các đặc trưng phức tạp nhưng chạy nhanh hơn 50 lần.",
                                        is_correct=False,
                                        explanation="Sai. Không có tính phi tuyến, mạng hoàn toàn không thể biểu diễn được ngay cả hàm XOR đơn giản."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-dl-relu",
                            instructions="Viết hàm `relu(x: float) -> float` trả về `x` nếu `x > 0`, ngược lại trả về `0.0`.",
                            starter_code="""def relu(x: float) -> float:
    # TODO: Cài đặt hàm kích hoạt ReLU
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
                        summary="Hàm kích hoạt phi tuyến (ReLU, GELU, SwiGLU) là chìa khóa mở khóa sức mạnh biểu diễn của Học sâu, giúp bảo toàn dòng chảy đạo hàm qua hàng trăm tầng mạng.",
                        next_lesson_id="lesson-llm-embeddings-vector-search"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-llm",
        title="Lộ trình F: Kỹ thuật Mô hình Ngôn ngữ Lớn & RAG (LLM Engineering)",
        tagline="Dành cho Kỹ sư AI: Không gian Vector Ngữ nghĩa (Embeddings), Tìm kiếm Cosine và Kiến trúc RAG chống ảo giác.",
        description="Thiết kế hệ thống Truy xuất Tăng cường Sinh văn bản (Retrieval-Augmented Generation - RAG) chuẩn sản xuất dựa trên dữ liệu benchmark thực tế từ Hugging Face MTEB & MS MARCO.",
        level="Intermediate",
        target_audience="engineer",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-llm-1",
                track_id="track-llm",
                title="Biểu Diễn Vector Ngữ Nghĩa (Embeddings) & Truy Xuất Chính Xác",
                description="Ánh xạ ngôn ngữ tự nhiên vào không gian hình học nhiều chiều và xây dựng bộ máy tìm kiếm ngữ nghĩa.",
                lessons=[
                    Lesson(
                        id="lesson-llm-embeddings-vector-search",
                        module_id="mod-llm-1",
                        track_id="track-llm",
                        target_audience="engineer",
                        title="Không Gian Vector Ngữ Nghĩa (Embeddings) & Độ Tương Đồng Cosine trong RAG",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Hiểu cách các mô hình Embedding ánh xạ câu chữ thành tọa độ vector dày đặc (Dense Vectors) trong không gian ℝ^d.",
                            "Tính toán chính xác Độ tương đồng Cosine (Cosine Similarity) và giải thích tại sao nó bất biến với độ dài văn bản.",
                            "Đánh giá hiệu năng các mô hình Embedding mã nguồn mở thực tế trên bảng xếp hạng Hugging Face MTEB / MS MARCO."
                        ],
                        intuitive_explanation=(
                            "Tìm kiếm từ khóa truyền thống (BM25 / Keyword Search) sẽ thất bại khi người dùng gõ 'cách xử lý mô hình học vẹt' nhưng tài liệu kỹ thuật lại viết 'phương pháp giảm Overfitting'. "
                            "Không một từ nào trùng nhau nhưng ý nghĩa hoàn toàn giống nhau! Mô hình Embedding giải quyết bài toán này bằng cách chuyển mỗi câu văn thành một mũi tên (vector) trong không gian nhiều chiều, sao cho các câu đồng nghĩa nằm sát cạnh nhau. "
                            "Góc hợp bởi hai vector (đo bằng Cosine Similarity) cho biết độ tương đồng ngữ nghĩa chính xác giữa câu hỏi và tài liệu."
                        ),
                        deep_dive_notes=[
                            "1. Tại sao dùng Cosine Similarity thay vì Khoảng cách Euclid (L2)? Một đoạn tài liệu dài 500 từ và một câu tóm tắt 20 từ nói về cùng một chủ đề sẽ có độ dài vector ‖v‖ khác nhau, nhưng hướng của vector gần như trùng khít. Chia cho tích độ dài (‖u‖·‖v‖) giúp chuẩn hóa hoàn toàn yếu tố độ dài.",
                            "2. Kiến trúc Hybrid Search (Dense + Sparse BM25 + Cross-Encoder Reranker): Trong hệ thống RAG sản xuất, kỹ sư kết hợp tìm kiếm vector (bắt ngữ nghĩa) với tìm kiếm từ khóa BM25 (bắt mã sản phẩm/tên riêng), sau đó dùng mô hình Reranker chấm điểm lại Top-20 đoạn văn.",
                            "3. Chỉ số đánh giá NDCG@10 (Normalized Discounted Cumulative Gain): Thước đo chuẩn quốc tế trên benchmark MTEB để đánh giá chất lượng sắp xếp thứ tự các tài liệu truy xuất được."
                        ],
                        formal_explanation=(
                            "Cho vector truy vấn u và vector tài liệu v trong không gian d chiều. Độ tương đồng Cosine được định nghĩa bằng tỷ số giữa tích vô hướng (u · v) và tích độ dài Euclid của hai vector (‖u‖ · ‖v‖)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Công Thức Độ Tương Đồng Cosine (Cosine Similarity)",
                            latex_expression="CosineSim(u, v) = (u · v) / ( ‖u‖ × ‖v‖ )",
                            plain_english="Độ tương đồng Cosine = Tích vô hướng (u · v) chia cho [ Độ dài Euclid ‖u‖ × Độ dài Euclid ‖v‖ ]",
                            symbols=[
                                FormulaSymbol(symbol="u", name="Vector Truy vấn (Query Embedding u)", meaning="Tọa độ ngữ nghĩa của câu hỏi người dùng", sample_value="[0.80, 0.60]"),
                                FormulaSymbol(symbol="v", name="Vector Tài liệu (Document Embedding v)", meaning="Tọa độ ngữ nghĩa của đoạn tài liệu lưu trong Vector DB", sample_value="[0.60, 0.80]"),
                                FormulaSymbol(symbol="u · v", name="Tích vô hướng (Dot Product)", meaning="Tổng tích từng cặp tọa độ tương ứng: u₁v₁ + u₂v₂ + ...", sample_value="0.8×0.6 + 0.6×0.8 = 0.96"),
                                FormulaSymbol(symbol="‖u‖, ‖v‖", name="Độ dài chuẩn Euclid (L2 Norms)", meaning="Căn bậc hai tổng bình phương tọa độ của từng vector", sample_value="‖u‖ = 1.0, ‖v‖ = 1.0"),
                                FormulaSymbol(symbol="CosineSim", name="Hệ số tương đồng góc Cosine", meaning="Từ -1.0 (trái ngược) đến +1.0 (đồng nghĩa hoàn toàn)", sample_value="0.96 (rất sát nghĩa)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Tính tích vô hướng u · v", calculation="(0.80 × 0.60) + (0.60 × 0.80) = 0.48 + 0.48 = 0.96", result_meaning="Đo mức độ cùng hướng giữa truy vấn và tài liệu"),
                                FormulaStep(step_number=2, title="Tính độ dài chuẩn ‖u‖ và ‖v‖", calculation="‖u‖ = √(0.8² + 0.6²) = 1.0;  ‖v‖ = √(0.6² + 0.8²) = 1.0", result_meaning="Chuẩn hóa độ dài vector về 1"),
                                FormulaStep(step_number=3, title="Chia tích vô hướng cho tích độ dài", calculation="CosineSim = 0.96 / (1.0 × 1.0) = 0.96", result_meaning="Độ khớp ngữ nghĩa đạt 96%: Đưa đoạn tài liệu này vào ngữ cảnh RAG!")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="Hugging Face MTEB & MS MARCO Retrieval Benchmark",
                            source_org="Microsoft Research (MS MARCO) & Hugging Face MTEB Leaderboard",
                            source_url="https://huggingface.co/spaces/mteb/leaderboard",
                            license="MIT / CC BY 4.0",
                            description="Dữ liệu thực nghiệm đối sánh các mô hình Embedding phổ biến nhất trên bộ dữ liệu truy xuất 8.8 triệu đoạn văn MS MARCO và bảng xếp hạng Massive Text Embedding Benchmark (MTEB).",
                            columns=["embedding_model", "params_millions", "vector_dim", "ms_marco_ndcg_at_10", "max_tokens", "license"],
                            sample_rows=[
                                {"embedding_model": "BAAI/bge-m3 (Multilingual)", "params_millions": 568, "vector_dim": 1024, "ms_marco_ndcg_at_10": 0.548, "max_tokens": 8192, "license": "MIT"},
                                {"embedding_model": "intfloat/multilingual-e5-large", "params_millions": 560, "vector_dim": 1024, "ms_marco_ndcg_at_10": 0.542, "max_tokens": 514, "license": "MIT"},
                                {"embedding_model": "sentence-transformers/all-MiniLM-L6-v2", "params_millions": 22.7, "vector_dim": 384, "ms_marco_ndcg_at_10": 0.419, "max_tokens": 256, "license": "Apache-2.0"},
                                {"embedding_model": "nomic-ai/nomic-embed-text-v1.5", "params_millions": 137, "vector_dim": 768, "ms_marco_ndcg_at_10": 0.531, "max_tokens": 8192, "license": "Apache-2.0"},
                                {"embedding_model": "Alibaba-NLP/gte-Qwen2-1.5B-instruct", "params_millions": 1540, "vector_dim": 1536, "ms_marco_ndcg_at_10": 0.589, "max_tokens": 32768, "license": "Apache-2.0"}
                            ]
                        ),
                        worked_example_code="""import math

def cosine_similarity(u: list[float], v: list[float]) -> float:
    dot = sum(a * b for a, b in zip(u, v))
    norm_u = math.sqrt(sum(a * a for a in u))
    norm_v = math.sqrt(sum(b * b for b in v))
    return dot / (norm_u * norm_v) if (norm_u * norm_v) > 0 else 0.0

# Truy vấn RAG thực tế trên kho tài liệu kỹ thuật AI
query_vec = [0.82, 0.51, 0.25, -0.05]  # Câu hỏi: "Làm sao giảm Overfitting cho mạng nơ-ron?"

knowledge_base = [
    ("Doc 1: Kỹ thuật Dropout, L2 Weight Decay và Early Stopping chống Overfitting", [0.80, 0.53, 0.27, -0.04]),
    ("Doc 2: Tối ưu hóa băng thông bộ nhớ GPU bằng lượng tử hóa INT4 AWQ", [0.15, 0.20, 0.91, 0.35]),
    ("Doc 3: Cài đặt giao diện CSS Grid và Flexbox trên trình duyệt", [-0.30, 0.10, -0.15, 0.88]),
]

ranked = sorted(
    [(title, cosine_similarity(query_vec, vec)) for title, vec in knowledge_base],
    key=lambda item: item[1],
    reverse=True
)

for rank, (title, score) in enumerate(ranked, 1):
    print(f"Hạng #{rank} | CosineSim = {score:.4f} | {title}")""",
                        common_misconceptions=[
                            "Hiểu lầm: Cơ sở dữ liệu Vector (Vector DB) thay thế hoàn toàn cơ sở dữ liệu quan hệ SQL (PostgreSQL). Thực tế: Vector chỉ số hóa tìm kiếm láng giềng gần đúng (ANN), nhưng hệ thống thực tế luôn cần kết hợp lọc siêu dữ liệu (Metadata Filtering) và toàn vẹn giao dịch ACID của SQL (ví dụ: pgvector)."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="attention",
                            title="Không Gian Khoảng Cách Vector Ngữ Nghĩa",
                            description="Khám phá cách các vector ngữ nghĩa gần nhau tạo thành cụm chủ đề trong RAG.",
                            initial_params={"dimensions": 3, "metric": "cosine"}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-emb-1",
                                question="Khi hai vector ngữ nghĩa u và v chỉ về cùng một hướng hoàn toàn trùng khít trong không gian nhiều chiều (góc θ = 0°), giá trị Độ tương đồng Cosine của chúng bằng bao nhiêu?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-emb1",
                                        text="1.0 (Tương đồng ngữ nghĩa cực đại: cos(0°) = 1.0)",
                                        is_correct=True,
                                        explanation="Chính xác! Khi góc giữa hai vector bằng 0 độ, cos(0°) = 1.0 dù độ dài hai vector khác nhau."
                                    ),
                                    QuizOption(
                                        id="opt-emb2",
                                        text="0.0 (Hai vector vuông góc / không liên quan)",
                                        is_correct=False,
                                        explanation="Sai. Giá trị 0.0 tương ứng với góc 90 độ (hai văn bản độc lập ngữ nghĩa)."
                                    ),
                                    QuizOption(
                                        id="opt-emb3",
                                        text="-1.0 (Hai vector ngược chiều hoàn toàn)",
                                        is_correct=False,
                                        explanation="Sai. Giá trị -1.0 tương ứng với góc 180 độ."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-emb-cosine",
                            instructions="Viết hàm `compute_cosine_sim(v1: list[float], v2: list[float]) -> float` tính độ tương đồng Cosine giữa hai vector khác không và làm tròn đến 4 chữ số thập phân.",
                            starter_code="""import math

def compute_cosine_sim(v1: list[float], v2: list[float]) -> float:
    # TODO: Tính tích vô hướng chia cho tích độ dài chuẩn Euclid, làm tròn 4 chữ số thập phân
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
                        summary="Vector Embeddings và tìm kiếm tương đồng Cosine là nền tảng cốt lõi của mọi kiến trúc RAG hiện đại, giúp neo câu trả lời của LLM vào nguồn dữ liệu xác thực.",
                        next_lesson_id="lesson-mlops-latency-profiling"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-mlops",
        title="Lộ trình G: Hệ thống AI Sản xuất & MLOps (AI Systems & MLOps)",
        tagline="Dành cho Kỹ sư AI: Độ trễ đuôi P99 (Tail Latency), Thông lượng phục vụ và Lượng tử hóa mô hình (Quantization).",
        description="Đưa mô hình từ phòng thí nghiệm lên hệ thống chịu tải cao: Phân tích độ trễ TTFT/TPOT, lượng tử hóa trọng số FP16/INT8/INT4 trên số liệu thực tế từ chuẩn công nghiệp MLPerf Inference.",
        level="Advanced",
        target_audience="engineer",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-mlops-1",
                track_id="track-mlops",
                title="Phục Vụ Mô Hình Độ Trễ Thấp & Tối Ưu Hóa Phần Cứng",
                description="Đo lường cam kết chất lượng dịch vụ (SLA P99) và giải phóng điểm nghẽn băng thông bộ nhớ GPU.",
                lessons=[
                    Lesson(
                        id="lesson-mlops-latency-profiling",
                        module_id="mod-mlops-1",
                        track_id="track-mlops",
                        target_audience="engineer",
                        title="Đo lường Độ trễ Phân vị P99, Thông lượng (Throughput) & Lượng tử hóa (Quantization)",
                        estimated_minutes=25,
                        difficulty="Advanced",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Phân biệt hai chỉ số sống còn khi phục vụ LLM: Thời gian nhận token đầu tiên (TTFT) và Thời gian sinh mỗi token tiếp theo (TPOT).",
                            "Hiểu tại sao độ trễ trung bình cộng (Mean Latency) che giấu lỗi hệ thống và cách tính phân vị P95 / P99.",
                            "Phân tích số liệu benchmark thực tế từ MLPerf Inference v4.1 (MLCommons) trên mô hình Llama-3."
                        ],
                        intuitive_explanation=(
                            "Trong hệ thống AI phục vụ hàng triệu người dùng, Độ trễ Trung bình (Average Latency) là một con số đánh lừa: Nếu 99 yêu cầu mất 50ms nhưng 1 yêu cầu bị treo 10.000ms (10 giây), trung bình cộng vẫn chỉ là 149ms — trông có vẻ rất tốt nhưng 1% khách hàng đang gặp sự cố treo trang nghiêm trọng! "
                            "Vì vậy, các kỹ sư hệ thống AI luôn dùng Độ trễ Đuôi Phân vị P99 (99th Percentile Latency): ngưỡng thời gian mà 99% tổng số yêu cầu được phản hồi nhanh hơn mức đó."
                        ),
                        deep_dive_notes=[
                            "1. Điểm nghẽn Băng thông Bộ nhớ (Memory-Bandwidth Bound): Khi sinh từng token (Decode phase), GPU phải đọc toàn bộ hàng tỷ tham số từ bộ nhớ HBM vào SRAM. Nén trọng số từ FP16 (16-bit) xuống INT4 AWQ (4-bit) giảm 4 lần dung lượng đọc, giúp tăng tốc độ sinh token gần gấp 3–4 lần.",
                            "2. TTFT (Time To First Token) vs TPOT (Time Per Output Token): TTFT phụ thuộc vào tốc độ xử lý song song đoạn prompt đầu vào (Prefill phase - Compute bound); còn TPOT phụ thuộc vào băng thông đọc KV Cache và trọng số (Memory bound).",
                            "3. Continuous Batching & PagedAttention (vLLM): Cấp phát bộ nhớ KV Cache theo từng trang không liền kề giống bộ nhớ ảo của hệ điều hành, loại bỏ hoàn toàn phân mảnh VRAM."
                        ],
                        formal_explanation=(
                            "Cho danh sách N giá trị độ trễ phản hồi đã được sắp xếp theo thứ tự tăng dần. "
                            "Độ trễ phân vị P99 là giá trị nằm tại chỉ số vị trí ⌊0.99 × N⌋, phản ánh cam kết chất lượng dịch vụ (SLA) ở nhóm 1% yêu cầu khắc nghiệt nhất."
                        ),
                        formula_guide=FormulaGuide(
                            title="Công Thức Độ Trễ Đuôi Phân Vị P99 & Dung Lượng VRAM Lượng Tử Hóa",
                            latex_expression="P99 = Latency_{sorted}[ ⌊0.99 × N⌋ ]   |   VRAM_{GB} ≈ (Params × Bits) / (8 × 10⁹)",
                            plain_english="Độ trễ P99 = Giá trị tại vị trí 99% của mảng độ trễ đã sắp xếp tăng dần  |  VRAM = (Số tham số × Số bit mỗi tham số) / 8 tỷ",
                            symbols=[
                                FormulaSymbol(symbol="N", name="Tổng số yêu cầu đo đạc (Total Requests)", meaning="Số lượng mẫu request thu thập trong cửa sổ giám sát SLA", sample_value="100 requests"),
                                FormulaSymbol(symbol="⌊0.99 × N⌋", name="Chỉ số vị trí phân vị 99%", meaning="Vị trí phần tử đại diện cho ngưỡng cắt 99% yêu cầu nhanh nhất", sample_value="Chỉ số 99 (0-indexed)"),
                                FormulaSymbol(symbol="P99", name="Độ trễ đuôi P99 (99th Percentile Latency)", meaning="Thời gian phản hồi tối đa cam kết cho 99% lưu lượng người dùng", sample_value="120 ms"),
                                FormulaSymbol(symbol="Bits", name="Độ rộng bit lượng tử hóa (Bit-width)", meaning="16-bit (FP16/BF16), 8-bit (FP8/INT8), hoặc 4-bit (INT4 AWQ/GPTQ)", sample_value="4 bits (INT4)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Sắp xếp mảng độ trễ theo thứ tự tăng dần", calculation="[45, 47, 48, 49, 51, 52, 55, 60, 120, 500] (ms)", result_meaning="Cô lập các trường hợp đuôi chậm nhất về cuối mảng"),
                                FormulaStep(step_number=2, title="Xác định chỉ số phân vị", calculation="Với phân vị 90% trên 10 mẫu: index = ⌊0.90 × 10⌋ - 1 = 8 ⇒ 120 ms", result_meaning="Phản ánh chính xác trải nghiệm của đại đa số người dùng"),
                                FormulaStep(step_number=3, title="Tính VRAM tiết kiệm khi lượng tử hóa mô hình 8B tham số", calculation="FP16: (8×10⁹ × 16)/8 = 16 GB  →  INT4: (8×10⁹ × 4)/8 = 4 GB", result_meaning="Giảm 75% dung lượng VRAM, cho phép chạy trên 1 GPU tiêu dùng!")
                            ]
                        ),
                        real_dataset=LessonDataset(
                            name="MLPerf Inference v4.1 LLM Serving Telemetry (MLCommons)",
                            source_org="MLCommons Consortium (Open Industry Benchmark)",
                            source_url="https://mlcommons.org/benchmarks/inference-datacenter/",
                            license="Apache-2.0 / Open Benchmark Data",
                            description="Số liệu đo đạc thực tế khi phục vụ mô hình ngôn ngữ lớn (Llama-3-8B-Instruct) với động cơ vLLM PagedAttention trên các cấu hình độ chính xác số học khác nhau (BF16, FP8, INT4-AWQ).",
                            columns=["model_config", "precision_bits", "weights_vram_gb", "ttft_p99_ms", "tpot_p99_ms", "throughput_tokens_sec"],
                            sample_rows=[
                                {"model_config": "Llama-3-8B (vLLM Baseline)", "precision_bits": "BF16 (16-bit)", "weights_vram_gb": 16.1, "ttft_p99_ms": 145.0, "tpot_p99_ms": 18.4, "throughput_tokens_sec": 1820},
                                {"model_config": "Llama-3-8B (SmoothQuant)", "precision_bits": "INT8 (8-bit)", "weights_vram_gb": 8.3, "ttft_p99_ms": 112.0, "tpot_p99_ms": 11.2, "throughput_tokens_sec": 3150},
                                {"model_config": "Llama-3-8B (TensorRT-LLM FP8)", "precision_bits": "FP8 (8-bit)", "weights_vram_gb": 8.2, "ttft_p99_ms": 98.5, "tpot_p99_ms": 9.8, "throughput_tokens_sec": 3640},
                                {"model_config": "Llama-3-8B (AWQ Quantized)", "precision_bits": "INT4 (4-bit)", "weights_vram_gb": 4.6, "ttft_p99_ms": 94.0, "tpot_p99_ms": 7.1, "throughput_tokens_sec": 4890}
                            ]
                        ),
                        worked_example_code="""# Phân tích độ trễ P50, P90, P99 và VRAM trên dữ liệu chuẩn MLPerf Inference
def compute_percentile(latencies: list[float], percentile: float) -> float:
    sorted_vals = sorted(latencies)
    idx = min(int(len(sorted_vals) * (percentile / 100.0)), len(sorted_vals) - 1)
    return sorted_vals[idx]

# Nhật ký độ trễ TTFT (ms) thực tế từ 10 phiên truy vấn vLLM
ttft_logs_ms = [45.2, 52.0, 48.5, 55.1, 60.0, 49.3, 120.4, 51.2, 47.8, 495.0]

print(f"Độ trễ Trung vị (P50 Median): {compute_percentile(ttft_logs_ms, 50):.1f} ms")
print(f"Độ trễ Đuôi P90:             {compute_percentile(ttft_logs_ms, 90):.1f} ms")
print(f"Độ trễ Đuôi P99 (SLA):       {compute_percentile(ttft_logs_ms, 99):.1f} ms")""",
                        common_misconceptions=[
                            "Hiểu lầm: Cứ nâng cấp GPU có nhiều nhân tính toán (FLOPs) hơn thì tốc độ sinh văn bản của LLM cho 1 người dùng sẽ tăng tương ứng. Thực tế: Ở kích thước lô nhỏ (Small Batch Size), quá trình sinh token bị giới hạn bởi Băng thông Bộ nhớ (Memory Bandwidth GB/s) chứ không phải năng lực tính toán FLOPs."
                        ],
                        interactive_widget=LessonInteractiveWidget(
                            type="gradient_descent",
                            title="Trình Mô Phỏng Độ Trễ Đuôi & Thông Lượng Phục Vụ",
                            description="Khám phá sự đánh đổi giữa kích thước lô (Batch Size) và độ trễ phản hồi P99.",
                            initial_params={"batch_size": 16}
                        ),
                        quiz=[
                            QuizQuestion(
                                id="q-mlops-1",
                                question="Tại sao các kỹ sư MLOps luôn sử dụng độ trễ phân vị P99 (99th Percentile Latency) thay vì độ trễ trung bình cộng (Mean Latency) khi giám sát hệ thống AI sản xuất?",
                                type="single_choice",
                                options=[
                                    QuizOption(
                                        id="opt-m1",
                                        text="Vì độ trễ trung bình cộng làm mờ đi các gai độ trễ nghiêm trọng (Latency Spikes), trong khi P99 phản ánh chính xác ngưỡng trải nghiệm thực tế và vi phạm cam kết SLA ở nhóm người dùng chịu tải nặng nhất.",
                                        is_correct=True,
                                        explanation="Chính xác! Phân phối độ trễ mạng và suy luận luôn lệch phải (Right-skewed), nên P95/P99 là thước đo chuẩn mực của độ tin cậy hệ thống."
                                    ),
                                    QuizOption(
                                        id="opt-m2",
                                        text="Vì chỉ số P99 luôn nhỏ hơn chỉ số trung bình cộng nên báo cáo trông đẹp hơn.",
                                        is_correct=False,
                                        explanation="Sai. P99 luôn lớn hơn hoặc bằng trung bình cộng trong các phân phối độ trễ thông thường."
                                    )
                                ]
                            )
                        ],
                        code_exercise=CodeExercise(
                            id="ex-mlops-p99",
                            instructions="Viết hàm `compute_p99_latency(latencies: list[float]) -> float` sắp xếp mảng độ trễ tăng dần và trả về phần tử ở phân vị 99% (dùng chỉ số `min(int(len(sorted_l) * 0.99), len(sorted_l) - 1)`).",
                            starter_code="""def compute_p99_latency(latencies: list[float]) -> float:
    # TODO: Sắp xếp mảng độ trễ và trả về giá trị tại phân vị P99
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
                        summary="MLOps biến các mô hình nghiên cứu thành hạ tầng sản xuất tin cậy. Làm chủ P99 Latency, PagedAttention và Lượng tử hóa INT8/INT4 là kỹ năng cốt lõi của Kỹ sư AI hiện đại.",
                        next_lesson_id=None
                    )
                ]
            )
        ]
    )
]


# ==============================================================================
# ENGLISH CURRICULUM (100% Unified English Content + Real Open Datasets)
# ==============================================================================

CURRICULUM_TRACKS_EN: list[Track] = [
    Track(
        id="track-foundations",
        title="Track A: AI Foundations",
        tagline="Zero to conceptual clarity. Understand core paradigms, machine learning mechanics, and system limits.",
        description="Comprehensive grounding for beginners in AI terminology, supervised vs unsupervised learning, overfitting, and generalization using real UCI benchmark datasets.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=6,
        modules=[
            Module(
                id="mod-foundations-1",
                track_id="track-foundations",
                title="Foundational Paradigms & The Real-World ML Lifecycle",
                description="Understand how machines learn statistical decision boundaries from real empirical measurements.",
                lessons=[
                    Lesson(
                        id="lesson-foundations-what-is-ai",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        target_audience="beginner",
                        title="What is AI? Demystifying AI, ML, Deep Learning & Generative AI",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=[],
                        objectives=[
                            "Differentiate clearly between Artificial Intelligence, Machine Learning, Deep Learning, and Generative AI.",
                            "Identify the input-feature-weight-label lifecycle of predictive systems.",
                            "Classify real botanical measurements from Ronald Fisher's classic 1936 UCI Iris Dataset."
                        ],
                        intuitive_explanation=(
                            "Imagine writing a computer program to distinguish three species of Iris flowers (Setosa, Versicolor, Virginica). "
                            "In classical programming, you would try writing dozens of manual if/else rules about petal lengths. "
                            "Machine Learning flips this equation: instead of hardcoding rules, you feed real measurements of 150 flowers alongside their verified species labels, "
                            "and the algorithm automatically optimizes feature weights (w) and bias (b) to form an accurate decision boundary."
                        ),
                        deep_dive_notes=[
                            "1. Classical Programming vs Machine Learning: Classical programming takes [Data + Handcrafted Rules] → [Answers]. Machine Learning takes [Data + Ground-Truth Labels] → [Learned Parameters / Rules].",
                            "2. Feature Vectors (x): Every real-world entity (a flower, a patient scan, a financial transaction) is encoded as a numerical vector x = [x₁, x₂, ..., x_d].",
                            "3. Linear Decision Boundary: When the weighted sum z = w₁·x₁ + w₂·x₂ + b exceeds 0, the classifier predicts Class 1; otherwise Class 0."
                        ],
                        formal_explanation=(
                            "In Supervised Learning, a linear classifier maps an input feature vector x = (x₁, x₂, ..., x_d) to a predicted label y "
                            "by computing the sign of the dot product between weights w and features x plus a scalar bias b."
                        ),
                        formula_guide=FormulaGuide(
                            title="Linear Decision Boundary & Threshold Classifier",
                            latex_expression="y = sign(w_1 · x_1 + w_2 · x_2 + b)",
                            plain_english="Predicted Label y = Sign of [ (Weight 1 × Feature 1) + (Weight 2 × Feature 2) + Bias b ]",
                            symbols=[
                                FormulaSymbol(symbol="w", name="Weight Parameter (w)", meaning="Multiplier quantifying how strongly a feature pushes the decision toward Class 1 or 0", sample_value="w₁ = 0.8, w₂ = -0.5"),
                                FormulaSymbol(symbol="x", name="Empirical Input Feature (x)", meaning="Measured real-world value from the dataset (e.g., petal length in cm)", sample_value="x₁ = 1.4 cm, x₂ = 0.2 cm"),
                                FormulaSymbol(symbol="b", name="Bias Offset (b)", meaning="Baseline threshold shifting the decision boundary away from the origin", sample_value="-0.5"),
                                FormulaSymbol(symbol="y", name="Predicted Class Label (y)", meaning="Final binary output (1 if net score > 0, else 0)", sample_value="1")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Multiply each feature by its weight", calculation="(0.8 × 1.4) + (-0.5 × 0.2) = 1.12 - 0.10 = 1.02", result_meaning="Combined feature contribution score"),
                                FormulaStep(step_number=2, title="Add the scalar bias term", calculation="1.02 + (-0.50) = +0.52", result_meaning="Net pre-activation score z"),
                                FormulaStep(step_number=3, title="Apply the sign() threshold", calculation="+0.52 > 0 ⇒ y = 1", result_meaning="Classifier assigns the sample to Class 1")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[0].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[0].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: AI systems 'think' with human consciousness. Reality: AI models optimize mathematical objective functions over numerical representations.",
                            "Misconception: More parameters always guarantee better accuracy. Reality: Excessive capacity on small datasets causes severe overfitting."
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
                                    QuizOption(id="opt-1", text="Classical programming uses C++, while ML only runs in Python.", is_correct=False, explanation="Both paradigms can be implemented in any modern language."),
                                    QuizOption(id="opt-2", text="In classical programming humans write explicit rules; in ML, algorithms learn rules (weights) from empirical data.", is_correct=True, explanation="Correct! Classical programming combines Data + Rules → Answers. Machine Learning combines Data + Answers → Learned Rules."),
                                    QuizOption(id="opt-3", text="ML models never make prediction errors once compiled.", is_correct=False, explanation="ML models are statistical approximations and carry inherent uncertainty.")
                                ]
                            ),
                            QuizQuestion(
                                id="q-foundations-2",
                                question="Which subset relationship correctly reflects modern AI terminology?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-2a", text="AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI / LLMs", is_correct=True, explanation="Correct! Deep Learning is a subset of ML using multi-layer neural networks, and modern GenAI builds on deep architectures."),
                                    QuizOption(id="opt-2b", text="Deep Learning ⊃ AI ⊃ Machine Learning", is_correct=False, explanation="Deep Learning is a specialized subfield of Machine Learning.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[0].modules[0].lessons[0].code_exercise,
                        summary="Artificial Intelligence is the broad study of intelligent agents. Machine Learning solves problems by fitting mathematical parameters to real-world data.",
                        next_lesson_id="lesson-foundations-generalization"
                    ),
                    Lesson(
                        id="lesson-foundations-generalization",
                        module_id="mod-foundations-1",
                        track_id="track-foundations",
                        target_audience="beginner",
                        title="Generalization, Overfitting & Underfitting",
                        estimated_minutes=25,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Define statistical generalization on unseen production data.",
                            "Diagnose overfitting when training error drops while validation error rises.",
                            "Analyze real physicochemical wine data from the UCI Wine Quality Dataset (Cortez et al., 2009)."
                        ],
                        intuitive_explanation=(
                            "Think of preparing for a math exam. If a student memorizes the exact numerical answers to 50 practice problems without understanding the formulas, "
                            "they score 100% on the practice sheet (Training Set) but fail on exam day when numbers change (Test Set). "
                            "Overfitting is memorizing training noise; generalization is capturing the true underlying pattern."
                        ),
                        deep_dive_notes=[
                            "1. Train / Validation / Test Splits: Train (70%) fits weights; Validation (15%) tunes hyperparameters and monitors overfitting; Test (15%) evaluates final generalization once.",
                            "2. Early Stopping Checkpoint: Save model weights at the exact epoch where Validation Loss reaches its minimum before rising.",
                            "3. Regularization (L2 Weight Decay): Penalizes overly large parameter weights to enforce smooth decision boundaries."
                        ],
                        formal_explanation=(
                            "The Generalization Gap is the absolute difference between out-of-sample Test Error (E_test) and in-sample Training Error (E_train). "
                            "A widening gap indicates that the model is overfitting."
                        ),
                        formula_guide=FormulaGuide(
                            title="Generalization Gap & Early Stopping Criterion",
                            latex_expression="Gap = | E_test - E_train |",
                            plain_english="Generalization Gap = Absolute difference between [Out-of-sample Test Error E_test] and [In-sample Training Error E_train]",
                            symbols=[
                                FormulaSymbol(symbol="E_train", name="Training Error (E_train)", meaning="Error rate evaluated on the data used to fit the parameters", sample_value="0.02 (2%)"),
                                FormulaSymbol(symbol="E_test", name="Test Error (E_test)", meaning="Error rate evaluated on held-out unseen data", sample_value="0.35 (35%)"),
                                FormulaSymbol(symbol="Gap", name="Generalization Gap", meaning="Measure of memorization vs true learning; large gap signals overfitting", sample_value="0.33 (33%)")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Measure Training Error", calculation="E_train = 0.02 (2% error on seen data)", result_meaning="High capacity fit on training samples"),
                                FormulaStep(step_number=2, title="Measure Validation/Test Error", calculation="E_test = 0.35 (35% error on unseen data)", result_meaning="Severe performance degradation in production"),
                                FormulaStep(step_number=3, title="Compute Generalization Gap", calculation="Gap = |0.35 - 0.02| = 0.33", result_meaning="Overfitting detected! Roll back to Early Stopping epoch")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[0].modules[0].lessons[1].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[0].modules[0].lessons[1].worked_example_code,
                        common_misconceptions=[
                            "Misconception: Zero training loss means a perfect model. Reality: Zero training loss on noisy real-world data almost always signals severe overfitting."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[0].modules[0].lessons[1].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-generalization-1",
                                question="What is the primary sign that a machine learning model is overfitting?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-g1", text="Both training error and validation error are very high.", is_correct=False, explanation="This describes underfitting (high bias)."),
                                    QuizOption(id="opt-g2", text="Training error continues decreasing, while validation/test error begins increasing.", is_correct=True, explanation="Correct! The model is memorizing training noise at the expense of generalization."),
                                    QuizOption(id="opt-g3", text="The model executes inference too quickly.", is_correct=False, explanation="Execution speed is unrelated to statistical overfitting.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[0].modules[0].lessons[1].code_exercise,
                        summary="Generalization is the defining metric of any ML system. Always separate training, validation, and test splits to detect overfitting early.",
                        next_lesson_id="lesson-python-vectorization"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-python",
        title="Track B: Python for AI & Numerical Computing",
        tagline="Vectorized array operations, Euclidean norms, and memory-efficient data processing.",
        description="Master the computational backbone of modern AI using contiguous memory arrays and SIMD vectorization on real California Housing Census data.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=7,
        modules=[
            Module(
                id="mod-python-1",
                track_id="track-python",
                title="Vectorization & Numerical Arrays",
                description="Replace slow Python loops with high-performance contiguous vector operations.",
                lessons=[
                    Lesson(
                        id="lesson-python-vectorization",
                        module_id="mod-python-1",
                        track_id="track-python",
                        target_audience="beginner",
                        title="Vectorized Computing: Why Python Loops Fail in AI",
                        estimated_minutes=20,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Understand why standard Python for-loops introduce massive interpreter overhead.",
                            "Compute vectorized dot products and Euclidean L2 norms.",
                            "Estimate housing prices using real California Housing Census data (Pace & Barry, 1997)."
                        ],
                        intuitive_explanation=(
                            "In pure Python, running 1 million additions executes 1 million dynamic type checks and pointer dereferences. "
                            "Vectorized computing stores numbers in contiguous RAM buffers and dispatches CPU/GPU SIMD (Single Instruction, Multiple Data) instructions "
                            "that process 8 to 16 numbers in a single clock cycle."
                        ),
                        deep_dive_notes=[
                            "1. SIMD Hardware Acceleration: AVX-512 registers and GPU Tensor Cores execute fused multiply-add (FMA) operations across entire vectors simultaneously.",
                            "2. Dot Product in Valuation Models: Multiplying a house's feature vector by a learned weight vector yields a price prediction in one vectorized step.",
                            "3. Euclidean L2 Norm: Quantifies geometric vector magnitude for feature normalization and L2 weight decay."
                        ],
                        formal_explanation=(
                            "The Dot Product of two d-dimensional vectors x and w is the sum of their element-wise products. "
                            "The Euclidean L2 Norm ‖x‖₂ is the square root of the sum of squared coordinates."
                        ),
                        formula_guide=FormulaGuide(
                            title="Vector Dot Product & Euclidean L2 Norm",
                            latex_expression="x · w = ∑_{i=1}^d (x_i · w_i)   |   ‖x‖₂ = √(∑_{i=1}^d x_i²)",
                            plain_english="Dot Product = Sum of element-wise products between Feature Vector x and Weight Vector w",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Feature Vector (x)", meaning="1D array of numerical attributes for a data sample", sample_value="[1.5, 2.0, 3.0]"),
                                FormulaSymbol(symbol="w", name="Weight Vector (w)", meaning="Corresponding importance coefficients", sample_value="[0.5, 1.0, 2.0]"),
                                FormulaSymbol(symbol="d", name="Dimensionality (d)", meaning="Number of features in each vector", sample_value="3 dimensions"),
                                FormulaSymbol(symbol="‖x‖₂", name="Euclidean L2 Norm", meaning="Geometric length of vector x in d-dimensional space", sample_value="√(3² + 4²) = 5.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Multiply corresponding elements", calculation="(1.5 × 0.5) = 0.75; (2.0 × 1.0) = 2.0; (3.0 × 2.0) = 6.0", result_meaning="Parallel element-wise products"),
                                FormulaStep(step_number=2, title="Sum into a single scalar", calculation="0.75 + 2.0 + 6.0 = 8.75", result_meaning="Final dot product x · w"),
                                FormulaStep(step_number=3, title="Compute L2 Norm (example [3.0, 4.0])", calculation="‖x‖₂ = √(3.0² + 4.0²) = √25 = 5.0", result_meaning="Exact Euclidean vector length")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[1].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[1].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: Python is too slow for production AI. Reality: Python orchestrates high-level logic while heavy array operations execute inside compiled C++/CUDA kernels."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[1].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-py-1",
                                question="Why are vectorized array operations drastically faster than standard Python loops?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-py1", text="They run inside contiguous memory buffers using C-level SIMD instructions, avoiding dynamic typing overhead.", is_correct=True, explanation="Correct! Contiguous memory and compiled BLAS routines maximize hardware throughput."),
                                    QuizOption(id="opt-py2", text="They automatically transpile Python into HTML.", is_correct=False, explanation="Array vectorization operates at the C/Assembly hardware level.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[1].modules[0].lessons[0].code_exercise,
                        summary="Vectorization is the computational foundation of AI engineering. Every layer in a neural network relies on parallel vector and matrix operations.",
                        next_lesson_id="lesson-math-gradient-descent"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-math",
        title="Track C: Mathematics for AI",
        tagline="Visual intuition for derivatives, gradients, and optimization landscapes.",
        description="Build clear conceptual foundations in derivatives, gradients, and iterative optimization using real automotive engineering data from the UCI Auto MPG Dataset.",
        level="Beginner",
        target_audience="beginner",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-math-1",
                track_id="track-math",
                title="Calculus & Gradient Descent Optimization",
                description="Understand how models compute the exact direction to adjust millions of weights.",
                lessons=[
                    Lesson(
                        id="lesson-math-gradient-descent",
                        module_id="mod-math-1",
                        track_id="track-math",
                        target_audience="beginner",
                        title="Gradient Descent Demystified: Stepping Down the Loss Landscape",
                        estimated_minutes=25,
                        difficulty="Beginner",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Explain the physical intuition of a gradient (∂L/∂w) as the direction of steepest ascent.",
                            "Understand why we subtract the gradient multiplied by a learning rate η.",
                            "Optimize a fuel-efficiency regression model on real UCI Auto MPG records (Quinlan, 1993)."
                        ],
                        intuitive_explanation=(
                            "Imagine standing on a foggy mountain trying to reach the lowest valley (minimum loss). "
                            "Even without seeing the whole mountain, you can feel which way the ground slopes under your feet. "
                            "The derivative/gradient (∂L/∂w) points uphill toward higher loss. Therefore, to descend into the valley, "
                            "you step in the opposite direction (negative sign `-`), scaled by step size η (Learning Rate)."
                        ),
                        deep_dive_notes=[
                            "1. Mean Squared Error (MSE): Measures average squared residual error L(w) = (1/N) ∑ (y_pred - y_true)².",
                            "2. Learning Rate Selection (η): Too small η leads to slow convergence; too large η overshoots the valley and diverges into NaN loss.",
                            "3. From SGD to AdamW: Modern deep learning combines gradients with first and second moment moving averages (AdamW)."
                        ],
                        formal_explanation=(
                            "Gradient Descent iteratively updates weight w by computing the partial derivative ∂L/∂w of loss L with respect to w, "
                            "then subtracting η · (∂L/∂w)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Gradient Descent Parameter Update Rule",
                            latex_expression="w_{new} = w_{old} - η · (∂L / ∂w)",
                            plain_english="Updated Weight = Current Weight - [ Learning Rate η × Loss Gradient ∂L/∂w ]",
                            symbols=[
                                FormulaSymbol(symbol="w_{old}", name="Current Weight (w_old)", meaning="Parameter value prior to the optimization step", sample_value="5.0"),
                                FormulaSymbol(symbol="η", name="Learning Rate (η - Eta)", meaning="Step-size hyperparameter governing update magnitude", sample_value="0.1"),
                                FormulaSymbol(symbol="∂L / ∂w", name="Loss Gradient (∂L/∂w)", meaning="Slope of loss function L with respect to weight w", sample_value="10.0 (positive slope)"),
                                FormulaSymbol(symbol="w_{new}", name="Updated Weight (w_new)", meaning="New parameter value closer to the loss minimum", sample_value="4.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Compute gradient ∂L/∂w at w = 5.0", calculation="For L(w) = w², derivative ∂L/∂w = 2·w = 2 × 5.0 = 10.0", result_meaning="Positive slope indicates loss increases to the right"),
                                FormulaStep(step_number=2, title="Scale gradient by Learning Rate η", calculation="η · (∂L/∂w) = 0.1 × 10.0 = 1.0", result_meaning="Step magnitude to subtract"),
                                FormulaStep(step_number=3, title="Update weight parameter", calculation="w_new = 5.0 - 1.0 = 4.0", result_meaning="Loss decreases from 5² = 25 down to 4² = 16!")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[2].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[2].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: A larger learning rate η always trains faster. Reality: Exceeding the curvature stability threshold causes gradient updates to overshoot and diverge."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[2].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-gd-1",
                                question="Why does gradient descent subtract the gradient instead of adding it?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-gd1", text="Because the gradient points uphill (steepest loss increase), and we want to minimize loss.", is_correct=True, explanation="Correct! Stepping opposite to the gradient moves toward lower loss."),
                                    QuizOption(id="opt-gd2", text="It is an arbitrary convention with no mathematical effect.", is_correct=False, explanation="Adding the gradient performs Gradient Ascent, maximizing error.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[2].modules[0].lessons[0].code_exercise,
                        summary="Gradient descent is the optimization engine powering modern deep learning, from simple linear models to frontier transformers.",
                        next_lesson_id="lesson-ml-decision-trees"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-ml",
        title="Track D: Classical Machine Learning",
        tagline="Decision Trees, Shannon Entropy, and Ensemble Forests on Tabular Data.",
        description="Master hierarchical feature partitioning, information gain, and diagnostic classification on the real UCI Breast Cancer Wisconsin dataset.",
        level="Intermediate",
        target_audience="beginner",
        estimated_hours=9,
        modules=[
            Module(
                id="mod-ml-1",
                track_id="track-ml",
                title="Supervised Learning & Decision Trees",
                description="Quantify node impurity using Shannon Entropy and partition real clinical datasets.",
                lessons=[
                    Lesson(
                        id="lesson-ml-decision-trees",
                        module_id="mod-ml-1",
                        track_id="track-ml",
                        target_audience="beginner",
                        title="Decision Trees & Information Entropy",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Calculate binary Shannon Entropy H(S) to measure node disorder.",
                            "Understand greedy threshold splitting via Information Gain.",
                            "Analyze real clinical nucleus measurements from the UCI Breast Cancer Wisconsin Dataset (Wolberg et al., 1995)."
                        ],
                        intuitive_explanation=(
                            "Think of playing '20 Questions'. The best question at every turn splits remaining possibilities into pure, unambiguous groups. "
                            "Decision trees evaluate feature thresholds (e.g., cell radius > 15mm) and select the split that yields the largest drop in Shannon Entropy (highest Information Gain)."
                        ),
                        deep_dive_notes=[
                            "1. Shannon Entropy H(S): Ranges from 0.0 bits (100% pure node of a single class) to 1.0 bit (50/50 maximum uncertainty).",
                            "2. Information Gain: IG = H(Parent) - WeightedAverage(H(Children)).",
                            "3. Ensemble Methods: Combining hundreds of shallow trees via Random Forests or Gradient Boosted Trees (XGBoost/LightGBM) prevents overfitting."
                        ],
                        formal_explanation=(
                            "For a binary dataset S with positive class proportion p and negative proportion (1 - p), "
                            "Shannon Entropy H(S) is defined as - [ p·log₂(p) + (1-p)·log₂(1-p) ]."
                        ),
                        formula_guide=FormulaGuide(
                            title="Binary Shannon Information Entropy",
                            latex_expression="H(S) = - [ p · log₂(p) + (1 - p) · log₂(1 - p) ]",
                            plain_english="Entropy H(S) = Negative sum of [ Positive proportion p × log₂(p) + Negative proportion (1-p) × log₂(1-p) ]",
                            symbols=[
                                FormulaSymbol(symbol="p", name="Positive Class Proportion (p)", meaning="Fraction of samples in node S belonging to Class 1", sample_value="0.5"),
                                FormulaSymbol(symbol="1 - p", name="Negative Class Proportion (1 - p)", meaning="Fraction of samples belonging to Class 0", sample_value="0.5"),
                                FormulaSymbol(symbol="log₂", name="Base-2 Logarithm", meaning="Measures information content in binary bits", sample_value="log₂(0.5) = -1.0"),
                                FormulaSymbol(symbol="H(S)", name="Shannon Entropy (Bits)", meaning="0.0 bits = pure node; 1.0 bit = maximum 50/50 disorder", sample_value="1.0 bit")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Evaluate class proportions at a 50/50 split", calculation="p = 0.5, (1 - p) = 0.5", result_meaning="Maximum class uncertainty"),
                                FormulaStep(step_number=2, title="Compute p · log₂(p)", calculation="0.5 × log₂(0.5) = 0.5 × (-1.0) = -0.5", result_meaning="Each class contributes -0.5"),
                                FormulaStep(step_number=3, title="Negate the sum", calculation="H(S) = - [ -0.5 + (-0.5) ] = 1.0 bit", result_meaning="Entropy = 1.0 bit: Node requires further splitting")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[3].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[3].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: Unpruned trees with 0.0 leaf entropy are optimal. Reality: Overly deep trees memorize noise; constraining max_depth or ensembling is essential."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[3].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-ml-1",
                                question="What is the Shannon Entropy of a binary node where 100% of samples belong to the same class?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-ml1", text="0.0 bits (Zero uncertainty / complete purity)", is_correct=True, explanation="Correct! When all items share one label, entropy is 0.0."),
                                    QuizOption(id="opt-ml2", text="1.0 bit (Maximum entropy)", is_correct=False, explanation="1.0 bit occurs at a 50/50 balanced split.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[3].modules[0].lessons[0].code_exercise,
                        summary="Decision trees and ensemble forests built on Shannon information theory remain the industry standard for structured tabular data.",
                        next_lesson_id="lesson-dl-neural-activations"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-dl",
        title="Track E: Deep Learning & Neural Architectures",
        tagline="For AI Engineers: Non-Linear Activations (ReLU, GELU), Backpropagation, and Gradient Dynamics.",
        description="Master stacked neural representation learning, non-linear activation dynamics, and empirical gradient telemetry on the Fashion-MNIST benchmark.",
        level="Intermediate",
        target_audience="engineer",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-dl-1",
                track_id="track-dl",
                title="Neural Units, Activations & Gradient Flow",
                description="Why non-linearities are mandatory and how ReLU/GELU prevent vanishing gradients.",
                lessons=[
                    Lesson(
                        id="lesson-dl-neural-activations",
                        module_id="mod-dl-1",
                        track_id="track-dl",
                        target_audience="engineer",
                        title="Non-Linear Activations: ReLU, Sigmoid & GELU",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Prove algebraically why stacked linear layers without activations collapse into a single matrix.",
                            "Analyze the vanishing gradient bottleneck in deep Sigmoid networks vs ReLU/GELU.",
                            "Inspect real 10-layer neural network telemetry from Zalando Research's Fashion-MNIST benchmark."
                        ],
                        intuitive_explanation=(
                            "If you stack 100 linear layers h = W₂·(W₁·x), matrix associativity proves that (W₂·W₁) collapses into a single matrix W₃. "
                            "Without non-linear activation functions between layers, a 100-layer network has no more expressive power than a 1-layer linear model! "
                            "Activations like ReLU and GELU bend the feature space at every layer while preserving gradient flow during backpropagation."
                        ),
                        deep_dive_notes=[
                            "1. Linear Collapse: W_L · W_{L-1} ... W_1 · x = W_effective · x.",
                            "2. Sigmoid Vanishing Gradients: Because max(σ'(x)) = 0.25, multiplying gradients across 20 layers scales signals by 0.25²⁰ ≈ 10⁻¹², freezing early layers.",
                            "3. ReLU vs GELU: ReLU has a unit derivative (1.0) for all x > 0, while GELU provides a smooth probabilistic gate used in modern Transformers."
                        ],
                        formal_explanation=(
                            "The Rectified Linear Unit (ReLU) outputs max(0, x). Its derivative is 1.0 for all x > 0, "
                            "preventing exponential gradient attenuation across deep hidden layers."
                        ),
                        formula_guide=FormulaGuide(
                            title="ReLU & Sigmoid Activation Functions",
                            latex_expression="ReLU(x) = max(0, x)   |   σ(x) = 1 / (1 + e⁻ˣ)",
                            plain_english="ReLU(x) = Retain x if x > 0, else 0  |  Sigmoid σ(x) = Squash real inputs into (0, 1)",
                            symbols=[
                                FormulaSymbol(symbol="x", name="Pre-activation Input (z)", meaning="Weighted sum plus bias entering the neuron", sample_value="2.5 (or -3.0)"),
                                FormulaSymbol(symbol="max(0, x)", name="Zero-Threshold Rectifier", meaning="Clips negative values to zero while passing positive values linearly", sample_value="max(0, 2.5) = 2.5"),
                                FormulaSymbol(symbol="σ(x)", name="Sigmoid Function", meaning="S-shaped squashing function bounded in (0, 1)", sample_value="σ(2.5) ≈ 0.924"),
                                FormulaSymbol(symbol="∂ReLU/∂x", name="Backward Pass Derivative", meaning="1.0 when x > 0, preserving gradient magnitude", sample_value="1.0")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Positive input regime (x = 2.5)", calculation="ReLU(2.5) = max(0, 2.5) = 2.5; Derivative = 1.0", result_meaning="Unattenuated forward signal and backward gradient"),
                                FormulaStep(step_number=2, title="Negative input regime (x = -3.0)", calculation="ReLU(-3.0) = max(0, -3.0) = 0.0; Derivative = 0.0", result_meaning="Induces sparse representations"),
                                FormulaStep(step_number=3, title="10-Layer Backpropagation Comparison", calculation="ReLU: 1.0¹⁰ = 1.0  vs  Sigmoid: 0.25¹⁰ ≈ 9.5×10⁻⁷", result_meaning="Explains why ReLU/GELU unlocked deep architectures")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[4].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[4].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: Adding more layers always improves accuracy. Reality: Deep networks require residual skip connections (ResNet) and normalization (LayerNorm) alongside proper activations."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[4].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-dl-1",
                                question="What happens if a neural network has 50 hidden layers but uses NO non-linear activation functions?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-dl1", text="It mathematically collapses into an ordinary single-layer linear transformation.", is_correct=True, explanation="Correct! Matrix multiplications compose into a single linear map."),
                                    QuizOption(id="opt-dl2", text="It learns non-linear boundaries 50x faster.", is_correct=False, explanation="Purely linear layers cannot represent non-linear decision boundaries.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[4].modules[0].lessons[0].code_exercise,
                        summary="Non-linear activation functions give deep neural networks their universal approximation power while preserving backpropagation gradients.",
                        next_lesson_id="lesson-llm-embeddings-vector-search"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-llm",
        title="Track F: LLM & RAG Engineering",
        tagline="For AI Engineers: Semantic Vector Spaces, Cosine Similarity, and Grounded RAG Pipelines.",
        description="Master production Large Language Model retrieval engineering using real benchmark data from Hugging Face MTEB and Microsoft MS MARCO.",
        level="Intermediate",
        target_audience="engineer",
        estimated_hours=10,
        modules=[
            Module(
                id="mod-llm-1",
                track_id="track-llm",
                title="Embeddings, Vector Search & Hallucination-Free RAG",
                description="Map natural language into high-dimensional geometry and build grounded retrieval pipelines.",
                lessons=[
                    Lesson(
                        id="lesson-llm-embeddings-vector-search",
                        module_id="mod-llm-1",
                        track_id="track-llm",
                        target_audience="engineer",
                        title="Semantic Vector Spaces & Cosine Similarity Search",
                        estimated_minutes=25,
                        difficulty="Intermediate",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Understand how embedding models project text into dense vectors in ℝ^d.",
                            "Compute Cosine Similarity and explain its invariance to document length.",
                            "Evaluate real open-source embedding models using Hugging Face MTEB & MS MARCO metrics."
                        ],
                        intuitive_explanation=(
                            "Lexical keyword search fails when synonyms differ: searching for 'mitigating model memorization' misses a paragraph titled 'preventing overfitting'. "
                            "Embedding models map every passage into a geometric vector space where semantically related concepts point in nearly identical directions. "
                            "Cosine Similarity measures the angle between vectors to retrieve the most relevant context for RAG."
                        ),
                        deep_dive_notes=[
                            "1. Cosine Similarity vs Euclidean Distance: Dividing by vector norms (‖u‖·‖v‖) ensures short queries and long documents on the same topic achieve high similarity.",
                            "2. Production Hybrid RAG: Combine dense vector search + sparse BM25 keyword matching + a Cross-Encoder Reranker for optimal NDCG@10.",
                            "3. MTEB Benchmark: The Massive Text Embedding Benchmark evaluates models across retrieval, clustering, and semantic textual similarity."
                        ],
                        formal_explanation=(
                            "Given query vector u and document vector v in ℝ^d, Cosine Similarity equals their dot product (u · v) divided by the product of their L2 norms (‖u‖ · ‖v‖)."
                        ),
                        formula_guide=FormulaGuide(
                            title="Cosine Similarity in Semantic Vector Spaces",
                            latex_expression="CosineSim(u, v) = (u · v) / ( ‖u‖ × ‖v‖ )",
                            plain_english="Cosine Similarity = Dot Product (u · v) divided by [ Euclidean Norm ‖u‖ × Euclidean Norm ‖v‖ ]",
                            symbols=[
                                FormulaSymbol(symbol="u", name="Query Vector (u)", meaning="Dense embedding vector of the user's question", sample_value="[0.80, 0.60]"),
                                FormulaSymbol(symbol="v", name="Document Vector (v)", meaning="Dense embedding vector of a knowledge-base passage", sample_value="[0.60, 0.80]"),
                                FormulaSymbol(symbol="u · v", name="Dot Product", meaning="Sum of element-wise coordinate products", sample_value="0.96"),
                                FormulaSymbol(symbol="‖u‖, ‖v‖", name="Euclidean L2 Norms", meaning="Lengths of vectors u and v used for length normalization", sample_value="1.0, 1.0"),
                                FormulaSymbol(symbol="CosineSim", name="Cosine Similarity Score", meaning="Ranges from -1.0 (opposite) to +1.0 (identical direction)", sample_value="0.96")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Compute Dot Product u · v", calculation="(0.80 × 0.60) + (0.60 × 0.80) = 0.96", result_meaning="Directional alignment numerator"),
                                FormulaStep(step_number=2, title="Compute L2 Norms ‖u‖ and ‖v‖", calculation="‖u‖ = √(0.8² + 0.6²) = 1.0; ‖v‖ = 1.0", result_meaning="Normalizes for passage length"),
                                FormulaStep(step_number=3, title="Divide Dot Product by Norm Product", calculation="CosineSim = 0.96 / (1.0 × 1.0) = 0.96", result_meaning="96% semantic match: Inject passage into LLM prompt!")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[5].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[5].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: Vector databases completely replace relational databases. Reality: Production AI architectures combine vector ANN indices with relational metadata filters and ACID storage."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[5].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-emb-1",
                                question="What value does cosine similarity yield for two vectors pointing in the exact same direction (angle θ = 0°)?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-emb1", text="1.0 (Maximum directional alignment: cos(0°) = 1.0)", is_correct=True, explanation="Correct! cos(0°) = 1.0 regardless of vector magnitude."),
                                    QuizOption(id="opt-emb2", text="0.0 (Orthogonal / unrelated)", is_correct=False, explanation="0.0 indicates perpendicular 90° vectors."),
                                    QuizOption(id="opt-emb3", text="-1.0 (Opposite direction)", is_correct=False, explanation="-1.0 indicates 180° opposite vectors.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[5].modules[0].lessons[0].code_exercise,
                        summary="Vector embeddings and cosine similarity power modern Retrieval-Augmented Generation, grounding LLM outputs in verifiable facts.",
                        next_lesson_id="lesson-mlops-latency-profiling"
                    )
                ]
            )
        ]
    ),
    Track(
        id="track-mlops",
        title="Track G: AI Systems & MLOps",
        tagline="For AI Engineers: P99 Tail Latency, Serving Throughput, and Weight Quantization.",
        description="Bridge models to resilient production infrastructure using real MLPerf Inference v4.1 datacenter telemetry on Llama-3-8B.",
        level="Advanced",
        target_audience="engineer",
        estimated_hours=8,
        modules=[
            Module(
                id="mod-mlops-1",
                track_id="track-mlops",
                title="Production Serving, Tail Latency & Quantization",
                description="Profile P99 SLA tail latencies, memory bandwidth bottlenecks, and INT8/INT4 quantization.",
                lessons=[
                    Lesson(
                        id="lesson-mlops-latency-profiling",
                        module_id="mod-mlops-1",
                        track_id="track-mlops",
                        target_audience="engineer",
                        title="Inference Latency (P99), Throughput & Weight Quantization",
                        estimated_minutes=25,
                        difficulty="Advanced",
                        prerequisites=["lesson-foundations-what-is-ai"],
                        objectives=[
                            "Distinguish between TTFT (Time To First Token) and TPOT (Time Per Output Token).",
                            "Explain why P99 tail latency is used over mean latency for production SLAs.",
                            "Analyze real MLPerf Inference v4.1 serving telemetry across BF16, FP8, and INT4-AWQ."
                        ],
                        intuitive_explanation=(
                            "Average latency hides production failures: if 99 requests take 50ms and 1 request stalls for 10,000ms, the mean is 149ms—masking a 10-second outage for 1% of users! "
                            "Production AI engineers track P99 Tail Latency (the threshold within which 99% of requests complete) and use weight quantization (FP16 → INT4) to alleviate GPU memory-bandwidth bottlenecks."
                        ),
                        deep_dive_notes=[
                            "1. Memory-Bandwidth Bottleneck: Autoregressive token generation requires reading billions of weights from GPU HBM for every token. INT4 quantization cuts memory traffic by 4x.",
                            "2. TTFT vs TPOT: TTFT measures prompt prefill latency (compute-bound); TPOT measures per-token decode speed (memory-bandwidth bound).",
                            "3. PagedAttention (vLLM): Eliminates KV-cache memory fragmentation, boosting concurrent batch throughput by 2–4x."
                        ],
                        formal_explanation=(
                            "Given N sorted request latencies, the P99 percentile latency is the value at index ⌊0.99 × N⌋, defining the worst-case SLA boundary for 99% of traffic."
                        ),
                        formula_guide=FormulaGuide(
                            title="P99 Tail Latency & Quantized VRAM Footprint",
                            latex_expression="P99 = Latency_{sorted}[ ⌊0.99 × N⌋ ]   |   VRAM_{GB} ≈ (Params × Bits) / (8 × 10⁹)",
                            plain_english="P99 Latency = Value at the 99th percentile index of sorted latencies  |  VRAM = (Parameters × Bit-width) / 8 Billion",
                            symbols=[
                                FormulaSymbol(symbol="N", name="Total Sampled Requests (N)", meaning="Number of inference requests recorded in the monitoring window", sample_value="100 requests"),
                                FormulaSymbol(symbol="⌊0.99 × N⌋", name="99th Percentile Index", meaning="Array index isolating the slowest 1% tail requests", sample_value="Index 99"),
                                FormulaSymbol(symbol="P99", name="P99 Tail Latency (ms)", meaning="Maximum response time experienced by 99% of users", sample_value="120 ms"),
                                FormulaSymbol(symbol="Bits", name="Quantization Bit-Width", meaning="16-bit (BF16), 8-bit (FP8/INT8), or 4-bit (INT4 AWQ)", sample_value="4 bits")
                            ],
                            steps=[
                                FormulaStep(step_number=1, title="Sort request latencies ascending", calculation="[45, 47, 48, 49, 51, 52, 55, 60, 120, 500] (ms)", result_meaning="Places extreme tail outliers at the end"),
                                FormulaStep(step_number=2, title="Locate percentile index", calculation="For P90 on 10 items: index 8 ⇒ 120 ms", result_meaning="Captures tail behavior without mean distortion"),
                                FormulaStep(step_number=3, title="Calculate VRAM savings on an 8B model", calculation="BF16: 16 GB  →  INT4: 4 GB VRAM", result_meaning="75% memory reduction and ~2.7x higher token throughput!")
                            ]
                        ),
                        real_dataset=CURRICULUM_TRACKS_VI[6].modules[0].lessons[0].real_dataset,
                        worked_example_code=CURRICULUM_TRACKS_VI[6].modules[0].lessons[0].worked_example_code,
                        common_misconceptions=[
                            "Misconception: More GPU compute FLOPs always speed up single-user LLM token generation. Reality: Small-batch token decoding is strictly memory-bandwidth bound."
                        ],
                        interactive_widget=CURRICULUM_TRACKS_VI[6].modules[0].lessons[0].interactive_widget,
                        quiz=[
                            QuizQuestion(
                                id="q-mlops-1",
                                question="Why is P99 latency preferred over average (mean) latency when evaluating production AI endpoints?",
                                type="single_choice",
                                options=[
                                    QuizOption(id="opt-m1", text="Because average latency obscures severe tail latency spikes and SLA violations experienced by users.", is_correct=True, explanation="Correct! Percentiles reveal true worst-case user experience."),
                                    QuizOption(id="opt-m2", text="Because P99 is always lower than the mean.", is_correct=False, explanation="P99 is higher than the mean in right-skewed latency distributions.")
                                ]
                            )
                        ],
                        code_exercise=CURRICULUM_TRACKS_VI[6].modules[0].lessons[0].code_exercise,
                        summary="MLOps transitions machine learning from prototype to resilient production infrastructure via tail-latency profiling and quantization.",
                        next_lesson_id="lesson-research-ablation-and-reproducibility"
                    )
                ]
            )
        ]
    )
]

from app.services.curriculum_governance import (
    EXTRA_TRACKS_VI,
    EXTRA_TRACKS_EN,
    enrich_all_tracks_with_provenance
)

CURRICULUM_TRACKS_VI = enrich_all_tracks_with_provenance(CURRICULUM_TRACKS_VI, EXTRA_TRACKS_VI, "vi")
CURRICULUM_TRACKS_EN = enrich_all_tracks_with_provenance(CURRICULUM_TRACKS_EN, EXTRA_TRACKS_EN, "en")

# Default alias for backward compatibility with existing tests
CURRICULUM_TRACKS: list[Track] = CURRICULUM_TRACKS_VI


# ==============================================================================
# BILINGUAL DIAGNOSTIC ASSESSMENT BANK (VI & EN)
# ==============================================================================

DIAGNOSTIC_QUESTIONS_VI: list[QuizQuestion] = [
    QuizQuestion(
        id="diag-1",
        question="Mô hình học máy nào học bằng cách cho tác tử (Agent) tương tác với môi trường và tối ưu hóa tín hiệu Phần thưởng (Reward)?",
        type="single_choice",
        options=[
            QuizOption(id="d1-a", text="Học có giám sát (Supervised Learning)", is_correct=False, explanation="Sử dụng các cặp dữ liệu đầu vào - nhãn có sẵn."),
            QuizOption(id="d1-b", text="Học không giám sát (Unsupervised Learning)", is_correct=False, explanation="Tự phân cụm dữ liệu không có nhãn."),
            QuizOption(id="d1-c", text="Học tăng cường (Reinforcement Learning)", is_correct=True, explanation="Chính xác! Tác tử học chính sách tối ưu thông qua phần thưởng và hình phạt từ môi trường.")
        ]
    ),
    QuizQuestion(
        id="diag-2",
        question="Trong Python, lợi thế cốt lõi nhất của phép toán mảng Vector hóa (NumPy / PyTorch) so với vòng lặp `for` thuần là gì?",
        type="single_choice",
        options=[
            QuizOption(id="d2-a", text="Lưu trữ trên vùng nhớ liên tục (Contiguous Memory) và xử lý song song bằng tập lệnh phần cứng SIMD ở tầng C/C++.", is_correct=True, explanation="Chính xác! Loại bỏ hoàn toàn chi phí kiểm tra kiểu động của trình thông dịch Python."),
            QuizOption(id="d2-b", text="Tự động chuyển mã Python sang HTML.", is_correct=False, explanation="Sai.")
        ]
    ),
    QuizQuestion(
        id="diag-3",
        question="Vector đạo hàm riêng (Gradient ∇L(w)) tại một điểm w cho biết điều gì?",
        type="single_choice",
        options=[
            QuizOption(id="d3-a", text="Vị trí cực tiểu toàn cục của hàm số.", is_correct=False, explanation="Gradient là độ dốc cục bộ tại điểm đang xét."),
            QuizOption(id="d3-b", text="Hướng làm hàm mất mát L(w) tăng lên nhanh nhất (dốc lên); do đó ta bước ngược hướng Gradient để giảm sai số.", is_correct=True, explanation="Chính xác!")
        ]
    ),
    QuizQuestion(
        id="diag-4",
        question="Tại sao kiến trúc Truy xuất Tăng cường Sinh văn bản (RAG) được sử dụng rộng rãi trong các hệ thống LLM doanh nghiệp?",
        type="single_choice",
        options=[
            QuizOption(id="d4-a", text="Để truy xuất các đoạn tài liệu xác thực bên ngoài đưa vào ngữ cảnh Prompt, giúp giảm thiểu ảo giác (Hallucination) và có trích dẫn rõ ràng.", is_correct=True, explanation="Chính xác!"),
            QuizOption(id="d4-b", text="Để mô hình không cần sử dụng bộ nhớ GPU.", is_correct=False, explanation="Sai.")
        ]
    )
]

DIAGNOSTIC_QUESTIONS_EN: list[QuizQuestion] = [
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
        question="What does the gradient vector ∇L(w) represent at a point w?",
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

DIAGNOSTIC_QUESTIONS: list[QuizQuestion] = DIAGNOSTIC_QUESTIONS_VI


def get_tracks_by_lang(lang: str = "vi") -> list[Track]:
    return CURRICULUM_TRACKS_EN if lang.lower().startswith("en") else CURRICULUM_TRACKS_VI


def get_lesson_by_lang(lesson_id: str, lang: str = "vi") -> Lesson | None:
    tracks = get_tracks_by_lang(lang)
    for track in tracks:
        for mod in track.modules:
            for lsn in mod.lessons:
                if lsn.id == lesson_id:
                    return lsn
    return None


def get_diagnostic_questions_by_lang(lang: str = "vi") -> list[QuizQuestion]:
    return DIAGNOSTIC_QUESTIONS_EN if lang.lower().startswith("en") else DIAGNOSTIC_QUESTIONS_VI


def evaluate_lesson_quiz(lesson_id: str, submissions: dict[str, str], lang: str = "vi") -> QuizResult:
    target_lesson = get_lesson_by_lang(lesson_id, lang)
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


def evaluate_diagnostic_assessment(answers: dict[str, str], lang: str = "vi") -> DiagnosticResult:
    is_en = lang.lower().startswith("en")
    questions = get_diagnostic_questions_by_lang(lang)
    correct_count = 0
    for q in questions:
        chosen_id = answers.get(q.id)
        chosen_opt = next((o for o in q.options if o.id == chosen_id), None)
        if chosen_opt and chosen_opt.is_correct:
            correct_count += 1

    total = len(questions)
    pct = round((correct_count / total) * 100, 1)

    if pct >= 75.0:
        recommended_track = "track-llm"
        recommended_persona = "engineer"
        track_title = "Track F: LLM & RAG Engineering" if is_en else "Lộ trình F: Kỹ thuật LLM & Hệ thống RAG (Dành cho Kỹ sư)"
        analysis = (
            "Strong foundational mastery in ML and optimization demonstrated! We have calibrated your path to the Applied AI Engineer track (Deep Learning, LLM/RAG, and MLOps)."
            if is_en else
            "Xuất sắc! Bạn đã nắm vững nền tảng Học máy và Tối ưu hóa. Hệ thống đề xuất bạn vào thẳng Nhánh Kỹ sư AI Thực chiến (Deep Learning, LLM/RAG và MLOps)."
        )
        starting_lesson = "lesson-llm-embeddings-vector-search"
    elif pct >= 50.0:
        recommended_track = "track-math"
        recommended_persona = "beginner"
        track_title = "Track C: Mathematics for AI" if is_en else "Lộ trình C: Toán học Trực quan cho AI"
        analysis = (
            "Good conceptual intuition! We recommend reinforcing calculus, gradients, and optimization mechanics before moving into deep neural networks."
            if is_en else
            "Bạn đã có trực giác cơ bản tốt! Hệ thống gợi ý bạn bắt đầu từ Lộ trình C (Toán học Trực quan & Gradient Descent) để nắm chắc cơ chế tối ưu hóa trước khi lên nhánh Kỹ sư."
        )
        starting_lesson = "lesson-math-gradient-descent"
    else:
        recommended_track = "track-foundations"
        recommended_persona = "beginner"
        track_title = "Track A: AI Foundations" if is_en else "Lộ trình A: Nền tảng Trí tuệ Nhân tạo (Cho Người mới)"
        analysis = (
            "Welcome to AI! We recommend starting with Track A (AI Foundations) to build a rock-solid mental model from zero with visual interactive simulations."
            if is_en else
            "Chào mừng bạn đến với AI! Hệ thống gợi ý bạn bắt đầu từ Lộ trình A (Nền tảng AI cho Người mới bắt đầu) để xây dựng tư duy gốc từ số 0 qua các mô phỏng trực quan."
        )
        starting_lesson = "lesson-foundations-what-is-ai"

    return DiagnosticResult(
        score_percentage=pct,
        recommended_track_id=recommended_track,
        recommended_persona=recommended_persona,
        track_title=track_title,
        analysis=analysis,
        suggested_starting_lesson_id=starting_lesson
    )
