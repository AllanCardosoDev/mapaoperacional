import React from 'react';

// =============================================================================
// CATÁLOGO DE ÍCONES E INSÍGNIAS OPERACIONAIS OFICIAIS DO CBMAM & FORÇAS
// =============================================================================

export const AVAILABLE_ICONS = [
  { id: 'cbmam_shield', label: 'CBMAM Oficial', desc: 'Bombeiros Militares AM', category: 'militar', color: '#dc2626' },
  { id: 'cbmsp_shield', label: 'CBMSP São Paulo', desc: 'Apoio Força Interestadual SP', category: 'militar', color: '#8b5cf6' },
  { id: 'fn_badge', label: 'Força Nacional (FN)', desc: 'Força Nacional de Segurança', category: 'militar', color: '#06b6d4' },
  { id: 'prevfogo_badge', label: 'Prevfogo / IBAMA', desc: 'Brigadas Federais de Incêndio', category: 'federal', color: '#10b981' },
  { id: 'icmbio_badge', label: 'ICMBio Conservação', desc: 'Instituto Chico Mendes', category: 'federal', color: '#14b8a6' },
  { id: 'brigadista_sema', label: 'Brigadista SEMA', desc: 'Governo do Estado do Amazonas', category: 'estadual', color: '#16a34a' },
  { id: 'brigadista_mun', label: 'Brigadista Municipal', desc: 'Defesa Civil Municipal', category: 'municipal', color: '#ea580c' },
  { id: 'fire_red', label: 'Combate a Incêndio 1', desc: 'Linha de Fogo / Ataque Direto', category: 'operacao', color: '#ef4444' },
  { id: 'fire_orange', label: 'Combate a Incêndio 2', desc: 'Turma de Queima Controlada', category: 'operacao', color: '#f97316' },
  { id: 'fire_yellow', label: 'Combate a Incêndio 3', desc: 'Turma de Rescaldo e Aceiro', category: 'operacao', color: '#eab308' },
  { id: 'flame_amber', label: 'Operação Verão (OPAMV)', desc: 'Reforço Estiagem / Verão', category: 'operacao', color: '#f59e0b' },
  { id: 'shield_blue', label: 'Operação Reforço (OPAM REF)', desc: 'Efetivo Deslocado do Interior', category: 'operacao', color: '#0284c7' },
  { id: 'base_camp', label: 'Base Temporária', desc: 'Posto de Comando Avançado (PCA)', category: 'base', color: '#38bdf8' },
  { id: 'air_tractor', label: 'Air Tractor AT-802', desc: 'Aeronave de Combate Aéreo', category: 'aereo', color: '#eab308' },
  { id: 'helicopter', label: 'Helicóptero Harpia', desc: 'Asas Rotativas / Resgate', category: 'aereo', color: '#ef4444' },
  { id: 'fire_truck', label: 'Auto Bomba Tanque (ABT)', desc: 'Viatura Pesada de Combate', category: 'terrestre', color: '#dc2626' },
  { id: 'boat', label: 'Embarcação Fluvial', desc: 'Lancha Rápida de Resgate', category: 'fluvial', color: '#0284c7' },
  { id: 'drone', label: 'Drone de Monitoramento', desc: 'Reconhecimento Aéreo Termal', category: 'tecnologia', color: '#a855f7' },
];

