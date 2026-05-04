import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const BG = '#edeae3';
const INK = '#1e1c18';
const INK_2 = '#3a3830';
const INK_3 = '#6b6760';
const SERIF = "var(--font-serif), 'Source Serif 4', Georgia, serif";

export default function About() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK }}>
      <Nav />
      <main
        className="mx-auto w-full"
        style={{
          maxWidth: 720,
          paddingLeft: 'clamp(20px, 4vw, 56px)',
          paddingRight: 'clamp(20px, 4vw, 56px)',
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: 'clamp(80px, 9vw, 128px)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: INK,
            marginBottom: 36,
            textWrap: 'balance',
          }}
        >
          A math-first thinking tool for personal finance.
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            fontFamily: SERIF,
            fontSize: 'clamp(16px, 1.25vw, 19px)',
            lineHeight: 1.65,
            color: INK_2,
          }}
        >
          <p>
            Learnberry is a set of interactive simulators for thinking through
            personal finance decisions. Every model is built around a real
            equation. Not a black box, not a guess.
          </p>
          <p>
            The goal is clarity. Most financial tools either oversimplify
            (a single number answer) or overwhelm (dozens of inputs).
            Learnberry sits in between: just enough parameters to be honest,
            simple enough to be useful.
          </p>
          <p>
            This is not financial advice. It is a thinking aid. Use it to
            build intuition, stress-test assumptions, and ask better
            questions.
          </p>
          <p style={{ color: INK_3 }}>
            No accounts. No tracking. No data leaves your browser. The math
            runs locally and that is intentional.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
