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
  // --- MANAUS (Capital) ---
  { id: 'tk-1', type: 'serv_ord', muni: 'Manaus', x: 1604, y: 505, label: '92 SV ORD CBMAM', count: 92 },
  { id: 'tk-2', type: 'efetivo_seg', muni: 'Manaus', x: 1674, y: 505, label: '6 Militar SEG', count: 6 },
  { id: 'tk-3', type: 'serv_ord', muni: 'Manaus', x: 1744, y: 505, label: '25 Militares SP', count: 25 },
  { id: 'tk-4', type: 'air_tractor', muni: 'Manaus', x: 1594, y: 565, label: 'AT-01 Flores' },
  { id: 'tk-5', type: 'air_tractor', muni: 'Manaus', x: 1594, y: 615, label: 'AT-02 Flores' },
  { id: 'tk-6', type: 'air_tractor', muni: 'Manaus', x: 1659, y: 565, label: 'AT-03 Flores' },
  { id: 'tk-7', type: 'air_tractor', muni: 'Manaus', x: 1659, y: 615, label: 'AT-04 Flores' },
  { id: 'tk-8', type: 'helicoptero', muni: 'Manaus', x: 1529, y: 560, label: 'Harpia 01 CIOPAER' },
  { id: 'tk-9', type: 'helicoptero', muni: 'Manaus', x: 1529, y: 615, label: 'Harpia 02 CIOPAER' },
  { id: 'tk-10', type: 'brasao_cbi', muni: 'Manaus', x: 1729, y: 565, label: 'CBI CBMAM' },

  // --- APUÍ ---
  { id: 'tk-11', type: 'serv_ord', muni: 'Apuí', x: 1700, y: 1100, label: '6 SV Ordinário', count: 6 },
  { id: 'tk-12', type: 'efetivo_brigadista_sema', muni: 'Apuí', x: 1770, y: 1100, label: '15 Brig. SEMA', count: 15 },

  // --- ATALAIA DO NORTE ---
  { id: 'tk-13', type: 'serv_ord', muni: 'Atalaia do Norte', x: 300, y: 880, label: '2 SV Ordinário', count: 2 },
  { id: 'tk-14', type: 'efetivo_brigadista', muni: 'Atalaia do Norte', x: 365, y: 880, label: '15 Brigadistas', count: 15 },

  // --- AUTAZES (Prevfogo 38, SV ORD 5+6=11, SEMA 12) ---
  { id: 'tk-15', type: 'serv_ord', muni: 'Autazes', x: 1671, y: 685, label: '5 SV Ordinário', count: 5 },
  { id: 'tk-16', type: 'serv_ord', muni: 'Autazes', x: 1741, y: 685, label: '6 Posto Km 53', count: 6 },
  { id: 'tk-17', type: 'efetivo_prevfogo', muni: 'Autazes', x: 1671, y: 735, label: '38 Prevfogo IBAMA', count: 38 },
  { id: 'tk-18', type: 'efetivo_brigadista_sema', muni: 'Autazes', x: 1741, y: 735, label: '12 Brig. SEMA', count: 12 },

  // --- BARCELOS ---
  { id: 'tk-19', type: 'efetivo_brigadista', muni: 'Barcelos', x: 1263, y: 349, label: '12 Brigadistas', count: 12 },

  // --- BARREIRINHA (Prevfogo 21) ---
  { id: 'tk-20', type: 'efetivo_prevfogo', muni: 'Barreirinha', x: 1998, y: 622, label: '21 Prevfogo IBAMA', count: 21 },

  // --- BOA VISTA DO RAMOS ---
  { id: 'tk-21', type: 'serv_ord', muni: 'Boa Vista do Ramos', x: 1944, y: 633, label: '3 SV Ord. (Base)', count: 3 },

  // --- BOCA DO ACRE ---
  { id: 'tk-22', type: 'serv_ord', muni: 'Boca do Acre', x: 730, y: 1190, label: '4 SV Ord. (Base)', count: 4 },
  { id: 'tk-23', type: 'efetivo_brigadista_sema', muni: 'Boca do Acre', x: 795, y: 1190, label: '15 Brig. SEMA', count: 15 },

  // --- BORBA (Prevfogo 20, SV ORD 2, SEMA 10, ABT) ---
  { id: 'tk-24', type: 'serv_ord', muni: 'Borba', x: 1719, y: 807, label: '2 SV Ord. (Base)', count: 2 },
  { id: 'tk-25', type: 'efetivo_prevfogo', muni: 'Borba', x: 1789, y: 807, label: '20 Prevfogo IBAMA', count: 20 },
  { id: 'tk-26', type: 'efetivo_brigadista_sema', muni: 'Borba', x: 1719, y: 857, label: '10 Brig. SEMA', count: 10 },
  { id: 'tk-27', type: 'vtr_abt', muni: 'Borba', x: 1789, y: 857, label: 'ABT Borba' },

  // --- CAAPIRANGA ---
  { id: 'tk-28', type: 'serv_ord', muni: 'Caapiranga', x: 1445, y: 631, label: '3 SV Ord. (Base)', count: 3 },

  // --- CANUTAMA ---
  { id: 'tk-30', type: 'serv_ord', muni: 'Canutama', x: 1175, y: 1081, label: '2 SV Ord. (Base)', count: 2 },
  { id: 'tk-31', type: 'efetivo_brigadista_sema', muni: 'Canutama', x: 1240, y: 1081, label: '11 Brig. SEMA', count: 11 },

  // --- CAREIRO (Careiro Castanho) ---
  { id: 'tk-32', type: 'serv_ord', muni: 'Careiro', x: 1625, y: 704, label: '8 SV Ord. (Base)', count: 8 },
  { id: 'tk-33', type: 'efetivo_brigadista_sema', muni: 'Careiro', x: 1690, y: 704, label: '8 Brig. SEMA', count: 8 },

  // --- CAREIRO DA VÁRZEA (Prevfogo 18, SV ORD 4) ---
  { id: 'tk-34', type: 'serv_ord', muni: 'Careiro da Várzea', x: 1685, y: 645, label: '4 SV Ord. (Base)', count: 4 },
  { id: 'tk-35', type: 'efetivo_prevfogo', muni: 'Careiro da Várzea', x: 1750, y: 645, label: '18 Prevfogo IBAMA', count: 18 },

  // --- COARI ---
  { id: 'tk-36', type: 'serv_ord', muni: 'Coari', x: 1170, y: 719, label: '4 SV Ordinário', count: 4 },
  { id: 'tk-37', type: 'efetivo_brigadista_sema', muni: 'Coari', x: 1235, y: 719, label: '12 Brig. SEMA', count: 12 },

  // --- ENVIRA ---
  { id: 'tk-38', type: 'serv_ord', muni: 'Envira', x: 485, y: 1083, label: '1 SV Ordinário', count: 1 },
  { id: 'tk-39', type: 'efetivo_brigadista', muni: 'Envira', x: 550, y: 1083, label: '11 Brigadistas', count: 11 },

  // --- HUMAITÁ ---
  { id: 'tk-40', type: 'serv_ord', muni: 'Humaitá', x: 1365, y: 1074, label: '6 SV Ordinário', count: 6 },
  { id: 'tk-41', type: 'efetivo_brigadista_sema', muni: 'Humaitá', x: 1435, y: 1074, label: '15 Brig. SEMA', count: 15 },
  { id: 'tk-42', type: 'vtr_florestal', muni: 'Humaitá', x: 1400, y: 1120, label: 'Pick-up Humaitá' },

  // --- IRANDUBA ---
  { id: 'tk-43', type: 'serv_ord', muni: 'Iranduba', x: 1595, y: 630, label: '6 SV Ordinário', count: 6 },
  { id: 'tk-44', type: 'embarcacao', muni: 'Iranduba', x: 1660, y: 630, label: 'Lancha Fluvial Iranduba' },

  // --- ITACOATIARA ---
  { id: 'tk-45', type: 'serv_ord', muni: 'Itacoatiara', x: 1780, y: 630, label: '10 SV Ordinário', count: 10 },
  { id: 'tk-46', type: 'air_tractor', muni: 'Itacoatiara', x: 1845, y: 630, label: 'AT-06 Itacoatiara' },
  { id: 'tk-47', type: 'vtr_abt', muni: 'Itacoatiara', x: 1813, y: 675, label: 'ABT Itacoatiara' },

  // --- ITAPIRANGA ---
  { id: 'tk-48', type: 'serv_ord', muni: 'Itapiranga', x: 1810, y: 569, label: '6 SV Ordinário', count: 6 },
  { id: 'tk-49', type: 'efetivo_brigadista', muni: 'Itapiranga', x: 1875, y: 569, label: '11 Brigadistas', count: 11 },

  // --- JUTAÍ ---
  { id: 'tk-50', type: 'serv_ord', muni: 'Jutaí', x: 690, y: 790, label: '1 SV Ordinário', count: 1 },
  { id: 'tk-51', type: 'efetivo_brigadista', muni: 'Jutaí', x: 755, y: 790, label: '11 Brigadistas', count: 11 },

  // --- LÁBREA ---
  { id: 'tk-52', type: 'serv_ord', muni: 'Lábrea', x: 940, y: 1140, label: '4 SV Ordinário', count: 4 },
  { id: 'tk-53', type: 'efetivo_brigadista_sema', muni: 'Lábrea', x: 1005, y: 1140, label: '15 Brig. SEMA', count: 15 },
  { id: 'tk-54', type: 'vtr_ur', muni: 'Lábrea', x: 970, y: 1190, label: 'UR Lábrea' },

  // --- MANACAPURU ---
  { id: 'tk-55', type: 'serv_ord', muni: 'Manacapuru', x: 1554, y: 643, label: '11 SV Ordinário', count: 11 },

  // --- MANAQUIRI ---
  { id: 'tk-56', type: 'serv_ord', muni: 'Manaquiri', x: 1570, y: 696, label: '6 SV Ordinário', count: 6 },
  { id: 'tk-57', type: 'efetivo_brigadista_sema', muni: 'Manaquiri', x: 1635, y: 696, label: '9 Brig. SEMA', count: 9 },

  // --- MANICORÉ ---
  { id: 'tk-58', type: 'serv_ord', muni: 'Manicoré', x: 1470, y: 1034, label: '3 SV Ordinário', count: 3 },
  { id: 'tk-59', type: 'efetivo_brigadista_sema', muni: 'Manicoré', x: 1535, y: 1034, label: '7 Brig. SEMA', count: 7 },

  // --- MAUÉS (Prevfogo 14, SV ORD 2) ---
  { id: 'tk-60', type: 'serv_ord', muni: 'Maués', x: 1838, y: 821, label: '2 SV Ordinário', count: 2 },
  { id: 'tk-61', type: 'efetivo_prevfogo', muni: 'Maués', x: 1903, y: 821, label: '14 Prevfogo IBAMA', count: 14 },

  // --- NHAMUNDÁ ---
  { id: 'tk-62', type: 'serv_ord', muni: 'Nhamundá', x: 1885, y: 453, label: '2 SV Ordinário', count: 2 },

  // --- NOVA OLINDA DO NORTE (Prevfogo 15) ---
  { id: 'tk-64', type: 'efetivo_prevfogo', muni: 'Nova Olinda do Norte', x: 1833, y: 718, label: '15 Prevfogo IBAMA', count: 15 },

  // --- NOVO AIRÃO ---
  { id: 'tk-65', type: 'serv_ord', muni: 'Novo Airão', x: 1445, y: 507, label: '2 SV Ordinário', count: 2 },
  { id: 'tk-66', type: 'helicoptero', muni: 'Novo Airão', x: 1510, y: 507, label: 'Harpia 03 Novo Airão' },

  // --- NOVO ARIPUANÃ ---
  { id: 'tk-67', type: 'serv_ord', muni: 'Novo Aripuanã', x: 1575, y: 1028, label: '3 SV Ordinário', count: 3 },
  { id: 'tk-68', type: 'efetivo_brigadista_sema', muni: 'Novo Aripuanã', x: 1640, y: 1028, label: '12 Brig. SEMA', count: 12 },

  // --- PARINTINS (Prevfogo 8, SV ORD 4, KC-390, Brasão 3ª CIBM) ---
  { id: 'tk-69', type: 'serv_ord', muni: 'Parintins', x: 1987, y: 564, label: '4 SV Ordinário', count: 4 },
  { id: 'tk-70', type: 'brasao_cibm', muni: 'Parintins', x: 2052, y: 564, label: '3ª CIBM' },
  { id: 'tk-71', type: 'kc390', muni: 'Parintins', x: 1987, y: 619, label: 'KC-390 FAB' },
  { id: 'tk-72', type: 'efetivo_prevfogo', muni: 'Parintins', x: 2052, y: 619, label: '8 Prevfogo IBAMA', count: 8 },

  // --- PRESIDENTE FIGUEIREDO ---
  { id: 'tk-73', type: 'serv_ord', muni: 'Presidente Figueiredo', x: 1635, y: 438, label: '11 SV Ordinário', count: 11 },
  { id: 'tk-74', type: 'air_tractor', muni: 'Presidente Figueiredo', x: 1700, y: 438, label: 'AT-05 P. Fig.' },

  // --- RIO PRETO DA EVA ---
  { id: 'tk-75', type: 'serv_ord', muni: 'Rio Preto da Eva', x: 1713, y: 566, label: '7 SV Ordinário', count: 7 },

  // --- TABATINGA ---
  { id: 'tk-76', type: 'serv_ord', muni: 'Tabatinga', x: 560, y: 721, label: '5 SV Ordinário', count: 5 },

  // --- TAPAUÁ ---
  { id: 'tk-77', type: 'serv_ord', muni: 'Tapauá', x: 980, y: 954, label: '3 SV Ordinário', count: 3 },
  { id: 'tk-78', type: 'efetivo_brigadista_sema', muni: 'Tapauá', x: 1045, y: 954, label: '12 Brig. SEMA', count: 12 },

  // --- TEFÉ ---
  { id: 'tk-79', type: 'serv_ord', muni: 'Tefé', x: 990, y: 777, label: '7 SV Ordinário', count: 7 },
  { id: 'tk-80', type: 'efetivo_brigadista', muni: 'Tefé', x: 1055, y: 777, label: '3 Brigadistas', count: 3 },

  // --- URUCURITUBA ---
  { id: 'tk-81', type: 'serv_ord', muni: 'Urucurituba', x: 1930, y: 603, label: '1 SV Ord. (Base)', count: 1 }
];
