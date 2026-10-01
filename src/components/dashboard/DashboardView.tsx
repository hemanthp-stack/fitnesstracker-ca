import React, { useState } from 'react';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import type { MetricType } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { SummaryCards } from './SummaryCards';
import { GoalProgress } from './GoalProgress';
import { WeeklyChart } from '../progress/WeeklyChart';
import { ActivityCard } from '../history/ActivityCard';
import { EmptyState } from '../common/EmptyState';

export const DashboardView: React.FC = () => {
  const {
    activities,
    weeklyStats,
    goals,
    setActiveTab,
    setIsAddModalOpen,
    resetSampleData,
  } = useFitness();

  const [dashboardMetric, setDashboardMetric] = useState<MetricType>('calories');

  const hasAnyActivities = activities.length > 0;
  const recentActivities = activities.slice(0, 3);

  const targetMap: Record<MetricType, number> = {
    calories: goals.calories,
    steps: goals.steps,
    duration: goals.workoutMinutes,
  };

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 translate-y-12 w-48 h-48 bg-teal-300/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-emerald-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              FitTrack Daily Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Stay active, reach your goals!
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Track your daily steps, active calories, and workout duration. Every step counts
              towards a healthier lifestyle.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-emerald-800 font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Fitness Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Today's Summary</h3>
          <span className="text-xs text-slate-400 font-medium">Updated in real-time</span>
        </div>
        <SummaryCards />
      </div>

      {/* 3. Daily Goals Progress Bars */}
      <GoalProgress />

      {/* 4. Weekly Progress Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">7-Day Activity Trends</h3>
            <p className="text-xs text-slate-500">
              Overview of your movement and workout habits over the past week
            </p>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <span>Full Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!hasAnyActivities ? (
          <EmptyState
            title="No activities recorded yet. Add your first workout!"
            description="Add your first workout to generate your 7-day fitness trends!"
            actionText="Add Activity"
            onAddClick={() => setIsAddModalOpen(true)}
            onLoadDemoClick={resetSampleData}
          />
        ) : (
          <WeeklyChart
            dailyPoints={weeklyStats.dailyPoints}
            metric={dashboardMetric}
            onMetricChange={setDashboardMetric}
            targetValue={targetMap[dashboardMetric]}
            height={220}
          />
        )}
      </div>

      {/* 5. Recent Activities Section */}
      {hasAnyActivities && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Recent Workouts</h3>
              <p className="text-xs text-slate-400">Latest logged fitness sessions</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
