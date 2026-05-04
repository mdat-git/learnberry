import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(0,0,0,0.10)',
        background: '#edeae3',
        marginTop: 'auto',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between flex-wrap gap-3"
        style={{
          maxWidth: 1240,
          padding: '24px clamp(20px, 4vw, 56px)',
        }}
      >
        <Link href="/" className="flex items-center" style={{ gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="#167e7f" strokeWidth="1.3" />
            <path
              d="M6.5 13.5 C7.5 10.5, 9 8, 10 7 C11 8, 12.5 10.5, 13.5 13.5"
              stroke="#167e7f"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#6b6760', letterSpacing: '-0.01em' }}>
            learnberry
          </span>
        </Link>
        <span
          style={{
            fontSize: 12,
            color: '#a09890',
            letterSpacing: '0.02em',
          }}
        >
          Not financial advice. No data stored. © 2026
        </span>
      </div>
    </footer>
  );
}
