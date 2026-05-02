'use client';

import { useState, useEffect, useRef } from 'react';
import { computeTrajectory } from '@/lib/models/home';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const TEAL = '#167e7f';
const INK = '#171717';
const INK_MID = '#3f3f3f';
const INK_LIGHT = '#737373';
const INK_FAINT = '#a3a3a3';
const BORDER = '#e5e5e5';
const RED_SOFT = '#c0644a';

function fmtCurrency(v: number): string {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v)}`;
}

function fmtMonths(m: number | null): string {
  if (m === null) return 'Not in range';
  const yrs = Math.floor(m / 12);
  const mos = m % 12;
  if (yrs === 0) return `${mos}mo`;
  if (mos === 0) return `${yrs}yr`;
  return `${yrs}yr ${mos}mo`;
}

// ── Chart ──────────────────────────────────────────────────────────────────

interface ChartProps {
  savingsPoints: { month: number; value: number }[];
  requiredPoints: { month: number; value: number }[];
  crossoverMonth: number | null;
  years: number;
}

function TrajectoryChart({ savingsPoints, requiredPoints, crossoverMonth, years }: ChartProps) {
  const allValues = [...savingsPoints.map((p) => p.value), ...requiredPoints.map((p) => p.value)];
  const maxVal = Math.max(...allValues) * 1.05;

  const W = 600, H = 400;
  const PAD = { top: 24, right: 24, bottom: 40, left: 68 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xScale = (month: number) => PAD.left + (month / (years * 12)) * chartW;
  const yScale = (val: number) => PAD.top + chartH - (val / maxVal) * chartH;

  const savingsPath = savingsPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.month).toFixed(1)} ${yScale(p.value).toFixed(1)}`)
    .join(' ');

  const requiredPath = requiredPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.month).toFixed(1)} ${yScale(p.value).toFixed(1)}`)
    .join(' ');

  const savingsArea =
    savingsPath +
    ` L ${xScale(years * 12).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${xScale(0).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

  const yTicks = Array.from({ length: 5 }, (_, i) => (i / 4) * maxVal);
  const xTickStep = years <= 10 ? 2 : years <= 20 ? 4 : 5;
  const xTicks = Array.from({ length: Math.floor(years / xTickStep) + 1 }, (_, i) => i * xTickStep);

  const crossX = crossoverMonth !== null ? xScale(crossoverMonth) : null;
  const crossY = crossoverMonth !== null ? yScale(savingsPoints[crossoverMonth].value) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', minHeight: 180 }}>
      <defs>
        <linearGradient id="sim-savingsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.01" />
        </linearGradient>
        <clipPath id="sim-chartClip">
          <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH} />
        </clipPath>
      </defs>

      {/* Grid lines + Y labels */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={yScale(v).toFixed(1)}
            x2={PAD.left + chartW} y2={yScale(v).toFixed(1)}
            stroke={BORDER} strokeWidth="1"
          />
          <text
            x={PAD.left - 8} y={yScale(v) + 4}
            textAnchor="end" fontSize="11" fill={INK_LIGHT}
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            {fmtCurrency(v)}
          </text>
        </g>
      ))}

      {/* X labels */}
      {xTicks.map((yr) => (
        <text
          key={yr}
          x={xScale(yr * 12)} y={PAD.top + chartH + 20}
          textAnchor="middle" fontSize="11" fill={INK_LIGHT}
          fontFamily="var(--font-geist-sans), sans-serif"
        >
          {yr === 0 ? 'Now' : `Yr ${yr}`}
        </text>
      ))}

      {/* Area fill */}
      <path d={savingsArea} fill="url(#sim-savingsGrad)" clipPath="url(#sim-chartClip)" />

      {/* Required line (dashed) */}
      <path
        d={requiredPath}
        stroke={RED_SOFT} strokeWidth="1.5"
        strokeDasharray="5 4" fill="none"
        clipPath="url(#sim-chartClip)"
      />

      {/* Savings line */}
      <path
        d={savingsPath}
        stroke={TEAL} strokeWidth="2" fill="none"
        clipPath="url(#sim-chartClip)"
      />

      {/* Crossover marker */}
      {crossX !== null && crossY !== null && (
        <g>
          <line
            x1={crossX} y1={PAD.top} x2={crossX} y2={PAD.top + chartH}
            stroke={TEAL} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
          />
          <circle cx={crossX} cy={crossY} r="8" fill={TEAL} fillOpacity="0.2" />
          <circle cx={crossX} cy={crossY} r="5" fill={TEAL} />
        </g>
      )}

      {/* Legend */}
      <g transform={`translate(${PAD.left + 8}, ${PAD.top + 12})`}>
        <line x1="0" y1="5" x2="20" y2="5" stroke={TEAL} strokeWidth="2" />
        <text x="26" y="9" fontSize="11" fill={INK_MID} fontFamily="var(--font-geist-sans), sans-serif">
          Projected savings
        </text>
        <line x1="106" y1="5" x2="126" y2="5" stroke={RED_SOFT} strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="132" y="9" fontSize="11" fill={INK_MID} fontFamily="var(--font-geist-sans), sans-serif">
          Down payment needed
        </text>
      </g>
    </svg>
  );
}

