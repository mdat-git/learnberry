'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { generatePoints, evaluateLinear } from '@/lib/models/linear';

const ACCENT = '#167e7f';

export default function LinearSimulator() {
  const [m, setM] = useState(1);
  const [b, setB] = useState(0);

  const points = generatePoints(m, b, -10, 10, 40);
  const yAtFive = evaluateLinear(m, b, 5);

  const slopeLabel = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
  const interceptLabel =
    b === 0 ? '' : b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  const formula =
    m === 0 && b === 0
      ? 'y = 0'
      : m === 0
        ? `y = ${b}`
        : `y = ${slopeLabel}${interceptLabel}`;

  return (
    <div className="flex flex-col gap-5">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-10, 10]}
            tickCount={11}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="number"
            domain={[-30, 30]}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="linear"
            dataKey="y"
            stroke={ACCENT}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-center text-lg font-mono font-semibold" style={{ color: ACCENT }}>
        {formula}
      </p>

      <div className="flex flex-col gap-4">
        <ControlRow
          label="Slope (m)"
          value={m}
          min={-5}
          max={5}
          step={0.1}
          onChange={setM}
        />
        <ControlRow
          label="Intercept (b)"
          value={b}
          min={-10}
          max={10}
          step={0.5}
          onChange={setB}
        />
      </div>

      <p className="text-sm text-gray-500 text-center">
        y at x = 5: <span className="font-semibold text-gray-800">{yAtFive.toFixed(2)}</span>
      </p>
    </div>
  );
}

function ControlRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInput}
          className="w-16 text-right border border-gray-200 rounded px-1 text-sm focus:outline-none focus:ring-1"
          style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSlider}
        className="w-full accent-[#167e7f]"
      />
    </div>
  );
}
