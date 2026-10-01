import React, { useState } from 'react';
import { Flame, Footprints, Clock } from 'lucide-react';
import type { DayMetricPoint, MetricType } from '../../types/fitness';
import { formatNumber, formatDuration } from '../../utils/formatters';

interface WeeklyChartProps {
  dailyPoints: DayMetricPoint[];
  metric: MetricType;
  onMetricChange?: (metric: MetricType) => void;
  targetValue?: number;
  height?: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  dailyPoints,
  metric,
  onMetricChange,
  targetValue,
  height = 240,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DayMetricPoint | null>(null);

  // Metric metadata
  const metricConfig = {
    calories: {
      label: 'Calories',
      unit: 'kcal',
      color: '#f59e0b', // amber-500
      hoverColor: '#d97706',
      icon: Flame,
      getValue: (p: DayMetricPoint) => p.calories,
      format: (v: number) => `${formatNumber(v)} kcal`,
    },
    steps: {
      label: 'Steps',
      unit: 'steps',
      color: '#10b981', // emerald-500
      hoverColor: '#059669',
      icon: Footprints,
      getValue: (p: DayMetricPoint) => p.steps,
      format: (v: number) => `${formatNumber(v)} steps`,
    },
    duration: {
      label: 'Workout Time',
      unit: 'min',
      color: '#0284c7', // sky-600
      hoverColor: '#0369a1',
      icon: Clock,
      getValue: (p: DayMetricPoint) => p.duration,
      format: (v: number) => formatDuration(v),
    },
  }[metric];

  // Calculate scales
  const values = dailyPoints.map(metricConfig.getValue);
  const maxDataVal = Math.max(...values, 0);
  const maxTarget = targetValue || 0;
  const maxVal = Math.max(maxDataVal, maxTarget, 10);
  // Add 15% top padding to max value for nice aesthetics
  const chartMax = Math.ceil((maxVal * 1.15) / 10) * 10;

  // Chart dimensions inside SVG viewBox
  const chartWidth = 560;
  const chartHeight = height;
  const paddingTop = 25;
  const paddingBottom = 40;
  const paddingLeft = 45;
  const paddingRight = 15;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const colWidth = plotWidth / dailyPoints.length;
  const barWidth = Math.min(36, colWidth * 0.55);

  // Grid line values (4 lines: 0, 33%, 66%, 100%)
  const gridSteps = [0, 0.33, 0.66, 1];

  return (
    <div className="w-full">
      {/* Metric Selector Tabs */}
      {onMetricChange && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Activity Over Last 7 Days
          </div>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onMetricChange('calories')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                metric === 'calories'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Calories</span>
            </button>
            <button
              onClick={() => onMetricChange('steps')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                metric === 'steps'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-emerald-500" />
              <span>Steps</span>
            </button>
            <button
              onClick={() => onMetricChange('duration')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                metric === 'duration'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Duration</span>
            </button>
          </div>
        </div>
      )}

      {/* Hover Info Tooltip Bar */}
      <div className="h-6 mb-2 flex items-center justify-between text-xs px-1 text-slate-600">
        {hoveredPoint ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {hoveredPoint.fullDateLabel} ({hoveredPoint.dayLabel}):
            </span>
            <span
              className="font-bold px-2 py-0.5 rounded-md text-white text-[11px]"
              style={{ backgroundColor: metricConfig.color }}
            >
              {metricConfig.format(metricConfig.getValue(hoveredPoint))}
            </span>
            <span className="text-slate-400">
              • {hoveredPoint.count} {hoveredPoint.count === 1 ? 'workout' : 'workouts'}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">
            Hover over bars to inspect daily details
          </span>
        )}
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Background grid lines */}
          {gridSteps.map((step, idx) => {
            const y = paddingTop + plotHeight * (1 - step);
            const val = Math.round(chartMax * step);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={step > 0 ? '4 4' : 'none'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  className="font-mono font-medium"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Goal reference dashed line */}
          {targetValue && targetValue > 0 && targetValue <= chartMax && (
            <g>
              <line
                x1={paddingLeft}
                y1={paddingTop + plotHeight * (1 - targetValue / chartMax)}
                x2={chartWidth - paddingRight}
                y2={paddingTop + plotHeight * (1 - targetValue / chartMax)}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.45"
              />
              <text
                x={chartWidth - paddingRight}
                y={paddingTop + plotHeight * (1 - targetValue / chartMax) - 4}
                textAnchor="end"
                fontSize="9"
                fill="#64748b"
                className="font-semibold uppercase tracking-wider"
              >
                Target ({targetValue})
              </text>
            </g>
          )}

          {/* Daily Bars */}
          {dailyPoints.map((point, index) => {
            const val = metricConfig.getValue(point);
            const barHeight = val > 0 ? Math.max(4, (val / chartMax) * plotHeight) : 0;
            const x = paddingLeft + index * colWidth + (colWidth - barWidth) / 2;
            const y = paddingTop + plotHeight - barHeight;
            const isHovered = hoveredPoint?.date === point.date;

            return (
              <g
                key={point.date}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Hit test area for easier hovering */}
                <rect
                  x={paddingLeft + index * colWidth}
                  y={paddingTop}
                  width={colWidth}
                  height={plotHeight + 25}
                  fill="transparent"
                />

                {/* Bar Background Track */}
                <rect
                  x={x}
                  y={paddingTop}
                  width={barWidth}
                  height={plotHeight}
                  rx={barWidth / 2}
                  fill="#f8fafc"
                />

                {/* Actual Metric Bar */}
                {barHeight > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={barWidth / 4}
                    fill={isHovered ? metricConfig.hoverColor : metricConfig.color}
                    opacity={point.isToday ? 1 : 0.85}
                    className="transition-all duration-300"
                  />
                )}

                {/* Today Marker or Label */}
                {point.isToday && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={paddingTop + plotHeight + 18}
                    r="2.5"
                    fill="#10b981"
                  />
                )}

                {/* Day of Week Label */}
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + plotHeight + (point.isToday ? 30 : 22)}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={point.isToday ? '700' : '500'}
                  fill={point.isToday ? '#0f172a' : '#64748b'}
                >
                  {point.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Summary footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: metricConfig.color }}
            />
            <span>Daily {metricConfig.label}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-600 font-medium">Today</span>
          </span>
        </div>
        <span className="text-slate-400 font-medium">
          Total: {metricConfig.format(values.reduce((a, b) => a + b, 0))}
        </span>
      </div>
    </div>
  );
};
