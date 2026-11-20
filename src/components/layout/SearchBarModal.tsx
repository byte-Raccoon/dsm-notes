import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, FlaskConical, Award, ArrowRight } from 'lucide-react';
import { allUnits } from '../../data/syllabus';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (unitId: string, lessonId: string) => void;
  onSelectSimulator: (unitId: string, simKey: string) => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectSimulator
}) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search through all lessons and simulators
  const lowerQuery = query.toLowerCase().trim();

  const matchingLessons = allUnits.flatMap(unit =>
    unit.lessons
      .filter(l =>
        l.title.toLowerCase().includes(lowerQuery) ||
        l.subtitle.toLowerCase().includes(lowerQuery) ||
        l.whatIsIt.coreDefinition.toLowerCase().includes(lowerQuery) ||
        l.examPerspective.typicalDtuQuestions.some(q => q.toLowerCase().includes(lowerQuery))
      )
      .map(l => ({ ...l, unit }))
  );

  const matchingSimulators = allUnits.flatMap(unit =>
    unit.simulators
      .filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
      )
      .map(s => ({ ...s, unit }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search IT201 lessons, K-maps, Gray code, ARM registers, FPU..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            onClick={onClose}
            className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-500 cursor-pointer"
          >
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {matchingSimulators.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 px-2 block mb-2">
                Interactive Simulators ({matchingSimulators.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingSimulators.map(sim => (
                  <button
                    key={sim.id}
                    onClick={() => {
                      onSelectSimulator(sim.unit.id, sim.id);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-400 text-left transition-all flex items-start justify-between gap-2 group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900 dark:text-indigo-300">
                        <FlaskConical className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{sim.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {sim.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingLessons.length > 0 ? (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Curriculum Lessons ({matchingLessons.length})
              </span>
              <div className="space-y-1.5">
                {matchingLessons.map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectLesson(l.unit.id, l.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Unit {l.unit.number}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {l.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {l.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : matchingSimulators.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching lessons or simulators found for "{query}".
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
