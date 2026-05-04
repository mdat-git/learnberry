'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { calculateDebtPaydown } from '@/lib/models/debtPaydown';
import type { Debt, StrategyResult, DebtPaydownResult } from '@/lib/models/debtPaydown';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

type DebtInputState = {
  debts: Debt[];
  extraBudget: number;
};

const TEAL = '#167e7f';
const TEAL_DARK = '#0f4f50';
const INK = '#171717';
const INK_3 = '#737373';
const INK_4 = '#a3a3a3';
const BG = '#fafaf8';
const BG_2 = '#f3f3f1';
const DIV = '#f0efed';
const BORDER = '#e5e5e5';
const GRAY_DASH = '#a3a3a3';

// ── helpers ────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function fmtMoney(v: number): string {
  return `$${Math.round(v).toLocaleString()}`;
}

function fmtMoneyShort(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v)}`;
}

function fmtDateFromMonths(months: number | null): string {
  if (months === null) return 'Not in 50yr';
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ── uncontrolled inputs (iOS Safari friendly) ─────────────────────────────

interface TextFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function TextField({ value, onChange, placeholder }: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => onChangeRef.current(el.value);
    el.addEventListener('input', h);
    el.addEventListener('change', h);
    return () => {
      el.removeEventListener('input', h);
      el.removeEventListener('change', h);
    };
  }, []);

  return (
    <input
      ref={ref}
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      style={{
        width: '100%',
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 14,
        background: 'white',
        color: INK,
        outline: 'none',
        fontFamily: 'inherit',
      }}
    />
  );
}

interface NumberFieldProps {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
}

function NumberField({ value, onChange, prefix, suffix, step = 1, min = 0 }: NumberFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => {
      const n = parseFloat(el.value);
      onChangeRef.current(isNaN(n) ? 0 : n);
    };
    el.addEventListener('input', h);
    el.addEventListener('change', h);
    return () => {
      el.removeEventListener('input', h);
      el.removeEventListener('change', h);
    };
  }, []);

  const padLeft = prefix ? 26 : 12;
  const padRight = suffix ? 26 : 12;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {prefix && (
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 14,
            color: INK_3,
            pointerEvents: 'none',
          }}
        >
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        type="number"
        defaultValue={value === 0 ? '' : value}
        step={step}
        min={min}
        inputMode="decimal"
        style={{
          width: '100%',
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: `8px ${padRight}px 8px ${padLeft}px`,
          fontSize: 14,
          background: 'white',
          color: INK,
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
      {suffix && (
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 14,
            color: INK_3,
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

function SliderRow({ label, value, onChange, min, max, step, format }: SliderRowProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => {
      const n = parseFloat(el.value);
      const next = isNaN(n) ? 0 : n;
      setDisplay(next);
      onChangeRef.current(next);
    };
    el.addEventListener('input', h);
    el.addEventListener('change', h);
    return () => {
      el.removeEventListener('input', h);
      el.removeEventListener('change', h);
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: INK }}>{label}</label>
        <span style={{ fontSize: 14, fontWeight: 600, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>
          {format(display)}
        </span>
      </div>
      <input ref={ref} type="range" defaultValue={value} min={min} max={max} step={step} />
    </div>
  );
}

// ── Debt card ──────────────────────────────────────────────────────────────

interface FieldLabelProps {
  children: React.ReactNode;
}
function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: INK_3,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 6,
        display: 'block',
      }}
    >
      {children}
    </label>
  );
}

interface DebtCardProps {
  debt: Debt;
  onChange: (d: Debt) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function DebtCard({ debt, onChange, onRemove, canRemove }: DebtCardProps) {
  return (
    <div
      style={{
        background: BG_2,
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        padding: 20,
        position: 'relative',
      }}
    >
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${debt.name || 'debt'}`}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: 'transparent',
            border: 'none',
            color: INK_4,
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <FieldLabel>Debt name</FieldLabel>
          <TextField
            value={debt.name}
            onChange={(v) => onChange({ ...debt, name: v })}
            placeholder="e.g. Car loan"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <FieldLabel>Current balance</FieldLabel>
            <NumberField
              value={debt.balance}
              onChange={(v) => onChange({ ...debt, balance: v })}
              prefix="$"
              step={100}
            />
          </div>
          <div>
            <FieldLabel>APR</FieldLabel>
            <NumberField
              value={debt.apr}
              onChange={(v) => onChange({ ...debt, apr: v })}
              suffix="%"
              step={0.1}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Monthly payment</FieldLabel>
          <NumberField
            value={debt.monthlyPayment}
            onChange={(v) => onChange({ ...debt, monthlyPayment: v })}
            prefix="$"
            step={10}
          />
        </div>
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
function Section({ title, children }: SectionProps) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: INK_3,
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Results table ──────────────────────────────────────────────────────────

