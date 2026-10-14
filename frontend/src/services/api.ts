import type {
  Track, Lesson, CodeExecutionResponse, NewsArticle,
  TutorResponse, WorkspaceProject, ProjectFile,
  DatasetSummary, ExperimentRun, LearnerProgress,
  AuthResponse, UserProfile
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

const getStoredToken = (): string | null => localStorage.getItem('tlab_token') || localStorage.getItem('chinai_token');
const getStoredLang = (): string => localStorage.getItem('tlab_lang') || localStorage.getItem('chinai_lang') || 'vi';
const getStoredPersona = (): string => localStorage.getItem('tlab_persona') || localStorage.getItem('chinai_persona') || 'beginner';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication & Google OAuth
  async register(email: string, fullName: string, password: string, role?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Đăng ký thất bại');
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Đăng nhập thất bại');
    return data;
  },

  async loginWithGoogle(email: string, fullName: string, avatarUrl?: string, googleCredential?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        google_credential: googleCredential
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Kết nối Google thất bại');
    return data;
  },

  async linkGoogleAccount(email: string, fullName: string, avatarUrl?: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/google/link`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, full_name: fullName, avatar_url: avatarUrl })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Không thể liên kết tài khoản Google');
    return data;
  },

  async unlinkGoogleAccount(email: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/google/unlink`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Không thể hủy liên kết Google');
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  // Curriculum
  async getTracks(lang?: string): Promise<Track[]> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/tracks?lang=${encodeURIComponent(activeLang)}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
  },

  async getLesson(lessonId: string, lang?: string): Promise<Lesson> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/lessons/${lessonId}?lang=${encodeURIComponent(activeLang)}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch lesson');
    return res.json();
  },

  async submitQuiz(lessonId: string, selectedOptionIds: Record<string, string>, lang?: string): Promise<any> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/quiz/submit?lang=${encodeURIComponent(activeLang)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ lesson_id: lessonId, selected_option_ids: selectedOptionIds })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  async submitExercisePass(lessonId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/learn/exercise/pass`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ lesson_id: lessonId })
    });
    if (!res.ok) throw new Error('Failed to record exercise pass');
    return res.json();
  },

  async getDiagnosticQuestions(lang?: string): Promise<any[]> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/diagnostic/questions?lang=${encodeURIComponent(activeLang)}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch diagnostic questions');
    return res.json();
  },

  async submitDiagnostic(answers: Record<string, string>, lang?: string): Promise<any> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/diagnostic/submit?lang=${encodeURIComponent(activeLang)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit diagnostic');
    return res.json();
  },

  async getProgress(lang?: string, persona?: string): Promise<LearnerProgress> {
    const activeLang = lang || getStoredLang();
    const activePersona = persona || getStoredPersona();
    const res = await fetch(
      `${API_BASE}/learn/progress?lang=${encodeURIComponent(activeLang)}&persona=${encodeURIComponent(activePersona)}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async getOerResources(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/learn/oer/resources`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch OER resources');
    return res.json();
  },

  async getGovernanceAudit(lang?: string): Promise<any> {
    const activeLang = lang || getStoredLang();
    const res = await fetch(`${API_BASE}/learn/governance/audit?lang=${encodeURIComponent(activeLang)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch governance audit');
    return res.json();
  },

  // Code Execution
  async executeCode(code: string, exerciseId?: string): Promise<CodeExecutionResponse> {
    const res = await fetch(`${API_BASE}/execution/run`, {
      method: 'POST',
      headers: getAuthHeaders(),
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

    const res = await fetch(`${API_BASE}/news/articles?${query.toString()}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async toggleBookmark(articleId: string): Promise<{ id: string; bookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/news/articles/${articleId}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async triggerNewsIngestion(): Promise<any> {
    const res = await fetch(`${API_BASE}/news/ingest`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to trigger ingestion');
    return res.json();
  },

  // AI Tutor
  async queryTutor(query: string, mode: 'learn' | 'engineer', lessonId?: string, codeContext?: string): Promise<TutorResponse> {
    const res = await fetch(`${API_BASE}/tutor/query`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
    const res = await fetch(`${API_BASE}/workspace/projects`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(projectId: string): Promise<WorkspaceProject> {
    const res = await fetch(`${API_BASE}/workspace/projects/${projectId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async updateFile(fileId: string, content: string): Promise<ProjectFile> {
    const res = await fetch(`${API_BASE}/workspace/files/${fileId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to save file');
    return res.json();
  },

  async createFile(projectId: string, name: string, content: string = ''): Promise<ProjectFile> {
    const res = await fetch(`${API_BASE}/workspace/projects/${projectId}/files`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, content, language: name.endsWith('.csv') ? 'csv' : 'python' })
    });
    if (!res.ok) throw new Error('Failed to create file');
    return res.json();
  },

  async getDatasetSummary(): Promise<DatasetSummary> {
    const res = await fetch(`${API_BASE}/workspace/dataset/summary`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dataset summary');
    return res.json();
  },

  async getExperiments(): Promise<ExperimentRun[]> {
    const res = await fetch(`${API_BASE}/workspace/experiments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch experiments');
    return res.json();
  }
};
