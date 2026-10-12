import React from 'react';

export function TokenSvg({ type, count = 10, width, height, className = "" }) {
  switch (type) {
    case 'air_tractor':
      return (
        <svg viewBox="0 0 160 85" width={width || 90} height={height || 48} className={className}>
          <defs>
            <filter id={`stk-shd-${type}`} x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 12 40 L 25 36 L 40 35 L 75 22 L 125 22 L 145 28 L 155 35 L 155 46 L 140 52 L 120 54 L 85 55 L 70 65 L 50 65 L 60 55 L 30 55 L 18 50 Z" 
                fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter={`url(#stk-shd-${type})`}/>
          <path d="M 20 42 L 35 38 L 80 25 L 125 25 Q 148 29 150 40 Q 146 50 120 51 L 80 52 L 65 62 L 54 62 L 62 52 L 32 52 Q 22 49 20 42 Z" 
                fill="#facc15" stroke="#ca8a04" strokeWidth="1.2"/>
          <path d="M 70 33 L 130 33 L 115 41 L 65 41 Z" fill="#1e3a8a"/>
          <path d="M 75 35 L 125 35 L 115 39 L 70 39 Z" fill="#0284c7"/>
          <path d="M 90 25 Q 98 17 112 25 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="1"/>
          <ellipse cx="18" cy="42" rx="4" ry="7" fill="#1e293b"/>
          <line x1="18" y1="20" x2="18" y2="64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="18" cy="42" r="3" fill="#ef4444"/>
          <path d="M 85 52 L 80 68 L 74 68" stroke="#334155" strokeWidth="2" fill="none"/>
          <ellipse cx="78" cy="69" rx="5.5" ry="5.5" fill="#0f172a"/>
          <ellipse cx="138" cy="53" rx="3.5" ry="3.5" fill="#0f172a"/>
          <text x="82" y="47" fontSize="7.5" fontWeight="900" fontFamily="Arial, sans-serif" fill="#0f172a" letterSpacing="0.5">AIR TRACTOR</text>
        </svg>
      );

    case 'helicoptero':
      return (
        <svg viewBox="0 0 160 80" width={width || 95} height={height || 48} className={className}>
          <defs>
            <filter id="helo-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 10 32 L 35 25 L 85 24 L 115 28 L 150 42 L 155 48 L 140 52 L 110 50 L 80 58 L 40 58 L 20 50 L 10 40 Z" 
                fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#helo-shd)"/>
          <path d="M 18 36 Q 16 30 28 28 L 78 28 Q 95 30 100 38 L 145 44 L 148 48 L 138 50 L 95 46 Q 85 54 60 54 L 32 52 Q 18 48 18 36 Z" 
                fill="#2d372e" stroke="#1f2620" strokeWidth="1.2"/>
          <path d="M 22 34 Q 28 29 42 29 L 42 42 L 24 42 Q 20 38 22 34 Z" fill="#38bdf8" opacity="0.85"/>
          <rect x="48" y="32" width="14" height="9" rx="2" fill="#0284c7" opacity="0.8"/>
          <rect x="56" y="22" width="6" height="7" fill="#475569"/>
          <line x1="12" y1="22" x2="110" y2="22" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round"/>
          <circle cx="59" cy="22" r="3.5" fill="#e2e8f0"/>
          <ellipse cx="145" cy="44" rx="2" ry="7" fill="#0f172a"/>
          <path d="M 34 52 L 30 62 L 85 62 L 80 52" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="22" y1="62" x2="92" y2="62" stroke="#0f172a" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 68 34 L 88 34 L 84 44 L 64 44 Z" fill="#eab308"/>
          <text x="66" y="41" fontSize="5.5" fontWeight="900" fontFamily="Arial, sans-serif" fill="#000000">HARPIA</text>
        </svg>
      );

    case 'kc390':
      return (
        <svg viewBox="0 0 170 80" width={width || 105} height={height || 50} className={className}>
          <defs>
            <filter id="kc-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 12 40 L 40 32 L 85 30 L 140 22 L 160 16 L 164 26 L 150 48 L 130 52 L 85 54 L 40 55 L 20 50 Z" 
                fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" filter="url(#kc-shd)"/>
          <path d="M 18 42 Q 18 35 35 34 L 125 34 L 145 22 L 158 18 L 160 25 L 148 44 L 135 50 L 40 50 Q 22 49 18 42 Z" 
                fill="#475569" stroke="#334155" strokeWidth="1.2"/>
          <line x1="148" y1="18" x2="162" y2="18" stroke="#1e293b" strokeWidth="3"/>
          <ellipse cx="78" cy="42" rx="14" ry="6" fill="#1e293b"/>
          <ellipse cx="66" cy="42" rx="4" ry="5.5" fill="#38bdf8" opacity="0.6"/>
          <text x="85" y="47" fontSize="8" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff" letterSpacing="0.5">KC-390</text>
          <rect x="68" y="49" width="22" height="5" rx="2" fill="#0f172a"/>
          <circle cx="72" cy="54" r="3" fill="#020617"/>
          <circle cx="80" cy="54" r="3" fill="#020617"/>
          <circle cx="88" cy="54" r="3" fill="#020617"/>
        </svg>
      );

    case 'efetivo':
      return (
        <svg viewBox="0 0 130 90" width={width || 68} height={height || 48} className={className}>
          <defs>
            <filter id="ef-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <rect x="4" y="4" width="122" height="82" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#ef-shd)"/>
          <rect x="8" y="8" width="56" height="74" rx="8" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5"/>
          <path d="M 18 42 Q 18 20 36 18 Q 54 20 54 42 Q 46 44 36 44 Q 26 44 18 42 Z" fill="#ef4444"/>
          <rect x="24" y="32" width="24" height="10" rx="3" fill="#0284c7"/>
          <circle cx="36" cy="56" r="10" fill="#0f172a"/>
          <circle cx="36" cy="56" r="4.5" fill="#38bdf8"/>
          <rect x="68" y="8" width="54" height="74" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="95" y="58" fontSize="42" fontWeight="900" fontFamily="'Impact', 'Arial Black', sans-serif" fill="#0f172a" textAnchor="middle">{count}</text>
          <text x="95" y="74" fontSize="8" fontWeight="800" fontFamily="Arial, sans-serif" fill="#dc2626" textAnchor="middle">MILITARES</text>
        </svg>
      );

    case 'vtr_abt':
      return (
        <svg viewBox="0 0 150 85" width={width || 82} height={height || 48} className={className}>
          <defs>
            <filter id="abt-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 8 50 L 15 25 L 50 25 L 142 25 L 142 65 L 125 65 L 115 65 L 45 65 L 35 65 L 8 65 Z" 
                fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#abt-shd)"/>
          <rect x="52" y="28" width="86" height="35" rx="3" fill="#dc2626"/>
          <path d="M 12 52 L 18 34 L 52 34 L 52 63 L 12 63 Z" fill="#b91c1c"/>
          <polygon points="18,36 34,36 34,48 15,48" fill="#38bdf8"/>
          <rect x="56" y="32" width="22" height="28" fill="#cbd5e1"/>
          <rect x="82" y="32" width="24" height="28" fill="#cbd5e1"/>
          <rect x="110" y="32" width="24" height="28" fill="#cbd5e1"/>
          <rect x="25" y="29" width="8" height="5" rx="2" fill="#ef4444"/>
          <rect x="35" y="29" width="8" height="5" rx="2" fill="#3b82f6"/>
          <ellipse cx="32" cy="64" rx="9" ry="9" fill="#0f172a"/>
          <ellipse cx="100" cy="64" rx="9" ry="9" fill="#0f172a"/>
          <ellipse cx="124" cy="64" rx="9" ry="9" fill="#0f172a"/>
          <text x="60" y="26" fontSize="8" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff">ABT-CBMAM</text>
        </svg>
      );

    case 'vtr_florestal':
      return (
        <svg viewBox="0 0 140 80" width={width || 78} height={height || 46} className={className}>
          <defs>
            <filter id="vf-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 10 48 L 18 30 L 48 26 L 85 26 L 132 38 L 132 60 L 10 60 Z" 
                fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#vf-shd)"/>
          <path d="M 14 50 L 22 34 L 52 30 L 88 30 L 92 42 L 130 42 L 130 58 L 14 58 Z" fill="#dc2626"/>
          <polygon points="25,36 48,34 48,46 22,46" fill="#38bdf8"/>
          <rect x="52" y="34" width="22" height="12" fill="#38bdf8"/>
          <rect x="94" y="34" width="30" height="12" rx="3" fill="#e2e8f0"/>
          <rect x="36" y="26" width="16" height="4" rx="2" fill="#ef4444"/>
          <circle cx="36" cy="58" r="9.5" fill="#0f172a"/>
          <circle cx="110" cy="58" r="9.5" fill="#0f172a"/>
          <text x="32" y="52" fontSize="7" fontWeight="900" fontFamily="Arial, sans-serif" fill="#facc15">FLORESTAL 4X4</text>
        </svg>
      );

    case 'vtr_ur':
      return (
        <svg viewBox="0 0 140 80" width={width || 78} height={height || 46} className={className}>
          <defs>
            <filter id="ur-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 10 50 L 16 32 L 48 30 L 132 30 L 132 60 L 10 60 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#ur-shd)"/>
          <path d="M 14 50 L 20 34 L 50 32 L 128 32 L 128 58 L 14 58 Z" fill="#f8fafc" stroke="#cbd5e1"/>
          <rect x="14" y="44" width="114" height="8" fill="#dc2626"/>
          <rect x="88" y="35" width="4" height="14" fill="#0284c7"/>
          <rect x="83" y="40" width="14" height="4" fill="#0284c7"/>
          <polygon points="22,36 46,36 46,44 18,44" fill="#38bdf8"/>
          <circle cx="34" cy="58" r="9" fill="#0f172a"/>
          <circle cx="106" cy="58" r="9" fill="#0f172a"/>
          <text x="56" y="50" fontSize="7" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff">RESGATE UR</text>
        </svg>
      );

    case 'embarcacao':
      return (
        <svg viewBox="0 0 150 75" width={width || 84} height={height || 44} className={className}>
          <defs>
            <filter id="bt-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <path d="M 8 36 L 40 24 L 105 24 L 142 36 L 132 58 L 12 58 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#bt-shd)"/>
          <path d="M 14 38 L 45 28 L 105 28 L 138 38 L 128 54 L 20 54 Z" fill="#dc2626"/>
          <path d="M 24 46 L 132 46 L 126 54 L 20 54 Z" fill="#1e3a8a"/>
          <path d="M 50 28 L 62 16 L 90 16 L 94 28 Z" fill="#f8fafc"/>
          <rect x="8" y="32" width="8" height="18" rx="2" fill="#0f172a"/>
          <text x="60" y="42" fontSize="7" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff">CBMAM FLUVIAL</text>
        </svg>
      );

    case 'brasao_cbi':
      return (
        <svg viewBox="0 0 100 100" width={width || 52} height={height || 52} className={className}>
          <defs>
            <filter id="cbi-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#cbi-shd)"/>
          <circle cx="50" cy="50" r="44" fill="#dc2626"/>
          <circle cx="50" cy="50" r="36" fill="#ffffff"/>
          <circle cx="50" cy="50" r="31" fill="#0284c7"/>
          <path d="M 32 48 L 44 32 L 68 32 L 56 48 Z" fill="#facc15"/>
          <circle cx="50" cy="46" r="12" fill="#ef4444"/>
          <line x1="36" y1="36" x2="64" y2="64" stroke="#ffffff" strokeWidth="3"/>
          <line x1="64" y1="36" x2="36" y2="64" stroke="#ffffff" strokeWidth="3"/>
          <text x="50" y="80" fontSize="10.5" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff" textAnchor="middle">CBI CBMAM</text>
        </svg>
      );

    case 'brasao_cibm':
      return (
        <svg viewBox="0 0 100 100" width={width || 50} height={height || 50} className={className}>
          <defs>
            <filter id="cibm-shd" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" filter="url(#cibm-shd)"/>
          <path d="M 50 10 Q 85 10 85 45 Q 85 75 50 90 Q 15 75 15 45 Q 15 10 50 10 Z" fill="#047857"/>
          <circle cx="50" cy="46" r="22" fill="#ffffff"/>
          <circle cx="50" cy="46" r="18" fill="#dc2626"/>
          <polygon points="50,32 54,42 64,38 58,46 64,54 54,50 50,60 46,50 36,54 42,46 36,38 46,42" fill="#facc15"/>
          <text x="50" y="78" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif" fill="#ffffff" textAnchor="middle">2ª CIBM</text>
        </svg>
      );

    default:
      return null;
  }
}
