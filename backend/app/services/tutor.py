import re
from sqlalchemy.orm import Session
from app.models.entities import NewsArticle
from app.schemas.tutor import TutorQueryRequest, TutorQueryResponse, CitationItem
from app.services.curriculum import CURRICULUM_TRACKS

def retrieve_relevant_contexts(query: str, db: Session, limit: int = 3) -> list[CitationItem]:
    terms = set(re.findall(r"\w+", query.lower()))
    scored_items: list[tuple[float, CitationItem]] = []

    # 1. Search Curriculum Lessons
    for track in CURRICULUM_TRACKS:
        for mod in track.modules:
            for lsn in mod.lessons:
                haystack = f"{lsn.title} {' '.join(lsn.objectives)} {lsn.intuitive_explanation}".lower()
                matches = sum(1 for t in terms if t in haystack)
                if matches > 0:
                    score = matches * 2.0
                    citation = CitationItem(
                        id=lsn.id,
                        type="lesson",
                        title=lsn.title,
                        url_or_ref=f"/learn/{lsn.id}",
                        excerpt=lsn.objectives[0] if lsn.objectives else lsn.intuitive_explanation[:150]
                    )
                    scored_items.append((score, citation))

    # 2. Search News Articles
    articles = db.query(NewsArticle).all()
    for art in articles:
        haystack = f"{art.title} {art.summary_what} {art.category}".lower()
        matches = sum(1 for t in terms if t in haystack)
        if matches > 0:
            score = matches * 1.5
            citation = CitationItem(
                id=art.id,
                type="news",
                title=art.title,
                url_or_ref=art.canonical_url,
                excerpt=art.summary_what[:150]
            )
            scored_items.append((score, citation))

    # Sort descending by relevance score
    scored_items.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored_items[:limit]]

