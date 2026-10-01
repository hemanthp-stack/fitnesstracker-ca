import React from 'react';
import {
  Activity,
  BarChart3,
  History,
  LayoutDashboard,
  PlusCircle,
  RotateCcw,
  Target,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import type { NavTab } from '../../types/fitness';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: "Today's stats & overview",
  },
  {
    id: 'add',
    label: 'Add Activity',
    icon: PlusCircle,
    description: 'Log new workout or steps',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    description: 'Past workouts & logs',
  },
  {
    id: 'progress',
    label: 'Weekly Progress',
    icon: BarChart3,
    description: '7-day statistics & trends',
  },
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsGoalModalOpen,
    goals,
    todaySummary,
    resetSampleData,
    clearAllData,
  } = useFitness();

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
  };

  const stepsPct = Math.min(100, Math.round((todaySummary.totalSteps / goals.steps) * 100));
  const calPct = Math.min(100, Math.round((todaySummary.totalCalories / goals.calories) * 100));

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Activity className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
            FitTrack
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              v1.0
            </span>
          </span>
          <p className="text-xs text-slate-400 font-medium">Daily Fitness Companion</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-8">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-sm shadow-emerald-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <div className="truncate">
                <div className="leading-tight">{item.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Target Quick Glance Card */}
      <div className="mt-auto pt-4 border-t border-slate-100 mb-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              Today's Target
            </span>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 mt-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Steps</span>
                <span className="font-semibold text-slate-700">{stepsPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stepsPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Calories</span>
                <span className="font-semibold text-slate-700">{calPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${calPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Data Controls */}
      <div className="pt-2 text-xs text-slate-400 space-y-1.5">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Data Management
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={resetSampleData}
            title="Reset to sample demo activities"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-[11px] font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={clearAllData}
            title="Clear all stored fitness data"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors text-[11px] font-medium"
          >
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
