import { useState } from 'react';
import type { Entry } from '../../types';
import { formatShortDate } from '../../utils/date';

interface LineChartProps {
  entries: Entry[];
  color: string;
  unit: string;
}

const W = 760;
const H = 280;
const PAD_L = 48;
const PAD_R = 24;
const PAD_T = 36;
const PAD_B = 36;

export function LineChart({ entries, color, unit }: LineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm italic text-slate-600">No entries yet.</div>;
  }

  const values = sorted.map((e) => e.value);
  const max = Math.max(...values);
  const min = Math.min(0, Math.min(...values));
  const range = max - min || 1;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const stepX = sorted.length > 1 ? innerW / (sorted.length - 1) : 0;

  const points = sorted.map((e, i) => {
    const x = PAD_L + i * stepX;
    const y = PAD_T + innerH - ((e.value - min) / range) * innerH;
    return { x, y, entry: e };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${PAD_T + innerH} L${points[0].x.toFixed(1)},${PAD_T + innerH} Z`;

  const gridLines = Array.from({ length: 4 }, (_, i) => {
    const frac = i / 3;
    const value = min + (1 - frac) * range;
    const y = PAD_T + frac * innerH;
    return { y, value };
  });

  const gradId = `grad-${color.replace('#', '')}`;

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD_L} x2={W - PAD_R} y1={g.y} y2={g.y} stroke="#272b3a" strokeDasharray="4 4" strokeWidth={1} />
            <text x={PAD_L - 10} y={g.y + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {Math.round(g.value * 10) / 10}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover((h) => (h === i ? null : h))}>
            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10.5" fontWeight={700} fill="#e2e8f0">
              {p.entry.value}
            </text>
            <circle cx={p.x} cy={p.y} r={hover === i ? 6 : 4} fill={color} stroke="#0a0b10" strokeWidth={2} />
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
            <text x={p.x} y={H - 10} textAnchor="middle" fontSize="9.5" fill="#64748b">
              {formatShortDate(new Date(p.entry.date))}
            </text>
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(points[hover].x / W) * 100}%`,
            top: `${(points[hover].y / H) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <p className="font-bold text-slate-50">
            {points[hover].entry.value} <span className="font-normal text-slate-400">{unit}</span>
          </p>
          <p className="text-slate-300">{points[hover].entry.label}</p>
          <p className="text-slate-500">{formatShortDate(new Date(points[hover].entry.date))}</p>
        </div>
      )}
    </div>
  );
}
