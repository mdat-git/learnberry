'use client';

import Image from 'next/image';
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
        {/* Logo mark only */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="learnberry"
            width={32}
            height={32}
            style={{ objectFit: 'contain', height: 32, width: 'auto' }}
            priority
          />
        </Link>

        {/* Right links */}
        <div className="flex items-center" style={{ gap: 32 }}>
          <Link href="/learn" style={{ fontSize: 14, color: '#1e1c18', fontWeight: 500 }}>
            Learn
          </Link>
          <Link href="/models" style={{ fontSize: 14, color: '#1e1c18', fontWeight: 500 }}>
            Models
          </Link>
        </div>
      </div>
    </nav>
  );
}
