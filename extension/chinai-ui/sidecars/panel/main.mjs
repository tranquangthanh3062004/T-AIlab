import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Response, SidecarApp } from 'sidecar_sdk';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHINAI_API_BASE = 'http://127.0.0.1:8000';

const readLocal = (name) => readFileSync(join(HERE, name), 'utf8');

const app = new SidecarApp();

// Static file routes
app.page('/', () => readLocal('index.html'));
app.page('/app.js', () => readLocal('app.js'));
app.api('/styles.css', () => new Response(readLocal('styles.css'), { contentType: 'text/css' }), 'GET');

// Proxy helper
async function fetchChinai(endpoint, options = {}) {
  try {
    const res = await fetch(`${CHINAI_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      return { error: `Server returned status ${res.status}`, ok: false };
    }
    const data = await res.json();
    return { data, ok: true };
  } catch (err) {
    return { error: err.message || 'Cannot connect to CHINAI backend on port 8000', ok: false };
  }
}

// APIs
app.api('/api/chinai/health', async () => {
  return await fetchChinai('/api/health');
}, 'GET');

app.api('/api/chinai/progress', async () => {
  return await fetchChinai('/api/learn/progress');
}, 'GET');

app.api('/api/chinai/tracks', async () => {
  return await fetchChinai('/api/learn/tracks');
}, 'GET');

app.api('/api/chinai/lesson', async (data) => {
  const lessonId = data.id || 'lesson-foundations-what-is-ai';
  return await fetchChinai(`/api/learn/lessons/${lessonId}`);
}, 'GET');

app.api('/api/chinai/news', async () => {
  return await fetchChinai('/api/news/articles');
}, 'GET');

app.api('/api/chinai/run', async (data) => {
  return await fetchChinai('/api/execution/run', {
    method: 'POST',
    body: JSON.stringify({ code: data.code || '' })
  });
}, 'POST');

app.run();
