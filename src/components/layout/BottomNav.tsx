import React from 'react';
import { BarChart3, History, LayoutDashboard, PlusCircle } from 'lucide-react';
import type { NavTab } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';


export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFitness();

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Add Activity', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-50 text-emerald-600 scale-105' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