interface ResultsTableProps {
  result: DebtPaydownResult;
  totalMinimumPayments: number;
}

function ResultsTable({ result, totalMinimumPayments }: ResultsTableProps) {
  const cols: { key: keyof DebtPaydownResult; label: string }[] = [
    { key: 'minimum', label: 'Minimum' },
    { key: 'snowball', label: 'Snowball' },
    { key: 'avalanche', label: 'Avalanche' },
  ];

  const cell = (k: keyof DebtPaydownResult, row: 'date' | 'interest' | 'savings' | 'cashflow'): string => {
    const r: StrategyResult = result[k];
    if (row === 'date') return fmtDateFromMonths(r.debtFreeMonth);
    if (row === 'interest') return fmtMoney(r.totalInterestPaid);
    if (row === 'savings') {
      if (k === 'minimum') return '—';
      const saved = result.minimum.totalInterestPaid - r.totalInterestPaid;
      return saved > 0 ? `Save ${fmtMoney(saved)}` : '—';
    }
    // cashflow
    return r.debtFreeMonth !== null ? `${fmtMoney(totalMinimumPayments)}/mo` : '—';
  };

  const rowLabels: { key: 'date' | 'interest' | 'savings' | 'cashflow'; label: string }[] = [
    { key: 'date', label: 'Debt-free date' },
    { key: 'interest', label: 'Total interest paid' },
    { key: 'savings', label: 'vs Minimum' },
    { key: 'cashflow', label: 'Cash flow fully unlocked' },
  ];

  return (
    <div
      style={{
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          background: BG_2,
          borderBottom: `1px solid ${DIV}`,
        }}
      >
        <div style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: INK_3 }}>
          Metric
        </div>
        {cols.map((c) => (
          <div
            key={c.key}
            style={{
              padding: '12px 14px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: c.key === 'minimum' ? INK_3 : INK,
              textAlign: 'right',
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rowLabels.map((r, i) => (
        <div
          key={r.key}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
            borderBottom: i < rowLabels.length - 1 ? `1px solid ${DIV}` : 'none',
          }}
        >
          <div style={{ padding: '14px', fontSize: 13, color: INK_3 }}>{r.label}</div>
          {cols.map((c) => {
            const val = cell(c.key, r.key);
            const isSavings = r.key === 'savings' && val.startsWith('Save');
            return (
              <div
                key={c.key}
                style={{
                  padding: '14px',
                  fontSize: 13,
                  fontWeight: c.key === 'minimum' ? 400 : 500,
                  color: isSavings ? TEAL : c.key === 'minimum' ? INK_3 : INK,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Milestones list ────────────────────────────────────────────────────────

interface MilestonesProps {
  strategy: 'Snowball' | 'Avalanche';
  milestones: StrategyResult['cashFlowMilestones'];
}
function MilestonesList({ strategy, milestones }: MilestonesProps) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        padding: '16px 18px',
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 12, letterSpacing: '-0.01em' }}>
        {strategy}
      </p>
      {milestones.length === 0 ? (
        <p style={{ fontSize: 12, color: INK_4, lineHeight: 1.5 }}>
          No debts cleared in 50 years.
        </p>
      ) : (
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
          {milestones.map((m, i) => (
            <li key={i} style={{ fontSize: 12.5, color: INK_3, lineHeight: 1.5 }}>
              <span style={{ color: INK_4, fontVariantNumeric: 'tabular-nums' }}>Month {m.month}</span>
              {' — '}
              <span style={{ color: INK, fontWeight: 500 }}>{m.debtName || 'Unnamed debt'}</span>
              {' paid off → '}
              <span style={{ color: TEAL, fontWeight: 500 }}>+{fmtMoney(m.cashFlowUnlocked)}/mo</span>
              <span style={{ color: INK_4 }}> ({fmtMoney(m.cumulativeCashFlow)}/mo total)</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ── Chart ──────────────────────────────────────────────────────────────────

interface ChartProps {
  result: DebtPaydownResult;
  startingTotal: number;
}

function BalanceChart({ result, startingTotal }: ChartProps) {
  const lens = [
    result.minimum.snapshots.length,
    result.snowball.snapshots.length,
    result.avalanche.snapshots.length,
  ];
  const maxLen = Math.max(...lens);

  type Row = { year: number; minimum: number; snowball: number; avalanche: number };
  const data: Row[] = [];
  for (let i = 0; i < maxLen; i++) {
    data.push({
      year: i / 12,
      minimum: i < result.minimum.snapshots.length ? result.minimum.snapshots[i].totalBalance : 0,
      snowball: i < result.snowball.snapshots.length ? result.snowball.snapshots[i].totalBalance : 0,
      avalanche: i < result.avalanche.snapshots.length ? result.avalanche.snapshots[i].totalBalance : 0,
    });
  }

  const maxYear = Math.ceil((maxLen - 1) / 12);
  const tickStep = maxYear <= 10 ? 1 : maxYear <= 25 ? 5 : 10;
  const ticks: number[] = [];
  for (let y = 0; y <= maxYear; y += tickStep) ticks.push(y);
  if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);

  return (
    <div
      style={{ background: 'white', border: `1px solid ${DIV}`, borderRadius: 12, padding: '16px 8px 12px' }}
      className="h-[280px] md:h-[320px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={DIV} vertical={false} />
          <XAxis
            dataKey="year"
            type="number"
            domain={[0, maxYear || 1]}
            ticks={ticks}
            tickFormatter={(y: number) => (y === 0 ? 'Now' : `${y}y`)}
            tick={{ fontSize: 11, fill: INK_3 }}
            axisLine={{ stroke: BORDER }}
            tickLine={{ stroke: BORDER }}
            allowDecimals={false}
          />
          <YAxis
            domain={[0, startingTotal || 1]}
            tickFormatter={(v: number) => fmtMoneyShort(v)}
            tick={{ fontSize: 11, fill: INK_3 }}
            axisLine={{ stroke: BORDER }}
            tickLine={{ stroke: BORDER }}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 12,
              padding: '8px 10px',
            }}
            labelFormatter={(year) => {
              const y = typeof year === 'number' ? year : parseFloat(String(year));
              const totalMonths = Math.round(y * 12);
              const yr = Math.floor(totalMonths / 12);
              const mo = totalMonths % 12;
              return yr === 0 ? `Month ${mo}` : `${yr}y ${mo}m`;
            }}
            formatter={(v) => fmtMoney(v as number)}
          />
          <Legend
            verticalAlign="bottom"
            iconType="plainline"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="minimum"
            name="Minimum"
            stroke={GRAY_DASH}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="snowball"
            name="Snowball"
            stroke={TEAL}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="avalanche"
            name="Avalanche"
            stroke={TEAL_DARK}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Collapsible math ───────────────────────────────────────────────────────

function CollapsibleMath() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        background: 'white',
        marginBottom: 36,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: INK,
          fontFamily: 'inherit',
        }}
      >
        <span>How it&apos;s calculated</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}
        >
          <path d="M3 5.5l4 4 4-4" stroke={INK_3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '4px 18px 18px', borderTop: `1px solid ${DIV}` }}>
          <div
            style={{
              fontSize: 13,
              color: INK_3,
              lineHeight: 1.85,
              fontFamily: 'var(--font-geist-mono), monospace',
              whiteSpace: 'pre-line',
              paddingTop: 14,
            }}
          >
{`Monthly interest = Balance × (APR ÷ 12)
Principal paid = Payment − Monthly interest
New balance = Balance − Principal paid

Snowball: extra budget applied to lowest balance first, payment rolls on payoff
Avalanche: extra budget applied to highest APR first, payment rolls on payoff`}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

const DEFAULT_DEBT_INPUTS: DebtInputState = {
  debts: [{ id: 'seed', name: '', balance: 0, apr: 0, monthlyPayment: 0 }],
  extraBudget: 0,
};

export default function DebtPaydownSimulator() {
  const [inputs, setInputs, hydrated] = useLocalStorage<DebtInputState>(
    'learnberry:debt-inputs',
    DEFAULT_DEBT_INPUTS,
  );
  const { debts, extraBudget } = inputs;

  const setDebts = (updater: Debt[] | ((prev: Debt[]) => Debt[])) =>
    setInputs((prev) => ({
      ...prev,
      debts: typeof updater === 'function' ? updater(prev.debts) : updater,
    }));
  const setExtraBudget = (v: number) =>
    setInputs((prev) => ({ ...prev, extraBudget: v }));

  const updateDebt = (id: string, updated: Debt) => {
    setDebts((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };
  const removeDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };
  const addDebt = () => {
    setDebts((prev) => [...prev, { id: uid(), name: '', balance: 0, apr: 0, monthlyPayment: 0 }]);
  };

  const hasValidDebt = debts.some((d) => d.balance > 0 && d.monthlyPayment > 0);

  const result = calculateDebtPaydown({
    debts: debts.map((d) => ({ ...d, apr: d.apr / 100 })),
    extraMonthlyBudget: extraBudget,
  });

  const startingTotal = debts.reduce((s, d) => s + Math.max(0, d.balance), 0);
  const totalMinimumPayments = debts.reduce((s, d) => s + d.monthlyPayment, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <Nav />

      <main
        className="flex-1 w-full mx-auto"
        style={{
          maxWidth: 720,
          paddingLeft: 'clamp(20px, 5vw, 40px)',
          paddingRight: 'clamp(20px, 5vw, 40px)',
          paddingTop: 'clamp(28px, 4vw, 48px)',
          paddingBottom: 'clamp(40px, 6vw, 72px)',
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: INK,
              marginBottom: 8,
              lineHeight: 1.15,
            }}
          >
            Debt Paydown
          </h1>
          <p style={{ fontSize: 14, color: INK_3, lineHeight: 1.6, maxWidth: 520 }}>
            Compare paying minimums vs. the snowball and avalanche methods. See
            when each debt clears and how cash flow opens up over time.
          </p>
        </header>

        <div key={hydrated ? 'h' : 'd'}>
          {/* Section 1: Debts */}
          <Section title="Your debts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {debts.map((d) => (
                <DebtCard
                  key={d.id}
                  debt={d}
                  onChange={(u) => updateDebt(d.id, u)}
                  onRemove={() => removeDebt(d.id)}
                  canRemove={debts.length > 1}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addDebt}
              style={{
                marginTop: 14,
                fontSize: 13,
                fontWeight: 500,
                color: TEAL,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              + Add debt
            </button>
          </Section>

          {/* Section 2: Extra budget */}
          <Section title="Extra monthly budget">
            <div
              style={{
                background: 'white',
                border: `1px solid ${DIV}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <SliderRow
                label="Extra monthly budget"
                value={extraBudget}
                onChange={setExtraBudget}
                min={0}
                max={2000}
                step={50}
                format={(v) => `$${v.toLocaleString()}`}
              />
              <p style={{ fontSize: 12, color: INK_4, marginTop: 14, lineHeight: 1.5 }}>
                Applied on top of all minimum payments. Rolls automatically when a debt clears.
              </p>
            </div>
          </Section>
        </div>

        {/* Section 3: Results */}
        {hasValidDebt ? (
          <>
            <Section title="Results">
              <ResultsTable result={result} totalMinimumPayments={totalMinimumPayments} />
            </Section>

            <Section title="Cash flow milestones">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MilestonesList strategy="Snowball" milestones={result.snowball.cashFlowMilestones} />
                <MilestonesList strategy="Avalanche" milestones={result.avalanche.cashFlowMilestones} />
              </div>
            </Section>

            <Section title="Balance over time">
              <BalanceChart result={result} startingTotal={startingTotal} />
            </Section>

            <CollapsibleMath />
          </>
        ) : (
          <div
            style={{
              padding: '24px',
              border: `1px dashed ${BORDER}`,
              borderRadius: 12,
              background: 'white',
              marginBottom: 36,
            }}
          >
            <p style={{ fontSize: 13, color: INK_3, lineHeight: 1.6 }}>
              Enter a balance and a monthly payment for at least one debt to see results.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
