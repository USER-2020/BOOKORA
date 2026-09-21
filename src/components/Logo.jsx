import React from 'react';

export default function Logo({ compact = false, dark = false }) {
  return (
    <div className={`logo ${compact ? 'logo-compact' : ''} ${dark ? 'logo-dark' : ''}`} aria-label="Noryvaq">
      <span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 50 40" focusable="false"><defs><linearGradient id="noryvaq-logo-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7d4df4" /><stop offset=".58" stopColor="#665dff" /><stop offset="1" stopColor="#1ed1ed" /></linearGradient></defs><path d="M6 29C9 18 14 9 21 9c7 0 7 15 13 17 5 2 9-8 11-15" stroke="url(#noryvaq-logo-gradient)" strokeWidth="8" strokeLinecap="round" fill="none" /></svg></span>
      {!compact && <span className="logo-word">Noryvaq</span>}
    </div>
  );
}
