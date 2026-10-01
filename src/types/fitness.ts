export type ActivityType =
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Gym'
  | 'Yoga'
  | 'Swimming'
  | 'Hiking'
  | 'HIIT'
  | 'Other';

export interface FitnessActivity {
  id: string;
  type: ActivityType;
  customType?: string;
  duration: number; // in minutes
  calories: number; // in kcal
  steps: number; // count
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  notes?: string;
  isSample?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFormData {
  type: ActivityType;
  customType?: string;
  duration: string | number;
  calories: string | number;
  steps: string | number;
  date: string;
  notes?: string;
}

export interface ActivityFormErrors {
  type?: string;
  duration?: string;
  calories?: string;
  steps?: string;
  date?: string;
}

export interface DailyGoals {
  steps: number;
  calories: number;
  workoutMinutes: number;
}

export interface DailySummary {
  date: string;
  totalSteps: number;
  totalCalories: number;
  totalDuration: number;
  workoutCount: number;
  activities: FitnessActivity[];
}

export interface DayMetricPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  fullDateLabel: string; // e.g. "Oct 1"
  steps: number;
  calories: number;
  duration: number;
  count: number;
  isToday: boolean;
}

export interface WeeklyStats {
  totalSteps: number;
  totalCalories: number;
  totalDuration: number;
  workoutCount: number;
  avgSteps: number;
  avgCalories: number;
  avgDuration: number;
  dailyPoints: DayMetricPoint[];
}

export type MetricType = 'calories' | 'steps' | 'duration';

export type NavTab = 'dashboard' | 'add' | 'history' | 'progress';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
