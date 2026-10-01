import React, { useState, useEffect } from 'react';
import { Check, Flame, Footprints, Clock, Target, X, AlertCircle } from 'lucide-react';
import type { DailyGoals } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';


export const GoalSettingsModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, goals, updateGoals } = useFitness();

  const [formGoals, setFormGoals] = useState<DailyGoals>(goals);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormGoals(goals);
  }, [goals, isGoalModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGoalModalOpen) {
        setIsGoalModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGoalModalOpen, setIsGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const steps = Number(formGoals.steps);
    const calories = Number(formGoals.calories);
    const workoutMinutes = Number(formGoals.workoutMinutes);

    if (isNaN(steps) || steps <= 0) {
      setError('Daily steps goal must be a positive number.');
      return;
    }
    if (isNaN(calories) || calories <= 0) {
      setError('Daily calories goal must be a positive number.');
      return;
    }
    if (isNaN(workoutMinutes) || workoutMinutes <= 0) {
      setError('Daily workout minutes goal must be a positive number.');
      return;
    }

    updateGoals({ steps, calories, workoutMinutes });
    setIsGoalModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Set Daily Goals</h2>
              <p className="text-xs text-slate-500">
                Personalize your daily movement and calorie burn targets
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Steps Target */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-500" />
              Daily Steps Goal
            </label>
            <input
              type="number"
              min="100"
              step="500"
              value={formGoals.steps}
              onChange={(e) => setFormGoals({ ...formGoals, steps: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
            <div className="flex gap-2 mt-2">
              {[6000, 8000, 10000, 12000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setFormGoals({ ...formGoals, steps: preset })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    formGoals.steps === preset
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Calories Target */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Daily Active Calories Goal (kcal)
            </label>
            <input
              type="number"
              min="50"
              step="50"
              value={formGoals.calories}
              onChange={(e) => setFormGoals({ ...formGoals, calories: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
            <div className="flex gap-2 mt-2">
              {[300, 500, 750, 1000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setFormGoals({ ...formGoals, calories: preset })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    formGoals.calories === preset
                      ? 'border-amber-500 bg-amber-50 text-amber-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset} kcal
                </button>
              ))}
            </div>
          </div>

          {/* Workout Minutes Target */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              Daily Workout Goal (minutes)
            </label>
            <input
              type="number"
              min="10"
              step="5"
              value={formGoals.workoutMinutes}
              onChange={(e) =>
                setFormGoals({ ...formGoals, workoutMinutes: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
            <div className="flex gap-2 mt-2">
              {[30, 45, 60, 90].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setFormGoals({ ...formGoals, workoutMinutes: preset })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    formGoals.workoutMinutes === preset
                      ? 'border-sky-500 bg-sky-50 text-sky-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Goals</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
