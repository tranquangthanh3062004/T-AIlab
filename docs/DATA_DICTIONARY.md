# CHINAI AI Learning OS — Data Dictionary & Entity Catalog

## 1. Core Schema Entities

### 1.1 `Track`
Represents an overarching curriculum pathway containing cohesive learning modules.
- `id` (`string`): Unique slug identifier (e.g., `track-foundations`, `track-llm`).
- `track_number` (`integer`): 0-indexed sequence ordering from `0` to `14`.
- `title` (`string`): Human-readable pathway name (localized).
- `tagline` (`string`): Concise 1-sentence value proposition.
- `description` (`string`): Pedagogical scope, industry relevance, and methodology.
- `level` (`string`): Difficulty tier (`Beginner`, `Intermediate`, `Advanced`, `Research/Expert`).
- `target_audience` (`string`): Primary persona (`beginner` or `engineer`).
- `specialization_branch` (`string`): Functional cluster:
  - `BEGINNER_CORE`
  - `APPLIED_ENGINEER`
  - `SYSTEMS_MLOPS`
  - `RESEARCH_SPECIALIST` / `SPECIALIZATION_RESEARCH`
  - `CAPSTONE` / `CAPSTONE_PORTFOLIO`
- `prerequisites` (`list[string]`): IDs of mandatory prerequisite tracks.
- `learning_outcomes` (`list[string]`): Concrete competencies acquired.
- `completion_criteria` (`string`): Verifiable criteria for track certification.
- `estimated_hours` (`integer`): Estimated total learning time.
- `modules` (`list[Module]`): Ordered sequence of modules.

---

### 1.2 `Module`
Represents a sub-unit of a track grouping related lessons.
- `id` (`string`): Module slug identifier (e.g., `mod-foundations-1`).
- `track_id` (`string`): Parent track identifier.
- `title` (`string`): Module title.
- `description` (`string`): Module overview.
- `lessons` (`list[Lesson]`): Ordered list of lessons.

---

### 1.3 `Lesson`
The core educational unit conforming to the 16-section standard:
- `id` (`string`): Globally unique lesson identifier.
- `module_id` (`string`): Parent module identifier.
- `track_id` (`string`): Parent track identifier.
- `title` (`string`): Lesson title.
- `target_audience` (`string`): `beginner` or `engineer`.
- `estimated_minutes` (`integer`): Paced duration (15–35 min).
- `difficulty` (`string`): `Beginner`, `Intermediate`, `Advanced`, `Research/Expert`.
- `prerequisites` (`list[string]`): IDs of prerequisite lessons.
- `objectives` (`list[string]`): Bloom's taxonomy measurable goals.
- `why_this_matters` (`string`): Real-world engineering context.
- `intuitive_explanation` (`string`): First principles analogy.
- `deep_dive_notes` (`list[string]`): Architectural trade-offs & edge cases.
- `formal_explanation` (`string`): Mathematical formulation.
- `formula_guide` (`FormulaGuide | null`): 4-column formula deconstruction.
- `real_dataset` (`LessonDataset | null`): Grounded open-source benchmark dataset.
- `worked_example_code` (`string | null`): Clean, production Python 3.13 implementation.
- `output_analysis` (`string`): Empirical analysis of code outputs.
- `common_misconceptions` (`list[string]`): Traps and counter-intuitions.
- `when_to_use_and_not_use` (`list[string]`): Production trade-offs.
- `guided_practice` (`list[string]`): Step-by-step walkthrough.
- `code_exercise` (`CodeExercise | null`): Sandbox practice exercise with unit assertions.
- `capstone_spec` (`CapstoneProjectSpec | null`): Capstone deliverable specification.
- `flashcards` (`list[FlashcardItem]`): Spaced repetition active recall cards.
- `quiz` (`list[QuizQuestion]`): Deterministic knowledge check.
- `mastery_criteria` (`list[string]`): Verifiable threshold definitions.
- `source_references` (`list[SourceReference]`): Verified citations.
- `content_version` (`string`): Semantic version (e.g., `2.3.0`).
- `review_status` (`string`): `PUBLISHED` / `BLOCKED`.
- `last_verified_date` (`string`): ISO date string.
- `license_provenance` (`string`): License statement (CC BY 4.0 / Open Data).
- `summary` (`string`): Key takeaway.
- `next_lesson_id` (`string | null`): Recommended next lesson.

---

### 1.4 `VerifiedResourceItem` (OER Registry)
Catalog of verified open educational resources:
- `id` (`string`): Slug identifier (e.g., `google-ml-crash-course`).
- `title` (`string`): Resource title.
- `organization` (`string`): Publishing institution (Google, Stanford, MIT, Hugging Face).
- `canonical_url` (`string`): HTTPS URL.
- `resource_type` (`string`): `PRIMARY_DOC`, `UNIVERSITY_COURSE`, `OPEN_BOOK`, `PEER_REVIEWED_PAPER`, `GITHUB_REPO`.
- `spdx_license` (`string`): SPDX identifier (e.g., `CC-BY-4.0`, `Apache-2.0`, `MIT`).
- `access_model` (`string`): `FREE_OPEN` (100% accessible) or `FREEMIUM_AUDIT` (Free course audit).
- `recommended_for_tracks` (`list[string]`): Relevant track IDs.
- `citation_text` (`string`): Formal academic citation string.
