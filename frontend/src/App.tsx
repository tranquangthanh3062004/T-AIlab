import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
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
    <main className="flex-1 flex flex-col pb-16 md:pb-0">
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
        <footer className="py-6 pb-20 md:pb-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-400">
            T AIlab (CHINAI 2.0) &middot; Nền tảng Đào tạo AI Chuẩn mực, Không gian Lập trình IDE &amp; Radar Nghiên cứu AI
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Học từ số 0 &middot; Xây dựng hệ thống AI thực chiến &middot; Đồng bộ đa tài khoản Google
          </p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
