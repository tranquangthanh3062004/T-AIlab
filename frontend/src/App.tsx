import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { FloatingAgentWidget } from './components/FloatingAgentWidget';
import { HomeView } from './views/HomeView';
import { LearnView } from './views/LearnView';
import { LessonView } from './views/LessonView';
import { DiagnosticView } from './views/DiagnosticView';
import { WorkspaceView } from './views/WorkspaceView';
import { DatasetsView } from './views/DatasetsView';
import { NewsRadarView } from './views/NewsRadarView';
import { TutorView } from './views/TutorView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 flex flex-col pb-20 md:pb-8">
      {activeView === 'home' && <HomeView />}
      {activeView === 'learn' && <LearnView />}
      {activeView === 'lesson' && <LessonView />}
      {activeView === 'diagnostic' && <DiagnosticView />}
      {activeView === 'workspace' && <WorkspaceView />}
      {activeView === 'datasets' && <DatasetsView />}
      {activeView === 'news' && <NewsRadarView />}
      {activeView === 'tutor' && <TutorView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Header />
        <AuthModal />
        <MainContent />
        <FloatingAgentWidget />
        <footer className="py-6 pb-20 md:pb-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-400">
            T Lab AI &middot; Nền tảng Học &amp; Kỹ thuật Trí tuệ Nhân tạo Thực chiến
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            15 Lộ trình Học tập &middot; Dữ liệu Mở Chuẩn OER &middot; Đồng bộ Google &middot; Trợ lý AI Agent 24/7
          </p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
