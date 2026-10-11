import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { WorkspaceProject, CodeExecutionResponse } from '../types';
import {
  FileText, Play, Save, Plus, Terminal, Sparkles,
  RefreshCw, FileCode, Database,
  Layers, ChevronDown, X
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const { setActiveView, language, theme } = useApp();
  const isVi = language === 'vi';

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResponse | null>(null);

  // New file modal
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  // AI Assistant panel
  const [isAiOpen, setIsAiOpen] = useState<boolean>(true);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiChat, setAiChat] = useState<{ query: string; answer: string; citations: any[] }[]>([]);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        const p = projects[0];
        setProject(p);
        if (p.files.length > 0) {
          const firstId = p.files[0].id;
          setActiveFileId(firstId);
          setOpenTabs([firstId]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);


  const handleInsertTemplate = (type: 'linear' | 'entropy' | 'vector') => {
    if (!activeFileId) return;
    let snippet = '';
    if (type === 'linear') {
      snippet = `# Model Hồi Quy Tuyến Tính (Linear Hypothesis) & MSE Loss\n` +
        `def predict(x, w, b):\n    return w * x + b\n\n` +
        `def compute_mse_loss(y_preds, y_trues):\n    return sum((yp - yt) ** 2 for yp, yt in zip(y_preds, y_trues)) / len(y_preds)\n\n` +
        `x_samples = [1.0, 2.0, 3.0, 4.0, 5.0]\n` +
        `y_trues   = [2.1, 4.2, 5.9, 8.1, 9.8]\nw, b = 1.9, 0.2\n` +
        `y_preds = [predict(x, w, b) for x in x_samples]\n` +
        `loss = compute_mse_loss(y_preds, y_trues)\n` +
        `print(f"Hệ số w={w}, b={b} -> MSE Loss: {loss:.4f}")\n` +
        `print(f"Dự đoán: {[round(p, 2) for p in y_preds]}")\n`;
    } else if (type === 'entropy') {
      snippet = `import math\n\n` +
        `# Tính toán Độ Hỗn Loạn Shannon (Entropy)\n` +
        `def shannon_entropy(p1):\n` +
        `    if p1 <= 0.0 or p1 >= 1.0:\n        return 0.0\n` +
        `    p0 = 1.0 - p1\n` +
        `    return - (p1 * math.log2(p1) + p0 * math.log2(p0))\n\n` +
        `for p in [0.1, 0.3, 0.5, 0.7, 0.9]:\n` +
        `    print(f"Xác suất p={p:.1f} -> Entropy = {shannon_entropy(p):.4f} bits")\n`;
    } else {
      snippet = `import math\n\n` +
        `# Tính Toán Tích Vô Hướng Vector & Cosine Similarity\n` +
        `def cosine_similarity(v1, v2):\n` +
        `    dot = sum(a * b for a, b in zip(v1, v2))\n` +
        `    mag1 = math.sqrt(sum(a * a for a in v1))\n` +
        `    mag2 = math.sqrt(sum(b * b for b in v2))\n` +
        `    return dot / (mag1 * mag2) if (mag1 * mag2) > 0 else 0.0\n\n` +
        `query = [1.0, 0.5, 0.2]\n` +
        `doc_a = [0.9, 0.6, 0.1]\n` +
        `doc_b = [-0.5, 0.8, -0.4]\n` +
        `print("Độ tương đồng Query vs Doc A:", round(cosine_similarity(query, doc_a), 4))\n` +
        `print("Độ tương đồng Query vs Doc B:", round(cosine_similarity(query, doc_b), 4))\n`;
    }
    setDirtyFiles(prev => ({ ...prev, [activeFileId]: snippet }));
  };

  const activeFile = project?.files.find(f => f.id === activeFileId);
  const currentCode = activeFileId && dirtyFiles[activeFileId] !== undefined
    ? dirtyFiles[activeFileId]
    : (activeFile?.content || '');

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId || value === undefined) return;
    setDirtyFiles(prev => ({ ...prev, [activeFileId]: value }));
  };

  const handleSaveFile = async () => {
    if (!activeFileId || dirtyFiles[activeFileId] === undefined) return;
    try {
      const updated = await api.updateFile(activeFileId, dirtyFiles[activeFileId]);
      if (project) {
        const updatedFiles = project.files.map(f => f.id === updated.id ? updated : f);
        setProject({ ...project, files: updatedFiles });
      }
      setDirtyFiles(prev => {
        const copy = { ...prev };
        delete copy[activeFileId];
        return copy;
      });
    } catch (e) {
      console.error('Failed to save file', e);
    }
  };

  const handleRunActiveFile = async () => {
    try {
      setExecuting(true);
      const res = await api.executeCode(currentCode);
      setExecutionResult(res);
    } catch (e: any) {
      setExecutionResult({
        success: false,
        stdout: '',
        stderr: e.message || (isVi ? 'Thực thi thất bại' : 'Execution failed'),
        exit_code: 1,
        execution_time_ms: 0,
        security_flagged: false
      });
    } finally {
      setExecuting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunActiveFile();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCode, activeFileId, dirtyFiles]);

  const handleOpenFile = (fileId: string) => {
    setActiveFileId(fileId);
    if (!openTabs.includes(fileId)) {
      setOpenTabs([...openTabs, fileId]);
    }
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(id => id !== fileId);
    setOpenTabs(newTabs);
    if (activeFileId === fileId) {
      setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const handleCreateFile = async () => {
    if (!project || !newFileName.trim()) return;
    try {
      const name = newFileName.trim();
      const isCsv = name.endsWith('.csv');
      const initialContent = isCsv
        ? 'feature_1,feature_2,label\n0.5,1.2,1\n-0.8,0.4,0\n1.1,-0.3,1\n'
        : '# ' + name + '\nimport math\n\nprint("File initialized successfully!")\n';
      const created = await api.createFile(project.id, name, initialContent);
      setProject({
        ...project,
        files: [...project.files, created]
      });
      setNewFileName('');
      setIsCreatingFile(false);
      handleOpenFile(created.id);
    } catch (e) {
      console.error('Failed to create file', e);
    }
  };

  const handleAiAction = async (promptText: string) => {
    try {
      setAiLoading(true);
      const fullQuery = `Context File: ${activeFile?.name || 'untitled'}\nCode Snippet:\n\`\`\`python\n${currentCode.slice(0, 1500)}\n\`\`\`\n\nUser Question: ${promptText}`;
      const res = await api.queryTutor(fullQuery, 'engineer');
      setAiChat(prev => [
        ...prev,
        {
          query: promptText,
          answer: res.answer,
          citations: res.citations
        }
      ]);
    } catch (e: any) {
      setAiChat(prev => [
        ...prev,
        {
          query: promptText,
          answer: isVi ? `Lỗi trợ lý: ${e.message}` : `Error: ${e.message}`,
          citations: []
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 py-32">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span className="text-xs font-mono">{isVi ? 'Đang khởi chạy Không gian Monaco...' : 'Initializing Monaco Workspace...'}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-200 overflow-hidden select-none">
      {/* Workspace Menu Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {project?.name || 'Workspace'}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            {isVi ? 'Python 3.13 Sandbox Cô Lập' : 'Python 3.13 Isolated Sandbox'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Code Templates */}
          <div className="hidden md:flex items-center gap-1 mr-2 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px]">
            <span className="px-1.5 text-slate-400 font-medium">{isVi ? 'Mẫu ML:' : 'Snippets:'}</span>
            <button
              onClick={() => handleInsertTemplate('linear')}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded transition"
              title="Chèn mẫu code Hồi quy tuyến tính"
            >
              Hồi quy
            </button>
            <button
              onClick={() => handleInsertTemplate('entropy')}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded transition"
              title="Chèn mẫu code Entropy Shannon"
            >
              Entropy
            </button>
            <button
              onClick={() => handleInsertTemplate('vector')}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded transition"
              title="Chèn mẫu code Tích vô hướng vector"
            >
              Vector
            </button>
          </div>

          <span className="hidden xl:inline-block text-[11px] text-slate-400 font-mono bg-slate-850 px-2 py-0.5 rounded border border-slate-800">
            Ctrl+Enter ↵ Chạy
          </span>

          {activeFileId && dirtyFiles[activeFileId] !== undefined && (
            <button
              onClick={handleSaveFile}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-semibold text-[11px] transition shadow-xs"
            >
              <Save className="w-3 h-3" />
              <span>{isVi ? 'Lưu (Ctrl+S)' : 'Save (Ctrl+S)'}</span>
            </button>
          )}

          <button
            onClick={handleRunActiveFile}
            disabled={executing}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded font-bold text-xs shadow-xs transition"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{executing ? (isVi ? 'Đang chạy...' : 'Executing...') : (isVi ? 'Chạy Sandbox' : 'Run Sandbox')}</span>
          </button>

          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
              isAiOpen ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isVi ? 'Trợ Lý AI' : 'AI Assistant'}</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Panel Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 gap-4 text-slate-500">
          <div className="text-indigo-400 cursor-pointer p-2 rounded hover:bg-slate-900" title={isVi ? 'Tập tin' : 'Explorer'}>
            <FileCode className="w-5 h-5" />
          </div>
          <div className="hover:text-slate-300 cursor-pointer p-2 rounded hover:bg-slate-900" title={isVi ? 'Kiểm soát phiên bản' : 'Source Control'}>
            <Layers className="w-5 h-5" />
          </div>
          <div
            onClick={() => setActiveView('datasets')}
            className="hover:text-slate-300 text-slate-400 cursor-pointer p-2 rounded hover:bg-slate-900 transition"
            title={isVi ? 'Dữ liệu & Chỉ số Thử nghiệm' : 'Datasets & Experiment Runs'}
          >
            <Database className="w-5 h-5" />
          </div>
        </div>

        {/* Primary Sidebar: File Explorer */}
        <div className="w-56 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{isVi ? 'Tập Tin Dự Án' : 'Explorer'}</span>
            <button
              onClick={() => setIsCreatingFile(true)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded"
              title={isVi ? 'Tạo file mới' : 'New File'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCreatingFile && (
            <div className="p-2 border-b border-slate-800 bg-slate-800/50">
              <input
                type="text"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder={isVi ? 'ten_file.py hoac data.csv' : 'filename.py or data.csv'}
                className="w-full px-2 py-1 bg-slate-950 border border-indigo-500 rounded text-xs font-mono text-white focus:outline-hidden"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreateFile();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
                autoFocus
              />
            </div>
          )}

          {/* Files List */}
          <div className="flex-1 overflow-y-auto py-2 font-mono text-xs">
            <div className="px-3 py-1 text-[11px] text-slate-500 uppercase flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Project Root
            </div>
            {project?.files.map(f => {
              const isSelected = f.id === activeFileId;
              const isDirty = dirtyFiles[f.id] !== undefined;

              return (
                <div
                  key={f.id}
                  onClick={() => handleOpenFile(f.id)}
                  className={`px-6 py-1.5 flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </span>
                  {isDirty && <span className="text-amber-400 font-bold">•</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Editor Canvas & Bottom Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Tab Strip */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center overflow-x-auto text-xs font-mono">
            {openTabs.map(tabId => {
              const file = project?.files.find(f => f.id === tabId);
              if (!file) return null;
              const isActive = tabId === activeFileId;
              const isDirty = dirtyFiles[tabId] !== undefined;

              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`h-full px-4 flex items-center gap-2 border-r border-slate-800 cursor-pointer transition ${
                    isActive
                      ? 'bg-slate-950 text-slate-100 font-medium border-t-2 border-t-indigo-500'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  {isDirty ? (
                    <span className="text-amber-400 font-bold">•</span>
                  ) : (
                    <button
                      onClick={e => handleCloseTab(tabId, e)}
                      className="hover:text-slate-200 text-slate-500 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 relative">
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.name.endsWith('.csv') ? 'plaintext' : 'python'}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={currentCode}
                onChange={handleEditorChange}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, Menlo, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  automaticLayout: true
                }}
              />
            ) : (
              <div className="flex-1 h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                {isVi ? 'Chưa chọn file nào. Hãy nhấp vào một tập tin trong cây thư mục bên trái.' : 'No active file selected. Choose a file from the explorer.'}
              </div>
            )}
          </div>

          {/* Bottom Panel: Output Console / Terminal */}
          <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col">
            <div className="px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isVi ? 'Đầu Ra Terminal Sandbox' : 'Terminal Output'}</span>
                </span>
                {executionResult && (
                  <span className={executionResult.success ? 'text-emerald-400' : 'text-rose-400'}>
                    Exit: {executionResult.exit_code} ({executionResult.execution_time_ms} ms)
                  </span>
                )}
              </div>
              <button
                onClick={() => setExecutionResult(null)}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                {isVi ? 'Xóa màn hình' : 'Clear'}
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950 select-text">
              {executionResult ? (
                <div className="space-y-1">
                  {executionResult.stdout && (
                    <div className="text-slate-200 whitespace-pre-wrap">{executionResult.stdout}</div>
                  )}
                  {executionResult.stderr && (
                    <div className="text-rose-400 whitespace-pre-wrap">{executionResult.stderr}</div>
                  )}
                  {executionResult.security_flagged && (
                    <div className="p-2 bg-rose-950/40 border border-rose-800 text-rose-300 rounded mt-2">
                      <span className="font-bold">{isVi ? 'Vi phạm bảo mật Sandbox: ' : 'Security Violation: '}</span>
                      {executionResult.security_reason}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-slate-600">
                  {isVi 
                    ? 'Nhấp "Chạy Sandbox" ở trên để thực thi mã nguồn Python trong môi trường cô lập bảo mật.' 
                    : "Click 'Run in Sandbox' above to execute current code file in an isolated Python process."}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Context-Aware AI Assistant */}
        {isAiOpen && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isVi ? 'Trợ Lý Kỹ Sư AI' : 'Workspace AI Assistant'}</span>
              </span>
              <button onClick={() => setIsAiOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="p-2.5 border-b border-slate-800 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleAiAction(isVi ? "Giải thích kiến trúc và logic của tập tin này." : "Explain the selected file's architecture and logic.")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                {isVi ? 'Giải thích Code' : 'Explain Code'}
              </button>
              <button
                onClick={() => handleAiAction(isVi ? "Đề xuất các test assertions để kiểm thử code này." : "Suggest unit test assertions to verify this code.")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                {isVi ? 'Đề xuất Tests' : 'Suggest Tests'}
              </button>
              <button
                onClick={() => handleAiAction(isVi ? "Phân tích các trường hợp biên và nguy cơ tràn số." : "Analyze potential edge cases or numerical instability.")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
              >
                {isVi ? 'Kiểm tra Edge Cases' : 'Review Edge Cases'}
              </button>
            </div>

            {/* AI Chat History */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {aiChat.length === 0 ? (
                <div className="text-center text-slate-500 py-10 space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto text-slate-600" />
                  <p className="text-[11px]">
                    {isVi 
                      ? 'Đặt câu hỏi về file code hiện tại, yêu cầu sinh test case hoặc phân tích độ phức tạp thuật toán.' 
                      : 'Ask about the current script, request test cases, or inspect algorithmic complexity.'}
                  </p>
                </div>
              ) : (
                aiChat.map((chat, idx) => (
                  <div key={idx} className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="font-semibold text-indigo-400 text-[11px]">{isVi ? 'Bạn: ' : 'You: '} {chat.query}</div>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                      {chat.answer}
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="text-center text-indigo-400 py-2 text-xs flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isVi ? 'Đang phân tích mã nguồn...' : 'Retrieving context...'}</span>
                </div>
              )}
            </div>

            {/* AI Input */}
            <div className="p-2.5 border-t border-slate-800 flex gap-1.5 bg-slate-950">
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder={isVi ? 'Hỏi về file code hiện tại...' : 'Ask about current file...'}
                className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-hidden"
                onKeyDown={e => {
                  if (e.key === 'Enter' && aiPrompt.trim()) {
                    handleAiAction(aiPrompt.trim());
                    setAiPrompt('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (aiPrompt.trim()) {
                    handleAiAction(aiPrompt.trim());
                    setAiPrompt('');
                  }
                }}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Engineer Status Bar */}
      <div className="h-6 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Python 3.13 AST Sandbox
          </span>
          <span>&bull;</span>
          <span>SLA: 5.0s Timeout</span>
          <span>&bull;</span>
          <span>UTF-8</span>
          {activeFile && (
            <>
              <span>&bull;</span>
              <span className="text-slate-300">{activeFile.name}</span>
            </>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-500">
          <span>{isVi ? 'Phím tắt:' : 'Shortcuts:'} Ctrl+Enter (Chạy) &middot; Ctrl+S (Lưu)</span>
        </div>
      </div>
    </div>
  );
};
