# CHINAI AI Learning OS — Content Authoring Guide & Quality Rubric

## 1. Pedagogical Design Standards (16-Section Standard)

Every lesson authored in CHINAI AI Learning OS must strictly adhere to the 16-section pedagogical architecture:

1. **Title, Estimated Minutes & Difficulty Level**:
   - Explicit target audience: `beginner` or `engineer`.
   - Clear cognitive pacing (15–35 minutes).
2. **Prerequisites & Prerequisite DAG Node**:
   - Explicit previous lesson IDs; zero circular dependencies permitted.
3. **Actionable Objectives (Bloom's Taxonomy)**:
   - At least 3 measurable objectives starting with action verbs (Calculate, Implement, Evaluate, Distinguish).
4. **Why This Matters (Industrial & Real-world Relevance)**:
   - Explains the economic, security, or computational rationale behind the concept.
5. **Intuitive Explanation (First Principles Analogy)**:
   - Grounded in everyday mental models before formal math or code is shown.
6. **Deep-Dive Technical Notes**:
   - Nuances, edge cases, algorithmic trade-offs, and historical context.
7. **Formal Mathematical Explanation**:
   - Rigorous mathematical definition with explicit domain sets ($\mathbb{R}^d, \theta \in \Theta$).
8. **4-Column Formula Guide (`FormulaGuide`)**:
   - `title`, `latex_expression`, `plain_english`.
   - `symbols`: List of symbols with name, mathematical meaning, and concrete sample numerical value.
   - `steps`: Step-by-step arithmetic walkthrough demonstrating how numbers flow into output.
9. **Verified Real Dataset Reference (`LessonDataset`)**:
   - Name, authoritative organization, canonical URL, permissive license (CC BY 4.0, Apache-2.0, MIT).
   - Column schema and representative sample rows.
10. **Worked Example Code (`worked_example_code`)**:
    - Clean, production-ready, typed Python 3.13 code using official libraries (`numpy`, `scipy`, `sklearn`).
11. **Empirical Output Analysis (`output_analysis`)**:
    - Detailed numerical interpretation of the worked code's terminal output.
12. **Common Misconceptions (`common_misconceptions`)**:
    - At least 2 common developer traps or myths deconstructed.
13. **Practical Production Trade-offs (`when_to_use_and_not_use`)**:
    - Explicit list of conditions when to apply this technique vs. when simpler or different methods are superior.
14. **Guided Practice & Embedded Monaco IDE Lab (`code_exercise`)**:
    - `instructions`, `starter_code`, `solution_code`, and automated `test_assertions_code`.
    - Must execute within 5 seconds under AST static syntax guarding.
15. **Active Recall & Spaced Repetition Flashcards (`flashcards`)**:
    - At least 3 Q&A flashcards reinforcing foundational concepts and edge cases.
16. **Deterministic Knowledge Check Quiz & Mastery Criteria (`quiz`, `mastery_criteria`, `source_references`)**:
    - Deterministic multiple-choice questions with plausible distractors and explanation.
    - Verified academic papers, official documentation, or university course citations.

---

## 2. The 13-Criterion Content Quality Rubric

Every proposed lesson must score $\ge 8.5/10.0$ and pass all 3 Hard Blocking Gates:

```
+-------------------------------------------------------------------------+
|                  13-CRITERION CHINAI CONTENT RUBRIC                     |
+-------------------------------------------------------------------------+
| 1. Scientific & Mathematical Accuracy (weight: 1.5)                    |
| 2. Cognitive Pacing & Chunking (weight: 1.0)                            |
| 3. Concrete Numerical Example Walkthrough (weight: 1.0)                 |
| 4. Verified Real Dataset Provenance (weight: 1.0)                       |
| 5. Production Code Quality & Python 3.13 Typing (weight: 1.0)          |
| 6. Test Assertion Verification in Sandbox (weight: 1.0)                 |
| 7. Common Misconceptions Addressed (weight: 0.5)                        |
| 8. When to Use & When NOT to Use Trade-offs (weight: 0.5)              |
| 9. Socratic Active Recall Flashcards (weight: 0.5)                      |
| 10. Deterministic Knowledge Check Quality (weight: 1.0)                 |
| 11. Authoritative OER & Academic Citations (weight: 0.5)                |
| 12. Bilingual Conceptual Parity (VI/EN) (weight: 0.5)                   |
| 13. Capstone Spec & Error Analysis Rigor (weight: 0.5)                  |
+-------------------------------------------------------------------------+
| HARD BLOCKING GATES (Immediate 0 score & BLOCKED status if failed):     |
| [Gate 1] AST Security Check (no subprocess, eval, os.system, socket)    |
| [Gate 2] License Hygiene (no unverified commercial or restricted data)  |
| [Gate 3] Deterministic Quiz Correctness (every Q has exactly 1 correct) |
+-------------------------------------------------------------------------+
```