def generate_grounded_tutor_response(req: TutorQueryRequest, db: Session) -> TutorQueryResponse:
    citations = retrieve_relevant_contexts(req.query, db, limit=3)

    is_engineer = req.mode == "engineer"
    query_lower = req.query.lower()
    
    # Detect Vietnamese language
    is_vietnamese = bool(re.search(r"[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]", query_lower)) or any(
        kw in query_lower for kw in ["la gi", "nhu the nao", "giai thich", "hoc may", "tri tue nhan tao", "mo hinh", "tai sao", "lam sao"]
    )

    if citations:
        primary = citations[0]
        if is_vietnamese:
            if is_engineer:
                answer = (
                    f"### Phân tích Kỹ thuật: {primary.title}\n\n"
                    f"Dựa trên tài liệu hệ thống ([{primary.type.capitalize()}: {primary.id}]({primary.url_or_ref})):\n\n"
                    f"**Cơ chế & Kiến trúc trọng tâm:**\n{primary.excerpt}\n\n"
                    f"**Lưu ý khi triển khai sản phẩm (Production):**\n"
                    f"- Kiểm tra giới hạn tài nguyên tính toán và độ trễ (latency profiling).\n"
                    f"- Đảm bảo tính ổn định số học (numerical stability) với độ chính xác FP16/BF16.\n\n"
                    f"**Hành động đề xuất:** Khởi chạy tập lệnh trong Engineer Workspace hoặc kiểm tra phân phối tham số."
                )
                actions = [
                    f"Mở tài liệu: {primary.title}",
                    "Chạy thử nghiệm trong Engineer Workspace",
                    "Đo đạc độ trễ inference P99"
                ]
            else:
                answer = (
                    f"### Giải đáp cùng CHINAI Tutor!\n\n"
                    f"Một tài liệu tuyệt vời để bạn nắm vững khái niệm này là bài học: **{primary.title}** ([Xem bài học]({primary.url_or_ref})).\n\n"
                    f"**Ý niệm Trực quan (Intuitive Concept):**\n{primary.excerpt}\n\n"
                    f"**Tại sao điều này quan trọng?**\n"
                    f"Hiểu được khối xây dựng nền tảng này sẽ giúp bạn thấy cách các hệ thống AI đưa ra dự đoán và học hỏi từ dữ liệu mà không bị bối rối bởi các công thức phức tạp.\n\n"
                    f"**Bước tiếp theo:** Hãy thử tương tác với mô hình mô phỏng trực quan 2D trong bài học để cảm nhận bản chất!"
                )
                actions = [
                    f"Khám phá bài học: {primary.title}",
                    "Thực hành với mô phỏng tương tác",
                    "Làm bài kiểm tra kiến thức (Quiz)"
                ]
        else:
            if is_engineer:
                answer = (
                    f"### Engineering Analysis: {primary.title}\n\n"
                    f"Based on platform records ([{primary.type.capitalize()}: {primary.id}]({primary.url_or_ref})):\n\n"
                    f"**Key Mechanism / Architecture:**\n{primary.excerpt}\n\n"
                    f"**Implementation Consideration:**\n"
                    f"When implementing this in production, verify resource constraints, batching latency, and numerical precision (FP16/BF16).\n\n"
                    f"**Recommended Action:** Inspect related models in the Engineer Workspace or execute benchmark assertions."
                )
                actions = [
                    f"Open related reference: {primary.title}",
                    "Run test script in Engineer Workspace",
                    "Inspect parameter distributions"
                ]
            else:
                answer = (
                    f"### Let's Break Down Your Question!\n\n"
                    f"A great place to understand this is **{primary.title}** ([Lesson Link]({primary.url_or_ref})).\n\n"
                    f"**Intuitive Concept:**\n{primary.excerpt}\n\n"
                    f"**Why This Matters:**\n"
                    f"Understanding this core building block will help you see how AI models make predictions without getting lost in complicated math.\n\n"
                    f"**Suggested Next Step:** Jump into the interactive visual widget on this lesson to see it in action!"
                )
                actions = [
                    f"Start lesson: {primary.title}",
                    "Try the interactive simulation",
                    "Take the 2-minute knowledge check"
                ]
        confidence = "High"
    else:
        # Fallback when query is general or unindexed
        if is_vietnamese:
            if is_engineer:
                answer = (
                    f"### Đánh giá Kỹ thuật\n\n"
                    f"Về câu hỏi `{req.query}`: Hiện chưa tìm thấy tài liệu cục bộ hoặc bài báo tương thích chính xác 100%.\n\n"
                    f"**Gợi ý kỹ thuật:** Bạn có thể tham khảo **Track F: LLM Engineering** hoặc cập nhật các bài báo arXiv mới nhất từ **Radar Tin tức AI**."
                )
                actions = ["Thu thập bài báo arXiv mới qua News Radar", "Khám phá Track F: LLM Engineering"]
            else:
                answer = (
                    f"### Xin chào bạn học viên!\n\n"
                    f"Bạn vừa hỏi: *\"{req.query}\"*\n\n"
                    f"Để xây dựng nền tảng vững chắc, bạn nên bắt đầu từ **Track A: Nền tảng AI** để làm quen với Machine Learning, hoặc làm **Bài Đánh giá Năng lực (Diagnostic)** để nhận lộ trình cá nhân hóa."
                )
                actions = ["Làm bài Đánh giá Diagnostic", "Khám phá Track A: Nền tảng AI"]
        else:
            if is_engineer:
                answer = (
                    f"### Technical Assessment\n\n"
                    f"Regarding `{req.query}`: No direct local lesson or verified research paper matches were retrieved with high confidence.\n\n"
                    f"**Guidance:** Check the API docs, review Track D/F for ML foundations and LLM architectures, or ingest fresh arXiv papers using the AI News Radar."
                )
                actions = ["Ingest latest arXiv papers via News Radar", "Explore Track F: LLM Engineering"]
            else:
                answer = (
                    f"### Hello Learner!\n\n"
                    f"You asked: *\"{req.query}\"*\n\n"
                    f"To build solid understanding, we recommend starting with **Track A: AI Foundations** to master supervised learning and model generalization, or take the **Diagnostic Assessment** to get a tailored path."
                )
                actions = ["Take Diagnostic Placement", "Explore Track A: AI Foundations"]
        confidence = "Moderate"

    return TutorQueryResponse(
        answer=answer,
        citations=citations,
        suggested_actions=actions,
        confidence_level=confidence,
        has_unverified_claims=False
    )
