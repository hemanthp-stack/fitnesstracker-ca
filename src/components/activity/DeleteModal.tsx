import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { formatFullDate } from '../../utils/formatters';

export const DeleteModal: React.FC = () => {
  const { deletingActivity, setDeletingActivity, deleteActivity } = useFitness();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deletingActivity) {
        setDeletingActivity(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletingActivity, setDeletingActivity]);

  if (!deletingActivity) return null;

  const handleConfirmDelete = () => {
    deleteActivity(deletingActivity.id);
    setDeletingActivity(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Activity</h3>
          </div>
          <button
            onClick={() => setDeletingActivity(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to delete this{' '}
          <strong className="text-slate-900 font-semibold">{deletingActivity.type}</strong> workout
          from <span className="font-semibold text-slate-800">{formatFullDate(deletingActivity.date)}</span>?
        </p>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Duration:</span>
            <span className="font-semibold text-slate-800">{deletingActivity.duration} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Calories:</span>
            <span className="font-semibold text-slate-800">{deletingActivity.calories} kcal</span>
          </div>
          {deletingActivity.steps > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Steps:</span>
              <span className="font-semibold text-slate-800">{deletingActivity.steps.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setDeletingActivity(null)}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            data-testid="confirm-delete-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Activity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
