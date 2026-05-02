export default function Footer() {
  return (
    <footer
      className="w-full bg-white"
      style={{ borderTop: '1px solid #f0f0f0', padding: '24px 0' }}
    >
      <div className="max-w-[800px] mx-auto px-6 flex items-center justify-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
          <span style={{ fontSize: 12.5, fontWeight: 500, color: '#737373' }}>learnberry</span>
        </div>
        <span style={{ fontSize: 11.5, color: '#a3a3a3' }}>Not financial advice. © 2026</span>
      </div>
    </footer>
  );
}
