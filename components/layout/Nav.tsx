import Link from 'next/link';

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 52,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 3vw, 40px)',
      }}
    >
      {/* Left: logo + pill links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="#167e7f" strokeWidth="1.5" />
            <path
              d="M6.5 13.5 C7.5 10.5, 9 8, 10 7 C11 8, 12.5 10.5, 13.5 13.5"
              stroke="#167e7f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Link>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e5e5e5',
            borderRadius: 999,
            padding: '4px 6px',
            gap: 2,
          }}
        >
          <Link
            href="/"
            style={{ fontSize: 13, color: '#3f3f3f', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}
          >
            Tools
          </Link>
          <Link
            href="/about"
            style={{ fontSize: 13, color: '#3f3f3f', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}
          >
            About
          </Link>
        </div>
      </div>

      {/* Center: search pill — absolutely centered, hidden on mobile */}
      <div
        className="hidden md:flex items-center gap-2"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          border: '1px solid #e5e5e5',
          borderRadius: 999,
          padding: '6px 16px',
          pointerEvents: 'none',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="3.5" stroke="#a3a3a3" strokeWidth="1.2" />
          <line x1="7.5" y1="7.5" x2="10" y2="10" stroke="#a3a3a3" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12.5, color: '#a3a3a3', whiteSpace: 'nowrap' }}>Math-first personal finance</span>
      </div>

      {/* Right: CTA */}
      <div style={{ flexShrink: 0 }}>
        <Link
          href="/tools/home"
          style={{
            background: '#171717',
            color: 'white',
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 16px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }}
        >
          Run simulation
        </Link>
      </div>
    </nav>
  );
}
