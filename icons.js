// SVGs Oficiais e Marcadores Táticos para o Mapa Operacional CBMAM
window.TACTICAL_ICONS = {
  // 1. Air Tractor - Avião Amarelo de Combate a Incêndio Florestal
  air_tractor: {
    id: 'air_tractor',
    name: 'Air Tractor (AT-802F)',
    category: 'aeronave',
    width: 90,
    height: 48,
    svg: `<svg viewBox="0 0 160 85" width="90" height="48" class="token-svg">
      <defs>
        <filter id="sticker-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Sticker White Border Background -->
      <path d="M 12 40 L 25 36 L 40 35 L 75 22 L 125 22 L 145 28 L 155 35 L 155 46 L 140 52 L 120 54 L 85 55 L 70 65 L 50 65 L 60 55 L 30 55 L 18 50 Z" 
            fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#sticker-shadow)"/>
      <!-- Fuselagem Amarela Principal -->
      <path d="M 20 42 L 35 38 L 80 25 L 125 25 Q 148 29 150 40 Q 146 50 120 51 L 80 52 L 65 62 L 54 62 L 62 52 L 32 52 Q 22 49 20 42 Z" 
            fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <!-- Asa Superior/Lateral e Detalhe Azul/Preto -->
      <path d="M 70 33 L 130 33 L 115 41 L 65 41 Z" fill="#1e3a8a"/>
      <path d="M 75 35 L 125 35 L 115 39 L 70 39 Z" fill="#0284c7"/>
      <!-- Janela do Cockpit (Bolha Alta) -->
      <path d="M 90 25 Q 98 17 112 25 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.2"/>
      <!-- Nariz e Hélice Dianteira -->
      <ellipse cx="18" cy="42" rx="4" ry="7" fill="#1e293b"/>
      <line x1="18" y1="20" x2="18" y2="64" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="18" cy="42" r="3" fill="#ef4444"/>
      <!-- Trem de Pouso Fixo com Rodas Pretas -->
      <path d="M 85 52 L 80 68 L 74 68" stroke="#334155" stroke-width="2.5" fill="none"/>
      <ellipse cx="78" cy="69" rx="6" ry="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
      <circle cx="78" cy="69" r="2" fill="#94a3b8"/>
      <!-- Bequilha Traseira -->
      <ellipse cx="138" cy="53" rx="3.5" ry="3.5" fill="#0f172a"/>
      <!-- Texto Tático na Fuselagem -->
      <text x="82" y="47" font-size="7.5" font-weight="900" font-family="Arial, sans-serif" fill="#0f172a" letter-spacing="0.5">AIR TRACTOR</text>
      <!-- Listra Laranja na Cauda -->
      <path d="M 132 26 L 144 27 L 138 38 L 128 38 Z" fill="#f97316"/>
    </svg>`
  },

  // 2. Helicóptero Harpia / Black Hawk (Militar CBMAM)
  helicoptero: {
    id: 'helicoptero',
    name: 'Helicóptero (Harpia CBMAM)',
    category: 'aeronave',
    width: 95,
    height: 48,
    svg: `<svg viewBox="0 0 160 80" width="95" height="48" class="token-svg">
      <defs>
        <filter id="helo-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Contorno Branco de Adesivo Tático -->
      <path d="M 10 32 L 35 25 L 85 24 L 115 28 L 150 42 L 155 48 L 140 52 L 110 50 L 80 58 L 40 58 L 20 50 L 10 40 Z" 
            fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#helo-shadow)"/>
      <!-- Fuselagem Militar Verde-Oliva Escura -->
      <path d="M 18 36 Q 16 30 28 28 L 78 28 Q 95 30 100 38 L 145 44 L 148 48 L 138 50 L 95 46 Q 85 54 60 54 L 32 52 Q 18 48 18 36 Z" 
            fill="#2d372e" stroke="#1f2620" stroke-width="1.5"/>
      <!-- Cockpit Dianteiro / Vidros Escuros Fumê -->
      <path d="M 22 34 Q 28 29 42 29 L 42 42 L 24 42 Q 20 38 22 34 Z" fill="#38bdf8" opacity="0.85"/>
      <!-- Janela Lateral de Tripulação -->
      <rect x="48" y="32" width="14" height="9" rx="2" fill="#0284c7" opacity="0.8"/>
      <!-- Mastro e Rotor Principal -->
      <rect x="56" y="22" width="6" height="7" fill="#475569"/>
      <line x1="12" y1="22" x2="110" y2="22" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="59" cy="22" r="3.5" fill="#e2e8f0"/>
      <!-- Cauda e Rotor Traseiro -->
      <polygon points="144,40 148,40 147,48" fill="#1f2620"/>
      <ellipse cx="145" cy="44" rx="2" ry="7" fill="#0f172a"/>
      <!-- Esquis / Trem de Pouso de Resgate -->
      <path d="M 34 52 L 30 62 L 85 62 L 80 52" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="22" y1="62" x2="92" y2="62" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Faixa e Inscrição HARPIA CBMAM -->
      <path d="M 68 34 L 88 34 L 84 44 L 64 44 Z" fill="#eab308"/>
      <text x="66" y="41" font-size="5.5" font-weight="900" font-family="Arial, sans-serif" fill="#000000">HARPIA</text>
    </svg>`
  },

  // 3. Avião Cargueiro KC-390 Millennium (Apoio Logístico Pesado)
  kc390: {
    id: 'kc390',
    name: 'Avião Cargueiro (KC-390)',
    category: 'aeronave',
    width: 105,
    height: 50,
    svg: `<svg viewBox="0 0 170 80" width="105" height="50" class="token-svg">
      <defs>
        <filter id="kc-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Contorno Branco de Recorte -->
      <path d="M 12 40 L 40 32 L 85 30 L 140 22 L 160 16 L 164 26 L 150 48 L 130 52 L 85 54 L 40 55 L 20 50 Z" 
            fill="#ffffff" stroke="#cbd5e1" stroke-width="3" filter="url(#kc-shadow)"/>
      <!-- Fuselagem Militar Cinza-Azulada -->
      <path d="M 18 42 Q 18 35 35 34 L 125 34 L 145 22 L 158 18 L 160 25 L 148 44 L 135 50 L 40 50 Q 22 49 18 42 Z" 
            fill="#475569" stroke="#334155" stroke-width="1.5"/>
      <!-- Cauda em T Típica do KC-390 -->
      <polygon points="144,22 162,18 158,25 142,27" fill="#334155"/>
      <line x1="148" y1="18" x2="162" y2="18" stroke="#1e293b" stroke-width="3"/>
      <!-- Asa Alta e Turbina sob a Asa -->
      <path d="M 60 34 L 115 28 L 105 37 L 65 39 Z" fill="#64748b"/>
      <!-- Turbina Jet Engine -->
      <ellipse cx="78" cy="42" rx="14" ry="6" fill="#1e293b" stroke="#0f172a" stroke-width="1.2"/>
      <ellipse cx="66" cy="42" rx="4" ry="5.5" fill="#38bdf8" opacity="0.6"/>
      <!-- Cockpit Superior -->
      <path d="M 24 37 Q 30 33 40 35 L 38 40 L 26 40 Z" fill="#38bdf8"/>
      <!-- Marcação KC-390 / FAB / CBMAM -->
      <text x="85" y="47" font-size="8" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff" letter-spacing="0.5">KC-390</text>
      <!-- Trem de Pouso de Carga -->
      <rect x="68" y="49" width="22" height="5" rx="2" fill="#0f172a"/>
      <circle cx="72" cy="54" r="3" fill="#020617"/>
      <circle cx="80" cy="54" r="3" fill="#020617"/>
      <circle cx="88" cy="54" r="3" fill="#020617"/>
    </svg>`
  },

  // 4. Token de Efetivo Militar (Capacete + Máscara Autônoma + Caixa Numérica)
  efetivo: {
    id: 'efetivo',
    name: 'Efetivo de Bombeiros',
    category: 'efetivo',
    width: 68,
    height: 48,
    // Função para gerar SVG com contagem dinâmica (ex: 14, 9, 7, 4)
    getSvg: function(count = 10) {
      return `<svg viewBox="0 0 130 90" width="68" height="48" class="token-svg">
        <defs>
          <filter id="badge-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>
        <!-- Fundo do Card Branco com Borda Dupla Tática -->
        <rect x="4" y="4" width="122" height="82" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#badge-shadow)"/>
        
        <!-- Lado Esquerdo: Ícone do Bombeiro com Capacete e Máscara (Quadrado Vermelho/Coral) -->
        <rect x="8" y="8" width="56" height="74" rx="8" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
        <!-- Capacete Vermelho CBMAM -->
        <path d="M 18 42 Q 18 20 36 18 Q 54 20 54 42 Q 46 44 36 44 Q 26 44 18 42 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
        <path d="M 28 18 Q 36 14 44 18 L 42 24 L 30 24 Z" fill="#facc15"/>
        <!-- Viseira / Óculos de Proteção Tática -->
        <rect x="24" y="32" width="24" height="10" rx="3" fill="#0284c7" stroke="#0369a1" stroke-width="1.2"/>
        <line x1="28" y1="35" x2="44" y2="35" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Máscara Autônoma Respiratória (SCBA) -->
        <circle cx="36" cy="56" r="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <circle cx="36" cy="56" r="5" fill="#38bdf8"/>
        <path d="M 27 54 L 20 62 L 20 72" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 45 54 L 52 62 L 52 72" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
        
        <!-- Lado Direito: Número em Destaque Gigante -->
        <rect x="68" y="8" width="54" height="74" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="95" y="58" font-size="44" font-weight="900" font-family="'Impact', 'Arial Black', sans-serif" fill="#0f172a" text-anchor="middle">${count}</text>
        <text x="95" y="74" font-size="8.5" font-weight="800" font-family="Arial, sans-serif" fill="#dc2626" text-anchor="middle" letter-spacing="0.5">MILITARES</text>
      </svg>`;
    }
  },

  // 5. Viatura Auto Bomba Tanque (ABT Caminhão)
  vtr_abt: {
    id: 'vtr_abt',
    name: 'Viatura ABT (Caminhão)',
    category: 'viatura',
    width: 82,
    height: 48,
    svg: `<svg viewBox="0 0 150 85" width="82" height="48" class="token-svg">
      <defs>
        <filter id="vtr-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Base Branca de Adesivo -->
      <path d="M 8 50 L 15 25 L 50 25 L 142 25 L 142 65 L 125 65 L 115 65 L 45 65 L 35 65 L 8 65 Z" 
            fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#vtr-shadow)"/>
      <!-- Cabine e Corpo Vermelho do Bombeiro -->
      <rect x="52" y="28" width="86" height="35" rx="3" fill="#dc2626" stroke="#b91c1c" stroke-width="1.5"/>
      <path d="M 12 52 L 18 34 L 52 34 L 52 63 L 12 63 Z" fill="#b91c1c"/>
      <!-- Para-brisa e Janela da Cabine -->
      <polygon points="18,36 34,36 34,48 15,48" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>
      <rect x="36" y="36" width="13" height="12" fill="#38bdf8"/>
      <!-- Compartimentos de Ferramentas em Alumínio -->
      <rect x="56" y="32" width="22" height="28" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <rect x="82" y="32" width="24" height="28" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <rect x="110" y="32" width="24" height="28" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <!-- Linhas das Persianas de Resgate -->
      <line x1="56" y1="38" x2="78" y2="38" stroke="#64748b" stroke-width="1"/>
      <line x1="56" y1="44" x2="78" y2="44" stroke="#64748b" stroke-width="1"/>
      <line x1="56" y1="50" x2="78" y2="50" stroke="#64748b" stroke-width="1"/>
      <line x1="82" y1="38" x2="106" y2="38" stroke="#64748b" stroke-width="1"/>
      <line x1="82" y1="44" x2="106" y2="44" stroke="#64748b" stroke-width="1"/>
      <line x1="82" y1="50" x2="106" y2="50" stroke="#64748b" stroke-width="1"/>
      <!-- Canhão Monitor Superior -->
      <rect x="90" y="22" width="14" height="6" fill="#475569"/>
      <circle cx="97" cy="22" r="3.5" fill="#e2e8f0"/>
      <!-- Giroflex Emergência Vermelho/Azul -->
      <rect x="25" y="29" width="8" height="5" rx="2" fill="#ef4444"/>
      <rect x="35" y="29" width="8" height="5" rx="2" fill="#3b82f6"/>
      <!-- Rodas Pesadas -->
      <ellipse cx="32" cy="64" rx="10" ry="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <circle cx="32" cy="64" r="4" fill="#cbd5e1"/>
      <ellipse cx="100" cy="64" rx="10" ry="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <circle cx="100" cy="64" r="4" fill="#cbd5e1"/>
      <ellipse cx="124" cy="64" rx="10" ry="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <circle cx="124" cy="64" r="4" fill="#cbd5e1"/>
      <!-- Marcação ABT -->
      <text x="60" y="26" font-size="8.5" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff">ABT-CBMAM</text>
    </svg>`
  },

  // 6. Viatura Florestal 4x4 (Pick-up de Combate Rápido)
  vtr_florestal: {
    id: 'vtr_florestal',
    name: 'Viatura 4x4 Florestal',
    category: 'viatura',
    width: 78,
    height: 46,
    svg: `<svg viewBox="0 0 140 80" width="78" height="46" class="token-svg">
      <defs>
        <filter id="vtr4x4-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Base Adesivo Branco -->
      <path d="M 10 48 L 18 30 L 48 26 L 85 26 L 132 38 L 132 60 L 10 60 Z" 
            fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#vtr4x4-shadow)"/>
      <!-- Carroceria Vermelha e Caçamba de Ataque -->
      <path d="M 14 50 L 22 34 L 52 30 L 88 30 L 92 42 L 130 42 L 130 58 L 14 58 Z" fill="#dc2626"/>
      <!-- Cabine Dupla / Vidros -->
      <polygon points="25,36 48,34 48,46 22,46" fill="#38bdf8"/>
      <rect x="52" y="34" width="22" height="12" fill="#38bdf8"/>
      <!-- Tanque de Água e Carretel na Caçamba -->
      <rect x="94" y="34" width="30" height="12" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <ellipse cx="118" cy="38" rx="5" ry="5" fill="#f59e0b"/>
      <!-- Giroflex no Teto -->
      <rect x="36" y="26" width="16" height="4" rx="2" fill="#ef4444"/>
      <!-- Rodas Off-road Altas -->
      <circle cx="36" cy="58" r="10" fill="#0f172a" stroke="#334155" stroke-width="3"/>
      <circle cx="36" cy="58" r="4" fill="#cbd5e1"/>
      <circle cx="110" cy="58" r="10" fill="#0f172a" stroke="#334155" stroke-width="3"/>
      <circle cx="110" cy="58" r="4" fill="#cbd5e1"/>
      <!-- Inscrição Florestal -->
      <text x="32" y="52" font-size="7.5" font-weight="900" font-family="Arial, sans-serif" fill="#facc15">FLORESTAL 4X4</text>
    </svg>`
  },

  // 7. Unidade de Resgate (UR Ambulância)
  vtr_ur: {
    id: 'vtr_ur',
    name: 'Unidade de Resgate (UR)',
    category: 'viatura',
    width: 78,
    height: 46,
    svg: `<svg viewBox="0 0 140 80" width="78" height="46" class="token-svg">
      <defs>
        <filter id="ur-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M 10 50 L 16 32 L 48 30 L 132 30 L 132 60 L 10 60 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#ur-shadow)"/>
      <path d="M 14 50 L 20 34 L 50 32 L 128 32 L 128 58 L 14 58 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="14" y="44" width="114" height="8" fill="#dc2626"/>
      <!-- Cruz da Vida / Resgate -->
      <rect x="88" y="35" width="4" height="14" fill="#0284c7"/>
      <rect x="83" y="40" width="14" height="4" fill="#0284c7"/>
      <!-- Cabine / Vidros -->
      <polygon points="22,36 46,36 46,44 18,44" fill="#38bdf8"/>
      <!-- Giroflex -->
      <rect x="30" y="27" width="12" height="5" rx="2" fill="#ef4444"/>
      <!-- Rodas -->
      <circle cx="34" cy="58" r="9" fill="#0f172a"/>
      <circle cx="34" cy="58" r="3.5" fill="#cbd5e1"/>
      <circle cx="106" cy="58" r="9" fill="#0f172a"/>
      <circle cx="106" cy="58" r="3.5" fill="#cbd5e1"/>
      <text x="56" y="50" font-size="7" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff">RESGATE UR</text>
    </svg>`
  },

  // 8. Embarcação Fluvial / Lancha Rápida (VRF)
  embarcacao: {
    id: 'embarcacao',
    name: 'Lancha Rápida Fluvial',
    category: 'fluvial',
    width: 84,
    height: 44,
    svg: `<svg viewBox="0 0 150 75" width="84" height="44" class="token-svg">
      <defs>
        <filter id="boat-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Base Adesivo Branco -->
      <path d="M 8 36 L 40 24 L 105 24 L 142 36 L 132 58 L 12 58 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#boat-shadow)"/>
      <!-- Casco Hidrodinâmico Azul e Vermelho -->
      <path d="M 14 38 L 45 28 L 105 28 L 138 38 L 128 54 L 20 54 Z" fill="#dc2626"/>
      <path d="M 24 46 L 132 46 L 126 54 L 20 54 Z" fill="#1e3a8a"/>
      <!-- Cabine de Comando -->
      <path d="M 50 28 L 62 16 L 90 16 L 94 28 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
      <polygon points="62,18 72,18 72,26 56,26" fill="#38bdf8"/>
      <polygon points="76,18 88,18 88,26 76,26" fill="#38bdf8"/>
      <!-- Giroflex Náutico -->
      <circle cx="76" cy="14" r="3" fill="#3b82f6"/>
      <!-- Motores de Popa Duplos -->
      <rect x="8" y="32" width="8" height="18" rx="2" fill="#0f172a"/>
      <text x="60" y="42" font-size="7.5" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff">CBMAM FLUVIAL</text>
    </svg>`
  },

  // 9. Brasão Oficial do CBI (Comando de Bombeiros do Interior)
  brasao_cbi: {
    id: 'brasao_cbi',
    name: 'Brasão CBI CBMAM',
    category: 'brasao',
    width: 52,
    height: 52,
    svg: `<svg viewBox="0 0 100 100" width="52" height="52" class="token-svg">
      <defs>
        <filter id="cbi-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <!-- Base Adesivo Branco -->
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#cbi-shadow)"/>
      <!-- Círculo Externo Vermelho -->
      <circle cx="50" cy="50" r="44" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <!-- Anel Branco com Texto Tático -->
      <circle cx="50" cy="50" r="36" fill="#ffffff"/>
      <circle cx="50" cy="50" r="31" fill="#0284c7"/>
      <!-- Sol / Chamas e Mapa do Interior -->
      <path d="M 32 48 L 44 32 L 68 32 L 56 48 Z" fill="#facc15"/>
      <circle cx="50" cy="46" r="12" fill="#ef4444"/>
      <!-- Machado e Facho -->
      <line x1="36" y1="36" x2="64" y2="64" stroke="#ffffff" stroke-width="3"/>
      <line x1="64" y1="36" x2="36" y2="64" stroke="#ffffff" stroke-width="3"/>
      <!-- Texto Tático CBI -->
      <text x="50" y="80" font-size="11" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">CBI CBMAM</text>
    </svg>`
  },

  // 10. Brasão Pelotão Destacado / Companhia Independente (2ª CIBM)
  brasao_cibm: {
    id: 'brasao_cibm',
    name: 'Brasão 2ª CIBM',
    category: 'brasao',
    width: 50,
    height: 50,
    svg: `<svg viewBox="0 0 100 100" width="50" height="50" class="token-svg">
      <defs>
        <filter id="cibm-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#cibm-shadow)"/>
      <path d="M 50 10 Q 85 10 85 45 Q 85 75 50 90 Q 15 75 15 45 Q 15 10 50 10 Z" fill="#047857" stroke="#065f46" stroke-width="2"/>
      <circle cx="50" cy="46" r="22" fill="#ffffff"/>
      <circle cx="50" cy="46" r="18" fill="#dc2626"/>
      <!-- Cruz de Malta do Bombeiro -->
      <polygon points="50,32 54,42 64,38 58,46 64,54 54,50 50,60 46,50 36,54 42,46 36,38 46,42" fill="#facc15"/>
      <text x="50" y="78" font-size="9.5" font-weight="900" font-family="Arial, sans-serif" fill="#ffffff" text-anchor="middle">2ª CIBM</text>
    </svg>`
  }
};
