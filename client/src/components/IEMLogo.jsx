import React from 'react';

export default function IEMLogo({ size = 'md', className = '' }) {
  const heightMap = {
    xs: 26,
    sm: 34,
    md: 42,
    lg: 54
  };

  const h = heightMap[size] || size;

  return (
    <div
      className={`inline-flex items-center justify-center rounded overflow-hidden shadow-sm transition-transform hover:scale-105 ${className}`}
      style={{
        height: typeof h === 'number' ? `${h}px` : h,
        padding: '2px 6px',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      <img
        src="/iem-logo.png"
        alt="IEM Emblem - श्रद्धावान् लभते ज्ञानम्"
        onError={(e) => { e.currentTarget.src = '/iem-logo.svg'; }}
        style={{
          height: '100%',
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}

