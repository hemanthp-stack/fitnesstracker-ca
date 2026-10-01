import React from 'react';
import { Dumbbell, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddClick?: () => void;
  onLoadDemoClick?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No activities recorded yet. Add your first workout!',
  description = 'Add your first workout to track your steps, calories, and daily progress!',
  onAddClick,
  onLoadDemoClick,
  actionText = 'Add Activity',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
        <Dumbbell className="w-8 h-8 stroke-[1.75]" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}

        {onLoadDemoClick && (
          <button
            onClick={onLoadDemoClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-medium text-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Load Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
