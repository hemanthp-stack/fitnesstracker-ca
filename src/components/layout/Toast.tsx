import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useFitness();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200';
        let bgClass = 'bg-white';
        let icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200';
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderClass} ${bgClass} transition-all duration-300 animate-in fade-in slide-in-from-top-3`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
