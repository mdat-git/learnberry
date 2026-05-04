'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { calculateHomeModel } from '@/lib/models/homeModel';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

type HomeModelInputState = {
  currentSavingsBalance: number;
  currentMonthlySavings: number;
  annualReturnPct: number;
  monthsUntilDebtFree: number;
  monthlyContributionAfterDebt: number;
  currentHomeValue: number;
  remainingMortgage: number;
  sellingCostPct: number;
  targetHomePrice: number;
  downPaymentPct: number;
  closingCostPct: number;
  annualAppreciationPct: number;
  mortgageRate: number;
  grossMonthlyIncome: number;
  existingMonthlyDebt: number;
};

const DEFAULT_HOME_INPUTS: HomeModelInputState = {
  currentSavingsBalance: 25000,
  currentMonthlySavings: 800,
  annualReturnPct: 4.5,
  monthsUntilDebtFree: 74,
  monthlyContributionAfterDebt: 1250,
  currentHomeValue: 500000,
  remainingMortgage: 300000,
  sellingCostPct: 6,
  targetHomePrice: 750000,
  downPaymentPct: 20,
  closingCostPct: 2,
  annualAppreciationPct: 4,
  mortgageRate: 6.75,
  grossMonthlyIncome: 0,
  existingMonthlyDebt: 0,
};

const fmtUSD = (v: number) =>
  v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const fmtPct1 = (v: number) => `${(v * 100).toFixed(1)}%`;

const INK = '#171717';
const INK_2 = '#404040';
const INK_3 = '#737373';
const INK_4 = '#a3a3a3';
const TEAL = '#167e7f';
const BG_2 = '#f3f3f1';
const DIV = '#f0efed';
const BORDER = '#e5e5e5';

// ── helpers ────────────────────────────────────────────────────────────────

function fmtMoney(v: number): string {
  return `$${Math.round(v).toLocaleString()}`;
}

function fmtMoneyShort(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v)}`;
}

function fmtYearsMonths(months: number): string {
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos} month${mos === 1 ? '' : 's'} from today`;
  if (mos === 0) return `${yrs} year${yrs === 1 ? '' : 's'} from today`;
  return `${yrs} year${yrs === 1 ? '' : 's'} ${mos} month${mos === 1 ? '' : 's'} from today`;
}

// ── uncontrolled inputs (iOS Safari friendly) ─────────────────────────────

interface NumberFieldProps {
  defaultValue: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
}

function NumberField({
  defaultValue,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
}: NumberFieldProps) {
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
  const padRight = suffix ? 30 : 12;

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
        defaultValue={defaultValue === 0 ? '' : defaultValue}
        step={step}
        min={min}
        inputMode="decimal"
        style={{
          width: '100%',
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: `9px ${padRight}px 9px ${padLeft}px`,
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

// ── visual primitives ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: INK_4,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: INK_2, marginBottom: 6, fontWeight: 500 }}>
      {children}
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: INK_4, marginTop: 6, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function InputCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: BG_2,
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function CalculatedBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${DIV}`,
        borderRadius: 8,
        padding: '12px 16px',
        marginTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: INK_3 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 600, color: TEAL }}>{value}</span>
    </div>
  );
}

function AffordabilityRow({
  label,
  value,
  formula,
  last,
}: {
  label: string;
  value: string;
  formula: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        paddingTop: 12,
        paddingBottom: 12,
        borderBottom: last ? 'none' : `1px solid ${DIV}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: INK_3 }}>{label}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: INK,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: INK_4,
          marginTop: 4,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Cascadia Mono', monospace",
        }}
      >
        {formula}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: BG_2,
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{value}</div>
      <div style={{ fontSize: 11, color: INK_4 }}>{label}</div>
    </div>
  );
}

// ── chart ────────────────────────────────────────────────────────────────

const APPRECIATION_COLOR = '#c0392b';

