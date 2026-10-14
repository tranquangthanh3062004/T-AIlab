import re
from sqlalchemy.orm import Session
from app.models.entities import NewsArticle
from app.schemas.tutor import TutorQueryRequest, TutorQueryResponse, CitationItem
from app.services.curriculum import get_tracks, get_lesson_by_lang
from app.services.curriculum_governance import VERIFIED_OER_REGISTRY


def retrieve_relevant_contexts(query: str, db: Session, lang: str = "vi", limit: int = 3) -> list[CitationItem]:
    terms = set(re.findall(r"\w+", query.lower()))
    scored_items: list[tuple[float, CitationItem]] = []
    seen_ids: set[str] = set()

    # 1. Search all 15 Curriculum Tracks across both active language and English fallback
    for search_lang in ([lang, "en"] if lang == "vi" else ["en", "vi"]):
        for track in get_tracks(search_lang):
            for mod in track.modules:
                for lsn in mod.lessons:
                    if lsn.id in seen_ids:
                        continue
                    fg_text = f"{lsn.formula_guide.title} {lsn.formula_guide.latex_expression} {lsn.formula_guide.plain_english}" if lsn.formula_guide else ""
                    ds_text = lsn.real_dataset.name if lsn.real_dataset else ""
                    haystack = f"{lsn.id} {lsn.title} {' '.join(lsn.objectives)} {lsn.intuitive_explanation} {fg_text} {ds_text}".lower()
                    matches = sum(1 for t in terms if len(t) >= 2 and t in haystack)
                    if matches > 0:
                        score = matches * 2.5
                        seen_ids.add(lsn.id)
                        display_lsn = get_lesson_by_lang(lsn.id, lang) or lsn
                        citation = CitationItem(
                            id=display_lsn.id,
                            type="lesson",
                            title=display_lsn.title,
                            url_or_ref=f"/learn/{display_lsn.id}",
                            excerpt=display_lsn.intuitive_explanation[:220]
                        )
                        scored_items.append((score, citation))

    # 2. Search Verified OER Registry (21 authoritative sources)
    for res in VERIFIED_OER_REGISTRY:
        haystack = f"{res.id} {res.title} {res.organization} {' '.join(res.mapped_tracks)}".lower()
        matches = sum(1 for t in terms if len(t) >= 2 and t in haystack)
        if matches > 0:
            score = matches * 1.8
            citation = CitationItem(
                id=res.id,
                type="oer",
                title=f"{res.title} ({res.organization})",
                url_or_ref=res.canonical_url,
                excerpt=f"License: {res.spdx_license} | Access: {res.access_model} | {res.attribution_requirements}"
            )
            scored_items.append((score, citation))

    # 3. Search News Articles
    articles = db.query(NewsArticle).all()
    for art in articles:
        haystack = f"{art.title} {art.summary_what} {art.category}".lower()
        matches = sum(1 for t in terms if len(t) >= 2 and t in haystack)
        if matches > 0:
            score = matches * 1.5
            citation = CitationItem(
                id=art.id,
                type="news",
                title=art.title,
                url_or_ref=art.canonical_url,
                excerpt=art.summary_what[:160]
            )
            scored_items.append((score, citation))

    scored_items.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored_items[:limit]]