// ── Input row ──────────────────────────────────────────────────────────────

interface InputRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

function InputRow({ label, value, onChange, min, max, step, prefix, suffix }: InputRowProps) {
  const rangeRef = useRef<HTMLInputElement>(null);
  const numRef = useRef<HTMLInputElement>(null);
  // Keep a ref to onChange so native listeners always call the latest version
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Native DOM listeners — bypasses React's synthetic event system entirely,
  // which fixes iOS Safari where synthetic events silently fail on form inputs.
  useEffect(() => {
    const range = rangeRef.current;
    const num = numRef.current;
    if (!range || !num) return;

    const emit = (raw: string) => {
      const n = parseFloat(raw);
      if (!isNaN(n)) onChangeRef.current(n);
    };

    const onRange = () => emit(range.value);
    const onNum = () => emit(num.value);

    range.addEventListener('input', onRange);
    num.addEventListener('input', onNum);
    num.addEventListener('change', onNum); // fires on blur on iOS

    return () => {
      range.removeEventListener('input', onRange);
      num.removeEventListener('input', onNum);
      num.removeEventListener('change', onNum);
    };
  }, []);

  // Sync state → DOM when a sibling input changes the same value
  useEffect(() => {
    if (rangeRef.current) rangeRef.current.value = String(value);
    if (numRef.current && document.activeElement !== numRef.current) {
      numRef.current.value = String(value);
    }
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: INK_MID, letterSpacing: '0.01em', flexShrink: 0 }}>
          {label}
        </label>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: 'white', border: `1px solid ${BORDER}`,
            borderRadius: 5, padding: '4px 10px',
          }}
        >
          {prefix && <span style={{ fontSize: 13, color: INK_LIGHT, marginRight: 2 }}>{prefix}</span>}
          <input
            ref={numRef}
            type="number"
            defaultValue={value}
            min={min} max={max} step={step}
            style={{
              width: 72,
              textAlign: 'right',
              fontSize: 15,
              fontWeight: 500,
              color: INK,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
            }}
          />
          {suffix && <span style={{ fontSize: 13, color: INK_LIGHT, marginLeft: 2 }}>{suffix}</span>}
        </div>
      </div>
      <input
        ref={rangeRef}
        type="range"
        defaultValue={value}
        min={min} max={max} step={step}
      />
    </div>
  );
}

// ── Insight card ───────────────────────────────────────────────────────────

interface InsightCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  valueColor?: string;
}

