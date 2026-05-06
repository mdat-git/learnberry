import Image from 'next/image';
import Link from 'next/link';

const BG = '#edeae3';
const INK = '#1e1c18';
const INK_3 = '#6b6760';
const INK_4 = '#a09890';
const RULE = 'rgba(0,0,0,0.10)';

const navigate = [
  { label: 'Home', href: '/' },
  { label: 'Models', href: '/models' },
  { label: 'Learn', href: '/learn' },
];

const company = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

export default function Footer() {
  return (
    <footer style={{ background: BG, borderTop: `1px solid ${RULE}` }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 1240,
          padding: 'clamp(48px, 6vw, 72px) clamp(20px, 4vw, 56px) clamp(32px, 4vw, 48px)',
        }}
      >
        {/* Top row */}
        <div
          className="grid grid-cols-1 md:grid-cols-4"
          style={{
            gap: 'clamp(32px, 4vw, 64px)',
            paddingBottom: 'clamp(32px, 4vw, 48px)',
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          {/* Brand — spans 2 cols on md */}
          <div className="md:col-span-2">
            <Link href="/" style={{ display: 'inline-block', marginBottom: 20 }}>
              <Image
                src="/logo.svg"
                alt="learnberry"
                width={28}
                height={28}
                style={{ height: 28, width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p
              style={{
                fontSize: 14,
                color: INK_3,
                lineHeight: 1.65,
                maxWidth: 300,
              }}
            >
              Financial models that put every assumption in plain view. No accounts,
              no tracking, no data leaves your browser.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: INK_4,
                marginBottom: 18,
              }}
            >
              Navigate
            </p>
            {navigate.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  fontSize: 14,
                  color: INK_3,
                  marginBottom: 12,
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: INK_4,
                marginBottom: 18,
              }}
            >
              Company
            </p>
            {company.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  fontSize: 14,
                  color: INK_3,
                  marginBottom: 12,
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between flex-wrap"
          style={{ gap: 12, paddingTop: 24 }}
        >
          <span style={{ fontSize: 12, color: INK_4 }}>© 2026 Learnberry</span>
          <span style={{ fontSize: 12, color: INK_4 }}>
            Not financial advice. No data stored.
          </span>
        </div>
      </div>
    </footer>
  );
}
