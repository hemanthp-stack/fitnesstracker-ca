import React from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { AddActivityView } from './components/activity/AddActivityView';
import { ActivityList } from './components/history/ActivityList';
import { WeeklyProgressView } from './components/progress/WeeklyProgressView';
import { ActivityModal } from './components/activity/ActivityModal';
import { DeleteModal } from './components/activity/DeleteModal';
import { GoalSettingsModal } from './components/goals/GoalSettingsModal';

const AppContent: React.FC = () => {
  const { activeTab } = useFitness();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Top Header */}
        <Header />

        {/* Dynamic Tab Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'add' && <AddActivityView />}
          {activeTab === 'history' && <ActivityList />}
          {activeTab === 'progress' && <WeeklyProgressView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <ActivityModal />
      <DeleteModal />
      <GoalSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <AppContent />
    </FitnessProvider>
  );
}