function InsightCard({ label, value, sub, highlight, valueColor }: InsightCardProps) {
  return (
    <div
      style={{
        background: highlight ? TEAL : 'white',
        border: `1px solid ${highlight ? TEAL : BORDER}`,
        borderRadius: 8,
        padding: '20px 20px 18px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <span style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: highlight ? 'rgba(255,255,255,0.7)' : INK_LIGHT,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1,
        color: highlight ? 'white' : (valueColor ?? INK),
      }}>
        {value}
      </span>
      {sub && (
        <span style={{
          fontSize: 12, lineHeight: 1.4,
          color: highlight ? 'rgba(255,255,255,0.75)' : INK_LIGHT,
        }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function HomeSimulator() {
  const [inputs, setInputs] = useState({
    currentSavings: 40000,
    monthlyContribution: 2500,
    savingsReturnRate: 4.5,
    homePrice: 750000,
    downPaymentPct: 20,
    homePriceGrowthRate: 4,
    years: 15,
  });

  const set = (key: keyof typeof inputs) => (val: number) =>
    setInputs((prev) => ({ ...prev, [key]: val }));

  const data = computeTrajectory({
    currentSavings: inputs.currentSavings,
    monthlyContribution: inputs.monthlyContribution,
    savingsReturnRate: inputs.savingsReturnRate / 100,
    homePrice: inputs.homePrice,
    downPaymentPct: inputs.downPaymentPct / 100,
    homePriceGrowthRate: inputs.homePriceGrowthRate / 100,
    years: inputs.years,
  });

  const { crossoverMonth, savingsPoints, requiredPoints } = data;
  const finalSavings = savingsPoints[savingsPoints.length - 1].value;
  const finalRequired = requiredPoints[requiredPoints.length - 1].value;
  const gap = finalRequired - finalSavings;

  const requiredMonthlyToReach10Yr = (() => {
    const months = 10 * 12;
    const r = inputs.savingsReturnRate / 100 / 12;
    const target =
      inputs.homePrice *
      (1 + inputs.homePriceGrowthRate / 100 / 12) ** months *
      (inputs.downPaymentPct / 100);
    const fvCurrent = inputs.currentSavings * (1 + r) ** months;
    const fvFactor = r === 0 ? months : ((1 + r) ** months - 1) / r;
    return Math.max(0, (target - fvCurrent) / fvFactor);
  })();

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <Nav />

      {/* Page header */}
      <div className="w-full max-w-[800px] mx-auto px-6 pt-10 pb-0">
        <h1
          style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: INK,
            marginBottom: 8,
            lineHeight: 1.1,
          }}
        >
          Home Down Payment Simulator
        </h1>
        <p style={{ fontSize: 14, color: INK_LIGHT }}>
          Adjust your assumptions. See where the trajectory leads.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">

          {/* Inputs panel */}
          <div
            className="lg:sticky"
            style={{
              top: 64,
              background: 'white',
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: 24,
            }}
          >
            {/* Your situation */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_LIGHT, marginBottom: 16 }}>
                Your situation
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <InputRow
                  label="Current savings" value={inputs.currentSavings} onChange={set('currentSavings')}
                  min={0} max={500000} step={1000} prefix="$"
                />
                <InputRow
                  label="Monthly contribution" value={inputs.monthlyContribution} onChange={set('monthlyContribution')}
                  min={0} max={20000} step={100} prefix="$"
                />
                <InputRow
                  label="Savings return rate" value={inputs.savingsReturnRate} onChange={set('savingsReturnRate')}
                  min={0} max={10} step={0.1} suffix="%"
                />
              </div>
            </div>

            {/* The goal */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_LIGHT, marginBottom: 16 }}>
                The goal
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <InputRow
                  label="Home price" value={inputs.homePrice} onChange={set('homePrice')}
                  min={100000} max={3000000} step={10000} prefix="$"
                />
                <InputRow
                  label="Down payment" value={inputs.downPaymentPct} onChange={set('downPaymentPct')}
                  min={3} max={50} step={1} suffix="%"
                />
                <InputRow
                  label="Home price growth / yr" value={inputs.homePriceGrowthRate} onChange={set('homePriceGrowthRate')}
                  min={0} max={12} step={0.25} suffix="%"
                />
              </div>
            </div>

            {/* Time horizon */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_LIGHT, marginBottom: 16 }}>
                Time horizon
              </p>
              <InputRow
                label="Model years" value={inputs.years} onChange={set('years')}
                min={2} max={30} step={1} suffix="yr"
              />
            </div>

            {/* Note */}
            <p style={{ fontSize: 11, color: INK_FAINT, lineHeight: 1.6, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
              Model uses compounding accumulation at constant rates. No inflation adjustment. Not financial advice.
            </p>
          </div>

          {/* Right: chart + cards + narrative */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Chart */}
            <div
              style={{
                background: 'white',
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: '24px 16px 16px',
              }}
            >
              <TrajectoryChart
                savingsPoints={savingsPoints}
                requiredPoints={requiredPoints}
                crossoverMonth={crossoverMonth}
                years={inputs.years}
              />
            </div>

            {/* Insight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InsightCard
                highlight
                label="Goal reached"
                value={fmtMonths(crossoverMonth)}
                sub={
                  crossoverMonth !== null
                    ? `In ${Math.floor(crossoverMonth / 12)} years at current rate`
                    : 'Increase savings or extend horizon'
                }
              />
              <InsightCard
                label={`At year ${inputs.years}`}
                value={gap > 0 ? `-${fmtCurrency(gap)}` : `+${fmtCurrency(-gap)}`}
                valueColor={gap > 0 ? RED_SOFT : TEAL}
                sub={
                  gap > 0
                    ? `Savings still ${fmtCurrency(gap)} short`
                    : 'Savings exceed requirement'
                }
              />
              <InsightCard
                label="To reach goal in 10yr"
                value={`$${Math.round(requiredMonthlyToReach10Yr).toLocaleString()}/mo`}
                sub={`vs. your current $${inputs.monthlyContribution.toLocaleString()}/mo`}
              />
            </div>

            {/* Narrative */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              {crossoverMonth !== null ? (
                <p style={{ fontSize: 14, color: INK_MID, lineHeight: 1.7, maxWidth: 560 }}>
                  At your current savings rate of{' '}
                  <strong style={{ color: INK }}>${inputs.monthlyContribution.toLocaleString()}/mo</strong>
                  {' '}into an account returning{' '}
                  <strong style={{ color: INK }}>{inputs.savingsReturnRate}%</strong>,
                  you are projected to reach a{' '}
                  <strong style={{ color: INK }}>{inputs.downPaymentPct}% down payment</strong>
                  {' '}on a{' '}
                  <strong style={{ color: INK }}>${(inputs.homePrice / 1000).toFixed(0)}k home</strong>
                  {' '}in approximately{' '}
                  <strong style={{ color: TEAL }}>{fmtMonths(crossoverMonth)}</strong>.
                </p>
              ) : (
                <p style={{ fontSize: 14, color: INK_MID, lineHeight: 1.7, maxWidth: 560 }}>
                  At your current savings rate, the goal moves further away over time due to home price growth.
                  To close the gap, increase monthly contribution, extend the time horizon, or reduce the down payment target.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
