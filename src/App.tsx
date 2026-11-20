import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { allUnits, getUnitById, getLessonById } from './data/syllabus';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { SearchBarModal } from './components/layout/SearchBarModal';

import { DashboardHome } from './components/dashboard/DashboardHome';
import { UnitOverviewPage } from './components/dashboard/UnitOverviewPage';
import { LessonView } from './components/common/LessonView';
import { InteractiveLabHub } from './components/dashboard/InteractiveLabHub';
import { RevisionDashboard } from './components/dashboard/RevisionDashboard';
import { MockExamView } from './components/dashboard/MockExamView';

type ViewMode = 'home' | 'unit-overview' | 'lesson' | 'lab' | 'quiz' | 'revision';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [currentUnitId, setCurrentUnitId] = useState<string>('unit-1');
  const [currentLessonId, setCurrentLessonId] = useState<string>('u1-l1-positional-number-systems');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [labSimKey, setLabSimKey] = useState<string>('kmap-solver');

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeUnit = getUnitById(currentUnitId) || allUnits[0];
  const { lesson: activeLesson } = getLessonById(currentLessonId);

  // Navigation handlers
  const handleSelectLesson = (unitId: string, lessonId: string) => {
    setCurrentUnitId(unitId);
    setCurrentLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUnitOverview = (unitId: string) => {
    setCurrentUnitId(unitId);
    setCurrentView('unit-overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLab = (unitId?: string, simKey?: string) => {
    if (unitId) setCurrentUnitId(unitId);
    if (simKey) setLabSimKey(simKey);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuiz = (unitId: string) => {
    setCurrentUnitId(unitId);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRevision = () => {
    setCurrentView('revision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous and Next Lesson navigation
  const allFlattenedLessons = allUnits.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id })));
  const currentIdx = allFlattenedLessons.findIndex(l => l.id === currentLessonId);

  const prevLesson = currentIdx > 0 ? allFlattenedLessons[currentIdx - 1] : undefined;
  const nextLesson = currentIdx < allFlattenedLessons.length - 1 ? allFlattenedLessons[currentIdx + 1] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateHome={handleNavigateHome}
        onNavigateRevision={handleSelectRevision}
        onNavigateLab={() => handleSelectLab()}
      />

      <div className="flex-1 flex">
        {/* Left Collapsible Sidebar */}
        <Sidebar
          currentUnitId={currentUnitId}
          currentLessonId={currentLessonId}
          currentView={currentView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectLesson={handleSelectLesson}
          onSelectUnitOverview={handleSelectUnitOverview}
          onSelectLab={handleSelectLab}
          onSelectQuiz={handleSelectQuiz}
          onSelectRevision={handleSelectRevision}
        />

        {/* Main Content Pane */}
        <main className="flex-1 lg:pl-72 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto">
            {/* Dynamic Breadcrumbs */}
            {currentView !== 'home' && (
              <Breadcrumbs
                unit={currentView !== 'revision' && currentView !== 'lab' ? activeUnit : undefined}
                lesson={currentView === 'lesson' ? activeLesson : undefined}
                viewTitle={
                  currentView === 'revision'
                    ? 'Revision & Question Bank'
                    : currentView === 'lab'
                    ? 'Virtual Laboratory'
                    : currentView === 'quiz'
                    ? `Unit ${activeUnit.number} Assessment`
                    : currentView === 'unit-overview'
                    ? `Unit ${activeUnit.number} Overview`
                    : undefined
                }
                onNavigateHome={handleNavigateHome}
                onNavigateUnit={handleSelectUnitOverview}
              />
            )}

            {/* View Switching */}
            {currentView === 'home' && (
              <DashboardHome
                onSelectUnit={handleSelectUnitOverview}
                onSelectLesson={handleSelectLesson}
                onSelectLab={() => handleSelectLab()}
                onSelectRevision={handleSelectRevision}
              />
            )}

            {currentView === 'unit-overview' && (
              <UnitOverviewPage
                unit={activeUnit}
                onSelectLesson={lId => handleSelectLesson(activeUnit.id, lId)}
                onOpenQuiz={() => handleSelectQuiz(activeUnit.id)}
                onOpenLab={simKey => handleSelectLab(activeUnit.id, simKey)}
              />
            )}

            {currentView === 'lesson' && activeLesson && (
              <LessonView
                lesson={activeLesson}
                onNextLesson={nextLesson ? () => handleSelectLesson(nextLesson.unitId, nextLesson.id) : undefined}
                onPrevLesson={prevLesson ? () => handleSelectLesson(prevLesson.unitId, prevLesson.id) : undefined}
              />
            )}

            {currentView === 'lab' && (
              <InteractiveLabHub
                initialUnitId={currentUnitId}
                initialSimKey={labSimKey}
              />
            )}

            {currentView === 'quiz' && (
              <MockExamView
                unitId={currentUnitId}
                onFinish={handleNavigateHome}
              />
            )}

            {currentView === 'revision' && (
              <RevisionDashboard
                onSelectLesson={handleSelectLesson}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchBarModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
        onSelectSimulator={handleSelectLab}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default App;