interface ChartProps {
  snapshots: { month: number; balance: number }[];
  totalCashNeeded: number;
  debtFreeMonth: number;
  goalMonth: number | null;
  goalBalance: number;
  netEquity: number;
  appreciationSnapshots: { month: number; appreciatedGoal: number }[];
  annualAppreciationPct: number;
}

function TimelineChart({
  snapshots,
  totalCashNeeded,
  debtFreeMonth,
  goalMonth,
  goalBalance,
  netEquity,
  appreciationSnapshots,
  annualAppreciationPct,
}: ChartProps) {
  const lastMonth = snapshots[snapshots.length - 1]?.month ?? 0;

  const chartData = useMemo(() => {
    const apprByMonth = new Map(appreciationSnapshots.map((a) => [a.month, a.appreciatedGoal]));
    return snapshots.map((s) => ({
      month: s.month,
      balance: s.balance,
      withEquity: s.balance + netEquity,
      appreciatedGoal: apprByMonth.get(s.month) ?? null,
    }));
  }, [snapshots, debtFreeMonth, netEquity, appreciationSnapshots]);

  const lastAppreciatedGoal =
    appreciationSnapshots[appreciationSnapshots.length - 1]?.appreciatedGoal ?? totalCashNeeded;
  const yMax = Math.max(totalCashNeeded * 1.2, lastAppreciatedGoal * 1.05);

  // Y value of the goal dot is the withEquity value at goalMonth
  const goalDotY = goalMonth !== null ? goalBalance + netEquity : null;

  const yearTicks = useMemo(() => {
    const ticks: number[] = [0];
    const maxYear = Math.ceil(lastMonth / 12);
    for (let y = 1; y <= maxYear; y++) ticks.push(y * 12);
    return ticks;
  }, [lastMonth]);

  return (
    <div className="w-full">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 24, right: 36, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              type="number"
              domain={[0, lastMonth]}
              ticks={yearTicks}
              tickFormatter={(m: number) => (m === 0 ? 'Now' : `Yr ${m / 12}`)}
              tick={{ fontSize: 11, fill: INK_4 }}
              axisLine={{ stroke: BORDER }}
              tickLine={false}
            />
            <YAxis
              domain={[0, yMax]}
              tickFormatter={(v: number) => fmtMoneyShort(v)}
              tick={{ fontSize: 11, fill: INK_4 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                fontSize: 12,
                padding: '6px 10px',
              }}
              labelFormatter={(label) => {
                const m = Number(label);
                return m === 0 ? 'Now' : `Month ${m}`;
              }}
              formatter={(value, name) =>
                [
                  fmtMoney(Number(value)),
                  name === 'balance' ? 'Cash savings' : 'Savings + equity',
                ] as [string, string]
              }
            />
            <ReferenceLine
              y={totalCashNeeded}
              stroke={INK_4}
              strokeDasharray="6 4"
              label={{ value: 'Goal today', position: 'right', fill: INK_4, fontSize: 11 }}
            />
            {/* Appreciation-adjusted goal */}
            <Line
              type="monotone"
              dataKey="appreciatedGoal"
              stroke={APPRECIATION_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeOpacity={0.6}
              dot={false}
              isAnimationActive={false}
              legendType="none"
              connectNulls
            />
            {appreciationSnapshots.length > 0 && (
              <ReferenceDot
                x={appreciationSnapshots[appreciationSnapshots.length - 1].month}
                y={appreciationSnapshots[appreciationSnapshots.length - 1].appreciatedGoal}
                r={0}
                label={{
                  value: `Goal if +${annualAppreciationPct}% appreciation`,
                  position: 'right',
                  fill: APPRECIATION_COLOR,
                  fontSize: 11,
                }}
              />
            )}
            {debtFreeMonth > 0 && debtFreeMonth <= lastMonth && (
              <ReferenceLine
                x={debtFreeMonth}
                stroke={INK_4}
                strokeDasharray="4 4"
                label={{
                  value: 'Debt-free',
                  position: 'top',
                  fill: INK_4,
                  fontSize: 11,
                }}
              />
            )}
            {/* Series 1 — cash savings */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke={TEAL}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              legendType="none"
            />
            {/* Series 2 — savings + equity */}
            <Line
              type="monotone"
              dataKey="withEquity"
              stroke={TEAL}
              strokeWidth={1.5}
              strokeDasharray="6 3"
              strokeOpacity={0.5}
              dot={false}
              isAnimationActive={false}
              legendType="none"
            />
            {goalMonth !== null && goalDotY !== null && (
              <ReferenceDot
                x={goalMonth}
                y={goalDotY}
                r={5}
                fill={TEAL}
                stroke="white"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="24" height="10" viewBox="0 0 24 10">
            <line x1="0" y1="5" x2="24" y2="5" stroke={TEAL} strokeWidth="2" />
          </svg>
          <span style={{ fontSize: 11, color: INK_4 }}>Cash savings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="24" height="10" viewBox="0 0 24 10">
            <line
              x1="0"
              y1="5"
              x2="24"
              y2="5"
              stroke={TEAL}
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.5"
            />
          </svg>
          <span style={{ fontSize: 11, color: INK_4 }}>Savings + equity</span>
        </div>
        {annualAppreciationPct > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="24" height="10" viewBox="0 0 24 10">
              <line
                x1="0"
                y1="5"
                x2="24"
                y2="5"
                stroke={APPRECIATION_COLOR}
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            </svg>
            <span style={{ fontSize: 11, color: INK_4 }}>
              Appreciation-adjusted goal
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── collapsible math ─────────────────────────────────────────────────────

function CollapsibleMath() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        marginTop: 24,
        background: BG_2,
        border: `1px solid ${DIV}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: INK_2,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        How it&apos;s calculated
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 120ms ease',
          }}
        >
          <path
            d="M3 4.5l3 3 3-3"
            stroke={INK_3}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            padding: '4px 18px 18px',
            fontSize: 12.5,
            color: INK_3,
            lineHeight: 1.7,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Cascadia Mono', monospace",
            whiteSpace: 'pre-wrap',
          }}
        >
{`Phase 1 — Now to debt-free:
  balance = balance × (1 + rate/12) + monthly contribution

Phase 2 — Debt-free to goal:
  balance = balance × (1 + rate/12) + unlocked cash flow
  Cash flow is higher here because debt payments have cleared

Equity from home sale:
  Net equity = Sale price − Mortgage − Selling costs
  Not deposited into savings — applied at closing as a lump sum
  Goal is crossed when: savings + equity ≥ down payment + closing costs

Interest earned = savings balance at goal − starting balance − all contributions
  (Equity is excluded — it is a capital transfer, not a return on savings)`}
        </div>
      )}
    </div>
  );
}

// ── main ────────────────────────────────────────────────────────────────

export default function HomeModelSimulator() {
  const [inputs, setInputs, hydrated] = useLocalStorage<HomeModelInputState>(
    'learnberry:home-inputs',
    DEFAULT_HOME_INPUTS,
  );

  const update =
    <K extends keyof HomeModelInputState>(field: K) =>
    (v: HomeModelInputState[K]) =>
      setInputs((prev) => ({ ...prev, [field]: v }));

  const affordability = useMemo(() => {
    const { targetHomePrice, downPaymentPct, mortgageRate, grossMonthlyIncome, existingMonthlyDebt } = inputs;
    if (targetHomePrice <= 0) return null;

    const principal = targetHomePrice * (1 - downPaymentPct / 100);
    const r = mortgageRate / 100 / 12;
    const n = 360;
    const monthlyPI =
      r === 0
        ? principal / n
        : (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

    const propertyTax = (targetHomePrice * 0.0125) / 12;
    const insurance = (targetHomePrice * 0.005) / 12;
    const piti = monthlyPI + propertyTax + insurance;

    const housingRatio = grossMonthlyIncome > 0 ? piti / grossMonthlyIncome : null;
    const dti =
      grossMonthlyIncome > 0
        ? (piti + existingMonthlyDebt) / grossMonthlyIncome
        : null;

    return { monthlyPI, propertyTax, insurance, piti, housingRatio, dti };
  }, [inputs]);

  const result = useMemo(
    () =>
      calculateHomeModel({
        currentMonthlySavings: inputs.currentMonthlySavings,
        currentSavingsBalance: inputs.currentSavingsBalance,
        annualReturn: inputs.annualReturnPct / 100,
        monthsUntilDebtFree: inputs.monthsUntilDebtFree,
        monthlyContributionAfterDebt: inputs.monthlyContributionAfterDebt,
        currentHomeValue: inputs.currentHomeValue,
        remainingMortgage: inputs.remainingMortgage,
        sellingCostPercent: inputs.sellingCostPct / 100,
        targetHomePrice: inputs.targetHomePrice,
        downPaymentPercent: inputs.downPaymentPct / 100,
        closingCostPercent: inputs.closingCostPct / 100,
        annualAppreciation: inputs.annualAppreciationPct / 100,
      }),
    [inputs],
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fafaf8', color: INK }}>
      <Nav />
      <main
        className="flex-1 mx-auto w-full"
        style={{
          maxWidth: 720,
          paddingLeft: 'clamp(20px, 5vw, 32px)',
          paddingRight: 'clamp(20px, 5vw, 32px)',
          paddingTop: 'clamp(40px, 6vw, 72px)',
          paddingBottom: 'clamp(48px, 6vw, 72px)',
        }}
      >
        <h1
          className="font-semibold tracking-[-0.02em] mb-2"
          style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: INK }}
        >
          Home Model
        </h1>
        <p style={{ fontSize: 14, color: INK_3, marginBottom: 32, lineHeight: 1.6 }}>
          Project when your savings can fund a new home, factoring in debt
          paydown, the sale of a current home, and post-debt cash flow.
        </p>

        <div key={hydrated ? 'h' : 'd'}>
          {/* Section 1 — Right now */}
          <SectionLabel>Right now</SectionLabel>
          <InputCard>
            <div>
              <FieldLabel>Current savings balance</FieldLabel>
              <NumberField
                defaultValue={inputs.currentSavingsBalance}
                onChange={update('currentSavingsBalance')}
                prefix="$"
                step={500}
              />
            </div>
            <div>
              <FieldLabel>Monthly savings contribution</FieldLabel>
              <NumberField
                defaultValue={inputs.currentMonthlySavings}
                onChange={update('currentMonthlySavings')}
                prefix="$"
                step={50}
              />
              <FieldHelper>
                What you&apos;re putting away now, during debt paydown
              </FieldHelper>
            </div>
            <div>
              <FieldLabel>Annual return on savings</FieldLabel>
              <NumberField
                defaultValue={inputs.annualReturnPct}
                onChange={update('annualReturnPct')}
                suffix="%"
                step={0.1}
              />
              <FieldHelper>HYSA or investment return</FieldHelper>
            </div>
          </InputCard>

          {/* Section 2 — Debt paydown */}
          <SectionLabel>Debt paydown</SectionLabel>
          <p style={{ fontSize: 12, color: INK_4, marginTop: -8, marginBottom: 12 }}>
            From your debt paydown model, or estimate below
          </p>
          <InputCard>
            <div>
              <FieldLabel>Months until debt-free</FieldLabel>
              <NumberField
                defaultValue={inputs.monthsUntilDebtFree}
                onChange={update('monthsUntilDebtFree')}
                step={1}
              />
            </div>
            <div>
              <FieldLabel>Monthly cash flow unlocked</FieldLabel>
              <NumberField
                defaultValue={inputs.monthlyContributionAfterDebt}
                onChange={update('monthlyContributionAfterDebt')}
                prefix="$"
                step={50}
              />
              <FieldHelper>
                Total payments freed when all debts clear
              </FieldHelper>
            </div>
          </InputCard>

          {/* Section 3 — Current home */}
          <SectionLabel>Your current home</SectionLabel>
          <InputCard>
            <div>
              <FieldLabel>Estimated sale price</FieldLabel>
              <NumberField
                defaultValue={inputs.currentHomeValue}
                onChange={update('currentHomeValue')}
                prefix="$"
                step={5000}
              />
            </div>
            <div>
              <FieldLabel>Remaining mortgage balance</FieldLabel>
              <NumberField
                defaultValue={inputs.remainingMortgage}
                onChange={update('remainingMortgage')}
                prefix="$"
                step={5000}
              />
            </div>
            <div>
              <FieldLabel>Selling costs</FieldLabel>
              <NumberField
                defaultValue={inputs.sellingCostPct}
                onChange={update('sellingCostPct')}
                suffix="%"
                step={0.5}
              />
              <FieldHelper>
                Agent fees + closing costs, typically 5–6%
              </FieldHelper>
            </div>
            <CalculatedBox
              label="Estimated net equity"
              value={fmtMoney(result.netEquity)}
            />
          </InputCard>

          {/* Section 4 — Target home */}
          <SectionLabel>Target home</SectionLabel>
          <InputCard>
            <div>
              <FieldLabel>Target home price</FieldLabel>
              <NumberField
                defaultValue={inputs.targetHomePrice}
                onChange={update('targetHomePrice')}
                prefix="$"
                step={5000}
              />
            </div>
            <div>
              <FieldLabel>Down payment</FieldLabel>
              <NumberField
                defaultValue={inputs.downPaymentPct}
                onChange={update('downPaymentPct')}
                suffix="%"
                step={1}
              />
            </div>
            <div>
              <FieldLabel>Closing costs</FieldLabel>
              <NumberField
                defaultValue={inputs.closingCostPct}
                onChange={update('closingCostPct')}
                suffix="%"
                step={0.5}
              />
            </div>
            <div>
              <FieldLabel>Annual home price appreciation</FieldLabel>
              <NumberField
                defaultValue={inputs.annualAppreciationPct}
                onChange={update('annualAppreciationPct')}
                suffix="%"
                step={0.5}
                min={0}
              />
              <FieldHelper>Historical So-Cal average ~4–6% annually</FieldHelper>
            </div>
            <CalculatedBox
              label="Total cash needed"
              value={fmtMoney(result.totalCashNeeded)}
            />
          </InputCard>
        </div>

        {/* Section 5 — Result */}
        <div style={{ marginTop: 32 }}>
          <SectionLabel>Your timeline</SectionLabel>

          {/* Primary answer */}
          <div
            style={{
              background: 'white',
              border: `1px solid ${DIV}`,
              borderRadius: 16,
              padding: '32px 24px',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 13, color: INK_3, marginBottom: 8 }}>
              You could buy in
            </div>
            <div
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                color: INK,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {result.goalMonth !== null ? result.goalDate : 'Not in 50 years'}
            </div>
            {result.goalMonth !== null && (
              <div
                style={{
                  fontSize: 14,
                  color: INK_3,
                  marginTop: 6,
                }}
              >
                {result.goalMonth === 0
                  ? 'Today'
                  : fmtYearsMonths(result.goalMonth)}
              </div>
            )}
          </div>

          {/* Stat cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 10, marginBottom: 24 }}
          >
            <StatCard
              label="Total saved at goal"
              value={
                result.goalMonth !== null ? fmtMoney(result.totalSavedAtGoal) : '—'
              }
            />
            <StatCard
              label="Equity from home sale"
              value={
                result.goalMonth !== null
                  ? fmtMoney(result.equityContribution)
                  : '—'
              }
            />
            <StatCard
              label="Interest earned on savings"
              value={
                result.goalMonth !== null
                  ? fmtMoney(result.interestEarnedAtGoal)
                  : '—'
              }
            />
            <StatCard
              label="Extra per month to buy 1 year sooner"
              value={
                result.monthlyNeededOneYearEarlier > 0
                  ? `${fmtMoney(result.monthlyNeededOneYearEarlier)}/mo`
                  : '—'
              }
            />
          </div>

          {inputs.annualAppreciationPct > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ gap: 10, marginBottom: 24 }}
            >
              <StatCard
                label="Home price at buy date"
                value={fmtMoneyShort(result.appreciatedHomePrice)}
              />
              <StatCard
                label="Revised cash needed"
                value={fmtMoney(result.appreciatedCashNeeded)}
              />
              <StatCard
                label={
                  result.appreciationGap === 0
                    ? 'Your trajectory covers appreciation'
                    : 'Extra needed vs today’s price'
                }
                value={fmtMoney(result.appreciationGap)}
              />
            </div>
          )}

          {/* Chart */}
          <div className="md:[&>div]:!h-[340px]">
            <TimelineChart
              snapshots={result.snapshots.filter(
                (s) =>
                  s.month <=
                  (result.goalMonth !== null ? result.goalMonth + 6 : 120),
              )}
              totalCashNeeded={result.totalCashNeeded}
              debtFreeMonth={result.debtFreeMonth}
              goalMonth={result.goalMonth}
              goalBalance={result.totalSavedAtGoal}
              netEquity={result.netEquity}
              appreciationSnapshots={result.appreciationSnapshots.filter(
                (a) =>
                  a.month <=
                  (result.goalMonth !== null ? result.goalMonth + 6 : 120),
              )}
              annualAppreciationPct={inputs.annualAppreciationPct}
            />
          </div>

          <CollapsibleMath />
        </div>

        {/* Affordability check */}
        <div style={{ marginTop: 32 }}>
          <SectionLabel>Affordability check</SectionLabel>

          <div key={hydrated ? 'h-aff' : 'd-aff'}>
            <InputCard>
              <div>
                <FieldLabel>Mortgage rate</FieldLabel>
                <NumberField
                  defaultValue={inputs.mortgageRate}
                  onChange={update('mortgageRate')}
                  suffix="%"
                  step={0.125}
                />
                <FieldHelper>Annual interest rate on the new mortgage</FieldHelper>
              </div>
              <div>
                <FieldLabel>Gross monthly income</FieldLabel>
                <NumberField
                  defaultValue={inputs.grossMonthlyIncome}
                  onChange={update('grossMonthlyIncome')}
                  prefix="$"
                  step={100}
                />
                <FieldHelper>Household income before taxes</FieldHelper>
              </div>
              <div>
                <FieldLabel>Existing monthly debt payments</FieldLabel>
                <NumberField
                  defaultValue={inputs.existingMonthlyDebt}
                  onChange={update('existingMonthlyDebt')}
                  prefix="$"
                  step={50}
                />
                <FieldHelper>Car, student loans, etc. (optional)</FieldHelper>
              </div>
            </InputCard>
          </div>

          {affordability && (
            <div
              style={{
                background: 'white',
                border: `1px solid ${DIV}`,
                borderRadius: 16,
                padding: 24,
                marginTop: 12,
              }}
            >
              <AffordabilityRow
                label="Monthly P&I"
                value={fmtUSD(affordability.monthlyPI)}
                formula="P × [r(1+r)^n] / [(1+r)^n − 1]"
              />
              <AffordabilityRow
                label="Est. Monthly PITI"
                value={fmtUSD(affordability.piti)}
                formula="P&I + property tax + insurance (estimates)"
              />
              {affordability.housingRatio !== null && (
                <AffordabilityRow
                  label="Housing Ratio"
                  value={fmtPct1(affordability.housingRatio)}
                  formula="PITI / gross monthly income"
                />
              )}
              {affordability.dti !== null && (
                <AffordabilityRow
                  label="DTI"
                  value={fmtPct1(affordability.dti)}
                  formula="(PITI + existing debt) / gross monthly income"
                  last
                />
              )}

              <p style={{ fontSize: 12, color: INK_3, marginTop: 18, lineHeight: 1.6 }}>
                Tax and insurance are estimates. Actual amounts vary by location.
              </p>
              <p style={{ fontSize: 12, color: INK_3, marginTop: 8, lineHeight: 1.6 }}>
                Lenders commonly use 28% as a housing ratio guideline and 36% as a
                DTI guideline. These are reference points, not rules.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
