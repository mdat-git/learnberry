import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const BG = '#edeae3';
const BG_2 = '#e4e1da';
const INK = '#1e1c18';
const INK_2 = '#3a3830';
const INK_3 = '#6b6760';
const INK_4 = '#a09890';
const TEAL = '#167e7f';
const RULE = 'rgba(0,0,0,0.10)';
const SERIF = "var(--font-serif), 'Source Serif 4', Georgia, serif";

const wrap = { maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' };
const hPad = { paddingLeft: 'clamp(20px, 4vw, 56px)', paddingRight: 'clamp(20px, 4vw, 56px)' };

const reasons = [
  'A bug or something behaving unexpectedly',
  'A suggestion for a new model or feature',
  'A question about the math',
  'Anything else',
];

export default function Contact() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <Nav />

      <main
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(64px, 8vw, 112px)',
          paddingBottom: 'clamp(80px, 9vw, 128px)',
        }}
      >
        {/* Header */}
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
          Contact
        </p>
        <h1
          style={{
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: INK,
            marginBottom: 28,
            textWrap: 'balance',
          }}
        >
          Get in touch.
        </h1>

        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(16px, 1.25vw, 19px)',
            lineHeight: 1.65,
            color: INK_2,
            marginBottom: 48,
          }}
        >
          Learnberry is a small project. If you have a question, a bug to report,
          or an idea for a model — feel free to reach out directly.
        </p>

        {/* Email CTA */}
        <div
          style={{
            background: BG_2,
            borderRadius: 16,
            padding: 'clamp(28px, 4vw, 48px)',
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: INK_3,
              marginBottom: 12,
              letterSpacing: '-0.005em',
            }}
          >
            Email
          </p>
          <a
            href="mailto:mdat.main@gmail.com"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 600,
              color: TEAL,
              letterSpacing: '-0.015em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            mdat.main@gmail.com
          </a>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              color: INK_3,
              marginTop: 16,
              lineHeight: 1.6,
            }}
          >
            No ticketing system, no response time guarantee — just an email.
            I read everything and reply when I can.
          </p>
        </div>

        {/* What to write about */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: INK,
            marginBottom: 20,
            letterSpacing: '-0.005em',
          }}
        >
          Good reasons to reach out
        </p>
        <div>
          {reasons.map((r, i) => (
            <div
              key={r}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 14,
                padding: '16px 0',
                borderTop: i === 0 ? `1px solid ${RULE}` : 'none',
                borderBottom: `1px solid ${RULE}`,
              }}
            >
              <span style={{ color: TEAL, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: INK_2, lineHeight: 1.45, letterSpacing: '-0.005em' }}>
                {r}
              </span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
