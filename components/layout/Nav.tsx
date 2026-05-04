'use client';

import Link from 'next/link';

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-[100]"
      style={{
        background: 'rgba(237, 234, 227, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: 1240,
          height: 64,
          paddingLeft: 'clamp(20px, 4vw, 56px)',
          paddingRight: 'clamp(20px, 4vw, 56px)',
        }}
      >
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-[8px]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="#167e7f" strokeWidth="1.4" />
            <path
              d="M6.5 13.5 C7.5 10.5, 9 8, 10 7 C11 8, 12.5 10.5, 13.5 13.5"
              stroke="#167e7f"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1e1c18',
              letterSpacing: '-0.015em',
            }}
          >
            learnberry
          </span>
        </Link>

        {/* Right links */}
        <div className="flex items-center" style={{ gap: 32 }}>
          <Link
            href="/#models"
            style={{ fontSize: 14, color: '#1e1c18', fontWeight: 500 }}
          >
            Models
          </Link>
          <Link
            href="/about"
            style={{ fontSize: 14, color: '#1e1c18', fontWeight: 500 }}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
