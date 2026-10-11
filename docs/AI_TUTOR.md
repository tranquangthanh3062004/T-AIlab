# AI Tutor & Knowledge Retrieval Architecture — AI Learning OS

**Version**: 1.0.0  
**Status**: Active  
**Author**: AI/ML Engineer & Learning Experience Designer

---

## 1. Core Principles
The AI Tutor helps learners bridge conceptual gaps, debug code, and synthesize news developments into actionable learning tasks.
- **Strict Citation Grounding**: The tutor is not allowed to generate unverified external links. Every citation in the response must correspond to an actual internal `lesson_id` or `news_id`.
- **Difficulty Adaptation**: Explanations dynamically adapt based on active mode (Intuitive, analogy-driven explanations for Learn Mode; concise, typed code snippets and algorithmic nuances for Engineer Mode).
- **Prompt Injection Defense**: Clear structural separation of instructions, retrieved platform context, and user questions.

---

## 2. Retrieval Pipeline

```
User Query + Active Mode + Current Lesson / Code Context
                           │
                           ▼
             [ 1. Intent & Context Parser ]
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
[ 2A. Curriculum Corpus Index ]  [ 2B. News Radar Corpus Index ]
  - Lesson titles & objectives     - Recent verified news items
  - Code snippets & quiz rationale - Benchmark claims & caveats
             └─────────────┬─────────────┘
                           ▼
             [ 3. Ranker & Context Formatter ]
   - Top K (k=3) relevant chunks extracted with deterministic IDs
                           │
                           ▼
             [ 4. Grounded Synthesis Prompt ]
   - System instructions: Must cite [Lesson: ID] or [News: ID]
   - Hard injection boundary: Retrieved text enclosed in <context>
                           │
                           ▼
             [ 5. Citation Verification Filter ]
   - Validate that all bracketed references exist in active DB
   - Flag any ungrounded assertions with uncertainty labels
                           │
                           ▼
             [ 6. Final Streamed Response ]
```

---

## 3. Graceful Fallback & Offline Operation
When external LLM API keys are not supplied in the environment (`GEMINI_API_KEY`, etc.), the AI Tutor activates an intelligent rule-based semantic retriever:
- Performs deterministic BM25 / token-overlap keyword matching across lesson objectives and news summaries.
- Synthesizes structured study recommendations, concept definitions, and direct links to the relevant lessons.
- Ensures the platform remains 100% usable without external API dependencies.
