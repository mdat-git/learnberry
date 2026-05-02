'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-[100] h-[52px]"
      style={{
        background: 'rgba(250,250,248,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0efed',
      }}
    >
      <div
        className="h-full mx-auto grid items-center"
        style={{
          maxWidth: 920,
          paddingLeft: 'clamp(24px, 5vw, 64px)',
          paddingRight: 'clamp(24px, 5vw, 64px)',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 16,
        }}
      >
        {/* Left: logo + pill */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          </Link>
          <div
            className="flex items-center"
            style={{ border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 5px' }}
          >
            <Link
              href="/#models"
              className="text-[13px] px-[9px] py-[3px] rounded-full whitespace-nowrap"
              style={{ color: pathname === '/' ? '#171717' : '#737373' }}
            >
              Models
            </Link>
            <Link
              href="/about"
              className="text-[13px] px-[9px] py-[3px] rounded-full whitespace-nowrap"
              style={{ color: pathname === '/about' ? '#171717' : '#737373' }}
            >
              About
            </Link>
          </div>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="text-[13px] font-medium whitespace-nowrap"
          style={{ color: '#737373', letterSpacing: '-0.01em' }}
        >
          learnberry
        </Link>

        {/* Right: empty — keeps wordmark centered */}
        <div />
      </div>
    </nav>
  );
}
