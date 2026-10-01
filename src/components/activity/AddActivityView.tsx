import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { ActivityForm } from './ActivityForm';

export const AddActivityView: React.FC = () => {
  const { setActiveTab } = useFitness();

  const handleSuccess = () => {
    // Navigate immediately to dashboard to view updated stats as requested in requirement 2 & 12
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Log New Activity</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Record your workout details to keep your fitness dashboard up to date
            </p>
          </div>
        </div>

        <ActivityForm onSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
};
