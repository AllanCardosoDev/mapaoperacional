import React from 'react';

/**
 * TokenSvg - Componente de Renderização dos Ícones e Ativos Táticos CBMAM
 * Design profissional de alta fidelidade visual (vetores precisos, cores vibrantes,
 * sem pretos opacos ou sombras pesadas, padrão Sala de Situação / CICC).
 */
export function TokenSvg({ type, count = 10, width, height, size, className = "" }) {
  // Suporte a prop size unificada ou width/height individuais
  const w = width || size;
  const h = height || size;

  switch (type) {
    // =========================================================================
    // 1. AIR TRACTOR (AT-802F FIRE BOSS - AVIÃO DE COMBATE A INCÊNDIO FLORESTAL)
    // =========================================================================
    case 'air_tractor':
      return (
        <svg 
          viewBox="0 0 160 85" 
          width={w || 92} 
          height={h || 48} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="at-fuselage" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="at-blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="at-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="at-metal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Disco translúcido da hélice em rotação dinâmica */}
          <ellipse cx="14" cy="40" rx="4" ry="24" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3"/>
          <line x1="14" y1="18" x2="14" y2="62" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="14" cy="18" r="2.5" fill="#facc15"/>
          <circle cx="14" cy="62" r="2.5" fill="#facc15"/>

          {/* Asa com diedro característico do AT-802 */}
          <path d="M 62 40 L 86 58 L 118 58 L 88 40 Z" fill="url(#at-fuselage)" stroke="#a16207" strokeWidth="1"/>
          <path d="M 108 58 L 118 58 L 115 54 L 105 54 Z" fill="url(#at-blue)"/>

          {/* Fuselagem principal estilizada */}
          <path d="M 14 40 L 26 34 L 48 33 L 78 28 L 126 28 Q 146 31 154 38 Q 154 44 142 48 L 118 49 L 76 49 L 52 46 L 26 44 Z" 
                fill="url(#at-fuselage)" stroke="#a16207" strokeWidth="1.2"/>

          {/* Faixa azul tática CBMAM (cheatline) */}
          <path d="M 28 39 L 144 39 L 138 44 L 28 44 Z" fill="url(#at-blue)"/>
          <path d="M 30 38.5 L 143 38.5" stroke="#ffffff" strokeWidth="0.8"/>

          {/* Cockpit Canopy em bolha com reflexo */}
          <path d="M 84 28 Q 94 17 110 20 Q 118 24 122 28 Z" fill="url(#at-glass)" stroke="#0369a1" strokeWidth="1"/>
          <path d="M 90 26 Q 98 20 108 22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>

          {/* Nariz da turbina / Spinner cromado */}
          <path d="M 14 40 L 24 35 L 24 45 Z" fill="url(#at-metal)" stroke="#64748b" strokeWidth="1"/>
          <circle cx="20" cy="40" r="2.5" fill="#ef4444"/>

          {/* Estabilizador Vertical (Cauda) */}
          <path d="M 130 28 L 148 12 L 158 14 L 148 29 Z" fill="url(#at-blue)" stroke="#1d4ed8" strokeWidth="1"/>
          <polygon points="144,17 152,18 148,24 140,23" fill="#facc15"/>

          {/* Estabilizador Horizontal */}
          <path d="M 136 38 L 156 38 L 152 42 L 134 42 Z" fill="url(#at-fuselage)" stroke="#ca8a04" strokeWidth="0.8"/>

          {/* Trem de Pouso com polainas aerodinâmicas (Wheel Pants) */}
          <line x1="72" y1="46" x2="68" y2="60" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="68" cy="62" rx="7" ry="5" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="68" cy="62" r="2.5" fill="#e2e8f0"/>

          {/* Bequilha de Cauda */}
          <circle cx="140" cy="49" r="2.5" fill="#334155"/>

          {/* Comporta de Lançamento de Água (Water Hopper Gate) */}
          <rect x="68" y="48" width="22" height="3" rx="1" fill="#dc2626"/>

          {/* Tipografia Tática */}
          <text x="82" y="43" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.4">
            AT-802F
          </text>
        </svg>
      );

    // =========================================================================
    // 2. HELICÓPTERO HARPIA (CIOPAER / CBMAM - ASAS ROTATIVAS)
    // =========================================================================
    case 'helicoptero':
      return (
        <svg 
          viewBox="0 0 160 85" 
          width={w || 95} 
          height={h || 50} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="hp-white" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="hp-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="hp-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="hp-skid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Disco do Rotor Principal em Rotação com Glow Ciano */}
          <ellipse cx="64" cy="18" rx="58" ry="6" fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4"/>
          <line x1="10" y1="18" x2="118" y2="18" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="10" cy="18" r="2.5" fill="#ef4444"/>
          <circle cx="118" cy="18" r="2.5" fill="#ef4444"/>

          {/* Mastro e Cabeça do Rotor */}
          <rect x="61" y="18" width="6" height="8" rx="1.5" fill="#475569" stroke="#334155" strokeWidth="0.8"/>
          <circle cx="64" cy="18" r="4" fill="#e2e8f0"/>

          {/* Corpo Fuselagem Principal (Branco de Alto Brilho) */}
          <path d="M 22 36 Q 20 28 32 26 L 82 26 Q 96 28 102 36 L 146 43 L 148 47 L 138 49 L 96 46 Q 84 56 58 56 L 32 54 Q 20 48 22 36 Z" 
                fill="url(#hp-white)" stroke="#94a3b8" strokeWidth="1.2"/>

          {/* Faixa Dinâmica CBMAM Vermelha e Dourada */}
          <path d="M 38 40 L 98 42 L 94 48 L 44 48 Z" fill="url(#hp-red)"/>
          <path d="M 40 48 L 94 48 L 92 51 L 46 51 Z" fill="#facc15"/>

          {/* Cockpit Panorâmico de Alta Visibilidade (Vidro Ciano) */}
          <path d="M 24 34 Q 30 28 44 28 L 44 43 L 26 43 Q 22 39 24 34 Z" fill="url(#hp-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <path d="M 28 32 Q 34 29 42 29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>

          {/* Janela Lateral dos Tripulantes / Resgate */}
          <rect x="50" y="31" width="16" height="10" rx="2.5" fill="url(#hp-glass)" stroke="#0284c7" strokeWidth="0.8"/>

          {/* Cauda e Estabilizador */}
          <path d="M 136 44 L 148 30 L 153 32 L 144 47 Z" fill="url(#hp-red)" stroke="#991b1b" strokeWidth="0.8"/>
          <polygon points="144,34 150,35 147,39 142,38" fill="#facc15"/>

          {/* Rotor de Cauda (Anti-torque) com pontas de perigo */}
          <ellipse cx="147" cy="38" rx="2.5" ry="11" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="0.8"/>
          <line x1="147" y1="28" x2="147" y2="48" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="147" cy="28" r="1.5" fill="#ef4444"/>
          <circle cx="147" cy="48" r="1.5" fill="#ef4444"/>

          {/* Trem de Pouso em Esquis (Alumínio Polido com Luz de Borda) */}
          <path d="M 36 54 L 32 64 L 86 64 L 82 54" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="22" y1="64" x2="94" y2="64" stroke="url(#hp-skid)" strokeWidth="3" strokeLinecap="round"/>
          {/* Curvatura dianteira do esqui */}
          <path d="M 22 64 Q 18 64 16 61" stroke="url(#hp-skid)" strokeWidth="3" fill="none" strokeLinecap="round"/>

          {/* Brasão / Identificação Tática */}
          <text x="68" y="45" fontSize="7" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.5">
            HARPIA
          </text>
          <text x="70" y="53" fontSize="4.5" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#1e293b">
            CBMAM
          </text>
        </svg>
      );

    // =========================================================================
    // 3. KC-390 MILLENNIUM (CARGUEIRO MILITAR PESADO FAB / CBMAM)
    // =========================================================================
    case 'kc390':
      return (
        <svg 
          viewBox="0 0 170 85" 
          width={w || 105} 
          height={h || 52} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="kc-fuselage" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="kc-wing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="kc-engine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="kc-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Asa Alta Enflechada (High Swept-Wing) */}
          <path d="M 68 34 L 140 16 L 156 16 L 152 24 L 98 36 Z" fill="url(#kc-wing)" stroke="#475569" strokeWidth="1"/>
          {/* Winglet azul */}
          <polygon points="152,14 157,14 155,18 150,18" fill="#0284c7"/>

          {/* Turbofan Pesado (Turbina sob a asa) */}
          <rect x="74" y="38" width="26" height="11" rx="4.5" fill="url(#kc-engine)" stroke="#334155" strokeWidth="1"/>
          {/* Cone de Entrada de Ar com Anel Cromado */}
          <ellipse cx="74" cy="43.5" rx="3.5" ry="5.5" fill="#334155"/>
          <ellipse cx="74" cy="43.5" rx="2" ry="3.5" fill="#38bdf8"/>
          <circle cx="74" cy="43.5" r="1.5" fill="#ffffff"/>

          {/* Fuselagem Principal Aerodinâmica em Prata Aeroespacial */}
          <path d="M 16 42 Q 18 32 38 32 L 126 32 L 148 20 L 160 18 L 162 25 L 148 44 L 132 50 L 42 50 Q 20 49 16 42 Z" 
                fill="url(#kc-fuselage)" stroke="#64748b" strokeWidth="1.2"/>

          {/* Faixa Tática Azul CBMAM / FAB */}
          <path d="M 28 38 L 136 38 L 134 43 L 26 43 Z" fill="#1e3a8a"/>
          <line x1="28" y1="38" x2="136" y2="38" stroke="#38bdf8" strokeWidth="0.8"/>

          {/* Cockpit de Alta Tecnologia (Janelas Angulares) */}
          <polygon points="22,38 34,35 38,38 24,40" fill="url(#kc-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <line x1="24" y1="37" x2="33" y2="36" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Empenagem em T (T-Tail) com Insígnia Nacional Brasileira */}
          <path d="M 144 20 L 160 16 L 164 16 L 152 24 Z" fill="url(#kc-wing)" stroke="#475569" strokeWidth="0.8"/>
          {/* Barbatana Verde e Amarela (Fin Flash FAB) */}
          <rect x="146" y="24" width="7" height="6" fill="#15803d"/>
          <polygon points="147,27 151,25 151,29" fill="#facc15"/>

          {/* Carenagem do Trem de Pouso Principal (Sponson) */}
          <rect x="68" y="47" width="30" height="7" rx="3.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
          {/* Rodas múltiplas com cubos prateados (não pretas puras) */}
          <circle cx="73" cy="53" r="3.2" fill="#334155" stroke="#1e293b" strokeWidth="0.8"/>
          <circle cx="73" cy="53" r="1.3" fill="#cbd5e1"/>
          <circle cx="82" cy="53" r="3.2" fill="#334155" stroke="#1e293b" strokeWidth="0.8"/>
          <circle cx="82" cy="53" r="1.3" fill="#cbd5e1"/>
          <circle cx="91" cy="53" r="3.2" fill="#334155" stroke="#1e293b" strokeWidth="0.8"/>
          <circle cx="91" cy="53" r="1.3" fill="#cbd5e1"/>

          {/* Trem Dianteiro */}
          <circle cx="34" cy="50" r="2.5" fill="#334155"/>
          <circle cx="34" cy="50" r="1" fill="#cbd5e1"/>

          {/* Identificação Tática */}
          <text x="84" y="42" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.5">
            KC-390
          </text>
        </svg>
      );

    // =========================================================================
    // 4. VIATURA ABT (AUTO BOMBA TANQUE - CAMINHÃO PESADO CBMAM)
    // =========================================================================
    case 'vtr_abt':
      return (
        <svg 
          viewBox="0 0 160 85" 
          width={w || 86} 
          height={h || 48} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="abt-red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="abt-shutter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="abt-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Canhão Monitor de Água no Teto (Cromado + Vermelho) */}
          <path d="M 44 22 L 48 22 L 52 16 L 36 16 L 38 22 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1"/>
          <line x1="36" y1="16" x2="24" y2="14" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="24" cy="14" r="2.5" fill="#facc15"/>

          {/* Mangotes e Equipamentos de Sucção no Teto */}
          <rect x="56" y="22" width="88" height="5" rx="1.5" fill="#475569" stroke="#334155" strokeWidth="0.8"/>
          <line x1="60" y1="24.5" x2="140" y2="24.5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2"/>

          {/* Giroflex / Barra de LED de Emergência no Teto da Cabine */}
          <rect x="22" y="24" width="10" height="4" rx="1.5" fill="#ef4444" stroke="#f87171" strokeWidth="0.8"/>
          <rect x="34" y="24" width="10" height="4" rx="1.5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="0.8"/>
          <rect x="31" y="24" width="4" height="4" fill="#ffffff"/>

          {/* Módulo Traseiro de Tanque e Bombas */}
          <rect x="52" y="27" width="96" height="38" rx="4" fill="url(#abt-red)" stroke="#7f1d1d" strokeWidth="1.2"/>

          {/* Cabine Frontal do Caminhão */}
          <path d="M 12 50 L 16 32 Q 18 28 26 28 L 52 28 L 52 65 L 12 65 Z" fill="url(#abt-red)" stroke="#7f1d1d" strokeWidth="1.2"/>

          {/* Para-brisa e Janela Lateral com reflexos */}
          <polygon points="18,34 32,32 32,46 16,46" fill="url(#abt-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <rect x="35" y="32" width="14" height="14" rx="1" fill="url(#abt-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <line x1="20" y1="36" x2="30" y2="34" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>

          {/* 3 Portas de Cortina de Alumínio (Persianas dos Armários de Equipamentos) */}
          <rect x="56" y="32" width="26" height="28" rx="2" fill="url(#abt-shutter)" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="56" y1="38" x2="82" y2="38" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="56" y1="44" x2="82" y2="44" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="56" y1="50" x2="82" y2="50" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="56" y1="56" x2="82" y2="56" stroke="#cbd5e1" strokeWidth="0.8"/>

          <rect x="86" y="32" width="28" height="28" rx="2" fill="url(#abt-shutter)" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="86" y1="38" x2="114" y2="38" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="86" y1="44" x2="114" y2="44" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="86" y1="50" x2="114" y2="50" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="86" y1="56" x2="114" y2="56" stroke="#cbd5e1" strokeWidth="0.8"/>

          <rect x="118" y="32" width="26" height="28" rx="2" fill="url(#abt-shutter)" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="118" y1="38" x2="144" y2="38" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="118" y1="44" x2="144" y2="44" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="118" y1="50" x2="144" y2="50" stroke="#cbd5e1" strokeWidth="0.8"/>
          <line x1="118" y1="56" x2="144" y2="56" stroke="#cbd5e1" strokeWidth="0.8"/>

          {/* Faixa Refletiva Amarelo-Limão / Branco de Segurança */}
          <rect x="12" y="47" width="136" height="3" fill="#facc15"/>
          <line x1="12" y1="47" x2="148" y2="47" stroke="#ffffff" strokeWidth="0.6"/>

          {/* Para-choque e Grade Dianteira com Faróis */}
          <rect x="8" y="52" width="6" height="12" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="11" cy="55" r="2" fill="#fef08a"/>

          {/* Rodas Pesadas: Pneus Grafite Escuro com Rodas de Liga Leve Prateadas */}
          {/* Eixo Dianteiro */}
          <circle cx="32" cy="65" r="9.5" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="32" cy="65" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="32" cy="65" r="2.5" fill="#dc2626"/>

          {/* Truque Traseiro (Eixos Duplos) */}
          <circle cx="102" cy="65" r="9.5" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="102" cy="65" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="102" cy="65" r="2.5" fill="#dc2626"/>

          <circle cx="126" cy="65" r="9.5" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="126" cy="65" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="126" cy="65" r="2.5" fill="#dc2626"/>

          {/* Tipografia Tática */}
          <text x="64" y="27" fontSize="7.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.4">
            ABT - CBMAM 193
          </text>
        </svg>
      );

    // =========================================================================
    // 5. VIATURA 4X4 FLORESTAL (PICK-UP RÁPIDA DE COMBATE A INCÊNDIO)
    // =========================================================================
    case 'vtr_florestal':
      return (
        <svg 
          viewBox="0 0 150 80" 
          width={w || 82} 
          height={h || 46} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="vf-red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="vf-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Snorkel de Travessia de Rio na Coluna A */}
          <path d="M 28 26 L 31 26 L 31 38" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="28" cy="26" r="2" fill="#475569"/>

          {/* Giroflex Tático Compacto no Teto */}
          <rect x="48" y="24" width="16" height="3.5" rx="1.5" fill="#ef4444" stroke="#f87171" strokeWidth="0.8"/>
          <rect x="56" y="24" width="8" height="3.5" rx="1" fill="#3b82f6"/>

          {/* Santantônio / Santo Antônio e Rack na Caçamba */}
          <path d="M 86 31 L 96 31 L 102 44 L 86 44 Z" fill="none" stroke="#64748b" strokeWidth="2"/>

          {/* Tanque de Água / Skid de Combate Florestal na Caçamba */}
          <rect x="94" y="34" width="30" height="10" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1"/>
          {/* Carretel de Mangueira */}
          <circle cx="118" cy="39" r="4.5" fill="#dc2626"/>
          <circle cx="118" cy="39" r="2" fill="#ffffff"/>

          {/* Carroceria Cabine Dupla 4x4 */}
          <path d="M 14 50 L 22 34 Q 26 28 36 28 L 84 28 L 88 42 L 132 42 L 132 58 L 14 58 Z" 
                fill="url(#vf-red)" stroke="#9a3412" strokeWidth="1.2"/>

          {/* Vidros Dianteiro e Traseiro */}
          <polygon points="26,34 48,32 48,44 24,44" fill="url(#vf-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <rect x="52" y="32" width="28" height="12" rx="1.5" fill="url(#vf-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <line x1="28" y1="36" x2="44" y2="34" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Faixa Tática Amarela Refletiva */}
          <path d="M 14 47 L 132 47 L 132 50 L 14 50 Z" fill="#facc15"/>

          {/* Quebra-Mato Dianteiro (Bullbar com Guincho) */}
          <path d="M 10 46 L 14 46 L 14 56 L 8 56 Z" fill="#475569" stroke="#334155" strokeWidth="0.8"/>
          <circle cx="14" cy="48" r="2.5" fill="#fef08a"/>

          {/* Rodas All-Terrain 4x4 com Rodas de Liga Leve */}
          <circle cx="36" cy="58" r="10" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="36" cy="58" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="36" cy="58" r="2" fill="#ea580c"/>

          <circle cx="110" cy="58" r="10" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="110" cy="58" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="110" cy="58" r="2" fill="#ea580c"/>

          {/* Tipografia Tática */}
          <text x="36" y="53" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.4">
            FLORESTAL 4X4
          </text>
        </svg>
      );

    // =========================================================================
    // 6. VIATURA RESGATE UR (UNIDADE DE RESGATE / AMBULÂNCIA CBMAM)
    // =========================================================================
    case 'vtr_ur':
      return (
        <svg 
          viewBox="0 0 150 80" 
          width={w || 82} 
          height={h || 46} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="ur-white" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="ur-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Giroflex Duplo no Teto */}
          <rect x="22" y="26" width="12" height="4" rx="1.5" fill="#ef4444" stroke="#f87171" strokeWidth="0.8"/>
          <rect x="36" y="26" width="12" height="4" rx="1.5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="0.8"/>

          {/* Carroceria Ambulância Tipo Furgão / Baú */}
          <path d="M 12 52 L 18 34 Q 22 30 32 30 L 134 30 L 134 60 L 12 60 Z" 
                fill="url(#ur-white)" stroke="#cbd5e1" strokeWidth="1.2"/>

          {/* Faixa Vermelha de Emergência CBMAM */}
          <rect x="12" y="44" width="122" height="8" fill="#dc2626"/>
          <rect x="12" y="42" width="122" height="2" fill="#facc15"/>

          {/* Cruz da Vida (Star of Life) Azul Real */}
          <circle cx="106" cy="38" r="9" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8"/>
          <path d="M 106 32 L 106 44 M 100 38 L 112 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="square"/>
          <path d="M 102 34 L 110 42 M 110 34 L 102 42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="square"/>

          {/* Vidros da Cabine */}
          <polygon points="22,34 46,32 46,42 18,42" fill="url(#ur-glass)" stroke="#0284c7" strokeWidth="0.8"/>
          <line x1="24" y1="36" x2="42" y2="34" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Rodas Prateadas de Ambulância */}
          <circle cx="36" cy="60" r="9" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="36" cy="60" r="5.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="36" cy="60" r="2" fill="#0284c7"/>

          <circle cx="112" cy="60" r="9" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <circle cx="112" cy="60" r="5.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <circle cx="112" cy="60" r="2" fill="#0284c7"/>

          {/* Tipografia Tática */}
          <text x="56" y="50" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.4">
            RESGATE 193
          </text>
        </svg>
      );

    // =========================================================================
    // 7. EMBARCAÇÃO FLUVIAL (LANCHA RÁPIDA DE RESGATE CBMAM)
    // =========================================================================
    case 'embarcacao':
      return (
        <svg 
          viewBox="0 0 160 80" 
          width={w || 88} 
          height={h || 46} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(0,0,0,0.28))' }}
        >
          <defs>
            <linearGradient id="bt-hull" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ef4444" />
              <stop offset="85%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="bt-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Arco de Radar e Giroflex Náutico */}
          <path d="M 88 18 L 94 32 L 84 32 Z" fill="none" stroke="#e2e8f0" strokeWidth="2"/>
          <rect x="85" y="16" width="6" height="3" rx="1" fill="#3b82f6" stroke="#60a5fa" strokeWidth="0.8"/>
          <circle cx="88" cy="14" r="2.5" fill="#e2e8f0"/>

          {/* Guarda-corpo da Proa (Handrail de Inox) */}
          <path d="M 14 36 L 44 26 L 54 28" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Cabine / Console Central com Para-brisa Náutico */}
          <path d="M 48 30 L 58 18 L 84 18 L 88 30 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
          <polygon points="56,20 80,20 82,28 52,28" fill="url(#bt-glass)" stroke="#0284c7" strokeWidth="0.8"/>

          {/* Casco em V Profundo com Faixa de Linha d'Água */}
          <path d="M 10 38 L 44 28 L 138 28 L 144 38 L 132 58 L 16 58 Z" 
                fill="url(#bt-hull)" stroke="#991b1b" strokeWidth="1.2"/>

          {/* Linha Azul Marítima CBMAM */}
          <path d="M 20 48 L 134 48 L 130 54 L 18 54 Z" fill="#1e3a8a"/>

          {/* Boia Circular de Resgate Laranja na Lateral */}
          <circle cx="68" cy="40" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5"/>
          <circle cx="68" cy="40" r="2.5" fill="#1e3a8a"/>

          {/* Motores de Popa Duplos (Outboard Motors) com Hélice */}
          <rect x="138" y="32" width="10" height="22" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1"/>
          <line x1="138" y1="40" x2="148" y2="40" stroke="#ef4444" strokeWidth="1.5"/>
          <circle cx="143" cy="52" r="3" fill="#e2e8f0"/>

          {/* Marola / Espuma de Água na Proa */}
          <path d="M 6 56 Q 14 52 24 56 Q 34 60 44 56" fill="none" stroke="rgba(56, 189, 248, 0.7)" strokeWidth="1.8" strokeLinecap="round"/>

          {/* Tipografia Tática */}
          <text x="82" y="44" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" letterSpacing="0.4">
            CBMAM FLUVIAL
          </text>
        </svg>
      );

    // =========================================================================
    // 8. CONTINGENTE: MILITAR SERVIÇO ORDINÁRIO (SV ORD CBMAM)
    // =========================================================================
    case 'efetivo':
    case 'efetivo_militar':
    case 'serv_ord':
      return (
        <svg 
          viewBox="0 0 135 75" 
          width={w || 74} 
          height={h || 44} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(220, 38, 38, 0.25))' }}
        >
          <defs>
            <linearGradient id="mil-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="gold-ax" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Moldura Externa de Alta Precisão */}
          <rect x="2" y="2" width="131" height="71" rx="8" fill="#ffffff" stroke="#ef4444" strokeWidth="2"/>

          {/* Lado Esquerdo: Brasão e Insígnia Militar dos Bombeiros */}
          <path d="M 3 3 L 52 3 L 52 72 L 3 72 Q 2 72 2 71 L 2 4 Q 2 3 3 3 Z" fill="url(#mil-badge)"/>

          {/* Machados Cruzados Dourados dos Bombeiros */}
          <line x1="15" y1="17" x2="39" y2="41" stroke="url(#gold-ax)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="39" y1="17" x2="15" y2="41" stroke="url(#gold-ax)" strokeWidth="3" strokeLinecap="round"/>

          {/* Escudo Heráldico CBMAM em Ouro com Chama Rubi */}
          <path d="M 27 15 Q 38 15 38 27 Q 38 38 27 44 Q 16 38 16 27 Q 16 15 27 15 Z" 
                fill="#991b1b" stroke="url(#gold-ax)" strokeWidth="2"/>
          {/* Chama Dourada Interna */}
          <path d="M 27 19 Q 33 25 27 33 Q 21 27 27 19 Z" fill="url(#gold-ax)"/>
          <path d="M 27 23 Q 30 27 27 32 Q 24 28 27 23 Z" fill="#ef4444"/>
          {/* Estrela de 5 Pontas */}
          <polygon points="27,34 28.5,37 32,37 29.2,39 30.5,42 27,40 23.5,42 24.8,39 22,37 25.5,37" fill="#fef08a"/>

          {/* Banner de Identificação Militar */}
          <rect x="6" y="52" width="42" height="13" rx="3" fill="#ffffff" opacity="0.95"/>
          <text x="27" y="62" fontSize="7" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#991b1b" textAnchor="middle" letterSpacing="0.4">
            CBMAM
          </text>

          {/* Lado Direito: Placa Numérica de Prontidão Tática */}
          <rect x="54" y="3" width="78" height="69" rx="6" fill="#f8fafc"/>
          {/* Número com tipografia ultra-legível e cor viva */}
          <text x="93" y="47" fontSize="35" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#dc2626" textAnchor="middle">
            {count}
          </text>
          {/* Micro-Pill Tag da Categoria */}
          <rect x="58" y="53" width="70" height="14" rx="3" fill="rgba(220, 38, 38, 0.12)" stroke="#f87171" strokeWidth="0.8"/>
          <text x="93" y="63" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#b91c1c" textAnchor="middle" letterSpacing="0.3">
            SV ORDINÁRIO
          </text>
        </svg>
      );

    // =========================================================================
    // 9. CONTINGENTE: MILITAR SEG (SERVIÇO EXTRAORDINÁRIO GRATIFICADO)
    // =========================================================================
    case 'efetivo_seg':
    case 'seg':
      return (
        <svg 
          viewBox="0 0 135 75" 
          width={w || 74} 
          height={h || 44} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(234, 179, 8, 0.35))' }}
        >
          <defs>
            <linearGradient id="seg-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="60%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="seg-gold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Moldura Externa Dourada Reforçada */}
          <rect x="2" y="2" width="131" height="71" rx="8" fill="#ffffff" stroke="#ca8a04" strokeWidth="2.2"/>

          {/* Lado Esquerdo: Brasão SEG com Estrela Dourada Radiante */}
          <path d="M 3 3 L 52 3 L 52 72 L 3 72 Q 2 72 2 71 L 2 4 Q 2 3 3 3 Z" fill="url(#seg-badge)"/>

          {/* Estrela de 8 Pontas SEG (Serviço Extraordinário Gratificado) */}
          <polygon points="27,14 30,22 38,20 33,27 38,34 30,32 27,40 24,32 16,34 21,27 16,20 24,22" fill="url(#seg-gold)" stroke="#ca8a04" strokeWidth="0.8"/>
          <circle cx="27" cy="27" r="4.5" fill="#dc2626"/>
          <circle cx="27" cy="27" r="2.2" fill="#facc15"/>

          {/* Banner SEG */}
          <rect x="6" y="52" width="42" height="13" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8"/>
          <text x="27" y="62" fontSize="7.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#78350f" textAnchor="middle" letterSpacing="0.4">
            SEG CBM
          </text>

          {/* Lado Direito: Placa Numérica */}
          <rect x="54" y="3" width="78" height="69" rx="6" fill="#fefce8"/>
          <text x="93" y="47" fontSize="35" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#991b1b" textAnchor="middle">
            {count}
          </text>
          {/* Micro-Pill Tag da Categoria */}
          <rect x="58" y="53" width="70" height="14" rx="3" fill="rgba(234, 179, 8, 0.2)" stroke="#ca8a04" strokeWidth="0.8"/>
          <text x="93" y="63" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#854d0e" textAnchor="middle" letterSpacing="0.3">
            MILITAR SEG
          </text>
        </svg>
      );

    // =========================================================================
    // 10. CONTINGENTE: BRIGADISTA (MUNICIPAL / GERAL)
    // =========================================================================
    case 'efetivo_brigadista':
    case 'brigadista':
      return (
        <svg 
          viewBox="0 0 135 75" 
          width={w || 74} 
          height={h || 44} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(234, 88, 12, 0.3))' }}
        >
          <defs>
            <linearGradient id="br-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="br-helm" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>

          {/* Moldura Externa Laranja de Alta Visibilidade */}
          <rect x="2" y="2" width="131" height="71" rx="8" fill="#ffffff" stroke="#ea580c" strokeWidth="2"/>

          {/* Lado Esquerdo: Capacete de Brigada Florestal e Chama */}
          <path d="M 3 3 L 52 3 L 52 72 L 3 72 Q 2 72 2 71 L 2 4 Q 2 3 3 3 Z" fill="url(#br-badge)"/>

          {/* Capacete de Incêndio Florestal */}
          <path d="M 17 32 Q 17 18 27 16 Q 37 18 37 32 L 40 36 L 14 36 Z" fill="url(#br-helm)" stroke="#ca8a04" strokeWidth="1"/>
          {/* Óculos de Proteção Tático com Reflexo Ciano */}
          <rect x="20" y="28" width="14" height="6" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8"/>
          {/* Protetor de Nuca Ignífugo */}
          <path d="M 18 36 L 27 46 L 36 36 Z" fill="#fdba74"/>

          {/* Banner da Brigada */}
          <rect x="6" y="52" width="42" height="13" rx="3" fill="#ffffff" opacity="0.95"/>
          <text x="27" y="62" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#c2410c" textAnchor="middle" letterSpacing="0.4">
            BRIGADA
          </text>

          {/* Lado Direito: Placa Numérica */}
          <rect x="54" y="3" width="78" height="69" rx="6" fill="#fff7ed"/>
          <text x="93" y="47" fontSize="35" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ea580c" textAnchor="middle">
            {count}
          </text>
          {/* Micro-Pill Tag da Categoria */}
          <rect x="58" y="53" width="70" height="14" rx="3" fill="rgba(234, 88, 12, 0.15)" stroke="#fdba74" strokeWidth="0.8"/>
          <text x="93" y="63" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#c2410c" textAnchor="middle" letterSpacing="0.3">
            BRIGADISTA
          </text>
        </svg>
      );

    // =========================================================================
    // 11. CONTINGENTE: BRIGADISTA SEMA (SECRETARIA DE MEIO AMBIENTE - AM)
    // =========================================================================
    case 'efetivo_brigadista_sema':
    case 'brigadista_sema':
    case 'brigadista_semais':
      return (
        <svg 
          viewBox="0 0 135 75" 
          width={w || 74} 
          height={h || 44} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(5, 150, 105, 0.3))' }}
        >
          <defs>
            <linearGradient id="sema-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="sema-gold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>

          {/* Moldura Verde Esmeralda Amazônica */}
          <rect x="2" y="2" width="131" height="71" rx="8" fill="#ffffff" stroke="#059669" strokeWidth="2"/>

          {/* Lado Esquerdo: Folha Amazônica e Chama Sustentável */}
          <path d="M 3 3 L 52 3 L 52 72 L 3 72 Q 2 72 2 71 L 2 4 Q 2 3 3 3 Z" fill="url(#sema-badge)"/>

          {/* Emblema Folha + Chama da SEMA Amazonas */}
          <circle cx="27" cy="27" r="14" fill="#ffffff" opacity="0.2"/>
          {/* Folha */}
          <path d="M 27 16 Q 37 24 27 38 Q 17 24 27 16 Z" fill="url(#sema-gold)" stroke="#ca8a04" strokeWidth="1"/>
          {/* Nervura da folha */}
          <line x1="27" y1="20" x2="27" y2="34" stroke="#047857" strokeWidth="1.2"/>
          {/* Estrela Amazônica */}
          <circle cx="27" cy="42" r="2.5" fill="#facc15"/>

          {/* Banner SEMA */}
          <rect x="6" y="52" width="42" height="13" rx="3" fill="#ffffff" opacity="0.95"/>
          <text x="27" y="62" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#047857" textAnchor="middle" letterSpacing="0.4">
            SEMA-AM
          </text>

          {/* Lado Direito: Placa Numérica */}
          <rect x="54" y="3" width="78" height="69" rx="6" fill="#ecfdf5"/>
          <text x="93" y="47" fontSize="35" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#059669" textAnchor="middle">
            {count}
          </text>
          {/* Micro-Pill Tag da Categoria */}
          <rect x="58" y="53" width="70" height="14" rx="3" fill="rgba(5, 150, 105, 0.15)" stroke="#6ee7b7" strokeWidth="0.8"/>
          <text x="93" y="63" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#065f46" textAnchor="middle" letterSpacing="0.3">
            BRIG. SEMA
          </text>
        </svg>
      );

    // =========================================================================
    // 12. CONTINGENTE: PREVFOGO / IBAMA (BRIGADA FEDERAL)
    // =========================================================================
    case 'efetivo_prevfogo':
      return (
        <svg 
          viewBox="0 0 135 75" 
          width={w || 74} 
          height={h || 44} 
          className={className}
          style={{ filter: 'drop-shadow(0 2.5px 5px rgba(21, 128, 61, 0.3))' }}
        >
          <defs>
            <linearGradient id="pf-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            <linearGradient id="pf-sun" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>

          {/* Moldura Verde Militar Federal */}
          <rect x="2" y="2" width="131" height="71" rx="8" fill="#ffffff" stroke="#15803d" strokeWidth="2"/>

          {/* Lado Esquerdo: Emblema Oficial do Prevfogo IBAMA */}
          <path d="M 3 3 L 52 3 L 52 72 L 3 72 Q 2 72 2 71 L 2 4 Q 2 3 3 3 Z" fill="url(#pf-badge)"/>

          {/* Sol Dourado e Chama Vermelha do Prevfogo */}
          <circle cx="27" cy="27" r="14" fill="url(#pf-sun)" stroke="#ca8a04" strokeWidth="1"/>
          {/* Triângulo / Pinheiro da Mata */}
          <polygon points="27,17 35,31 19,31" fill="#14532d"/>
          {/* Chama Central */}
          <path d="M 27 21 Q 31 27 27 33 Q 23 28 27 21 Z" fill="#ef4444"/>

          {/* Banner IBAMA */}
          <rect x="6" y="52" width="42" height="13" rx="3" fill="#ffffff" opacity="0.95"/>
          <text x="27" y="62" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#14532d" textAnchor="middle" letterSpacing="0.4">
            IBAMA
          </text>

          {/* Lado Direito: Placa Numérica */}
          <rect x="54" y="3" width="78" height="69" rx="6" fill="#f0fdf4"/>
          <text x="93" y="47" fontSize="35" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#15803d" textAnchor="middle">
            {count}
          </text>
          {/* Micro-Pill Tag da Categoria */}
          <rect x="58" y="53" width="70" height="14" rx="3" fill="rgba(21, 128, 61, 0.15)" stroke="#86efac" strokeWidth="0.8"/>
          <text x="93" y="63" fontSize="6.8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#14532d" textAnchor="middle" letterSpacing="0.3">
            PREVFOGO
          </text>
        </svg>
      );

    // =========================================================================
    // 13. BRASÃO DO CBI (COMANDO DE BOMBEIROS DO INTERIOR - CBMAM)
    // =========================================================================
    case 'brasao_cbi':
      return (
        <svg 
          viewBox="0 0 100 100" 
          width={w || 54} 
          height={h || 54} 
          className={className}
          style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}
        >
          <defs>
            <linearGradient id="cbi-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="cbi-red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>

          {/* Anel Externo Dourado com Borda Perolizada */}
          <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="url(#cbi-gold)" strokeWidth="3"/>
          <circle cx="50" cy="50" r="43" fill="url(#cbi-red)"/>
          <circle cx="50" cy="50" r="36" fill="#1e3a8a" stroke="url(#cbi-gold)" strokeWidth="1.5"/>

          {/* Machados Dourados Cruzados em Brasão Heráldico */}
          <line x1="28" y1="28" x2="72" y2="72" stroke="url(#cbi-gold)" strokeWidth="4" strokeLinecap="round"/>
          <line x1="72" y1="28" x2="28" y2="72" stroke="url(#cbi-gold)" strokeWidth="4" strokeLinecap="round"/>

          {/* Escudo Central CBMAM */}
          <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="url(#cbi-gold)" strokeWidth="1.5"/>
          {/* Tocha com Chama Rubra */}
          <path d="M 50 36 Q 56 43 50 52 Q 44 45 50 36 Z" fill="#ef4444"/>
          {/* Estrela do Amazonas */}
          <circle cx="50" cy="58" r="3" fill="#facc15"/>

          {/* Fita / Listel Oficial Superior e Inferior */}
          <rect x="22" y="74" width="56" height="15" rx="3" fill="url(#cbi-gold)" stroke="#a16207" strokeWidth="1"/>
          <text x="50" y="85" fontSize="8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#451a03" textAnchor="middle" letterSpacing="0.4">
            CBI CBMAM
          </text>
        </svg>
      );

    // =========================================================================
    // 14. BRASÃO DA 2ª CIBM (COMPANHIA INDEPENDENTE BOMBEIRO MILITAR)
    // =========================================================================
    case 'brasao_cibm':
      return (
        <svg 
          viewBox="0 0 100 100" 
          width={w || 52} 
          height={h || 52} 
          className={className}
          style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}
        >
          <defs>
            <linearGradient id="cibm-green" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="cibm-gold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Escudo Heráldico com Borda Dourada */}
          <path d="M 50 6 Q 88 6 88 44 Q 88 76 50 94 Q 12 76 12 44 Q 12 6 50 6 Z" 
                fill="url(#cibm-green)" stroke="url(#cibm-gold)" strokeWidth="3"/>

          {/* Círculo Interno Rubi */}
          <circle cx="50" cy="44" r="24" fill="#ffffff" stroke="url(#cibm-gold)" strokeWidth="1.5"/>
          <circle cx="50" cy="44" r="21" fill="#dc2626"/>

          {/* Machados e Tocha Cruzados */}
          <line x1="34" y1="32" x2="66" y2="56" stroke="url(#cibm-gold)" strokeWidth="2.5"/>
          <line x1="66" y1="32" x2="34" y2="56" stroke="url(#cibm-gold)" strokeWidth="2.5"/>

          {/* Estrela Dourada do Amazonas */}
          <polygon points="50,32 54,40 63,38 58,45 64,52 55,49 50,57 45,49 36,52 42,45 37,38 46,40" fill="url(#cibm-gold)"/>

          {/* Banner 2ª CIBM */}
          <rect x="22" y="72" width="56" height="15" rx="3" fill="#ffffff" stroke="url(#cibm-gold)" strokeWidth="1"/>
          <text x="50" y="83" fontSize="8" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#047857" textAnchor="middle" letterSpacing="0.4">
            2ª CIBM
          </text>
        </svg>
      );

    default:
      return null;
  }
}
