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

const wrap = { maxWidth: 1240, marginLeft: 'auto', marginRight: 'auto' };
const hPad = { paddingLeft: 'clamp(20px, 4vw, 56px)', paddingRight: 'clamp(20px, 4vw, 56px)' };

const topics = [
  {
    category: 'Guides',
    title: 'How to use the Home Down Payment model',
    blurb: 'A walkthrough of every input, what the math means, and how to read the chart.',
  },
  {
    category: 'Guides',
    title: 'Understanding debt paydown strategies',
    blurb: 'Avalanche vs. snowball, interest cost, and how extra payments change your timeline.',
  },
  {
    category: 'Concepts',
    title: 'Time value of money, explained plainly',
    blurb: 'The foundational idea behind every model on Learnberry.',
  },
  {
    category: 'Concepts',
    title: 'What is a savings rate and why does it compound?',
    blurb: 'How the relationship between income, spending, and time actually works.',
  },
  {
    category: 'Concepts',
    title: 'Home equity as a capital event',
    blurb: 'Why equity from a home sale is different from monthly savings — and how to model it.',
  },
  {
    category: 'Guides',
    title: 'Reading the appreciation line on the home model',
    blurb: 'What the red dashed line means, why it diverges, and what to do about it.',
  },
];

export default function Learn() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <Nav />

      {/* Header */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(48px, 6vw, 72px)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end' }}>
          <div>
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
              Learn
            </p>
            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: '-0.028em',
                color: INK,
                textWrap: 'balance',
              }}
            >
              Guides, concepts, and the math behind the models.
            </h1>
          </div>
          <div>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(16px, 1.25vw, 19px)',
                lineHeight: 1.65,
                color: INK_2,
              }}
            >
              Every Learnberry model is built on standard financial math. These guides explain
              how each tool works, what the inputs mean, and the concepts behind the equations —
              so you can use the models with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Coming soon banner */}
      <section style={{ ...wrap, ...hPad, paddingBottom: 'clamp(32px, 4vw, 48px)' }}>
        <div
          style={{
            background: BG_2,
            borderRadius: 14,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderLeft: `3px solid ${TEAL}`,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TEAL,
              flexShrink: 0,
            }}
          >
            In progress
          </span>
          <p style={{ fontSize: 14, color: INK_3, margin: 0 }}>
            Articles are being written. The list below shows what&apos;s planned.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section
        style={{
          ...wrap,
          ...hPad,
          paddingBottom: 'clamp(80px, 9vw, 128px)',
        }}
      >
        {topics.map((t, i) => (
          <div
            key={t.title}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'clamp(24px, 4vw, 64px)',
              padding: '28px 0',
              borderTop: i === 0 ? `1px solid ${RULE}` : 'none',
              borderBottom: `1px solid ${RULE}`,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: INK_4,
                flexShrink: 0,
                width: 80,
              }}
            >
              {t.category}
            </span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: INK,
                  letterSpacing: '-0.01em',
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                {t.title}
              </p>
              <p style={{ fontFamily: SERIF, fontSize: 14, color: INK_3, lineHeight: 1.55 }}>
                {t.blurb}
              </p>
            </div>
            <span style={{ fontSize: 12, color: INK_4, flexShrink: 0 }}>Soon</span>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
