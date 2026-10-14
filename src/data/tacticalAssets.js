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
  {
    "id": "tk-1",
    "type": "serv_ord",
    "muni": "Manaus",
    "x": 1604,
    "y": 505,
    "label": "117 SV ORD CBMAM",
    "count": 92
  },
  {
    "id": "tk-2",
    "type": "efetivo_seg",
    "muni": "Manaus",
    "x": 1674,
    "y": 505,
    "label": "6 Militar SEG",
    "count": 6
  },
  {
    "id": "tk-3",
    "type": "serv_ord",
    "muni": "Manaus",
    "x": 1744,
    "y": 505,
    "label": "25 Militares SP",
    "count": 25
  },
  {
    "id": "tk-4",
    "type": "air_tractor",
    "muni": "Manaus",
    "x": 1594,
    "y": 565,
    "label": "AT-01"
  },
  {
    "id": "tk-5",
    "type": "air_tractor",
    "muni": "Manaus",
    "x": 1594,
    "y": 615,
    "label": "AT-02"
  },
  {
    "id": "tk-6",
    "type": "air_tractor",
    "muni": "Manaus",
    "x": 1659,
    "y": 565,
    "label": "AT-03"
  },
  {
    "id": "tk-7",
    "type": "air_tractor",
    "muni": "Manaus",
    "x": 1659,
    "y": 615,
    "label": "AT-04"
  },
  {
    "id": "tk-8",
    "type": "helicoptero",
    "muni": "Manaus",
    "x": 1529,
    "y": 560,
    "label": "Harpia 01"
  },
  {
    "id": "tk-9",
    "type": "helicoptero",
    "muni": "Manaus",
    "x": 1529,
    "y": 615,
    "label": "Harpia 02"
  },
  {
    "id": "tk-10",
    "type": "brasao_cbi",
    "muni": "Manaus",
    "x": 1604,
    "y": 670,
    "label": "CBI QG"
  },
  {
    "id": "tk-11",
    "type": "serv_ord",
    "muni": "Apuí",
    "x": 1704,
    "y": 1090,
    "label": "6 SV Ordinário",
    "count": 6
  },
  {
    "id": "tk-12",
    "type": "efetivo_brigadista_sema",
    "muni": "Apuí",
    "x": 1769,
    "y": 1090,
    "label": "15 Brig. SEMA",
    "count": 15
  },
  {
    "id": "tk-13",
    "type": "serv_ord",
    "muni": "Atalaia do Norte",
    "x": 291,
    "y": 881,
    "label": "2 SV Ordinário",
    "count": 2
  },
  {
    "id": "tk-14",
    "type": "efetivo_brigadista",
    "muni": "Atalaia do Norte",
    "x": 351,
    "y": 881,
    "label": "15 Brigadistas",
    "count": 15
  },
  {
    "id": "tk-15",
    "type": "serv_ord",
    "muni": "Autazes",
    "x": 1671,
    "y": 685,
    "label": "5 SV Ordinário",
    "count": 5
  },
  {
    "id": "tk-16",
    "type": "serv_ord",
    "muni": "Autazes",
    "x": 1741,
    "y": 685,
    "label": "6 Posto Km 53",
    "count": 6
  },
  {
    "id": "tk-17",
    "type": "efetivo_brigadista",
    "muni": "Autazes",
    "x": 1671,
    "y": 735,
    "label": "13 Brigadistas",
    "count": 13
  },
  {
    "id": "tk-18",
    "type": "efetivo_brigadista_sema",
    "muni": "Autazes",
    "x": 1741,
    "y": 735,
    "label": "12 Brig. SEMA",
    "count": 12
  },
  {
    "id": "tk-19",
    "type": "efetivo_brigadista",
    "muni": "Barcelos",
    "x": 1263,
    "y": 349,
    "label": "12 Brigadistas",
    "count": 12
  },
  {
    "id": "tk-20",
    "type": "serv_ord",
    "muni": "Coari",
    "x": 1166,
    "y": 719,
    "label": "4 SV Ordinário",
    "count": 4
  },
  {
    "id": "tk-21",
    "type": "efetivo_brigadista_sema",
    "muni": "Coari",
    "x": 1231,
    "y": 719,
    "label": "12 Brig. SEMA",
    "count": 12
  },
  {
    "id": "tk-22",
    "type": "serv_ord",
    "muni": "Envira",
    "x": 481,
    "y": 1083,
    "label": "1 SV Ordinário",
    "count": 1
  },
  {
    "id": "tk-23",
    "type": "efetivo_brigadista",
    "muni": "Envira",
    "x": 541,
    "y": 1083,
    "label": "11 Brigadistas",
    "count": 11
  },
  {
    "id": "tk-24",
    "type": "serv_ord",
    "muni": "Humaitá",
    "x": 1364,
    "y": 1049,
    "label": "6 SV Ordinário",
    "count": 6
  },
  {
    "id": "tk-25",
    "type": "efetivo_brigadista_sema",
    "muni": "Humaitá",
    "x": 1434,
    "y": 1049,
    "label": "15 Brig. SEMA",
    "count": 15
  },
  {
    "id": "tk-26",
    "type": "vtr_florestal",
    "muni": "Humaitá",
    "x": 1364,
    "y": 1099,
    "label": "VF-01"
  },
  {
    "id": "tk-27",
    "type": "brasao_cibm",
    "muni": "Humaitá",
    "x": 1434,
    "y": 1099,
    "label": "Base Sul"
  },
  {
    "id": "tk-28",
    "type": "serv_ord",
    "muni": "Iranduba",
    "x": 1621,
    "y": 630,
    "label": "6 SV Ordinário",
    "count": 6
  },
  {
    "id": "tk-29",
    "type": "serv_ord",
    "muni": "Itacoatiara",
    "x": 1783,
    "y": 613,
    "label": "10 SV Ordinário",
    "count": 10
  },
  {
    "id": "tk-30",
    "type": "air_tractor",
    "muni": "Itacoatiara",
    "x": 1848,
    "y": 613,
    "label": "AT-06"
  },
  {
    "id": "tk-31",
    "type": "brasao_cbi",
    "muni": "Itacoatiara",
    "x": 1813,
    "y": 668,
    "label": "Base Leste"
  },
  {
    "id": "tk-32",
    "type": "serv_ord",
    "muni": "Itapiranga",
    "x": 1805,
    "y": 569,
    "label": "6 SV Ordinário",
    "count": 6
  },
  {
    "id": "tk-33",
    "type": "efetivo_brigadista",
    "muni": "Itapiranga",
    "x": 1870,
    "y": 569,
    "label": "11 Brigadistas",
    "count": 11
  },
  {
    "id": "tk-34",
    "type": "serv_ord",
    "muni": "Jutaí",
    "x": 690,
    "y": 790,
    "label": "1 SV Ordinário",
    "count": 1
  },
  {
    "id": "tk-35",
    "type": "efetivo_brigadista",
    "muni": "Jutaí",
    "x": 750,
    "y": 790,
    "label": "11 Brigadistas",
    "count": 11
  },
  {
    "id": "tk-36",
    "type": "serv_ord",
    "muni": "Lábrea",
    "x": 934,
    "y": 1124,
    "label": "4 SV Ordinário",
    "count": 4
  },
  {
    "id": "tk-37",
    "type": "efetivo_brigadista",
    "muni": "Lábrea",
    "x": 1004,
    "y": 1124,
    "label": "13 Brigadistas",
    "count": 13
  },
  {
    "id": "tk-38",
    "type": "efetivo_brigadista_sema",
    "muni": "Lábrea",
    "x": 934,
    "y": 1174,
    "label": "15 Brig. SEMA",
    "count": 15
  },
  {
    "id": "tk-39",
    "type": "vtr_florestal",
    "muni": "Lábrea",
    "x": 1004,
    "y": 1174,
    "label": "VF-02"
  },
  {
    "id": "tk-40",
    "type": "serv_ord",
    "muni": "Manaquiri",
    "x": 1555,
    "y": 696,
    "label": "6 SV Ordinário",
    "count": 6
  },
  {
    "id": "tk-41",
    "type": "efetivo_brigadista",
    "muni": "Manaquiri",
    "x": 1610,
    "y": 676,
    "label": "7 Brigadistas",
    "count": 7
  },
  {
    "id": "tk-42",
    "type": "efetivo_brigadista_sema",
    "muni": "Manaquiri",
    "x": 1610,
    "y": 721,
    "label": "9 Brig. SEMA",
    "count": 9
  },
  {
    "id": "tk-43",
    "type": "serv_ord",
    "muni": "Manacapuru",
    "x": 1554,
    "y": 643,
    "label": "11 SV Ordinário",
    "count": 11
  },
  {
    "id": "tk-44",
    "type": "serv_ord",
    "muni": "Manicoré",
    "x": 1456,
    "y": 1034,
    "label": "3 SV Ordinário",
    "count": 3
  },
  {
    "id": "tk-45",
    "type": "efetivo_brigadista",
    "muni": "Manicoré",
    "x": 1511,
    "y": 1014,
    "label": "20 Brigadistas",
    "count": 20
  },
  {
    "id": "tk-46",
    "type": "efetivo_brigadista_sema",
    "muni": "Manicoré",
    "x": 1511,
    "y": 1059,
    "label": "7 Brig. SEMA",
    "count": 7
  },
  {
    "id": "tk-47",
    "type": "serv_ord",
    "muni": "Maués",
    "x": 1838,
    "y": 821,
    "label": "2 SV Ordinário",
    "count": 2
  },
  {
    "id": "tk-48",
    "type": "efetivo_brigadista",
    "muni": "Maués",
    "x": 1903,
    "y": 821,
    "label": "13 Brigadistas",
    "count": 13
  },
  {
    "id": "tk-49",
    "type": "serv_ord",
    "muni": "Nhamundá",
    "x": 1884,
    "y": 453,
    "label": "2 SV Ordinário",
    "count": 2
  },
  {
    "id": "tk-50",
    "type": "efetivo_brigadista",
    "muni": "Nhamundá",
    "x": 1949,
    "y": 453,
    "label": "14 Brigadistas",
    "count": 14
  },
  {
    "id": "tk-51",
    "type": "serv_ord",
    "muni": "Novo Airão",
    "x": 1443,
    "y": 527,
    "label": "2 SV Ordinário",
    "count": 2
  },
  {
    "id": "tk-52",
    "type": "efetivo_brigadista",
    "muni": "Novo Airão",
    "x": 1508,
    "y": 527,
    "label": "2 Brigadistas",
    "count": 2
  },
  {
    "id": "tk-53",
    "type": "helicoptero",
    "muni": "Novo Airão",
    "x": 1473,
    "y": 472,
    "label": "Harpia 03"
  },
  {
    "id": "tk-54",
    "type": "serv_ord",
    "muni": "Novo Aripuanã",
    "x": 1571,
    "y": 1028,
    "label": "3 SV Ordinário",
    "count": 3
  },
  {
    "id": "tk-55",
    "type": "efetivo_brigadista_sema",
    "muni": "Novo Aripuanã",
    "x": 1636,
    "y": 1028,
    "label": "12 Brig. SEMA",
    "count": 12
  },
  {
    "id": "tk-56",
    "type": "serv_ord",
    "muni": "Parintins",
    "x": 1987,
    "y": 564,
    "label": "4 SV Ordinário",
    "count": 4
  },
  {
    "id": "tk-57",
    "type": "brasao_cibm",
    "muni": "Parintins",
    "x": 2052,
    "y": 564,
    "label": "3ª CIBM"
  },
  {
    "id": "tk-58",
    "type": "kc390",
    "muni": "Parintins",
    "x": 2027,
    "y": 619,
    "label": "KC-390 FAB"
  },
  {
    "id": "tk-59",
    "type": "serv_ord",
    "muni": "Presidente Figueiredo",
    "x": 1632,
    "y": 418,
    "label": "11 SV Ordinário",
    "count": 11
  },
  {
    "id": "tk-60",
    "type": "efetivo_brigadista",
    "muni": "Presidente Figueiredo",
    "x": 1697,
    "y": 418,
    "label": "10 Brigadistas",
    "count": 10
  },
  {
    "id": "tk-61",
    "type": "air_tractor",
    "muni": "Presidente Figueiredo",
    "x": 1632,
    "y": 473,
    "label": "AT-05"
  },
  {
    "id": "tk-62",
    "type": "brasao_cibm",
    "muni": "Presidente Figueiredo",
    "x": 1697,
    "y": 473,
    "label": "Pelotão P. Fig"
  },
  {
    "id": "tk-63",
    "type": "serv_ord",
    "muni": "Rio Preto da Eva",
    "x": 1688,
    "y": 566,
    "label": "7 SV Ordinário",
    "count": 7
  },
  {
    "id": "tk-64",
    "type": "efetivo_brigadista",
    "muni": "Rio Preto da Eva",
    "x": 1748,
    "y": 566,
    "label": "2 Brigadistas",
    "count": 2
  },
  {
    "id": "tk-65",
    "type": "serv_ord",
    "muni": "Tabatinga",
    "x": 535,
    "y": 721,
    "label": "5 SV Ordinário",
    "count": 5
  },
  {
    "id": "tk-66",
    "type": "efetivo_brigadista",
    "muni": "Tabatinga",
    "x": 595,
    "y": 721,
    "label": "3 Brigadistas",
    "count": 3
  },
  {
    "id": "tk-67",
    "type": "serv_ord",
    "muni": "Tapauá",
    "x": 968,
    "y": 954,
    "label": "3 SV Ordinário",
    "count": 3
  },
  {
    "id": "tk-68",
    "type": "efetivo_brigadista",
    "muni": "Tapauá",
    "x": 1023,
    "y": 934,
    "label": "5 Brigadistas",
    "count": 5
  },
  {
    "id": "tk-69",
    "type": "efetivo_brigadista_sema",
    "muni": "Tapauá",
    "x": 1023,
    "y": 979,
    "label": "12 Brig. SEMA",
    "count": 12
  },
  {
    "id": "tk-70",
    "type": "serv_ord",
    "muni": "Tefé",
    "x": 986,
    "y": 752,
    "label": "7 SV Ordinário",
    "count": 7
  },
  {
    "id": "tk-71",
    "type": "efetivo_brigadista",
    "muni": "Tefé",
    "x": 1056,
    "y": 752,
    "label": "5 Brigadistas",
    "count": 5
  },
  {
    "id": "tk-72",
    "type": "embarcacao",
    "muni": "Tefé",
    "x": 986,
    "y": 802,
    "label": "VRF Tefé"
  },
  {
    "id": "tk-73",
    "type": "brasao_cbi",
    "muni": "Tefé",
    "x": 1056,
    "y": 802,
    "label": "Base Solimões"
  },
  {
    "id": "tk-74",
    "type": "serv_ord",
    "muni": "Boa Vista do Ramos",
    "x": 1944,
    "y": 633,
    "label": "3 SV Ord. (Base)",
    "count": 3
  },
  {
    "id": "tk-75",
    "type": "serv_ord",
    "muni": "Boca do Acre",
    "x": 720,
    "y": 1170,
    "label": "4 SV Ord. (Base)",
    "count": 4
  },
  {
    "id": "tk-76",
    "type": "efetivo_brigadista_sema",
    "muni": "Boca do Acre",
    "x": 790,
    "y": 1170,
    "label": "15 Brig. SEMA (Base)",
    "count": 15
  },
  {
    "id": "tk-77",
    "type": "vtr_florestal",
    "muni": "Boca do Acre",
    "x": 755,
    "y": 1220,
    "label": "VF-03"
  },
  {
    "id": "tk-78",
    "type": "serv_ord",
    "muni": "Borba",
    "x": 1719,
    "y": 807,
    "label": "2 SV Ord. (Base)",
    "count": 2
  },
  {
    "id": "tk-79",
    "type": "efetivo_brigadista",
    "muni": "Borba",
    "x": 1789,
    "y": 807,
    "label": "3 Brigadistas",
    "count": 3
  },
  {
    "id": "tk-80",
    "type": "efetivo_brigadista_sema",
    "muni": "Borba",
    "x": 1719,
    "y": 857,
    "label": "10 Brig. SEMA",
    "count": 10
  },
  {
    "id": "tk-81",
    "type": "vtr_abt",
    "muni": "Borba",
    "x": 1789,
    "y": 857,
    "label": "ABT Borba"
  },
  {
    "id": "tk-82",
    "type": "serv_ord",
    "muni": "Caapiranga",
    "x": 1446,
    "y": 631,
    "label": "3 SV Ord. (Base)",
    "count": 3
  },
  {
    "id": "tk-83",
    "type": "efetivo_brigadista",
    "muni": "Caapiranga",
    "x": 1506,
    "y": 631,
    "label": "9 Brigadistas (Base)",
    "count": 9
  },
  {
    "id": "tk-84",
    "type": "serv_ord",
    "muni": "Canutama",
    "x": 1169,
    "y": 1081,
    "label": "2 SV Ord. (Base)",
    "count": 2
  },
  {
    "id": "tk-85",
    "type": "efetivo_brigadista_sema",
    "muni": "Canutama",
    "x": 1234,
    "y": 1081,
    "label": "11 Brig. SEMA (Base)",
    "count": 11
  },
  {
    "id": "tk-86",
    "type": "serv_ord",
    "muni": "Careiro",
    "x": 1613,
    "y": 704,
    "label": "8 SV Ord. (Castanho)",
    "count": 8
  },
  {
    "id": "tk-87",
    "type": "efetivo_brigadista_sema",
    "muni": "Careiro",
    "x": 1683,
    "y": 704,
    "label": "8 Brig. SEMA (Castanho)",
    "count": 8
  },
  {
    "id": "tk-88",
    "type": "serv_ord",
    "muni": "Careiro da Várzea",
    "x": 1707,
    "y": 655,
    "label": "4 SV Ord. (Base)",
    "count": 4
  },
  {
    "id": "tk-89",
    "type": "serv_ord",
    "muni": "Urucurituba",
    "x": 1905,
    "y": 603,
    "label": "1 SV Ord. (Base)",
    "count": 1
  },
  {
    "id": "tk-90",
    "type": "efetivo_brigadista",
    "muni": "Urucurituba",
    "x": 1965,
    "y": 603,
    "label": "18 Brigadistas (Base)",
    "count": 18
  }
];