def generate_grounded_tutor_response(req: TutorQueryRequest, db: Session) -> TutorQueryResponse:
    query_lower = req.query.lower()
    is_vietnamese = bool(re.search(r"[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]", query_lower)) or any(
        kw in query_lower for kw in ["la gi", "nhu the nao", "giai thich", "hoc may", "tri tue nhan tao", "mo hinh", "tai sao", "lam sao"]
    )
    lang = "vi" if is_vietnamese else "en"

    citations = retrieve_relevant_contexts(req.query, db, lang=lang, limit=3)
    is_engineer = req.mode == "engineer"

    if citations:
        primary = citations[0]
        matched_lesson = get_lesson_by_lang(primary.id, lang) if primary.type == "lesson" else None
        formula_line = ""
        socratic_prompt = ""
        tradeoff_line = ""

        if matched_lesson:
            if matched_lesson.formula_guide:
                formula_line = f"`{matched_lesson.formula_guide.latex_expression}` — *{matched_lesson.formula_guide.plain_english}*"
            if matched_lesson.flashcards:
                fc = matched_lesson.flashcards[0]
                socratic_prompt = fc.question
            if matched_lesson.when_to_use_and_not_use:
                tradeoff_line = matched_lesson.when_to_use_and_not_use[0]

        if is_vietnamese:
            if is_engineer:
                answer = (
                    f"### Phân tích Kỹ thuật Có dẫn nguồn: {primary.title}\n\n"
                    f"Dựa trên kho tri thức đã kiểm định ([{primary.type.upper()}: {primary.id}]({primary.url_or_ref})):\n\n"
                    f"**1. Cơ chế & Trực quan Kỹ thuật:**\n{primary.excerpt}\n\n"
                    + (f"**2. Công thức Toán học Chuẩn:**\n{formula_line}\n\n" if formula_line else "")
                    + (f"**3. Khi nào nên áp dụng (Production Trade-off):**\n- {tradeoff_line}\n\n" if tradeoff_line else "")
                    + (f"**4. Câu hỏi gợi mở Socratic (Active Recall):**\n> 💡 *{socratic_prompt}*\n" if socratic_prompt else "")
                )
                actions = [
                    f"Mở bài học: {primary.title}",
                    "Chạy kiểm thử AST trong Python Sandbox",
                    "Đối chiếu bộ dữ liệu chuẩn trong bài"
                ]
            else:
                answer = (
                    f"### Giải đáp Sư phạm cùng T Lab AI Tutor: {primary.title}\n\n"
                    f"Tài liệu phù hợp nhất cho câu hỏi của bạn nằm ở bài: **{primary.title}** ([Xem bài học]({primary.url_or_ref})).\n\n"
                    f"**1. Giải thích Dễ hiểu (Intuition):**\n{primary.excerpt}\n\n"
                    + (f"**2. Công thức Diễn giải bằng Lời:**\n{formula_line}\n\n" if formula_line else "")
                    + (f"**3. Câu hỏi Tự kiểm tra Nhanh (Socratic Check):**\n> 💡 *{socratic_prompt}*\n" if socratic_prompt else "")
                )
                actions = [
                    f"Khám phá bài học: {primary.title}",
                    "Xem bảng giải nghĩa từng ký hiệu Toán học",
                    "Làm bài tập tự chấm điểm trong bài"
                ]
        else:
            if is_engineer:
                answer = (
                    f"### Grounded Engineering Analysis: {primary.title}\n\n"
                    f"Retrieved from verified T Lab AI records ([{primary.type.upper()}: {primary.id}]({primary.url_or_ref})):\n\n"
                    f"**1. Core Mechanism:**\n{primary.excerpt}\n\n"
                    + (f"**2. Mathematical Formulation:**\n{formula_line}\n\n" if formula_line else "")
                    + (f"**3. Practical Engineering Trade-off:**\n- {tradeoff_line}\n\n" if tradeoff_line else "")
                    + (f"**4. Socratic Active Recall Prompt:**\n> 💡 *{socratic_prompt}*\n" if socratic_prompt else "")
                )
                actions = [
                    f"Open reference: {primary.title}",
                    "Run unit assertions in Python Sandbox",
                    "Inspect benchmark dataset rows"
                ]
            else:
                answer = (
                    f"### Let's Break It Down: {primary.title}\n\n"
                    f"The best grounded resource for your question is **{primary.title}** ([Lesson Link]({primary.url_or_ref})).\n\n"
                    f"**1. Intuitive Explanation:**\n{primary.excerpt}\n\n"
                    + (f"**2. Formula in Plain English:**\n{formula_line}\n\n" if formula_line else "")
                    + (f"**3. Socratic Check-for-Understanding:**\n> 💡 *{socratic_prompt}*\n" if socratic_prompt else "")
                )
                actions = [
                    f"Start lesson: {primary.title}",
                    "Review the 4-column Symbol Table",
                    "Take the deterministic Knowledge Check"
                ]
        confidence = "High"
    else:
        if is_vietnamese:
            answer = (
                f"### Hướng dẫn Học tập Có Kiểm chứng (T Lab AI Tutor)\n\n"
                f"Về câu hỏi `{req.query}`: Hiện chưa có đoạn trích khớp từ khóa trực tiếp trong câu truy vấn.\n\n"
                f"**Lộ trình 15 Track của T Lab AI gợi ý cho bạn:**\n"
                f"- **Người mới bắt đầu (Tracks 0–4):** Bắt đầu từ *Track 0: Nền tảng Tư duy AI*, *Track 1: Python Vector hóa*, *Track 2: Toán AI*, *Track 3: Khoa học Dữ liệu (Chống Data Leakage)* và *Track 4: Học máy Cổ điển*.\n"
                f"- **Kỹ sư AI Ứng dụng (Tracks 5–14):** Khám phá *Deep Learning*, *Computer Vision*, *LLM & RAG*, *Generative & Diffusion*, *AI Agents*, *MLOps*, *Responsible AI*, *Nghiên cứu Ablation*, *Chuỗi thời gian EWMA* và *Dự án Capstone*."
            )
            actions = ["Làm bài Đánh giá Diagnostic", "Khám phá 15 Lộ trình Học (Tracks 0–14)"]
        else:
            answer = (
                f"### Grounded Learning Guidance\n\n"
                f"Regarding `{req.query}`: No exact keyword match was found in the local index.\n\n"
                f"**Recommended across T Lab AI's 15 Tracks (Track 0 – Track 14):**\n"
                f"- **Beginner Core (Tracks 0–4):** Start with *Track 0: AI Foundations*, *Track 1: Python Vectorization*, *Track 2: Math for AI*, *Track 3: Data Science & Leakage Prevention*, and *Track 4: Classical ML*.\n"
                f"- **Applied Engineer & Specializations (Tracks 5–14):** Explore *Deep Learning*, *Computer Vision*, *LLM & RAG*, *Generative/Diffusion*, *AI Agents*, *MLOps*, *Responsible AI*, *Research Ablation*, *Time-Series EWMA*, and *Capstone*."
            )
            actions = ["Take Diagnostic Placement", "Browse all 15 Curriculum Tracks"]
        confidence = "Moderate"

    return TutorQueryResponse(
        answer=answer,
        citations=citations,
        suggested_actions=actions,
        confidence_level=confidence,
        has_unverified_claims=False
    )
