import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

function HomeSparkline() {
  return (
    <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-home" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(22,126,127,0.12)" />
          <stop offset="100%" stopColor="rgba(22,126,127,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,30 C30,28 60,24 90,18 C120,10 150,5 200,2 L200,32 L0,32 Z"
        fill="url(#grad-home)"
      />
      <path
        d="M0,30 C30,28 60,24 90,18 C120,10 150,5 200,2"
        fill="none"
        stroke="#167e7f"
        strokeWidth="1.5"
      />
      <line x1="0" y1="2" x2="200" y2="2" stroke="#c0644a" strokeDasharray="4 4" strokeWidth="1" opacity="0.5" />
      <line x1="148" y1="2" x2="148" y2="32" stroke="#167e7f" strokeDasharray="3 3" strokeWidth="1" opacity="0.4" />
      <circle cx="148" cy="2" r="2.5" fill="#167e7f" opacity="0.8" />
    </svg>
  );
}

function SavingsSparkline() {
  return (
    <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-savings" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(22,126,127,0.12)" />
          <stop offset="100%" stopColor="rgba(22,126,127,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,28 C20,26 40,22 60,16 C90,8 120,4 200,2 L200,32 L0,32 Z"
        fill="url(#grad-savings)"
      />
      <path
        d="M0,28 C20,26 40,22 60,16 C90,8 120,4 200,2"
        fill="none"
        stroke="#167e7f"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DebtSparkline() {
  return (
    <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none">
      <path
        d="M0,2 C20,6 60,14 100,22 C140,28 170,30 200,31"
        fill="none"
        stroke="#a3a3a3"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        opacity="0.5"
      />
      <path
        d="M0,2 C30,8 70,18 110,26 C150,30 180,31 200,32"
        fill="none"
        stroke="#167e7f"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function NetWorthSparkline() {
  return (
    <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-networth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(22,126,127,0.12)" />
          <stop offset="100%" stopColor="rgba(22,126,127,0)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="22" x2="200" y2="22" stroke="#e5e5e5" strokeDasharray="4 4" strokeWidth="1" />
      <path
        d="M0,28 C20,27 40,26 60,25 C80,23 90,22 100,20 C120,14 150,6 200,2 L200,32 L0,32 Z"
        fill="url(#grad-networth)"
      />
      <path
        d="M0,28 C20,27 40,26 60,25 C80,23 90,22 100,20 C120,14 150,6 200,2"
        fill="none"
        stroke="#167e7f"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const plannedTools = [
  {
    label: 'Savings Trajectory',
    desc: 'How long to reach $X given cash flow and return assumptions.',
    Spark: SavingsSparkline,
  },
  {
    label: 'Debt Paydown',
    desc: 'How extra payments collapse your payoff timeline and total interest.',
    Spark: DebtSparkline,
  },
  {
    label: 'Net Worth Growth',
    desc: 'Assets minus liabilities, projected forward under your assumptions.',
    Spark: NetWorthSparkline,
  },
];

const hPad = { paddingLeft: 'clamp(24px, 5vw, 64px)', paddingRight: 'clamp(24px, 5vw, 64px)' };

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fafaf8', color: '#171717' }}>
      <Nav />

      {/* ── OPENING ── */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          ...hPad,
          paddingTop: 'clamp(64px, 8vw, 100px)',
          paddingBottom: 'clamp(48px, 6vw, 72px)',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <p
            className="font-semibold leading-[1.2] tracking-[-0.025em] mb-5"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#171717' }}
          >
            Make your financial<br />trajectory visible.
          </p>
          <p
            className="leading-[1.7] font-normal mb-7"
            style={{ fontSize: 'clamp(15px, 1.6vw, 17px)', color: '#737373', maxWidth: 460 }}
          >
            See where your current behavior leads, what becomes possible, and what would change the timeline.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            <Link
              href="/tools/home"
              className="inline-flex items-center gap-[5px] text-[14px] font-medium"
              style={{ color: '#167e7f' }}
            >
              Open the home down payment model
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M8 3l3 3.5-3 3.5" stroke="#167e7f" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-[12px]" style={{ color: '#a3a3a3' }}>No data stored.</span>
          </div>
        </div>
      </section>

      {/* ── MODEL LIBRARY ── */}
      <section
        id="models"
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          ...hPad,
          paddingTop: 'clamp(36px, 4vw, 52px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
          borderTop: '1px solid #f0efed',
        }}
      >
        <p
          className="text-[12px] font-medium uppercase mb-7"
          style={{ color: '#a3a3a3', letterSpacing: '0.06em' }}
        >
          Models
        </p>

        {/* Featured model */}
        <Link
          href="/tools/home"
          className="flex flex-col md:grid md:items-center md:[grid-template-columns:2fr_1fr] gap-6 rounded-[10px] mb-2"
          style={{
            background: '#f3f3f1',
            border: '1px solid #e5e5e5',
            padding: '24px 28px',
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 md:gap-[10px]">
              <span className="text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap" style={{ color: '#171717' }}>
                Home Down Payment
              </span>
              <span
                className="text-[10px] font-medium rounded-[4px] px-[7px] py-[1px] flex-shrink-0"
                style={{
                  color: '#167e7f',
                  background: 'rgba(22,126,127,0.1)',
                  border: '1px solid rgba(22,126,127,0.2)',
                  letterSpacing: '0.03em',
                }}
              >
                Live
              </span>
            </div>
            <p className="text-[13.5px] leading-[1.6]" style={{ color: '#737373' }}>
              See when your savings trajectory meets your down payment target — and what changes the timeline.
            </p>
          </div>
          <div className="hidden md:block">
            <HomeSparkline />
          </div>
        </Link>

        {/* Planned tools */}
        <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid #f0efed' }}>
          {plannedTools.map(({ label, desc, Spark }, i) => (
            <div
              key={label}
              className="flex flex-row justify-between items-center gap-6 py-[14px] px-[20px] md:grid md:[grid-template-columns:1fr_120px] md:py-[16px] md:px-[28px]"
              style={{
                borderBottom: i < plannedTools.length - 1 ? '1px solid #f0efed' : 'none',
                opacity: 0.5,
              }}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium whitespace-nowrap" style={{ color: '#171717' }}>
                    {label}
                  </span>
                  <span
                    className="text-[10px] rounded-[4px] px-[6px] py-[1px] flex-shrink-0"
                    style={{ color: '#a3a3a3', border: '1px solid #e5e5e5', letterSpacing: '0.03em' }}
                  >
                    Planned
                  </span>
                </div>
                <span className="text-[12.5px] leading-[1.5]" style={{ color: '#737373' }}>
                  {desc}
                </span>
              </div>
              <div className="flex-shrink-0 w-[80px] h-[24px] overflow-hidden md:w-full md:h-auto md:overflow-visible">
                <Spark />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          ...hPad,
          paddingTop: 'clamp(56px, 7vw, 88px)',
          paddingBottom: 'clamp(56px, 7vw, 88px)',
          borderTop: '1px solid #f0efed',
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <p
            className="font-semibold leading-[1.25] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#171717' }}
          >
            If your current behavior continues,<br />where does it lead?
          </p>
          <p
            className="font-semibold leading-[1.25] tracking-[-0.025em] mb-7"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#737373', marginTop: '0.25em' }}
          >
            If you change one assumption,<br />what changes with it?
          </p>
          <p className="text-[14px] leading-[1.7]" style={{ color: '#a3a3a3' }}>
            Learnberry is built to make that visible.
          </p>
        </div>
      </section>

      {/* ── WHAT THIS IS ── */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          ...hPad,
          paddingTop: 'clamp(48px, 6vw, 72px)',
          paddingBottom: 'clamp(48px, 6vw, 72px)',
          borderTop: '1px solid #f0efed',
        }}
      >
        <div
          className="grid grid-cols-2"
          style={{ gap: 'clamp(32px, 6vw, 96px)', maxWidth: 680 }}
        >
          <div>
            <p className="text-[13px] font-semibold mb-[18px]" style={{ color: '#171717' }}>
              What <span style={{ color: '#167e7f' }}>Learnberry</span> does
            </p>
            <div className="flex flex-col gap-[11px]">
              {[
                'Models financial goals over time',
                'Shows how assumptions affect outcomes',
                'Makes variables visible and adjustable',
                'Uses deterministic, standard math',
              ].map((t) => (
                <div key={t} className="flex gap-[10px]">
                  <span className="text-[12px] font-semibold flex-shrink-0 mt-[1px]" style={{ color: '#167e7f' }}>✓</span>
                  <span className="text-[13px] leading-[1.6]" style={{ color: '#404040' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-[18px]" style={{ color: '#171717' }}>
              What it does not do
            </p>
            <div className="flex flex-col gap-[11px]">
              {[
                'Give financial advice',
                'Track your accounts or data',
                'Hide assumptions in a black box',
                'Motivate, nudge, or gamify',
              ].map((t) => (
                <div key={t} className="flex gap-[10px]">
                  <span className="text-[13px] flex-shrink-0" style={{ color: '#a3a3a3' }}>—</span>
                  <span className="text-[13px] leading-[1.6]" style={{ color: '#737373' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MATH NOTE ── */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 920,
          ...hPad,
          paddingTop: 'clamp(48px, 6vw, 72px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
          borderTop: '1px solid #f0efed',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <p
            className="font-bold leading-[1.15] tracking-[-0.025em] mb-4"
            style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: '#171717' }}
          >
            The model is the product.
          </p>
          <p className="text-[14px] leading-[1.8]" style={{ color: '#737373' }}>
            Learnberry tools are built from standard time-value-of-money equations: accumulation, growth, annuities,
            and goal conditions. No black box. No hidden score. No invented logic. Just assumptions, equations, and
            visible outcomes.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
