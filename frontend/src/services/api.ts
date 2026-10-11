import type {
  Track, Lesson, CodeExecutionResponse, NewsArticle,
  TutorResponse, WorkspaceProject, ProjectFile,
  DatasetSummary, ExperimentRun, LearnerProgress
} from '../types';

const API_BASE = '/api';

export const api = {
  // Curriculum
  async getTracks(): Promise<Track[]> {
    const res = await fetch(`${API_BASE}/learn/tracks`);
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
  },

  async getLesson(lessonId: string): Promise<Lesson> {
    const res = await fetch(`${API_BASE}/learn/lessons/${lessonId}`);
    if (!res.ok) throw new Error('Failed to fetch lesson');
    return res.json();
  },

  async submitQuiz(lessonId: string, selectedOptionIds: Record<string, string>): Promise<any> {
    const res = await fetch(`${API_BASE}/learn/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, selected_option_ids: selectedOptionIds })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  async submitExercisePass(lessonId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/learn/exercise/pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId })
    });
    if (!res.ok) throw new Error('Failed to record exercise pass');
    return res.json();
  },

  async getDiagnosticQuestions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/learn/diagnostic/questions`);
    if (!res.ok) throw new Error('Failed to fetch diagnostic questions');
    return res.json();
  },

  async submitDiagnostic(answers: Record<string, string>): Promise<any> {
    const res = await fetch(`${API_BASE}/learn/diagnostic/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit diagnostic');
    return res.json();
  },

  async getProgress(): Promise<LearnerProgress> {
    const res = await fetch(`${API_BASE}/learn/progress`);
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  // Code Execution
  async executeCode(code: string, exerciseId?: string): Promise<CodeExecutionResponse> {
    const res = await fetch(`${API_BASE}/execution/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, exercise_id: exerciseId, timeout_seconds: 5 })
    });
    if (!res.ok) throw new Error('Failed to execute code');
    return res.json();
  },

  // News Radar
  async getNews(params?: { category?: string; difficulty?: string; search?: string; bookmarked_only?: boolean }): Promise<NewsArticle[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
    if (params?.search) query.set('search', params.search);
    if (params?.bookmarked_only) query.set('bookmarked_only', 'true');

    const res = await fetch(`${API_BASE}/news/articles?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async toggleBookmark(articleId: string): Promise<{ id: string; bookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/news/articles/${articleId}/bookmark`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async triggerNewsIngestion(): Promise<any> {
    const res = await fetch(`${API_BASE}/news/ingest`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger ingestion');
    return res.json();
  },

  // AI Tutor
  async queryTutor(query: string, mode: 'learn' | 'engineer', lessonId?: string, codeContext?: string): Promise<TutorResponse> {
    const res = await fetch(`${API_BASE}/tutor/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        mode,
        current_lesson_id: lessonId,
        code_context: codeContext
      })
    });
    if (!res.ok) throw new Error('Failed to query tutor');
    return res.json();
  },

  // Workspace
  async getProjects(): Promise<WorkspaceProject[]> {
    const res = await fetch(`${API_BASE}/workspace/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(projectId: string): Promise<WorkspaceProject> {
    const res = await fetch(`${API_BASE}/workspace/projects/${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async updateFile(fileId: string, content: string): Promise<ProjectFile> {
    const res = await fetch(`${API_BASE}/workspace/files/${fileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to save file');
    return res.json();
  },

  async createFile(projectId: string, name: string, content: string = ''): Promise<ProjectFile> {
    const res = await fetch(`${API_BASE}/workspace/projects/${projectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content, language: name.endsWith('.csv') ? 'csv' : 'python' })
    });
    if (!res.ok) throw new Error('Failed to create file');
    return res.json();
  },

  async getDatasetSummary(): Promise<DatasetSummary> {
    const res = await fetch(`${API_BASE}/workspace/dataset/summary`);
    if (!res.ok) throw new Error('Failed to fetch dataset summary');
    return res.json();
  },

  async getExperiments(): Promise<ExperimentRun[]> {
    const res = await fetch(`${API_BASE}/workspace/experiments`);
    if (!res.ok) throw new Error('Failed to fetch experiments');
    return res.json();
  }
};
