import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const BG = '#edeae3';
const BG_2 = '#e4e1da';
const DARK = '#1e1c18';
const INK = '#1e1c18';
const INK_2 = '#3a3830';
const INK_3 = '#6b6760';
const INK_4 = '#a09890';
const RULE = 'rgba(0,0,0,0.10)';
const TEAL = '#167e7f';
const SERIF = "var(--font-serif), 'Source Serif 4', Georgia, serif";

const wrap = { maxWidth: 1240, marginLeft: 'auto', marginRight: 'auto' };
const hPad = { paddingLeft: 'clamp(20px, 4vw, 56px)', paddingRight: 'clamp(20px, 4vw, 56px)' };

const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK_3,
};

function Arrow({ size = 12, color = DARK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M7 3l3 3-3 3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturedChart() {
  return (
    <svg viewBox="0 0 460 320" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="featGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(237,234,227,0.18)" />
          <stop offset="100%" stopColor="rgba(237,234,227,0)" />
        </linearGradient>
      </defs>
      {[60, 130, 200, 270].map((y) => (
        <line key={y} x1="40" y1={y} x2="430" y2={y} stroke="rgba(237,234,227,0.06)" strokeWidth="1" />
      ))}
      <line x1="40" y1="60" x2="430" y2="60" stroke="rgba(237,234,227,0.45)" strokeDasharray="6 4" strokeWidth="1" />
      <text x="430" y="50" fill="rgba(237,234,227,0.55)" fontSize="11" textAnchor="end" fontFamily={SERIF}>goal</text>
      <path d="M40,260 C100,240 160,200 220,150 C280,108 340,80 430,60 L430,290 L40,290 Z" fill="url(#featGrad)" />
      <path d="M40,260 C100,240 160,200 220,150 C280,108 340,80 430,60" fill="none" stroke="#edeae3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="335" cy="80" r="4.5" fill="#edeae3" />
      <circle cx="335" cy="80" r="9" fill="none" stroke="#edeae3" strokeWidth="1" opacity="0.35" />
      {['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4', 'Yr 5'].map((label, i) => (
        <text key={label} x={40 + (i + 1) * 78} y={304} fill="rgba(237,234,227,0.45)" fontSize="10" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {label}
        </text>
      ))}
    </svg>
  );
}

function DebtSpark() {
  return (
    <svg viewBox="0 0 200 56" fill="none" style={{ width: '100%', height: 56, display: 'block' }}>
      <path d="M0,12 C30,18 60,28 100,38 C140,46 170,50 200,52" fill="none" stroke={INK_4} strokeDasharray="4 3" strokeWidth="1.2" opacity="0.55" />
      <path d="M0,12 C30,20 60,32 100,42 C140,48 170,50 200,50" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SavingsSpark() {
  return (
    <svg viewBox="0 0 200 56" fill="none" style={{ width: '100%', height: 56, display: 'block' }}>
      <path d="M0,46 C30,44 60,38 90,30 C130,18 170,10 200,8" fill="none" stroke={INK_4} strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}

function NetWorthSpark() {
  return (
    <svg viewBox="0 0 200 56" fill="none" style={{ width: '100%', height: 56, display: 'block' }}>
      <path d="M0,42 C40,38 80,30 120,22 C150,16 180,10 200,8" fill="none" stroke={INK_4} strokeWidth="1.4" opacity="0.55" />
      <path d="M0,46 C40,46 80,44 120,42 C150,40 180,38 200,36" fill="none" stroke={INK_4} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
    </svg>
  );
}

const featured = {
  title: 'Home Down Payment',
  blurb: 'Savings trajectory, home equity, and post-debt cash flow — modeled month by month against your timeline.',
  href: '/tools/home',
};

const models = [
  {
    title: 'Debt Paydown',
    blurb: 'How extra payments collapse your payoff timeline and reduce total interest paid.',
    status: 'Live',
    href: '/tools/debt',
    Spark: DebtSpark,
  },
  {
    title: 'Savings Trajectory',
    blurb: 'How long to reach a savings goal given your current cash flow and return assumptions.',
    status: 'Planned',
    href: null,
    Spark: SavingsSpark,
  },
  {
    title: 'Net Worth Growth',
    blurb: 'Assets minus liabilities, projected forward under your assumptions.',
    status: 'Planned',
    href: null,
    Spark: NetWorthSpark,
  },
];

export default function Models() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <Nav />

      {/* Header */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: INK_4,
            marginBottom: 20,
          }}
        >
          All models
        </p>
        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.028em',
            color: INK,
            maxWidth: 640,
            textWrap: 'balance',
          }}
        >
          Math-first tools for personal finance.
        </h1>
      </section>

      {/* Featured */}
      <section style={{ ...wrap, ...hPad, paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <Link href={featured.href} style={{ display: 'block', textDecoration: 'none' }}>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ background: DARK, borderRadius: 18, overflow: 'hidden', minHeight: 340 }}
          >
            <div style={{ padding: 'clamp(36px, 5vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(237,234,227,0.45)',
                  marginBottom: 18,
                }}
              >
                Featured
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(36px, 4.5vw, 56px)',
                  fontWeight: 500,
                  color: BG,
                  lineHeight: 1.04,
                  letterSpacing: '-0.012em',
                  marginBottom: 18,
                }}
              >
                {featured.title}
              </h2>
              <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.6, color: '#a8a39a', marginBottom: 28, maxWidth: 380 }}>
                {featured.blurb}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: BG,
                  color: DARK,
                  padding: '11px 20px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 500,
                  width: 'fit-content',
                }}
              >
                Open the model <Arrow color={DARK} size={11} />
              </span>
            </div>
            <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)', minHeight: 240 }}>
              <FeaturedChart />
            </div>
          </div>
        </Link>
      </section>

      {/* Model grid */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingBottom: 'clamp(80px, 9vw, 128px)',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: INK,
            marginBottom: 24,
            letterSpacing: '-0.005em',
          }}
        >
          More models
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
          {models.map((m) => {
            const isLive = !!m.href;
            const card = (
              <div
                style={{
                  background: BG_2,
                  borderRadius: 14,
                  padding: '28px 28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '-0.018em',
                    color: INK,
                    marginBottom: 12,
                    lineHeight: 1.15,
                  }}
                >
                  {m.title}
                </h3>
                <p style={{ fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.55, color: INK_2, marginBottom: 24, flexGrow: 1 }}>
                  {m.blurb}
                </p>
                <div style={{ marginBottom: 22, opacity: isLive ? 1 : 0.55 }}>
                  <m.Spark />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderTop: `1px solid ${RULE}` }}>
                  <span style={monoLabel}>Status</span>
                  <span style={{ fontSize: 13, color: isLive ? TEAL : INK_3, fontWeight: 500 }}>{m.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderTop: `1px solid ${RULE}` }}>
                  <span style={monoLabel}>Category</span>
                  <span style={{ fontSize: 13, color: INK_2 }}>Personal Finance</span>
                </div>
                <div style={{ marginTop: 18 }}>
                  {isLive ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: DARK, color: BG, padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500 }}>
                      Open model <Arrow color={BG} size={11} />
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: INK_3, fontWeight: 500 }}>Planned</span>
                  )}
                </div>
              </div>
            );
            return isLive ? (
              <Link key={m.title} href={m.href!} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>
            ) : (
              <div key={m.title}>{card}</div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
