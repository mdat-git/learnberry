import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

/* ── tokens ─────────────────────────────────────────────── */
const BG = '#edeae3';
const BG_2 = '#e4e1da';
const DARK = '#1e1c18';
const INK = '#1e1c18';
const INK_2 = '#3a3830';
const INK_3 = '#6b6760';
const INK_4 = '#a09890';
const RULE = 'rgba(0,0,0,0.10)';
const TEAL = '#167e7f';
const SERIF = "var(--font-serif), 'Source Serif 4', 'Source Serif Pro', Georgia, serif";

const wrap = { maxWidth: 1240, marginLeft: 'auto', marginRight: 'auto' };
const hPad = { paddingLeft: 'clamp(20px, 4vw, 56px)', paddingRight: 'clamp(20px, 4vw, 56px)' };

/* ── icons ──────────────────────────────────────────────── */
function Arrow({ size = 12, color = DARK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M7 3l3 3-3 3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── chart visuals ──────────────────────────────────────── */
function FeaturedChart() {
  // Larger illustrative chart for the dark featured panel.
  return (
    <svg viewBox="0 0 460 320" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="featGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(237,234,227,0.18)" />
          <stop offset="100%" stopColor="rgba(237,234,227,0)" />
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {[60, 130, 200, 270].map((y) => (
        <line key={y} x1="40" y1={y} x2="430" y2={y} stroke="rgba(237,234,227,0.06)" strokeWidth="1" />
      ))}
      {/* goal line */}
      <line x1="40" y1="60" x2="430" y2="60" stroke="rgba(237,234,227,0.45)" strokeDasharray="6 4" strokeWidth="1" />
      <text x="430" y="50" fill="rgba(237,234,227,0.55)" fontSize="11" textAnchor="end" fontFamily={SERIF}>goal</text>
      {/* trajectory area */}
      <path
        d="M40,260 C100,240 160,200 220,150 C280,108 340,80 430,60 L430,290 L40,290 Z"
        fill="url(#featGrad)"
      />
      {/* trajectory line */}
      <path
        d="M40,260 C100,240 160,200 220,150 C280,108 340,80 430,60"
        fill="none"
        stroke="#edeae3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* crossing dot */}
      <circle cx="335" cy="80" r="4.5" fill="#edeae3" />
      <circle cx="335" cy="80" r="9" fill="none" stroke="#edeae3" strokeWidth="1" opacity="0.35" />
      {/* x-axis ticks (years) */}
      {['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4', 'Yr 5'].map((label, i) => (
        <text
          key={label}
          x={40 + (i + 1) * 78}
          y={304}
          fill="rgba(237,234,227,0.45)"
          fontSize="10"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
        >
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

/* ── data ───────────────────────────────────────────────── */
const featured = {
  title: 'Home Down Payment',
  blurb:
    'Savings trajectory, home equity, and post-debt cash flow — modeled month by month against your timeline.',
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

const doesItems = [
  'Models financial goals over time',
  'Shows how assumptions affect outcomes',
  'Makes variables visible and adjustable',
  'Uses deterministic, standard math',
];

const doesNotItems = [
  'Give financial advice',
  'Track your accounts or data',
  'Hide assumptions in a black box',
  'Motivate, nudge, or gamify',
];

/* ── shared style fragments ─────────────────────────────── */
const sectionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: INK,
  marginBottom: 24,
  letterSpacing: '-0.005em',
};

const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK_3,
};

/* ── page ───────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <Nav />

      {/* ── HERO ── */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: 'clamp(56px, 7vw, 96px)',
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end' }}
        >
          <h1
            style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.028em',
              color: INK,
              textWrap: 'balance',
            }}
          >
            Financial models that put every assumption in plain view.
          </h1>
          <div style={{ paddingTop: 'clamp(8px, 1vw, 16px)' }}>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(22px, 1.35vw, 20px)',
                fontWeight: 400,
                lineHeight: 1.55,
                color: INK_2,
                textWrap: 'pretty',
              }}
            >
              Learnberry turns everyday goals into simple, transparent models. 
              No vague advice, no black box, no AI suggesions. Just plain math so 
              you can see where your current path leads, and where it could go when you
              change one thing.  
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURED MODEL (dark panel) ── */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingBottom: 'clamp(48px, 6vw, 80px)',
        }}
      >
        <Link href={featured.href} style={{ display: 'block', textDecoration: 'none' }}>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              background: DARK,
              borderRadius: 18,
              overflow: 'hidden',
              minHeight: 380,
            }}
          >
            {/* Left: text */}
            <div
              style={{
                padding: 'clamp(36px, 5vw, 64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 500,
                  color: BG,
                  lineHeight: 1.02,
                  letterSpacing: '-0.012em',
                  marginBottom: 22,
                }}
              >
                {featured.title}
              </h2>
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(15px, 1.2vw, 17px)',
                  lineHeight: 1.6,
                  color: '#a8a39a',
                  fontWeight: 400,
                  maxWidth: 420,
                  marginBottom: 28,
                }}
              >
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
                Open the model
                <Arrow color={DARK} size={11} />
              </span>
            </div>
            {/* Right: chart */}
            <div
              style={{
                padding: 'clamp(28px, 4vw, 48px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.18)',
                minHeight: 280,
              }}
            >
              <FeaturedChart />
            </div>
          </div>
        </Link>
      </section>

      {/* ── LATEST MODELS (3-col card grid) ── */}
      <section
        id="models"
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(40px, 5vw, 56px)',
          paddingBottom: 'clamp(72px, 8vw, 112px)',
        }}
      >
        <p style={sectionLabel}>Latest models</p>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 16 }}
        >
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
                  transition: 'background 0.18s ease',
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
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: 14.5,
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: INK_2,
                    marginBottom: 24,
                    flexGrow: 1,
                  }}
                >
                  {m.blurb}
                </p>
                <div style={{ marginBottom: 22, opacity: isLive ? 1 : 0.55 }}>
                  <m.Spark />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '12px 0',
                    borderTop: `1px solid ${RULE}`,
                  }}
                >
                  <span style={monoLabel}>Status</span>
                  <span style={{ fontSize: 13, color: isLive ? TEAL : INK_3, fontWeight: 500 }}>
                    {m.status}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '12px 0',
                    borderTop: `1px solid ${RULE}`,
                  }}
                >
                  <span style={monoLabel}>Category</span>
                  <span style={{ fontSize: 13, color: INK_2 }}>Personal Finance</span>
                </div>
                <div style={{ marginTop: 18 }}>
                  {isLive ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: DARK,
                        color: BG,
                        padding: '10px 18px',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      Open model <Arrow color={BG} size={11} />
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: INK_3, fontWeight: 500 }}>Planned</span>
                  )}
                </div>
              </div>
            );
            return isLive ? (
              <Link key={m.title} href={m.href!} style={{ textDecoration: 'none', color: 'inherit' }}>
                {card}
              </Link>
            ) : (
              <div key={m.title}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* ── PHILOSOPHY (split heading) ── */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(56px, 7vw, 96px)',
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 'clamp(32px, 5vw, 96px)', alignItems: 'start' }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(32px, 4.2vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: INK,
                marginBottom: '0.4em',
                textWrap: 'balance',
              }}
            >
              If your current behavior continues, where does it lead?
            </h2>
            <p
              style={{
                fontSize: 'clamp(32px, 4.2vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: INK_3,
                textWrap: 'balance',
              }}
            >
              If you change one assumption, what changes with it?
            </p>
          </div>
          <div style={{ paddingTop: 'clamp(8px, 1vw, 14px)' }}>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(16px, 1.3vw, 19px)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: INK_2,
                textWrap: 'pretty',
              }}
            >
              Learnberry is built to make that visible. Not with advice, but
              with a model you can see, adjust, and trust. Standard math with every variable 
              in control.
            </p>
          </div>
        </div>
      </section>

      {/* ── ABOUT (does/does-not + the model) ── */}
      <section
        id="about"
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(48px, 6vw, 72px)',
          paddingBottom: 'clamp(80px, 9vw, 128px)',
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 'clamp(40px, 6vw, 96px)', alignItems: 'start' }}
        >
          {/* Left: lists */}
          <div>
            <p style={sectionLabel}>What Learnberry does</p>
            <div>
              {doesItems.map((t, i) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 14,
                    padding: '16px 0',
                    borderBottom: `1px solid ${RULE}`,
                    borderTop: i === 0 ? `1px solid ${RULE}` : 'none',
                  }}
                >
                  <span style={{ color: TEAL, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>✓</span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: INK,
                      lineHeight: 1.45,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ ...sectionLabel, marginTop: 40 }}>What it does not do</p>
            <div>
              {doesNotItems.map((t, i) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 14,
                    padding: '16px 0',
                    borderBottom: `1px solid ${RULE}`,
                    borderTop: i === 0 ? `1px solid ${RULE}` : 'none',
                  }}
                >
                  <span style={{ color: INK_4, fontSize: 12, flexShrink: 0 }}>—</span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: INK_3,
                      lineHeight: 1.45,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the model */}
          <div>
            <p style={sectionLabel}>The model</p>
            <h3
              style={{
                fontSize: 'clamp(28px, 3.4vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: INK,
                lineHeight: 1.04,
                marginBottom: 28,
                textWrap: 'balance',
              }}
            >
              The model<br />is the product.
            </h3>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 17,
                color: INK_2,
                lineHeight: 1.65,
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              Learnberry tools are built from standard time-value-of-money
              equations: accumulation, growth, annuities, and goal conditions.
            </p>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 17,
                color: INK_2,
                lineHeight: 1.65,
                fontWeight: 400,
                marginBottom: 36,
              }}
            >
              No black box. No hidden score. No invented logic. Just
              assumptions, equations, and visible outcomes.
            </p>
            <Link
              href="/tools/home"
              style={{
                fontFamily: SERIF,
                fontSize: 17,
                fontStyle: 'italic',
                color: TEAL,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderBottom: `1px solid ${TEAL}`,
                paddingBottom: 2,
                textDecoration: 'none',
              }}
            >
              Open the down payment model
              <Arrow color={TEAL} size={11} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
