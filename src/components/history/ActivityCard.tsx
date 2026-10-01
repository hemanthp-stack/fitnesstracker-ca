import React from 'react';
import { Calendar, Clock, Flame, Footprints, Pencil, Sparkles, Trash2 } from 'lucide-react';
import type { FitnessActivity } from '../../types/fitness';

import { useFitness } from '../../context/FitnessContext';
import {
  ACTIVITY_META,
  formatCalories,
  formatDateLabel,
  formatDuration,
  formatFullDate,
  formatNumber,
} from '../../utils/formatters';
import { ActivityIcon } from '../common/ActivityIcon';

interface ActivityCardProps {
  activity: FitnessActivity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { setEditingActivity, setDeletingActivity } = useFitness();
  const meta = ACTIVITY_META[activity.type] || ACTIVITY_META.Other;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all group relative">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        {/* Type & Date */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl ${meta.bgColor} ${meta.textColor} flex items-center justify-center shrink-0 shadow-2xs`}
          >
            <ActivityIcon type={activity.type} className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base leading-tight">
                {activity.type === 'Other' && activity.customType
                  ? activity.customType
                  : meta.label}
              </h4>

              {activity.isSample && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  Sample Record
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">
                {formatDateLabel(activity.date)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">{formatFullDate(activity.date)}</span>
              {activity.time && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">{activity.time}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setEditingActivity(activity)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Edit activity"
            aria-label="Edit activity"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingActivity(activity)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete activity"
            aria-label="Delete activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/80 rounded-xl border border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Duration
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formatDuration(activity.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Calories
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formatCalories(activity.calories)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Steps
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formatNumber(activity.steps)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes if provided */}
      {activity.notes && (
        <p className="text-xs text-slate-600 italic bg-white px-2 py-1 rounded-lg border-l-2 border-emerald-400 mt-2">
          "{activity.notes}"
        </p>
      )}
    </div>
  );
};
