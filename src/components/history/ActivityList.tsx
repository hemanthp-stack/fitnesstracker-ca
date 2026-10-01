import React, { useMemo, useState } from 'react';
import { Plus, RotateCcw, Search, X } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from '../common/EmptyState';

type SortOption = 'date-desc' | 'date-asc' | 'calories-desc' | 'duration-desc' | 'steps-desc';

export const ActivityList: React.FC = () => {
  const {
    activities,
    setIsAddModalOpen,
    resetSampleData,
    clearSampleDataOnly,
  } = useFitness();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Filter & sort activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        // Type filter
        if (selectedType !== 'ALL' && activity.type !== selectedType) {
          return false;
        }

        // Date range filter
        if (dateFilter !== 'ALL') {
          const actDate = new Date(activity.date);
          const now = new Date();
          const diffDays = (now.getTime() - actDate.getTime()) / (1000 * 3600 * 24);

          if (dateFilter === 'TODAY' && diffDays > 1) return false;
          if (dateFilter === 'WEEK' && diffDays > 7) return false;
          if (dateFilter === 'MONTH' && diffDays > 30) return false;
        }

        // Search text filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchType = activity.type.toLowerCase().includes(query);
          const matchCustom = activity.customType?.toLowerCase().includes(query);
          const matchNotes = activity.notes?.toLowerCase().includes(query);
          if (!matchType && !matchCustom && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
          case 'calories-desc':
            return b.calories - a.calories;
          case 'duration-desc':
            return b.duration - a.duration;
          case 'steps-desc':
            return b.steps - a.steps;
          case 'date-desc':
          default:
            return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [activities, selectedType, dateFilter, searchTerm, sortBy]);

  const hasAnyActivities = activities.length > 0;
  const isFiltered =
    searchTerm !== '' || selectedType !== 'ALL' || dateFilter !== 'ALL' || sortBy !== 'date-desc';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setDateFilter('ALL');
    setSortBy('date-desc');
  };

  const sampleCount = activities.filter((a) => a.isSample).length;

  if (!hasAnyActivities) {
    return (
      <EmptyState
        title="No activities recorded yet"
        description="Your workout history is empty. Start recording your daily workouts to build your fitness log!"
        actionText="Add First Activity"
        onAddClick={() => setIsAddModalOpen(true)}
        onLoadDemoClick={resetSampleData}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Activity Log</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredActivities.length} of {activities.length} recorded workouts
            </p>
          </div>

          <div className="flex items-center gap-2">
            {sampleCount > 0 && (
              <button
                onClick={clearSampleDataOnly}
                className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl font-medium transition-colors"
                title="Remove only sample demo workouts"
              >
                Clear Sample Data ({sampleCount})
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Activity</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search type or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Activity Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by activity type"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Activity Types</option>
              <option value="Running">Running</option>
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
              <option value="Gym">Gym / Strength</option>
              <option value="Yoga">Yoga</option>
              <option value="Swimming">Swimming</option>
              <option value="Hiking">Hiking</option>
              <option value="HIIT">HIIT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              aria-label="Filter by date range"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today Only</option>
              <option value="WEEK">Past 7 Days</option>
              <option value="MONTH">Past 30 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort activities by"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
            >
              <option value="date-desc">Date (Newest first)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="calories-desc">Calories (High to low)</option>
              <option value="duration-desc">Duration (Long to short)</option>
              <option value="steps-desc">Steps (High to low)</option>
            </select>
          </div>
        </div>

        {/* Filter reset helper if active */}
        {isFiltered && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Filtered results: {filteredActivities.length} items</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Activities Grid / Cards */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center my-4">
          <p className="text-slate-600 text-sm font-semibold mb-2">No matching activities</p>
          <p className="text-slate-400 text-xs mb-4">
            Try adjusting your search criteria or clear your current filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};
