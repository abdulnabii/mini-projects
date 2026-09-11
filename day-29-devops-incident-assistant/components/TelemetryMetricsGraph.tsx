'use client';

import { useState } from 'react';
import { TelemetryPoint, ErrorBudget } from '@/types';
import {
  TrendingUp,
  Activity,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';

interface Props {
  telemetry: TelemetryPoint[];
  errorBudget?: ErrorBudget;
  serviceName: string;
  isResolved?: boolean;
}

export default function TelemetryMetricsGraph({
  telemetry,
  errorBudget,
  serviceName,
  isResolved = false,
}: Props) {
  const [activeMetric, setActiveMetric] = useState<'errorRate' | 'latency' | 'saturation'>('errorRate');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute points adjusted for resolution state
  const points = telemetry.map((pt, idx) => {
    if (isResolved && idx >= Math.floor(telemetry.length / 2)) {
      return {
        ...pt,
        errorRate: 0.01,
        p95Latency: 38,
        p99Latency: 62,
        resourceSaturation: 18.5,
      };
    }
    return pt;
  });

  const budget = errorBudget || {
    targetSlo: 99.9,
    periodDays: 30,
    totalBudgetMinutes: 43.2,
    minutesBurned: isResolved ? 18.0 : 21.4,
    burnRateMultiplier: isResolved ? 0.9 : 14.4,
    estimatedExhaustionHours: isResolved ? 999 : 2.4,
  };

  const budgetRemainingPercent = Math.max(
    0,
    Math.round(((budget.totalBudgetMinutes - budget.minutesBurned) / budget.totalBudgetMinutes) * 100)
  );

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Compute Min & Max values based on activeMetric
  let maxVal = 100;
  let minVal = 0;
  if (activeMetric === 'errorRate') {
    maxVal = 100;
    minVal = 0;
  } else if (activeMetric === 'latency') {
    const latVals = points.map((p) => p.p99Latency);
    maxVal = Math.max(...latVals, 500);
    minVal = 0;
  } else {
    maxVal = 100;
    minVal = 0;
  }

  const getX = (idx: number) => padding.left + (idx / Math.max(1, points.length - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - minVal) / Math.max(1, maxVal - minVal)) * graphHeight;

  // Build SVG Path
  const pathD = points.reduce((acc, pt, idx) => {
    const val =
      activeMetric === 'errorRate'
        ? pt.errorRate
        : activeMetric === 'latency'
        ? pt.p95Latency
        : pt.resourceSaturation;
    const x = getX(idx);
    const y = getY(val);
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Build Area Fill Path
  const areaD = `${pathD} L ${getX(points.length - 1)},${padding.top + graphHeight} L ${getX(0)},${padding.top + graphHeight} Z`;

  const getMetricColor = () => {
    if (isResolved) return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400' };
    switch (activeMetric) {
      case 'errorRate':
        return { stroke: '#f43f5e', fill: 'rgba(244, 63, 94, 0.15)', text: 'text-rose-400' };
      case 'latency':
        return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400' };
      default:
        return { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.15)', text: 'text-cyan-400' };
    }
  };

  const colors = getMetricColor();

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-4 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header & Metric Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Real-Time SRE Telemetry &amp; Error Budget
            </h3>
            <p className="text-[10px] text-slate-400 font-sans">
              Sub-second metrics correlation &amp; SLO burn rate tracking
            </p>
          </div>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#04080e] border border-white/[0.08] text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMetric('errorRate')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeMetric === 'errorRate' ? 'bg-rose-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTTP 5xx Error %
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('latency')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeMetric === 'latency' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Latency p95 (ms)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('saturation')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeMetric === 'saturation' ? 'bg-cyan-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pool / Memory %
          </button>
        </div>
      </div>

      {/* SVG Time-Series Chart */}
      <div className="p-3 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-2 relative">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-bold text-white">
            {activeMetric === 'errorRate' && 'Failure Rate Timeline (%)'}
            {activeMetric === 'latency' && 'Roundtrip Latency p95 Timeline (ms)'}
            {activeMetric === 'saturation' && 'Resource Pool Saturation Timeline (%)'}
          </span>
          <span className={colors.text}>
            {isResolved ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Stabilized at Baseline</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Outage Active (Breach Peak)</span>
              </span>
            )}
          </span>
        </div>

        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-44 select-none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + graphHeight * (1 - ratio);
              const label = Math.round(minVal + ratio * (maxVal - minVal));
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(148, 163, 184, 0.6)"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {label}
                    {activeMetric === 'latency' ? 'ms' : '%'}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Fill */}
            <path d={areaD} fill={colors.fill} />

            {/* Sparkline Curve */}
            <path
              d={pathD}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Incident Onset Marker Line */}
            {points.length > 2 && (
              <g>
                <line
                  x1={getX(Math.floor(points.length / 3))}
                  y1={padding.top}
                  x2={getX(Math.floor(points.length / 3))}
                  y2={padding.top + graphHeight}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={getX(Math.floor(points.length / 3)) + 4}
                  y={padding.top + 12}
                  fill="#f43f5e"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Incident Onset
                </text>
              </g>
            )}

            {/* Points & Interactive Tooltips */}
            {points.map((pt, idx) => {
              const val =
                activeMetric === 'errorRate'
                  ? pt.errorRate
                  : activeMetric === 'latency'
                  ? pt.p95Latency
                  : pt.resourceSaturation;
              const x = getX(idx);
              const y = getY(val);
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5 : 2.5}
                    fill={colors.stroke}
                    stroke="#04060a"
                    strokeWidth="1.5"
                  />
                  {/* Invisible hit area */}
                  <rect
                    x={x - 10}
                    y={padding.top}
                    width={20}
                    height={graphHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}

            {/* Tooltip Overlay */}
            {hoveredIndex !== null && (
              <g>
                <line
                  x1={getX(hoveredIndex)}
                  y1={padding.top}
                  x2={getX(hoveredIndex)}
                  y2={padding.top + graphHeight}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeDasharray="2 2"
                />
                <rect
                  x={Math.min(getX(hoveredIndex) - 40, svgWidth - 110)}
                  y={padding.top + 5}
                  width="100"
                  height="34"
                  rx="4"
                  fill="#090d16"
                  stroke="rgba(255, 255, 255, 0.2)"
                />
                <text
                  x={Math.min(getX(hoveredIndex) - 35, svgWidth - 105) + 45}
                  y={padding.top + 18}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {points[hoveredIndex].timestamp}
                </text>
                <text
                  x={Math.min(getX(hoveredIndex) - 35, svgWidth - 105) + 45}
                  y={padding.top + 30}
                  textAnchor="middle"
                  fill={colors.stroke}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {activeMetric === 'errorRate' && `${points[hoveredIndex].errorRate}% errors`}
                  {activeMetric === 'latency' && `${points[hoveredIndex].p95Latency}ms p95`}
                  {activeMetric === 'saturation' && `${points[hoveredIndex].resourceSaturation}% used`}
                </text>
              </g>
            )}

            {/* X-Axis Labels */}
            {points.map((pt, idx) => {
              if (idx % 2 !== 0 && idx !== points.length - 1) return null;
              return (
                <text
                  key={idx}
                  x={getX(idx)}
                  y={padding.top + graphHeight + 16}
                  textAnchor="middle"
                  fill="rgba(148, 163, 184, 0.6)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {pt.timestamp}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SRE SLO Error Budget Burn Rate Card */}
      <div className="p-3.5 rounded-xl bg-[#04080e] border border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`w-3.5 h-3.5 ${budget.burnRateMultiplier > 1 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              SLO Error Budget Burn Rate Monitor
            </span>
          </div>
          <span className="text-[10px] font-bold text-cyan-400">
            Target SLO: {budget.targetSlo}% (Three Nines)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>
              Remaining Budget: <strong className={budgetRemainingPercent < 25 ? 'text-rose-400' : 'text-emerald-400'}>{budgetRemainingPercent}%</strong>
            </span>
            <span>
              Burned: <strong className="text-white">{budget.minutesBurned} min</strong> / {budget.totalBudgetMinutes} min (30d)
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#0b101b] rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isResolved
                  ? 'bg-emerald-400'
                  : budgetRemainingPercent < 30
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500'
              }`}
              style={{ width: `${budgetRemainingPercent}%` }}
            />
          </div>
        </div>

        {/* SRE Burn Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-1 border-t border-white/[0.04]">
          <div className="p-2 rounded bg-[#090d15] border border-white/[0.04] space-y-0.5">
            <span className="text-slate-500 block">Burn Rate Multiplier</span>
            <p className={`font-bold ${isResolved ? 'text-emerald-400' : budget.burnRateMultiplier > 5 ? 'text-rose-400' : 'text-amber-400'}`}>
              {budget.burnRateMultiplier}x normal rate
            </p>
          </div>

          <div className="p-2 rounded bg-[#090d15] border border-white/[0.04] space-y-0.5">
            <span className="text-slate-500 block">Est. Time to Budget 0%</span>
            <p className={`font-bold ${isResolved ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isResolved ? 'Budget Safe (No burn)' : `${budget.estimatedExhaustionHours} hours remaining`}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2 rounded bg-[#090d15] border border-white/[0.04] space-y-0.5">
            <span className="text-slate-500 block">Alert Escalation</span>
            <p className={`font-bold ${isResolved ? 'text-emerald-400' : 'text-amber-300'}`}>
              {isResolved ? 'PAGERS RESOLVED' : 'PAGE P1 ESCALATION'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
