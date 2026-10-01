import React from 'react';
import { CheckCircle2, Flame, Footprints, Clock, SlidersHorizontal, Trophy } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { formatNumber } from '../../utils/formatters';

export const GoalProgress: React.FC = () => {
  const { todaySummary, goals, setIsGoalModalOpen } = useFitness();

  const stepsPct = Math.round((todaySummary.totalSteps / goals.steps) * 100);
  const calPct = Math.round((todaySummary.totalCalories / goals.calories) * 100);
  const durPct = Math.round((todaySummary.totalDuration / goals.workoutMinutes) * 100);

  const completedGoalsCount = [stepsPct >= 100, calPct >= 100, durPct >= 100].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Daily Targets</h3>
            {completedGoalsCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Trophy className="w-3 h-3 text-emerald-600" />
                {completedGoalsCount}/3 Completed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your daily targets and celebrate every milestone
          </p>
        </div>

        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Adjust Goals</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Goal */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Steps</span>
            </div>
            {stepsPct >= 100 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Goal Met!
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-600">{stepsPct}%</span>
            )}
          </div>

          <div className="mb-2">
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="font-bold text-slate-900 text-base">
                {formatNumber(todaySummary.totalSteps)}
              </span>
              <span className="text-xs text-slate-500">
                / {formatNumber(goals.steps)} steps
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  stepsPct >= 100 ? 'bg-emerald-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, stepsPct)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {todaySummary.totalSteps >= goals.steps
              ? `Surpassed goal by ${formatNumber(todaySummary.totalSteps - goals.steps)} steps!`
              : `${formatNumber(Math.max(0, goals.steps - todaySummary.totalSteps))} steps left today`}
          </p>
        </div>

        {/* Calories Goal */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Calories</span>
            </div>
            {calPct >= 100 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <CheckCircle2 className="w-4 h-4" /> Goal Met!
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-600">{calPct}%</span>
            )}
          </div>

          <div className="mb-2">
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="font-bold text-slate-900 text-base">
                {formatNumber(todaySummary.totalCalories)}
              </span>
              <span className="text-xs text-slate-500">
                / {formatNumber(goals.calories)} kcal
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  calPct >= 100 ? 'bg-amber-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, calPct)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {todaySummary.totalCalories >= goals.calories
              ? `Burned ${formatNumber(todaySummary.totalCalories - goals.calories)} kcal over target!`
              : `${formatNumber(Math.max(0, goals.calories - todaySummary.totalCalories))} kcal to reach target`}
          </p>
        </div>

        {/* Workout Minutes Goal */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100/80 text-sky-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">Workout Time</span>
            </div>
            {durPct >= 100 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-sky-600">
                <CheckCircle2 className="w-4 h-4" /> Goal Met!
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-600">{durPct}%</span>
            )}
          </div>

          <div className="mb-2">
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="font-bold text-slate-900 text-base">
                {todaySummary.totalDuration}
              </span>
              <span className="text-xs text-slate-500">
                / {goals.workoutMinutes} min
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  durPct >= 100 ? 'bg-sky-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, durPct)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {todaySummary.totalDuration >= goals.workoutMinutes
              ? `Surpassed workout goal by ${todaySummary.totalDuration - goals.workoutMinutes} min!`
              : `${Math.max(0, goals.workoutMinutes - todaySummary.totalDuration)} min workout remaining`}
          </p>
        </div>
      </div>
    </div>
  );
};