export function EfetivoIcon({ name, size = 20, className = '', style = {} }) {
  const iconId = name || 'cbmam_shield';

  // 1. Escudo Oficial CBMAM (Machadinhas, Tocha e Escudo Rubro)
  if (iconId === 'cbmam_shield') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <defs>
          <linearGradient id="cbmam_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="url(#cbmam_grad)" stroke="#facc15" strokeWidth="2" />
        {/* Machadinhas cruzadas */}
        <line x1="12" y1="12" x2="28" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="12" x2="12" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {/* Tocha central */}
        <circle cx="20" cy="18" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <path d="M 20 10 Q 22 14 20 17 Q 18 14 20 10 Z" fill="#ef4444" />
      </svg>
    );
  }

  // 2. Escudo CBMSP (São Paulo - Listras pretas e brancas com escudo rubro)
  if (iconId === 'cbmsp_shield') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <defs>
          <linearGradient id="sp_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="url(#sp_grad)" stroke="#ffffff" strokeWidth="2" />
        {/* Faixas SP */}
        <line x1="10" y1="16" x2="30" y2="16" stroke="#ffffff" strokeWidth="2" />
        <line x1="10" y1="22" x2="30" y2="22" stroke="#dc2626" strokeWidth="2" />
        <text x="20" y="30" fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SP</text>
      </svg>
    );
  }

  // 3. Força Nacional (FN - Escudo Verde e Amarelo com Brasão)
  if (iconId === 'fn_badge') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="#065f46" stroke="#facc15" strokeWidth="2" />
        <polygon points="20,10 28,18 20,26 12,18" fill="#facc15" />
        <circle cx="20" cy="18" r="4.5" fill="#1e40af" />
        <text x="20" y="32" fill="#facc15" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">FN</text>
      </svg>
    );
  }

  // 4. Prevfogo / IBAMA (Escudo Esmeralda com Folha e Chama)
  if (iconId === 'prevfogo_badge') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="#047857" stroke="#34d399" strokeWidth="2" />
        {/* Folha */}
        <path d="M 14 26 Q 16 14 26 14 Q 26 24 14 26 Z" fill="#10b981" />
        {/* Chama interior */}
        <path d="M 22 24 Q 25 18 22 15 Q 20 19 22 24 Z" fill="#f59e0b" />
        <text x="20" y="32" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">IBAMA</text>
      </svg>
    );
  }

  // 5. ICMBio (Brasão Verde-Azulado com Árvore / Fauna)
  if (iconId === 'icmbio_badge') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" />
        <circle cx="20" cy="17" r="7" fill="#14b8a6" />
        <path d="M 20 12 L 20 22 M 16 17 L 24 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <text x="20" y="32" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">ICMBIO</text>
      </svg>
    );
  }

  // 6. Brigadista SEMA (Estadual - Verde Amazônico)
  if (iconId === 'brigadista_sema') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#15803d" stroke="#86efac" strokeWidth="2" />
        {/* Folha estilizada */}
        <path d="M 12 26 C 14 12 28 12 28 26 C 24 28 16 28 12 26 Z" fill="#4ade80" />
        <line x1="20" y1="15" x2="20" y2="26" stroke="#15803d" strokeWidth="1.5" />
        <text x="20" y="33" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SEMA</text>
      </svg>
    );
  }

  // 7. Brigadista Municipal (Laranja Defesa Civil)
  if (iconId === 'brigadista_mun') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#c2410c" stroke="#fed7aa" strokeWidth="2" />
        {/* Capacete de proteção */}
        <path d="M 11 22 C 11 14 29 14 29 22 Z" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="9" y="22" width="22" height="3" rx="1.5" fill="#f97316" />
        <text x="20" y="32" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">BRIG</text>
      </svg>
    );
  }

  // 8. Combate a Incêndio Vermelho (Turma 1)
  if (iconId === 'fire_red') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
        <path d="M 20 8 Q 25 15 22 22 Q 28 20 27 26 Q 26 31 20 31 Q 14 31 13 25 Q 12 18 20 8 Z" fill="#ef4444" />
        <path d="M 20 18 Q 23 22 21 26 Q 23 25 22 28 Q 21 30 20 30 Q 18 30 18 28 Q 18 24 20 18 Z" fill="#facc15" />
        <text x="20" y="34" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">INC 1</text>
      </svg>
    );
  }

  // 9. Combate a Incêndio Laranja (Turma 2)
  if (iconId === 'fire_orange') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#c2410c" stroke="#fdba74" strokeWidth="2" />
        <path d="M 20 8 Q 25 15 22 22 Q 28 20 27 26 Q 26 31 20 31 Q 14 31 13 25 Q 12 18 20 8 Z" fill="#f97316" />
        <path d="M 20 18 Q 23 22 21 26 Q 23 25 22 28 Q 21 30 20 30 Q 18 30 18 28 Q 18 24 20 18 Z" fill="#facc15" />
        <text x="20" y="34" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">INC 2</text>
      </svg>
    );
  }

  // 10. Combate a Incêndio Amarelo (Turma 3)
  if (iconId === 'fire_yellow') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#854d0e" stroke="#fef08a" strokeWidth="2" />
        <path d="M 20 8 Q 25 15 22 22 Q 28 20 27 26 Q 26 31 20 31 Q 14 31 13 25 Q 12 18 20 8 Z" fill="#eab308" />
        <path d="M 20 18 Q 23 22 21 26 Q 23 25 22 28 Q 21 30 20 30 Q 18 30 18 28 Q 18 24 20 18 Z" fill="#ffffff" />
        <text x="20" y="34" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">INC 3</text>
      </svg>
    );
  }

  // 11. Operação Verão (OPAMV - Chama Dourada)
  if (iconId === 'flame_amber') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <rect x="5" y="5" width="30" height="30" rx="8" fill="#b45309" stroke="#fde68a" strokeWidth="2" />
        <path d="M 20 10 Q 26 17 23 24 Q 28 22 27 27 Q 25 31 20 31 Q 15 31 14 26 Q 13 20 20 10 Z" fill="#f59e0b" />
        <circle cx="20" cy="24" r="3" fill="#ffffff" />
      </svg>
    );
  }

  // 12. Operação Reforço (OPAM REF - Escudo Azul)
  if (iconId === 'shield_blue') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <path d="M 20 2 L 34 8 L 34 22 Q 34 33 20 38 Q 6 33 6 22 L 6 8 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <polyline points="14,20 18,24 26,14" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 13. Base Temporária (Posto Avançado / Tenda / Radar)
  if (iconId === 'base_camp') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <rect x="5" y="5" width="30" height="30" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        {/* Tenda militar */}
        <polygon points="20,10 32,28 8,28" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="20,10 20,28 14,28" fill="#0369a1" />
        <circle cx="20" cy="7" r="2" fill="#ef4444" />
      </svg>
    );
  }

  // 14. Air Tractor (Avião de combate a incêndio)
  if (iconId === 'air_tractor') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#854d0e" stroke="#fde047" strokeWidth="2" />
        <path d="M 8 20 L 32 20 L 26 15 L 14 15 Z" fill="#facc15" />
        <path d="M 18 10 L 22 10 L 21 28 L 19 28 Z" fill="#ffffff" />
        <polygon points="12,25 28,25 20,28" fill="#ca8a04" />
      </svg>
    );
  }

  // 15. Helicóptero Harpia
  if (iconId === 'helicopter') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
        <ellipse cx="20" cy="20" rx="9" ry="6" fill="#ffffff" />
        <line x1="8" y1="12" x2="32" y2="12" stroke="#facc15" strokeWidth="2" />
        <line x1="20" y1="12" x2="20" y2="16" stroke="#facc15" strokeWidth="2" />
        <rect x="12" y="26" width="16" height="2" rx="1" fill="#cbd5e1" />
      </svg>
    );
  }

  // 16. Auto Bomba Tanque (ABT - Caminhão)
  if (iconId === 'fire_truck') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <rect x="5" y="8" width="30" height="24" rx="4" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
        <rect x="22" y="12" width="10" height="8" rx="1" fill="#38bdf8" />
        <circle cx="12" cy="28" r="3.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
        <circle cx="28" cy="28" r="3.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
        <rect x="10" y="6" width="6" height="3" fill="#facc15" />
      </svg>
    );
  }

  // 17. Embarcação Fluvial
  if (iconId === 'boat') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <path d="M 8 22 Q 20 28 32 22 L 28 27 Q 20 31 12 27 Z" fill="#ffffff" />
        <rect x="15" y="14" width="10" height="8" rx="2" fill="#38bdf8" />
      </svg>
    );
  }

  // 18. Drone
  if (iconId === 'drone') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
        <circle cx="20" cy="20" r="17" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
        <circle cx="20" cy="20" r="4" fill="#a855f7" />
        <line x1="12" y1="12" x2="28" y2="28" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="28" y1="12" x2="12" y2="28" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
        <circle cx="28" cy="12" r="2.5" fill="#38bdf8" />
        <circle cx="12" cy="28" r="2.5" fill="#38bdf8" />
        <circle cx="28" cy="28" r="2.5" fill="#38bdf8" />
      </svg>
    );
  }

  // Padrão fallback
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ verticalAlign: 'middle', ...style }}>
      <circle cx="20" cy="20" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
      <text x="20" y="24" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">★</text>
    </svg>
  );
}
