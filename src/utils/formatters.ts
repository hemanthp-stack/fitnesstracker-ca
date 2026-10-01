import type { ActivityType } from '../types/fitness';


export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num || 0));
}

export function formatDuration(minutes: number): string {
  const mins = Math.max(0, Math.round(minutes || 0));
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function formatCalories(cal: number): string {
  return `${formatNumber(cal)} kcal`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export interface ActivityMetadata {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  defaultCaloriesPerMin: number;
  hasSteps: boolean;
}

export const ACTIVITY_META: Record<ActivityType, ActivityMetadata> = {
  Running: {
    label: 'Running',
    color: '#f97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    defaultCaloriesPerMin: 11,
    hasSteps: true,
  },
  Walking: {
    label: 'Walking',
    color: '#10b981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    defaultCaloriesPerMin: 4.5,
    hasSteps: true,
  },
  Cycling: {
    label: 'Cycling',
    color: '#0284c7',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
    defaultCaloriesPerMin: 8.5,
    hasSteps: false,
  },
  Gym: {
    label: 'Gym / Strength',
    color: '#8b5cf6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    defaultCaloriesPerMin: 6.5,
    hasSteps: false,
  },
  Yoga: {
    label: 'Yoga & Stretch',
    color: '#6366f1',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
    defaultCaloriesPerMin: 3.5,
    hasSteps: false,
  },
  Swimming: {
    label: 'Swimming',
    color: '#06b6d4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-700',
    defaultCaloriesPerMin: 9,
    hasSteps: false,
  },
  Hiking: {
    label: 'Hiking',
    color: '#d97706',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    defaultCaloriesPerMin: 7,
    hasSteps: true,
  },
  HIIT: {
    label: 'HIIT / Cardio',
    color: '#ef4444',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    defaultCaloriesPerMin: 12,
    hasSteps: true,
  },
  Other: {
    label: 'Other Activity',
    color: '#64748b',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-600',
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-700',
    defaultCaloriesPerMin: 5,
    hasSteps: false,
  },
};
