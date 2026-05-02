import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const tools = [
  {
    name: 'Savings Trajectory',
    description: 'How long to reach $X given your cash flow and return assumptions.',
    href: '/tools/savings',
    live: false,
  },
  {
    name: 'Home Down Payment',
    description: 'Model the path to a down payment under different savings rates.',
    href: '/tools/home',
    live: true,
  },
  {
    name: 'Debt Paydown',
    description: 'See how extra payments collapse your payoff timeline and total interest.',
    href: '/tools/debt',
    live: false,
  },
  {
    name: 'Net Worth Growth',
    description: 'Assets minus liabilities, projected forward under your assumptions.',
    href: '/tools/net-worth',
    live: false,
  },
];

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

const sparklines = [SavingsSparkline, HomeSparkline, DebtSparkline, NetWorthSparkline];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Nav />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6">

        {/* Hero */}
        <section className="pt-16 pb-16 md:pt-24 md:pb-20">
          <h1
            className="font-bold text-[#1a1918] leading-[1.05] tracking-[-0.04em] mb-5"
            style={{ fontSize: 'clamp(40px, 7vw, 68px)' }}
          >
            A <span style={{ color: '#167e7f' }}>math-first</span> thinking tool for personal finance.
          </h1>
          <p className="text-[16px] font-light text-[#9e9d97] leading-[1.65] tracking-[-0.01em] max-w-[420px]">
            Change assumptions. See outcomes. No accounts, no noise — just models
            that don&apos;t lie.
          </p>
        </section>

        {/* Tools */}
        <section style={{ paddingBottom: 80, borderTop: '1px solid #f0f0f0' }}>
          <p
            className="pt-5 pb-4"
            style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a3a3a3' }}
          >
            Tools
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
            {tools.map((tool, i) => {
              const Sparkline = sparklines[i];
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex flex-col rounded-2xl p-5"
                  style={{
                    background: tool.live ? '#fafafa' : '#ffffff',
                    border: '1px solid #e5e5e5',
                    opacity: tool.live ? 1 : 0.45,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#171717', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                        {tool.name}
                      </p>
                      {tool.live && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: '#167e7f',
                          background: 'rgba(22,126,127,0.08)',
                          borderRadius: 3,
                          padding: '1px 6px',
                          whiteSpace: 'nowrap',
                        }}>
                          Live
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: '#a3a3a3', flexShrink: 0 }}>→</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#737373', lineHeight: 1.5 }}>
                    {tool.description}
                  </p>
                  <div className="mt-4">
                    <Sparkline />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      {/* Philosophy */}
      <section className="w-full bg-white" style={{ borderTop: '1px solid #f0f0f0', padding: 'clamp(56px, 7vw, 96px) 0' }}>
        <div className="max-w-[800px] mx-auto px-6">
          <p
            style={{ fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.4, color: '#171717' }}
          >
            If your current behavior continues, where does it lead?
          </p>
          <p
            style={{ fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.4, color: '#737373' }}
          >
            If you change one assumption, what changes with it?
          </p>
          <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.7, marginTop: 24 }}>
            That is the question Learnberry is built to answer.
          </p>
        </div>
      </section>

      {/* What this is / does not do */}
      <section className="w-full bg-white" style={{ borderTop: '1px solid #f0f0f0', padding: 'clamp(56px, 7vw, 96px) 0' }}>
        <div className="max-w-[800px] mx-auto px-6">
          <p
            style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a3a3a3', marginBottom: 28 }}
          >
            What this is
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: '32px 64px', maxWidth: 720 }}
          >
            {/* Does */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', marginBottom: 20 }}>
                What <span style={{ color: '#167e7f' }}>Learnberry</span> does
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Models financial goals over time',
                  'Shows how assumptions affect outcomes',
                  'Makes key variables visible and adjustable',
                  'Uses deterministic, standard math',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ color: '#167e7f', fontWeight: 600, flexShrink: 0, fontSize: 13 }}>✓</span>
                    <p style={{ fontSize: 13, color: '#3f3f3f', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Does not */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', marginBottom: 20 }}>
                What it does not do
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Give financial advice',
                  'Track your accounts or data',
                  'Hide assumptions in a black box',
                  'Motivate, nudge, or gamify',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ color: '#a3a3a3', flexShrink: 0, fontSize: 13 }}>—</span>
                    <p style={{ fontSize: 13, color: '#3f3f3f', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The model */}
      <section className="w-full bg-white" style={{ borderTop: '1px solid #f0f0f0', padding: 'clamp(56px, 7vw, 96px) 0' }}>
        <div className="max-w-[800px] mx-auto px-6">
          <p
            style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a3a3a3', marginBottom: 20 }}
          >
            The model
          </p>
          <h2
            style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#171717', marginBottom: 16 }}
          >
            The model is the product.
          </h2>
          <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.8, maxWidth: 600 }}>
            Learnberry tools are built from standard time-value-of-money equations:
            accumulation, growth, annuities, and goal conditions. No black box. No
            hidden score. No invented logic. Just assumptions, equations, and visible
            outcomes.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
