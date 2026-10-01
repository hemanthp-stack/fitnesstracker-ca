import React, { createContext, useContext, useMemo, useState } from 'react';
import type {
  ActivityFormData,
  DailyGoals,
  DailySummary,
  DayMetricPoint,
  FitnessActivity,
  NavTab,
  ToastMessage,
  WeeklyStats,
} from '../types/fitness';
import { storageService } from '../services/storageService';
import { getTodayDateString } from '../utils/formatters';

interface FitnessContextType {
  activities: FitnessActivity[];
  goals: DailyGoals;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  todaySummary: DailySummary;
  weeklyStats: WeeklyStats;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  addActivity: (formData: ActivityFormData) => boolean;
  updateActivity: (id: string, formData: ActivityFormData) => boolean;
  deleteActivity: (id: string) => boolean;
  updateGoals: (newGoals: DailyGoals) => void;
  resetSampleData: () => void;
  clearSampleDataOnly: () => void;
  clearAllData: () => void;
  // Modal state helpers
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingActivity: FitnessActivity | null;
  setEditingActivity: (activity: FitnessActivity | null) => void;
  deletingActivity: FitnessActivity | null;
  setDeletingActivity: (activity: FitnessActivity | null) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<FitnessActivity[]>(() => {
    return storageService.initialize().activities;
  });
  const [goals, setGoals] = useState<DailyGoals>(() => {
    return storageService.loadGoals();
  });
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<FitnessActivity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<FitnessActivity | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Today's summary computation
  const todayDate = getTodayDateString();
  const todaySummary = useMemo<DailySummary>(() => {
    const todayActs = activities.filter((a) => a.date === todayDate);
    const totalSteps = todayActs.reduce((acc, curr) => acc + (Number(curr.steps) || 0), 0);
    const totalCalories = todayActs.reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0);
    const totalDuration = todayActs.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

    return {
      date: todayDate,
      totalSteps,
      totalCalories,
      totalDuration,
      workoutCount: todayActs.length,
      activities: todayActs,
    };
  }, [activities, todayDate]);

  // Weekly stats for the last 7 days (including today)
  const weeklyStats = useMemo<WeeklyStats>(() => {
    const points: DayMetricPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isToday = i === 0;

      const dayActs = activities.filter((a) => a.date === dateStr);
      const steps = dayActs.reduce((sum, a) => sum + (Number(a.steps) || 0), 0);
      const calories = dayActs.reduce((sum, a) => sum + (Number(a.calories) || 0), 0);
      const duration = dayActs.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);

      points.push({
        date: dateStr,
        dayLabel,
        fullDateLabel,
        steps,
        calories,
        duration,
        count: dayActs.length,
        isToday,
      });
    }

    const totalSteps = points.reduce((sum, p) => sum + p.steps, 0);
    const totalCalories = points.reduce((sum, p) => sum + p.calories, 0);
    const totalDuration = points.reduce((sum, p) => sum + p.duration, 0);
    const workoutCount = points.reduce((sum, p) => sum + p.count, 0);

    return {
      totalSteps,
      totalCalories,
      totalDuration,
      workoutCount,
      avgSteps: Math.round(totalSteps / 7),
      avgCalories: Math.round(totalCalories / 7),
      avgDuration: Math.round(totalDuration / 7),
      dailyPoints: points,
    };
  }, [activities]);

  const addActivity = (formData: ActivityFormData): boolean => {
    const durationNum = Number(formData.duration);
    const caloriesNum = Number(formData.calories);
    const stepsNum = Number(formData.steps) || 0;

    const newActivity = storageService.addActivity({
      type: formData.type,
      customType: formData.customType?.trim(),
      duration: durationNum,
      calories: caloriesNum,
      steps: stepsNum,
      date: formData.date,
      notes: formData.notes?.trim() || undefined,
    });

    setActivities((prev) => [newActivity, ...prev]);
    showToast(
      'success',
      'Activity Saved!',
      `Logged ${formData.type} (${durationNum} min, ${caloriesNum} kcal).`
    );
    return true;
  };

  const updateActivity = (id: string, formData: ActivityFormData): boolean => {
    const durationNum = Number(formData.duration);
    const caloriesNum = Number(formData.calories);
    const stepsNum = Number(formData.steps) || 0;

    const updated = storageService.updateActivity(id, {
      type: formData.type,
      customType: formData.customType?.trim(),
      duration: durationNum,
      calories: caloriesNum,
      steps: stepsNum,
      date: formData.date,
      notes: formData.notes?.trim() || undefined,
    });

    if (updated) {
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('success', 'Activity Updated', 'Changes were saved successfully.');
      return true;
    }
    showToast('error', 'Update Failed', 'Could not locate the activity record.');
    return false;
  };

  const deleteActivity = (id: string): boolean => {
    const act = activities.find((a) => a.id === id);
    const success = storageService.deleteActivity(id);
    if (success) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      showToast(
        'info',
        'Activity Deleted',
        act ? `Removed ${act.type} (${act.duration} min).` : 'Activity deleted successfully.'
      );
      return true;
    }
    return false;
  };

  const updateGoals = (newGoals: DailyGoals) => {
    storageService.saveGoals(newGoals);
    setGoals(newGoals);
    showToast('success', 'Goals Updated', 'Your daily targets have been refreshed.');
  };

  const resetSampleData = () => {
    const sample = storageService.resetToSampleData();
    setActivities(sample);
    showToast('info', 'Demo Data Restored', 'Sample activities loaded across the last 7 days.');
  };

  const clearSampleDataOnly = () => {
    const userOnly = storageService.clearSampleActivitiesOnly();
    setActivities(userOnly);
    showToast('info', 'Demo Records Cleared', 'All sample records have been removed.');
  };

  const clearAllData = () => {
    storageService.clearAllActivities();
    setActivities([]);
    showToast('info', 'All Data Cleared', 'Fitness history has been reset.');
  };

  return (
    <FitnessContext.Provider
      value={{
        activities,
        goals,
        activeTab,
        setActiveTab,
        todaySummary,
        weeklyStats,
        toasts,
        showToast,
        dismissToast,
        addActivity,
        updateActivity,
        deleteActivity,
        updateGoals,
        resetSampleData,
        clearSampleDataOnly,
        clearAllData,
        isAddModalOpen,
        setIsAddModalOpen,
        editingActivity,
        setEditingActivity,
        deletingActivity,
        setDeletingActivity,
        isGoalModalOpen,
        setIsGoalModalOpen,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export function useFitness(): FitnessContextType {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
