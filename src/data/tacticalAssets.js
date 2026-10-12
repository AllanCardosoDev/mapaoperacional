// Definições de Ativos Táticos, SVGs e Cenário Base Oficial CBMAM
export const TACTICAL_TOKENS = [
  {
    id: 'air_tractor',
    name: 'Air Tractor (AT-802F)',
    category: 'aeronave',
    type: 'air_tractor',
    label: 'Air Tractor',
    width: 90,
    height: 48,
    desc: 'Avião de combate a fogo florestal',
    color: '#facc15'
  },
  {
    id: 'helicoptero',
    name: 'Helicóptero Harpia',
    category: 'aeronave',
    type: 'helicoptero',
    label: 'Harpia',
    width: 95,
    height: 48,
    desc: 'Asa rotativa busca e resgate',
    color: '#475569'
  },
  {
    id: 'kc390',
    name: 'KC-390 Millennium',
    category: 'aeronave',
    type: 'kc390',
    label: 'KC-390',
    width: 105,
    height: 50,
    desc: 'Cargueiro militar pesado FAB/CBM',
    color: '#64748b'
  },
  {
    id: 'vtr_abt',
    name: 'Viatura ABT',
    category: 'viatura',
    type: 'vtr_abt',
    label: 'ABT Caminhão',
    width: 82,
    height: 48,
    desc: 'Auto Bomba Tanque pesado',
    color: '#dc2626'
  },
  {
    id: 'vtr_florestal',
    name: 'Viatura 4x4 Florestal',
    category: 'viatura',
    type: 'vtr_florestal',
    label: 'Pick-up Florestal',
    width: 78,
    height: 46,
    desc: 'Combate rápido em vegetação',
    color: '#ea580c'
  },
  {
    id: 'vtr_ur',
    name: 'Unidade de Resgate (UR)',
    category: 'viatura',
    type: 'vtr_ur',
    label: 'Resgate UR',
    width: 78,
    height: 46,
    desc: 'Atendimento pré-hospitalar',
    color: '#0284c7'
  },
  {
    id: 'embarcacao',
    name: 'Lancha Rápida Fluvial',
    category: 'fluvial',
    type: 'embarcacao',
    label: 'Lancha Fluvial',
    width: 84,
    height: 44,
    desc: 'Patrulha e socorro nos rios',
    color: '#0369a1'
  },
  {
    id: 'efetivo',
    name: 'Efetivo de Bombeiros',
    category: 'efetivo',
    type: 'efetivo',
    label: 'Efetivo Militar',
    width: 68,
    height: 48,
    count: 10,
    desc: 'Guarnição militar com SCBA',
    color: '#dc2626'
  },
  {
    id: 'brasao_cbi',
    name: 'Brasão CBI CBMAM',
    category: 'brasao',
    type: 'brasao_cbi',
    label: 'CBI CBMAM',
    width: 52,
    height: 52,
    desc: 'Comando de Bombeiros do Interior',
    color: '#b91c1c'
  },
  {
    id: 'brasao_cibm',
    name: 'Brasão 2ª CIBM',
    category: 'brasao',
    type: 'brasao_cibm',
    label: '2ª CIBM',
    width: 50,
    height: 50,
    desc: 'Companhia Independente Bombeiro',
    color: '#047857'
  }
];

// Cenário inicial idêntico ao quadro físico operacional da foto do CBMAM
export const INITIAL_REAL_SCENARIO = [
  // --- MANAUS ---
  { id: 'tk-1', type: 'air_tractor', muni: 'Manaus', x: 1610, y: 560, label: 'AT-01' },
  { id: 'tk-2', type: 'air_tractor', muni: 'Manaus', x: 1610, y: 615, label: 'AT-02' },
  { id: 'tk-3', type: 'air_tractor', muni: 'Manaus', x: 1680, y: 550, label: 'AT-03' },
  { id: 'tk-4', type: 'air_tractor', muni: 'Manaus', x: 1680, y: 605, label: 'AT-04' },
  { id: 'tk-5', type: 'helicoptero', muni: 'Manaus', x: 1530, y: 555, label: 'Harpia 01' },
  { id: 'tk-6', type: 'helicoptero', muni: 'Manaus', x: 1530, y: 605, label: 'Harpia 02' },
  { id: 'tk-7', type: 'brasao_cbi', muni: 'Manaus', x: 1600, y: 670, label: 'CBI' },

  // --- PRESIDENTE FIGUEIREDO ---
  { id: 'tk-8', type: 'brasao_cibm', muni: 'Presidente Figueiredo', x: 1650, y: 390, label: 'Pelotão P. Fig' },
  { id: 'tk-9', type: 'efetivo', count: 9, muni: 'Presidente Figueiredo', x: 1630, y: 440, label: '9 Militares' },
  { id: 'tk-10', type: 'air_tractor', muni: 'Presidente Figueiredo', x: 1625, y: 495, label: 'AT-05' },

  // --- ITACOATIARA ---
  { id: 'tk-11', type: 'efetivo', count: 14, muni: 'Itacoatiara', x: 1780, y: 615, label: '14 Militares' },
  { id: 'tk-12', type: 'air_tractor', muni: 'Itacoatiara', x: 1780, y: 670, label: 'AT-06' },
  { id: 'tk-13', type: 'brasao_cbi', muni: 'Itacoatiara', x: 1720, y: 630, label: 'Base Leste' },

  // --- PARINTINS / NHAMUNDÁ ---
  { id: 'tk-14', type: 'efetivo', count: 7, muni: 'Nhamundá', x: 1960, y: 520, label: '7 Militares' },
  { id: 'tk-15', type: 'efetivo', count: 4, muni: 'Parintins', x: 1960, y: 575, label: '4 Militares' },
  { id: 'tk-16', type: 'kc390', muni: 'Parintins', x: 1980, y: 630, label: 'KC-390' },
  { id: 'tk-17', type: 'brasao_cibm', muni: 'Parintins', x: 1910, y: 550, label: '3ª CIBM' },

  // --- NOVO AIRÃO ---
  { id: 'tk-18', type: 'helicoptero', muni: 'Novo Airão', x: 1440, y: 490, label: 'Harpia 03' },
  { id: 'tk-19', type: 'brasao_cibm', muni: 'Novo Airão', x: 1460, y: 550, label: 'Pel. N. Airão' },

  // --- TEFÉ ---
  { id: 'tk-20', type: 'brasao_cbi', muni: 'Tefé', x: 1020, y: 770, label: 'Base Solimões' },
  { id: 'tk-21', type: 'embarcacao', muni: 'Tefé', x: 1030, y: 815, label: 'VRF Tefé' },

  // --- HUMAITÁ (ARCO DO FOGO) ---
  { id: 'tk-22', type: 'brasao_cibm', muni: 'Humaitá', x: 1390, y: 1060, label: 'Base Sul' },
  { id: 'tk-23', type: 'vtr_florestal', muni: 'Humaitá', x: 1390, y: 1110, label: 'VF-01' },
  { id: 'tk-24', type: 'efetivo', count: 12, muni: 'Humaitá', x: 1320, y: 1080, label: '12 Militares' },

  // --- LÁBREA (ARCO DO FOGO) ---
  { id: 'tk-25', type: 'vtr_abt', muni: 'Lábrea', x: 960, y: 1140, label: 'ABT-08' },

  // --- BOCA DO ACRE (ARCO DO FOGO) ---
  { id: 'tk-26', type: 'vtr_florestal', muni: 'Boca do Acre', x: 745, y: 1190, label: 'VF-02' }
];
