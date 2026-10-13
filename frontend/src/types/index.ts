export type AppMode = 'learn' | 'engineer';
export type AppTheme = 'light' | 'dark';
export type LearnerPersona = 'beginner' | 'engineer';

export interface GoogleAccountItem {
  email: string;
  name: string;
  avatar_url?: string;
  is_primary: boolean;
  linked_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  auth_provider: string;
  connected_google_accounts: GoogleAccountItem[];
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: QuizOption[];
  hint?: string;
}

export interface CodeExercise {
  id: string;
  instructions: string;
  starter_code: string;
  solution_code: string;
  test_assertions_code: string;
}

export interface LessonInteractiveWidget {
  type: 'perceptron' | 'gradient_descent' | 'attention' | 'vector_space';
  title: string;
  description: string;
  initial_params: Record<string, any>;
}

export interface FormulaSymbol {
  symbol: string;
  name: string;
  meaning: string;
  sample_value: string;
}

export interface FormulaStep {
  step_number: number;
  title: string;
  calculation: string;
  result_meaning: string;
}

export interface FormulaGuide {
  title: string;
  latex_expression: string;
  plain_english: string;
  symbols: FormulaSymbol[];
  steps: FormulaStep[];
}

export interface LessonDataset {
  name: string;
  source_org: string;
  source_url: string;
  license: string;
  description: string;
  columns: string[];
  sample_rows: Record<string, any>[];
}

export interface SourceReference {
  title: string;
  organization: string;
  url: string;
  resource_type: string;
  license: string;
  lifecycle_status: string;
}

export interface CapstoneProjectSpec {
  problem_statement: string;
  dataset_and_license: string;
  acceptance_criteria: string[];
  baseline_model: string;
  evaluation_metrics: string[];
  implementation_steps: string[];
  error_analysis_guide: string;
  security_considerations: string;
  deployment_plan: string;
  rubric_dimensions: Record<string, string>[];
}

export interface FlashcardItem {
  question: string;
  answer: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  track_id: string;
  title: string;
  estimated_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  target_audience?: 'beginner' | 'engineer';
  prerequisites: string[];
  objectives: string[];
  why_this_matters?: string;
  intuitive_explanation: string;
  formal_explanation: string;
  deep_dive_notes?: string[];
  formula_guide?: FormulaGuide;
  real_dataset?: LessonDataset;
  worked_example_code?: string;
  output_analysis?: string;
  when_to_use_and_not_use?: string[];
  guided_practice?: string[];
  common_misconceptions: string[];
  interactive_widget?: LessonInteractiveWidget;
  quiz: QuizQuestion[];
  code_exercise?: CodeExercise;
  capstone_spec?: CapstoneProjectSpec;
  flashcards?: FlashcardItem[];
  mastery_criteria?: string[];
  further_reading?: string[];
  source_references?: SourceReference[];
  content_version?: string;
  review_status?: string;
  last_verified_date?: string;
  license_provenance?: string;
  summary: string;
  next_lesson_id?: string;
}

export interface Module {
  id: string;
  track_id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  track_number?: number;
  title: string;
  tagline: string;
  description: string;
  level: string;
  target_audience?: 'beginner' | 'engineer';
  specialization_branch?: string;
  prerequisites?: string[];
  learning_outcomes?: string[];
  completion_criteria?: string;
  estimated_hours: number;
  modules: Module[];
}

export interface CodeExecutionResponse {
  success: boolean;
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_time_ms: number;
  security_flagged: boolean;
  security_reason?: string;
  passed_tests?: boolean;
  test_feedback?: string;
}

export interface NewsArticle {
  id: string;
  canonical_url: string;
  title: string;
  source: string;
  author?: string;
  published_at: string;
  category: string;
  difficulty: string;
  summary_what: string;
  summary_new: string;
  summary_impact: string;
  summary_action: string;
  claim_status: 'VERIFIED' | 'VENDOR_CLAIM' | 'SPECULATIVE';
  bookmarked: boolean;
}

export interface CitationItem {
  id: string;
  type: 'lesson' | 'news' | 'documentation' | 'oer' | string;
  title: string;
  url_or_ref: string;
  excerpt: string;
}

export interface TutorResponse {
  answer: string;
  citations: CitationItem[];
  suggested_actions: string[];
  confidence_level: string;
  has_unverified_claims: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: string;
  updated_at: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description?: string;
  files: ProjectFile[];
  created_at: string;
  updated_at: string;
}

export interface DatasetSummary {
  name: string;
  rows: number;
  columns: string[];
  column_types: Record<string, string>;
  missing_counts: Record<string, number>;
  sample_data: Record<string, any>[];
}

export interface ExperimentRun {
  id: string;
  project_id: string;
  name: string;
  model_name: string;
  hyperparameters: Record<string, any>;
  metrics: Record<string, any>;
  status: string;
  created_at: string;
}

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface MasteryDimensionBreakdown {
  completion_rate: number;
  assessment_performance: number;
  estimated_mastery: number;
  confidence_level: string;
  confidence_note: string;
  demonstrated_project_skill: number;
}

export interface AdaptiveRecommendationItem {
  lesson_id: string;
  lesson_title: string;
  track_id: string;
  track_title: string;
  target_audience: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  recommendation_type: 'NEXT_PREREQUISITE' | 'REMEDIATION' | 'SPACED_REVIEW' | 'CAPSTONE_UNLOCK' | string;
  rationale: string;
  estimated_minutes: number;
}

export interface OERResourceSchema {
  id: string;
  title: string;
  organization: string;
  canonical_url: string;
  resource_type: string;
  access_model?: string;
  spdx_license: string;
  attribution_requirements: string;
  lifecycle_status: string;
  mapped_tracks: string[];
  quality_score: number;
  last_verified_date: string;
}

export interface LearnerProgress {
  completed_lesson_ids: string[];
  quiz_scores: Record<string, number>;
  diagnostic_completed: boolean;
  recommended_track: string;
  total_lessons_count: number;
  xp: number;
  level: number;
  level_title: string;
  streak_days: number;
  daily_goal_xp: number;
  today_xp: number;
  badges: BadgeInfo[];
  mastery_dimensions?: MasteryDimensionBreakdown;
  recommendations?: AdaptiveRecommendationItem[];
}
