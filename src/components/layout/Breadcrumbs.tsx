import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { UnitInfo, LessonContent } from '../../types';

interface BreadcrumbsProps {
  unit?: UnitInfo;
  lesson?: LessonContent;
  viewTitle?: string;
  onNavigateHome: () => void;
  onNavigateUnit?: (unitId: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  unit,
  lesson,
  viewTitle,
  onNavigateHome,
  onNavigateUnit
}) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto py-1">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>

      {unit && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <button
            onClick={() => onNavigateUnit && onNavigateUnit(unit.id)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
          >
            Unit {unit.number}: {unit.title}
          </button>
        </>
      )}

      {lesson && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {lesson.title}
          </span>
        </>
      )}

      {!lesson && viewTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {viewTitle}
          </span>
        </>
      )}
    </nav>
  );
};
