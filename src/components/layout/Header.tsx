import React, { useState } from 'react';
import { Activity, Calendar, Plus, Smartphone, Sparkles, Target } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { InstallAppModal } from './InstallAppModal';

export const Header: React.FC = () => {
  const {
    activities,
    setIsAddModalOpen,
    setIsGoalModalOpen,
    clearSampleDataOnly,
  } = useFitness();

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const hasSampleData = activities.some((a) => a.isSample);

  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand (Mobile) + Date */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">FitTrack</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedToday}</span>
          </div>
        </div>

        {/* Center / Banner: Sample data notification if sample items exist */}
        {hasSampleData && (
          <div className="hidden md:flex items-center gap-2 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sample records loaded</span>
            <button
              onClick={clearSampleDataOnly}
              className="text-amber-900 font-semibold underline hover:text-amber-700 ml-1 text-[11px]"
            >
              Clear demo data
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
            title="Install FitTrack as App"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Install App</span>
          </button>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition-colors shadow-2xs"
            title="Configure Daily Goals"
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Set Goals</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>
    </header>

    <InstallAppModal
      isOpen={isInstallModalOpen}
      onClose={() => setIsInstallModalOpen(false)}
    />
  </>
  );
};
