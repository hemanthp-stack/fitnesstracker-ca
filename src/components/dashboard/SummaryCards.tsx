import React from 'react';
import { Clock, Dumbbell, Flame, Footprints } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { formatNumber, formatDuration } from '../../utils/formatters';

export const SummaryCards: React.FC = () => {
  const { todaySummary, goals } = useFitness();

  const stepsPct = Math.min(999, Math.round((todaySummary.totalSteps / goals.steps) * 100));
  const calPct = Math.min(999, Math.round((todaySummary.totalCalories / goals.calories) * 100));
  const durPct = Math.min(
    999,
    Math.round((todaySummary.totalDuration / goals.workoutMinutes) * 100)
  );

  const cards = [
    {
      id: 'steps',
      title: 'Steps Walked',
      value: formatNumber(todaySummary.totalSteps),
      unit: 'steps',
      goalText: `${formatNumber(goals.steps)} goal`,
      pct: stepsPct,
      icon: Footprints,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      barColor: 'bg-emerald-500',
      badgeColor: stepsPct >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'calories',
      title: 'Calories Burned',
      value: formatNumber(todaySummary.totalCalories),
      unit: 'kcal',
      goalText: `${formatNumber(goals.calories)} kcal goal`,
      pct: calPct,
      icon: Flame,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      barColor: 'bg-amber-500',
      badgeColor: calPct >= 100 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'duration',
      title: 'Workout Time',
      value: todaySummary.totalDuration.toString(),
      unit: 'min',
      displayValue: formatDuration(todaySummary.totalDuration),
      goalText: `${goals.workoutMinutes} min goal`,
      pct: durPct,
      icon: Clock,
      color: 'sky',
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
      barColor: 'bg-sky-500',
      badgeColor: durPct >= 100 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700',
    },
    {
      id: 'workouts',
      title: 'Workouts Logged',
      value: todaySummary.workoutCount.toString(),
      unit: todaySummary.workoutCount === 1 ? 'session' : 'sessions',
      goalText: todaySummary.workoutCount > 0 ? 'Logged today' : 'No workout yet',
      pct: null,
      icon: Dumbbell,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      barColor: 'bg-purple-500',
      badgeColor: todaySummary.workoutCount > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              {card.pct !== null ? (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}
                >
                  {card.pct}%
                </span>
              ) : (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}
                >
                  {card.value}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {card.displayValue || card.value}
                </span>
                {!card.displayValue && (
                  <span className="text-xs font-medium text-slate-400">{card.unit}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">{card.goalText}</p>
            </div>

            {/* Subtle bottom progress line */}
            {card.pct !== null && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${card.barColor} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(100, card.pct)}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
