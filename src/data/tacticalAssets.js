// Definições de Ativos Táticos, SVGs e Cenário Base Oficial CBMAM
export const TACTICAL_TOKENS = [
  // --- AERONAVES ---
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

  // --- VIATURAS TERRESTRES ---
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

  // --- FLUVIAL ---
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

  // --- EFETIVO / CONTINGENTE ---
  {
    id: 'efetivo_militar',
    name: 'Bombeiros Militares (Serv. Ordinário)',
    category: 'efetivo',
    type: 'efetivo_militar',
    subType: 'serv_ord',
    label: 'SV Ordinário',
    width: 72,
    height: 48,
    count: 10,
    desc: 'Guarnição militar de serviço ordinário CBMAM',
    color: '#dc2626'
  },
  {
    id: 'efetivo_seg',
    name: 'Militares CBMAM (SEG)',
    category: 'efetivo',
    type: 'efetivo_seg',
    subType: 'seg',
    label: 'Militar SEG',
    width: 72,
    height: 48,
    count: 6,
    desc: 'Serviço Extraordinário Gratificado CBMAM',
    color: '#991b1b'
  },
  {
    id: 'efetivo_brigadista',
    name: 'Brigadistas (Municipal / Geral)',
    category: 'efetivo',
    type: 'efetivo_brigadista',
    subType: 'brigadista',
    label: 'Brigadistas',
    width: 72,
    height: 48,
    count: 10,
    desc: 'Brigada de combate a incêndio florestal municipal',
    color: '#ea580c'
  },
  {
    id: 'efetivo_brigadista_sema',
    name: 'Brigadistas SEMA-AM',
    category: 'efetivo',
    type: 'efetivo_brigadista_sema',
    subType: 'brigadista_sema',
    label: 'Brig. SEMA',
    width: 72,
    height: 48,
    count: 10,
    desc: 'Brigadistas Secretaria de Estado do Meio Ambiente (SEMA-AM)',
    color: '#047857'
  },
  {
    id: 'efetivo_prevfogo',
    name: 'Prevfogo / IBAMA',
    category: 'efetivo',
    type: 'efetivo_prevfogo',
    subType: 'prevfogo',
    label: 'Prevfogo IBAMA',
    width: 72,
    height: 48,
    count: 10,
    desc: 'Brigada Federal Prevfogo IBAMA',
    color: '#15803d'
  },

  // --- BRASÕES ---
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

// Cenário oficial consolidado da OPERAÇÃO AMAZONAS com Militares (Ord/SEG), Brigadistas (Geral/SEMA) e Meios Aéreos
export const INITIAL_REAL_SCENARIO = [
  // --- MANAUS (COMANDO GERAL & REFORÇOS) ---
  { id: 'tk-1', type: 'serv_ord', count: 117, muni: 'Manaus', x: 1600, y: 500, label: '117 SV ORD CBMAM' },
  { id: 'tk-2', type: 'efetivo_seg', count: 6, muni: 'Manaus', x: 1665, y: 500, label: '6 Militar SEG' },
  { id: 'tk-3', type: 'serv_ord', count: 25, muni: 'Manaus', x: 1730, y: 500, label: '25 Militares SP' },
  { id: 'tk-4', type: 'air_tractor', muni: 'Manaus', x: 1590, y: 560, label: 'AT-01' },
  { id: 'tk-5', type: 'air_tractor', muni: 'Manaus', x: 1590, y: 610, label: 'AT-02' },
  { id: 'tk-6', type: 'air_tractor', muni: 'Manaus', x: 1655, y: 560, label: 'AT-03' },
  { id: 'tk-7', type: 'air_tractor', muni: 'Manaus', x: 1655, y: 610, label: 'AT-04' },
  { id: 'tk-8', type: 'helicoptero', muni: 'Manaus', x: 1525, y: 555, label: 'Harpia 01' },
  { id: 'tk-9', type: 'helicoptero', muni: 'Manaus', x: 1525, y: 610, label: 'Harpia 02' },
  { id: 'tk-10', type: 'brasao_cbi', muni: 'Manaus', x: 1600, y: 665, label: 'CBI QG' },

  // --- AUTAZES (38 BRIGADISTAS + 5 SV ORD + 6 KM 53) ---
  { id: 'tk-11', type: 'serv_ord', count: 5, muni: 'Autazes', x: 1675, y: 690, label: '5 SV Ordinário' },
  { id: 'tk-12', type: 'serv_ord', count: 6, muni: 'Autazes', x: 1735, y: 690, label: '6 Posto Km 53' },
  { id: 'tk-13', type: 'efetivo_brigadista', count: 38, muni: 'Autazes', x: 1705, y: 740, label: '38 Brigadistas' },

  // --- BARREIRINHA (21 BRIGADISTAS TI ANDIRÁ-MARAU) ---
  { id: 'tk-14', type: 'efetivo_brigadista', count: 21, muni: 'Barreirinha', x: 1995, y: 625, label: '21 Brigadistas' },

  // --- MAUÉS (14 BRIGADISTAS + 2 SV ORD) ---
  { id: 'tk-15', type: 'serv_ord', count: 2, muni: 'Maués', x: 1870, y: 800, label: '2 SV Ordinário' },
  { id: 'tk-16', type: 'efetivo_brigadista', count: 14, muni: 'Maués', x: 1870, y: 850, label: '14 Brigadistas' },

  // --- NOVA OLINDA DO NORTE (15 BRIGADISTAS PAE CURUPIRA) ---
  { id: 'tk-17', type: 'efetivo_brigadista', count: 15, muni: 'Nova Olinda do Norte', x: 1830, y: 720, label: '15 Brigadistas' },

  // --- CAREIRO DA VÁRZEA (18 BRIGADISTAS + 4 SV ORD) ---
  { id: 'tk-18', type: 'serv_ord', count: 4, muni: 'Careiro da Várzea', x: 1705, y: 635, label: '4 SV Ordinário' },
  { id: 'tk-19', type: 'efetivo_brigadista', count: 18, muni: 'Careiro da Várzea', x: 1705, y: 675, label: '18 Brigadistas' },

  // --- BORBA (20 BRIGADISTAS + 2 SV ORD + 3 SEG) ---
  { id: 'tk-20', type: 'serv_ord', count: 2, muni: 'Borba', x: 1740, y: 810, label: '2 SV Ordinário' },
  { id: 'tk-21', type: 'efetivo_seg', count: 3, muni: 'Borba', x: 1800, y: 810, label: '3 Militar SEG' },
  { id: 'tk-22', type: 'efetivo_brigadista', count: 10, muni: 'Borba', x: 1740, y: 860, label: '10 Brigadistas' },
  { id: 'tk-23', type: 'efetivo_brigadista_sema', count: 10, muni: 'Borba', x: 1800, y: 860, label: '10 Brig. SEMA' },

  // --- PARINTINS (8 BRIGADISTAS + 4 SV ORD + KC-390 + BRASÃO) ---
  { id: 'tk-24', type: 'serv_ord', count: 4, muni: 'Parintins', x: 1960, y: 565, label: '4 SV Ordinário' },
  { id: 'tk-25', type: 'efetivo_brigadista', count: 8, muni: 'Parintins', x: 2025, y: 565, label: '8 Brigadistas' },
  { id: 'tk-26', type: 'kc390', muni: 'Parintins', x: 1980, y: 620, label: 'KC-390' },
  { id: 'tk-27', type: 'brasao_cibm', muni: 'Parintins', x: 1910, y: 550, label: '3ª CIBM' },

  // --- PRESIDENTE FIGUEIREDO (11 SV ORD + 10 BRIGADISTAS + AT-05) ---
  { id: 'tk-28', type: 'brasao_cibm', muni: 'Presidente Figueiredo', x: 1650, y: 390, label: 'Pelotão P. Fig' },
  { id: 'tk-29', type: 'serv_ord', count: 11, muni: 'Presidente Figueiredo', x: 1615, y: 440, label: '11 SV Ordinário' },
  { id: 'tk-30', type: 'efetivo_brigadista', count: 10, muni: 'Presidente Figueiredo', x: 1675, y: 440, label: '10 Brigadistas' },
  { id: 'tk-31', type: 'air_tractor', muni: 'Presidente Figueiredo', x: 1625, y: 495, label: 'AT-05' },

  // --- ITACOATIARA (10 SV ORD + AT-06 + BASE LESTE) ---
  { id: 'tk-32', type: 'serv_ord', count: 10, muni: 'Itacoatiara', x: 1780, y: 615, label: '10 SV Ordinário' },
  { id: 'tk-33', type: 'air_tractor', muni: 'Itacoatiara', x: 1780, y: 670, label: 'AT-06' },
  { id: 'tk-34', type: 'brasao_cbi', muni: 'Itacoatiara', x: 1720, y: 630, label: 'Base Leste' },

  // --- NHAMUNDÁ (2 SV ORD + 14 BRIGADISTAS) ---
  { id: 'tk-35', type: 'serv_ord', count: 2, muni: 'Nhamundá', x: 1960, y: 510, label: '2 SV Ordinário' },
  { id: 'tk-36', type: 'efetivo_brigadista', count: 14, muni: 'Nhamundá', x: 2025, y: 510, label: '14 Brigadistas' },

  // --- NOVO AIRÃO (2 SV ORD + 2 BRIGADISTAS + HARPIA) ---
  { id: 'tk-37', type: 'helicoptero', muni: 'Novo Airão', x: 1440, y: 490, label: 'Harpia 03' },
  { id: 'tk-38', type: 'serv_ord', count: 2, muni: 'Novo Airão', x: 1440, y: 540, label: '2 SV Ordinário' },
  { id: 'tk-39', type: 'efetivo_brigadista', count: 2, muni: 'Novo Airão', x: 1500, y: 540, label: '2 Brigadistas' },

  // --- TEFÉ (7 SV ORD + 5 BRIGADISTAS + VRF + BASE) ---
  { id: 'tk-40', type: 'brasao_cbi', muni: 'Tefé', x: 1000, y: 760, label: 'Base Solimões' },
  { id: 'tk-41', type: 'serv_ord', count: 7, muni: 'Tefé', x: 1060, y: 760, label: '7 SV Ordinário' },
  { id: 'tk-42', type: 'efetivo_brigadista', count: 5, muni: 'Tefé', x: 1060, y: 810, label: '5 Brigadistas' },
  { id: 'tk-43', type: 'embarcacao', muni: 'Tefé', x: 1000, y: 810, label: 'VRF Tefé' },

  // --- HUMAITÁ (6 SV ORD + 15 BRIG. SEMA + VF-01) ---
  { id: 'tk-44', type: 'brasao_cibm', muni: 'Humaitá', x: 1390, y: 1050, label: 'Base Sul' },
  { id: 'tk-45', type: 'vtr_florestal', muni: 'Humaitá', x: 1390, y: 1105, label: 'VF-01' },
  { id: 'tk-46', type: 'serv_ord', count: 6, muni: 'Humaitá', x: 1320, y: 1075, label: '6 SV Ordinário' },
  { id: 'tk-47', type: 'efetivo_brigadista_sema', count: 15, muni: 'Humaitá', x: 1450, y: 1075, label: '15 Brig. SEMA' },

  // --- LÁBREA (4 SV ORD + 13 BRIGADISTAS + 15 BRIG. SEMA + ABT-08) ---
  { id: 'tk-48', type: 'vtr_abt', muni: 'Lábrea', x: 940, y: 1140, label: 'ABT-08' },
  { id: 'tk-49', type: 'serv_ord', count: 4, muni: 'Lábrea', x: 940, y: 1085, label: '4 SV Ordinário' },
  { id: 'tk-50', type: 'efetivo_brigadista', count: 13, muni: 'Lábrea', x: 1005, y: 1085, label: '13 Brigadistas' },
  { id: 'tk-51', type: 'efetivo_brigadista_sema', count: 15, muni: 'Lábrea', x: 1005, y: 1140, label: '15 Brig. SEMA' },

  // --- BOCA DO ACRE (4 SV ORD + 15 BRIG. SEMA + VF-02) ---
  { id: 'tk-52', type: 'vtr_florestal', muni: 'Boca do Acre', x: 745, y: 1190, label: 'VF-02' },
  { id: 'tk-53', type: 'serv_ord', count: 4, muni: 'Boca do Acre', x: 745, y: 1135, label: '4 SV Ordinário' },
  { id: 'tk-54', type: 'efetivo_brigadista_sema', count: 15, muni: 'Boca do Acre', x: 810, y: 1135, label: '15 Brig. SEMA' },

  // --- APUÍ (6 SV ORD + 15 BRIG. SEMA) ---
  { id: 'tk-55', type: 'serv_ord', count: 6, muni: 'Apuí', x: 1705, y: 1090, label: '6 SV Ordinário' },
  { id: 'tk-56', type: 'efetivo_brigadista_sema', count: 15, muni: 'Apuí', x: 1770, y: 1090, label: '15 Brig. SEMA' }
];

