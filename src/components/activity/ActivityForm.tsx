import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Flame,
  Footprints,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import type { ActivityFormData, ActivityFormErrors, ActivityType, FitnessActivity } from '../../types/fitness';

import { useFitness } from '../../context/FitnessContext';
import { ACTIVITY_META, getTodayDateString } from '../../utils/formatters';
import { ActivityIcon } from '../common/ActivityIcon';

interface ActivityFormProps {
  initialActivity?: FitnessActivity | null;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const ACTIVITY_TYPES: ActivityType[] = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Yoga',
  'Swimming',
  'Hiking',
  'HIIT',
  'Other',
];

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialActivity,
  onSubmitSuccess,
  onCancel,
}) => {
  const { addActivity, updateActivity } = useFitness();
  const isEditing = Boolean(initialActivity);

  const [formData, setFormData] = useState<ActivityFormData>({
    type: initialActivity?.type || 'Running',
    customType: initialActivity?.customType || '',
    duration: initialActivity ? initialActivity.duration : 30,
    calories: initialActivity ? initialActivity.calories : 250,
    steps: initialActivity ? initialActivity.steps : 3000,
    date: initialActivity ? initialActivity.date : getTodayDateString(),
    notes: initialActivity?.notes || '',
  });

  const [errors, setErrors] = useState<ActivityFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-estimate calories & steps helper
  const handleAutoEstimate = () => {
    const dur = Number(formData.duration) || 0;
    if (dur <= 0) return;

    const meta = ACTIVITY_META[formData.type];
    const estimatedCal = Math.round(dur * meta.defaultCaloriesPerMin);
    let estimatedSteps = 0;

    if (formData.type === 'Running') {
      estimatedSteps = Math.round(dur * 140);
    } else if (formData.type === 'Walking') {
      estimatedSteps = Math.round(dur * 105);
    } else if (formData.type === 'Hiking') {
      estimatedSteps = Math.round(dur * 110);
    } else if (formData.type === 'HIIT') {
      estimatedSteps = Math.round(dur * 80);
    }

    setFormData((prev) => ({
      ...prev,
      calories: estimatedCal,
      steps: estimatedSteps,
    }));
  };

  const handleTypeSelect = (type: ActivityType) => {
    setFormData((prev) => {
      const dur = Number(prev.duration) || 30;
      const meta = ACTIVITY_META[type];
      const newCal = Math.round(dur * meta.defaultCaloriesPerMin);
      let newSteps = 0;
      if (type === 'Running') newSteps = Math.round(dur * 140);
      else if (type === 'Walking') newSteps = Math.round(dur * 105);
      else if (type === 'Hiking') newSteps = Math.round(dur * 110);

      return {
        ...prev,
        type,
        calories: isEditing ? prev.calories : newCal,
        steps: isEditing ? prev.steps : newSteps,
      };
    });

    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ActivityFormErrors = {};

    // Activity type validation
    if (!formData.type) {
      newErrors.type = 'Please select an activity type.';
    }

    // Duration validation: cannot be negative or empty
    const durationNum = Number(formData.duration);
    if (formData.duration === '' || isNaN(durationNum)) {
      newErrors.duration = 'Workout duration is required.';
    } else if (durationNum <= 0) {
      newErrors.duration = 'Duration must be greater than 0 minutes.';
    }

    // Calories validation: cannot be negative
    const caloriesNum = Number(formData.calories);
    if (formData.calories === '' || isNaN(caloriesNum)) {
      newErrors.calories = 'Calories burned is required.';
    } else if (caloriesNum < 0) {
      newErrors.calories = 'Calories burned cannot be negative.';
    }

    // Steps validation: cannot be negative
    const stepsNum = Number(formData.steps);
    if (formData.steps === '' || isNaN(stepsNum)) {
      newErrors.steps = 'Steps count is required (enter 0 if non-step activity).';
    } else if (stepsNum < 0) {
      newErrors.steps = 'Steps cannot be negative.';
    }

    // Date validation: is required
    if (!formData.date || !formData.date.trim()) {
      newErrors.date = 'Date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && initialActivity) {
        updateActivity(initialActivity.id, formData);
      } else {
        addActivity(formData);
        // Clear form after successful addition as specified in requirement 2
        setFormData({
          type: 'Running',
          customType: '',
          duration: 30,
          calories: 250,
          steps: 3000,
          date: getTodayDateString(),
          notes: '',
        });
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Activity Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Activity / Exercise Type <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {ACTIVITY_TYPES.map((type) => {
            const isSelected = formData.type === type;
            const meta = ACTIVITY_META[type];
            return (
              <button
                type="button"
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mb-1.5 transition-colors ${
                    isSelected ? 'bg-emerald-600 text-white' : `${meta.bgColor} ${meta.textColor}`
                  }`}
                >
                  <ActivityIcon type={type} className="w-4 h-4" />
                </div>
                <span className="text-xs leading-tight">{meta.label.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {formData.type === 'Other' && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="e.g. Pilates, Basketball, Rowing..."
              value={formData.customType || ''}
              onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>
        )}

        {errors.type && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.type}
          </p>
        )}
      </div>

      {/* 2. Duration, Calories & Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Workout Duration */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              Duration (min) <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 45"
              value={formData.duration}
              onChange={(e) => {
                setFormData({ ...formData, duration: e.target.value });
                if (errors.duration) setErrors({ ...errors, duration: undefined });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.duration
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              min
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex gap-1.5 mt-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setFormData({ ...formData, duration: mins })}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
              >
                {mins}m
              </button>
            ))}
          </div>

          {errors.duration && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.duration}
            </p>
          )}
        </div>

        {/* Calories Burned */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Calories (kcal) <span className="text-rose-500">*</span>
            </span>
            <button
              type="button"
              onClick={handleAutoEstimate}
              title="Estimate based on activity and duration"
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <Sparkles className="w-3 h-3" />
              Auto
            </button>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 350"
              value={formData.calories}
              onChange={(e) => {
                setFormData({ ...formData, calories: e.target.value });
                if (errors.calories) setErrors({ ...errors, calories: undefined });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.calories
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              kcal
            </span>
          </div>

          {errors.calories && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.calories}
            </p>
          )}
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-500" />
              Steps <span className="text-rose-500">*</span>
            </span>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, steps: 0 }))}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600"
            >
              0 steps
            </button>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 4500"
              value={formData.steps}
              onChange={(e) => {
                setFormData({ ...formData, steps: e.target.value });
                if (errors.steps) setErrors({ ...errors, steps: undefined });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.steps
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              steps
            </span>
          </div>

          {errors.steps && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.steps}
            </p>
          )}
        </div>
      </div>

      {/* 3. Date & Optional Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              if (errors.date) setErrors({ ...errors, date: undefined });
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.date
                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20'
            }`}
          />
          {errors.date && (
            <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Quick date shortcuts */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Quick Date Select
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, date: getTodayDateString() })}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                const str = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
                setFormData({ ...formData, date: str });
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
            >
              Yesterday
            </button>
          </div>
        </div>
      </div>

      {/* 4. Optional Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <StickyNote className="w-4 h-4 text-slate-400" />
          Optional Notes
        </label>
        <textarea
          rows={2}
          placeholder="How did the session feel? Any personal bests, route notes, or sets?"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm placeholder:text-slate-400 resize-none"
        />
      </div>

      {/* 5. Submit & Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-sm hover:shadow"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{isEditing ? 'Save Changes' : 'Record Activity'}</span>
        </button>
      </div>
    </form>
  );
};
