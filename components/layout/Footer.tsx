export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #f0efed', padding: '20px clamp(24px, 5vw, 64px)' }}>
      <div
        className="mx-auto flex items-center justify-between gap-3"
        style={{ maxWidth: 920 }}
      >
        <div className="flex items-center gap-[7px]">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
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
          <span className="text-[13px] font-medium" style={{ color: '#737373' }}>learnberry</span>
        </div>
        <span className="text-[11.5px]" style={{ color: '#a3a3a3' }}>Not financial advice. © 2025</span>
      </div>
    </footer>
  );
}
