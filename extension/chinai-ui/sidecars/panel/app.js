// Frontend logic for CHINAI Sidecar Extension

const sidecar = window.sidecar;

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.setAttribute('hidden', ''));

    btn.classList.add('active');
    const targetContent = document.getElementById(`tab-${tabName}`);
    if (targetContent) {
      targetContent.removeAttribute('hidden');
    }
  });
});

// Helper for sidecar fetch
async function callApi(url, method = 'GET', body = null) {
  try {
    const opts = { method };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    const res = await (sidecar ? sidecar.fetch(url, opts) : fetch(url, opts));
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { ok: false, error: err.message };
  }
}

// 1. Health Status
async function checkHealth() {
  const statusEl = document.getElementById('server-status');
  const textEl = document.getElementById('status-text');

  const res = await callApi('/api/chinai/health');
  if (res && res.ok && res.data && res.data.status === 'healthy') {
    statusEl.classList.remove('offline');
    textEl.textContent = `Online (v${res.data.version})`;
  } else {
    statusEl.classList.add('offline');
    textEl.textContent = 'Server Offline';
  }
}

// 2. Load Progress & Tracks
async function loadOverview() {
  const progRes = await callApi('/api/chinai/progress');
  if (progRes && progRes.ok && progRes.data) {
    const p = progRes.data;
    document.getElementById('streak-val').textContent = `${p.streak_days || 3}🔥`;
    document.getElementById('xp-val').textContent = `${p.xp || 150}⚡`;
    document.getElementById('level-val').textContent = `Lv.${p.level || 2}🏆`;
  }

  const tracksRes = await callApi('/api/chinai/tracks');
  const tracksListEl = document.getElementById('tracks-list');
  if (tracksRes && tracksRes.ok && Array.isArray(tracksRes.data)) {
    tracksListEl.innerHTML = tracksRes.data.map(t => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-radius: 6px; background: var(--muted, #f8fafc); border: 1px solid var(--border, #e2e8f0);">
        <span style="font-weight: 600;">${t.title}</span>
        <span style="font-size: 10px; color: var(--muted-foreground);">${t.level} &bull; ${t.estimated_hours}h</span>
      </div>
    `).join('');
  } else {
    tracksListEl.innerHTML = '<span style="color: #ef4444;">Không thể tải danh sách lộ trình.</span>';
  }
}

// 3. Formula Guide
async function loadLessonFormula(lessonId) {
  const res = await callApi(`/api/chinai/lesson?id=${encodeURIComponent(lessonId)}`);
  const latexEl = document.getElementById('formula-latex');
  const plainEl = document.getElementById('formula-plain');
  const symbolsListEl = document.getElementById('symbols-list');

  if (res && res.ok && res.data && res.data.formula_guide) {
    const fg = res.data.formula_guide;
    latexEl.textContent = fg.latex_expression;
    plainEl.textContent = fg.plain_english;

    symbolsListEl.innerHTML = fg.symbols.map(s => `
      <div class="symbol-item">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="symbol-badge">${s.symbol}</span>
          <span style="font-weight: 600;">${s.name}</span>
        </div>
        <span style="font-family: monospace; font-size: 10px; color: #059669;">${s.sample_value}</span>
      </div>
    `).join('');
  } else {
    latexEl.textContent = 'Chưa có công thức cho bài học này';
    plainEl.textContent = '';
    symbolsListEl.innerHTML = '<span style="color: var(--muted-foreground); font-size: 11px;">Không có ký hiệu đặc biệt.</span>';
  }
}

document.getElementById('lesson-select')?.addEventListener('change', (e) => {
  loadLessonFormula(e.target.value);
});

// 4. Run Sandbox Code
document.getElementById('run-code-btn')?.addEventListener('click', async () => {
  const code = document.getElementById('code-snippet').value;
  const outEl = document.getElementById('sandbox-output');
  outEl.textContent = 'Đang thực thi trong AST Sandbox...';

  const res = await callApi('/api/chinai/run', 'POST', { code });
  if (res && res.ok && res.data) {
    const r = res.data;
    if (r.security_flagged) {
      outEl.textContent = `[BẢO MẬT CHẶN]: ${r.security_reason}\nLệnh bị từ chối trước khi thực thi.`;
      outEl.style.color = '#f87171';
    } else if (r.success) {
      outEl.textContent = r.stdout || '(Thực thi thành công, không có stdout)';
      outEl.style.color = '#34d399';
    } else {
      outEl.textContent = `Exit ${r.exit_code}:\n${r.stderr || r.stdout || 'Thất bại'}`;
      outEl.style.color = '#fb7185';
    }
  } else {
    outEl.textContent = `Lỗi mạng: ${res.error || 'Không kết nối được server'}`;
    outEl.style.color = '#fb7185';
  }
});

document.getElementById('clear-console-btn')?.addEventListener('click', () => {
  const outEl = document.getElementById('sandbox-output');
  outEl.textContent = 'Console đã xóa.';
  outEl.style.color = '#94a3b8';
});

// 5. News
async function loadNews() {
  const res = await callApi('/api/chinai/news');
  const container = document.getElementById('news-container');
  if (res && res.ok && Array.isArray(res.data)) {
    container.innerHTML = res.data.slice(0, 5).map(art => `
      <div class="news-item">
        <a href="${art.canonical_url}" target="_blank" class="news-title">${art.title}</a>
        <div class="news-meta">
          <span style="font-weight: 600; color: #4f46e5;">${art.source_org}</span>
          <span>&bull;</span>
          <span>${art.category}</span>
          <span>&bull;</span>
          <span style="color: #059669;">${art.claim_status}</span>
        </div>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<span style="color: var(--muted-foreground); font-size: 11px;">Chưa tải được tin tức.</span>';
  }
}

// Open full app button
document.getElementById('open-full-btn')?.addEventListener('click', () => {
  window.open('http://127.0.0.1:5173', '_blank');
});

// Ask agent button
document.getElementById('ask-agent-btn')?.addEventListener('click', () => {
  if (sidecar && sidecar.agent && sidecar.conversationId) {
    sidecar.agent.sendMessage('Tôi đang học trên CHINAI OS. Hãy giải thích chi tiết thuật toán Gradient Descent và cách chọn learning rate phù hợp.');
  } else {
    alert('Bấm vào chat của Antigravity để hỏi trực tiếp.');
  }
});

// Init
checkHealth();
loadOverview();
loadLessonFormula('lesson-foundations-what-is-ai');
loadNews();
