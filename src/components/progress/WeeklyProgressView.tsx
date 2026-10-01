import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  Plus,
  TrendingUp,
} from 'lucide-react';
import type { MetricType } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { formatCalories, formatDuration, formatNumber } from '../../utils/formatters';
import { WeeklyChart } from './WeeklyChart';
import { EmptyState } from '../common/EmptyState';

export const WeeklyProgressView: React.FC = () => {
  const { weeklyStats, goals, setIsAddModalOpen, resetSampleData } = useFitness();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('calories');

  const hasAnyData = weeklyStats.workoutCount > 0 || weeklyStats.totalCalories > 0;

  if (!hasAnyData) {
    return (
      <EmptyState
        title="No activities recorded yet. Add your first workout!"
        description="Your 7-day progress chart will appear once you record your first workout or steps."
        actionText="Log First Workout"
        onAddClick={() => setIsAddModalOpen(true)}
        onLoadDemoClick={resetSampleData}
      />
    );
  }

  // Target value corresponding to active metric
  const targetMap: Record<MetricType, number> = {
    calories: goals.calories,
    steps: goals.steps,
    duration: goals.workoutMinutes,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Weekly Performance</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated metrics and daily breakdown for the past 7 days
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* 2. Four Weekly Stat Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Steps */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Steps</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatNumber(weeklyStats.totalSteps)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Avg: <span className="font-semibold text-slate-600">{formatNumber(weeklyStats.avgSteps)}</span> / day
          </p>
        </div>

        {/* Total Calories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Calories</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCalories(weeklyStats.totalCalories)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Avg: <span className="font-semibold text-slate-600">{formatNumber(weeklyStats.avgCalories)} kcal</span> / day
          </p>
        </div>

        {/* Total Workout Minutes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Workout Time</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatDuration(weeklyStats.totalDuration)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Avg: <span className="font-semibold text-slate-600">{weeklyStats.avgDuration} min</span> / day
          </p>
        </div>

        {/* Number of Workouts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Workouts</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {weeklyStats.workoutCount}{' '}
            <span className="text-sm font-medium text-slate-400">
              {weeklyStats.workoutCount === 1 ? 'session' : 'sessions'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across the past 7 days
          </p>
        </div>
      </div>

      {/* 3. 7-Day Chart Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <WeeklyChart
          dailyPoints={weeklyStats.dailyPoints}
          metric={selectedMetric}
          onMetricChange={setSelectedMetric}
          targetValue={targetMap[selectedMetric]}
          height={260}
        />
      </div>

      {/* 4. Daily Breakdown List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">7-Day Detailed Breakdown</h4>
            <p className="text-xs text-slate-500">Daily results from newest to oldest</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Workouts</th>
                <th className="py-3 px-3">Steps</th>
                <th className="py-3 px-3">Calories</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3 text-right">Goal Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Reverse to show today first */}
              {[...weeklyStats.dailyPoints].reverse().map((point) => {
                const metSteps = point.steps >= goals.steps;
                const metCal = point.calories >= goals.calories;
                const metDur = point.duration >= goals.workoutMinutes;
                const allMet = metSteps && metCal && metDur;
                const anyMet = metSteps || metCal || metDur;

                return (
                  <tr
                    key={point.date}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      point.isToday ? 'bg-emerald-50/30 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{point.dayLabel}</span>
                        <span className="text-slate-400 text-xs">({point.fullDateLabel})</span>
                        {point.isToday && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {point.count > 0 ? (
                        <span className="font-semibold text-slate-900">
                          {point.count} {point.count === 1 ? 'activity' : 'activities'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Rest day</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={metSteps ? 'font-bold text-emerald-600' : 'text-slate-700'}>
                        {formatNumber(point.steps)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={metCal ? 'font-bold text-amber-600' : 'text-slate-700'}>
                        {formatNumber(point.calories)} kcal
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={metDur ? 'font-bold text-sky-600' : 'text-slate-700'}>
                        {formatDuration(point.duration)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {allMet ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> All Goals
                        </span>
                      ) : anyMet ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          Target Hit
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
