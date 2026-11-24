// Matriz Oficial de Efetivo · Operação Amazonas Mais Verde
// Padrão canônico integrado com o Relatório Diário CBMAM (Sala de Situação)

export const MUNICIPIOS_POLO_LIST = [
  'Manaus',
  'Apuí',
  'Atalaia do Norte',
  'Autazes',
  'Barcelos',
  'Coari',
  'Envira',
  'Humaitá',
  'Iranduba',
  'Itacoatiara',
  'Itapiranga',
  'Jutaí',
  'Lábrea',
  'Manaquiri',
  'Manacapuru',
  'Manicoré',
  'Maués',
  'Nhamundá',
  'Novo Airão',
  'Novo Aripuanã',
  'Parintins',
  'Presidente Figueiredo',
  'Rio Preto da Eva',
  'Tabatinga',
  'Tapauá',
  'Tefé',
];

export const BASES_TEMPORARIAS_LIST = [
  'Autazes Posto Km 53',
  'Anamã',
  'Barreirinha',
  'Boa Vista do Ramos',
  'Boca do Acre',
  'Borba',
  'Caapiranga',
  'Canutama',
  'Careiro Castanho',
  'Careiro da Várzea',
  'São Sebastião do Uatumã',
  'Urucurituba',
];

export function norm(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// 1. Efetivo CBMAM por Município (Total Polos: 818)
export const BENCHMARK_PERMANENTE_CBMAM = {
  Manaus: 477,
  Apuí: 5,
  'Atalaia do Norte': 8,
  Autazes: 5,
  Barcelos: 7,
  Coari: 7,
  Envira: 5,
  Humaitá: 29,
  Iranduba: 28,
  Itacoatiara: 24,
  Itapiranga: 6,
  Jutaí: 5,
  Lábrea: 5,
  Manaquiri: 7,
  Manacapuru: 30,
  Manicoré: 5,
  Maués: 5,
  Nhamundá: 1,
  'Novo Airão': 15,
  'Novo Aripuanã': 4,
  Parintins: 35,
  'Presidente Figueiredo': 26,
  'Rio Preto da Eva': 22,
  Tabatinga: 27,
  Tapauá: 4,
  Tefé: 26,
};

// 2. Dados Operacionais Oficiais em Campo (580 nos 26 Polos)
export const BENCHMARK_MUNICIPIOS_OPERACIONAL = {
  Manaus: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 94,
    fn: 11,
    brig_mun: 0,
    brig_semas: 0,
  },
  Apuí: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 15,
  },
  'Atalaia do Norte': {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 15,
    brig_semas: 0,
  },
  Autazes: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 34,
    fn: 0,
    brig_mun: 13,
    brig_semas: 12,
  },
  Barcelos: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 12,
    brig_semas: 0,
  },
  Coari: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 23,
    brig_semas: 12,
  },
  Envira: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 11,
    brig_semas: 0,
  },
  Humaitá: {
    opamv: 4,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 15,
  },
  Iranduba: {
    opamv: 3,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Itacoatiara: {
    opamv: 0,
    opam_ref: 9,
    prevfogo: 22,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Itapiranga: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 11,
    brig_semas: 0,
  },
  Jutaí: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 11,
    brig_semas: 0,
  },
  Lábrea: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 10,
    brig_semas: 15,
  },
  Manaquiri: {
    opamv: 2,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 7,
    brig_semas: 9,
  },
  Manacapuru: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Manicoré: {
    opamv: 2,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 20,
    brig_semas: 7,
  },
  Maués: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 13,
    brig_semas: 0,
  },
  Nhamundá: {
    opamv: 2,
    opam_ref: 4,
    prevfogo: 0,
    fn: 0,
    brig_mun: 15,
    brig_semas: 0,
  },
  'Novo Airão': {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 2,
    brig_semas: 0,
  },
  'Novo Aripuanã': {
    opamv: 1,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 12,
  },
  Parintins: {
    opamv: 0,
    opam_ref: 14,
    prevfogo: 46,
    fn: 24,
    brig_mun: 9,
    brig_semas: 0,
  },
  'Presidente Figueiredo': {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 3,
    brig_semas: 0,
  },
  'Rio Preto da Eva': {
    opamv: 0,
    opam_ref: 7,
    prevfogo: 0,
    fn: 0,
    brig_mun: 6,
    brig_semas: 0,
  },
  Tabatinga: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 3,
    brig_semas: 0,
  },
  Tapauá: {
    opamv: 2,
    opam_ref: 1,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 12,
  },
  Tefé: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 5,
    brig_semas: 0,
  },
};

// 3. Bases Temporárias Oficiais em Campo (162 Operacionais)
export const BENCHMARK_BASES_OPERACIONAL = {
  'Autazes Posto Km 53': {
    opamv: 0,
    opam_ref: 4,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Anamã: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Barreirinha: {
    opamv: 0,
    opam_ref: 2,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  'Boa Vista do Ramos': {
    opamv: 0,
    opam_ref: 8,
    prevfogo: 0,
    fn: 0,
    brig_mun: 15,
    brig_semas: 0,
  },
  'Boca do Acre': {
    opamv: 2,
    opam_ref: 1,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 15,
  },
  Borba: {
    opamv: 3,
    opam_ref: 0,
    prevfogo: 28,
    fn: 0,
    brig_mun: 0,
    brig_semas: 10,
  },
  Caapiranga: {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Canutama: {
    opamv: 2,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 11,
  },
  'Careiro Castanho': {
    opamv: 2,
    opam_ref: 3,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 8,
  },
  'Careiro da Várzea': {
    opamv: 0,
    opam_ref: 4,
    prevfogo: 23,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  'São Sebastião do Uatumã': {
    opamv: 0,
    opam_ref: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_semas: 0,
  },
  Urucurituba: {
    opamv: 2,
    opam_ref: 1,
    prevfogo: 0,
    fn: 0,
    brig_mun: 18,
    brig_semas: 0,
  },
};

// 4. Efetivo Geral — Todas as Instituições (Total: 1.470)
export const EFETIVO_GERAL_INSTITUICOES = [
  {
    instituicao: 'CBMAM CAPITAL (PERMANENTE)',
    quantitativo: 477,
    participacao: '32,4%',
    cor: '#dc2626',
  },
  {
    instituicao: 'CBMAM INTERIOR (PERMANENTE)',
    quantitativo: 350,
    participacao: '23,8%',
    cor: '#ef4444',
  },
  {
    instituicao: 'BRIGADISTAS MUNICIPAIS',
    quantitativo: 208,
    participacao: '14,1%',
    cor: '#fb923c',
  },
  {
    instituicao: 'BRIGADISTAS SEMA',
    quantitativo: 153,
    participacao: '10,4%',
    cor: '#a3e635',
  },
  {
    instituicao: 'FORÇA NACIONAL',
    quantitativo: 35,
    participacao: '2,4%',
    cor: '#22d3ee',
  },
  {
    instituicao: 'CBMESP',
    quantitativo: 0,
    participacao: '0,0%',
    cor: '#64748b',
  },
  {
    instituicao: 'MARINHA',
    quantitativo: 0,
    participacao: '0,0%',
    cor: '#64748b',
  },
  {
    instituicao: 'PREVFOGO',
    quantitativo: 247,
    participacao: '16,8%',
    cor: '#34d399',
  },
];

// 5. Detalhamento Oficial por CRBM (Combatente e Saúde: Total 350)
export const CRBM_DETALHAMENTO = [
  // 1º CRBM (Sul do Amazonas)
  {
    crbm: '1º CRBM',
    grupamento: 'ADM 1º CRBM',
    municipio: 'Humaitá',
    combatente: 2,
    saude: 2,
    total: 4,
  },
  {
    crbm: '1º CRBM',
    grupamento: '7º GBM – Humaitá',
    municipio: 'Humaitá',
    combatente: 23,
    saude: 2,
    total: 25,
  },
  {
    crbm: '1º CRBM',
    grupamento: '8º GBM – Apuí',
    municipio: 'Apuí',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '1º CRBM',
    grupamento: '12º GBM – Lábrea',
    municipio: 'Lábrea',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '1º CRBM',
    grupamento: '13º GBM – Manicoré',
    municipio: 'Manicoré',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '1º CRBM',
    grupamento: '14º GBM – Novo Aripuanã',
    municipio: 'Novo Aripuanã',
    combatente: 4,
    saude: 0,
    total: 4,
  },
  {
    crbm: '1º CRBM',
    grupamento: '16º GBM – Tapauá',
    municipio: 'Tapauá',
    combatente: 4,
    saude: 0,
    total: 4,
  },

  // 2º CRBM (Região Metropolitana & Baixo Amazonas)
  {
    crbm: '2º CRBM',
    grupamento: 'ADM 2º CRBM (MANAUS)',
    municipio: 'Manaus',
    combatente: 7,
    saude: 2,
    total: 9,
  },
  {
    crbm: '2º CRBM',
    grupamento: '17º GBM – Itacoatiara',
    municipio: 'Itacoatiara',
    combatente: 21,
    saude: 3,
    total: 24,
  },
  {
    crbm: '2º CRBM',
    grupamento: '18º GBM – Manacapuru',
    municipio: 'Manacapuru',
    combatente: 21,
    saude: 9,
    total: 30,
  },
  {
    crbm: '2º CRBM',
    grupamento: '19º GBM – Parintins',
    municipio: 'Parintins',
    combatente: 25,
    saude: 10,
    total: 35,
  },
  {
    crbm: '2º CRBM',
    grupamento: '20º GBM – Presidente Figueiredo',
    municipio: 'Presidente Figueiredo',
    combatente: 17,
    saude: 9,
    total: 26,
  },
  {
    crbm: '2º CRBM',
    grupamento: '21º GBM – Rio Preto da Eva',
    municipio: 'Rio Preto da Eva',
    combatente: 19,
    saude: 3,
    total: 22,
  },
  {
    crbm: '2º CRBM',
    grupamento: '22º GBM – Iranduba',
    municipio: 'Iranduba',
    combatente: 22,
    saude: 6,
    total: 28,
  },
  {
    crbm: '2º CRBM',
    grupamento: '23º GBM – Autazes',
    municipio: 'Autazes',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '2º CRBM',
    grupamento: '33º GBM – Novo Airão',
    municipio: 'Novo Airão',
    combatente: 15,
    saude: 0,
    total: 15,
  },
  {
    crbm: '2º CRBM',
    grupamento: '34º GBM – Itapiranga',
    municipio: 'Itapiranga',
    combatente: 6,
    saude: 0,
    total: 6,
  },
  {
    crbm: '2º CRBM',
    grupamento: '35º GBM – Maués',
    municipio: 'Maués',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '2º CRBM',
    grupamento: '36º GBM – Manaquiri',
    municipio: 'Manaquiri',
    combatente: 6,
    saude: 1,
    total: 7,
  },
  {
    crbm: '2º CRBM',
    grupamento: '38º GBM – Nhamundá',
    municipio: 'Nhamundá',
    combatente: 1,
    saude: 0,
    total: 1,
  },

  // 3º CRBM (Alto Solimões & Médio Solimões)
  {
    crbm: '3º CRBM',
    grupamento: '43º GBM – Tabatinga',
    municipio: 'Tabatinga',
    combatente: 25,
    saude: 2,
    total: 27,
  },
  {
    crbm: '3º CRBM',
    grupamento: '44º GBM – Tefé',
    municipio: 'Tefé',
    combatente: 22,
    saude: 4,
    total: 26,
  },
  {
    crbm: '3º CRBM',
    grupamento: '45º GBM – Coari',
    municipio: 'Coari',
    combatente: 7,
    saude: 0,
    total: 7,
  },
  {
    crbm: '3º CRBM',
    grupamento: '48º GBM – Atalaia do Norte',
    municipio: 'Atalaia do Norte',
    combatente: 8,
    saude: 0,
    total: 8,
  },
  {
    crbm: '3º CRBM',
    grupamento: '52º GBM – Envira',
    municipio: 'Envira',
    combatente: 5,
    saude: 0,
    total: 5,
  },
  {
    crbm: '3º CRBM',
    grupamento: '58º GBM – Jutaí',
    municipio: 'Jutaí',
    combatente: 4,
    saude: 1,
    total: 5,
  },

  // 4º CRBM (Rio Negro)
  {
    crbm: '4º CRBM',
    grupamento: '64º GBM – Barcelos',
    municipio: 'Barcelos',
    combatente: 7,
    saude: 0,
    total: 7,
  },
];

export const CRBM_SUBTOTAIS = [
  { crbm: 'SUBTOTAL 1º CRBM', combatente: 48, saude: 4, total: 52 },
  { crbm: 'SUBTOTAL 2º CRBM', combatente: 170, saude: 43, total: 213 },
  { crbm: 'SUBTOTAL 3º CRBM', combatente: 71, saude: 7, total: 78 },
  { crbm: 'SUBTOTAL 4º CRBM', combatente: 7, saude: 0, total: 7 },
];

/**
 * Constrói o array canônico de efetivo (38 registros: 26 polos + 12 bases)
 * Pronto para exibição no mapa e gravação no Supabase
 */
export function getOficialEfetivoArray() {
  const result = [];

  // Polos
  MUNICIPIOS_POLO_LIST.forEach((nome) => {
    const isCap = nome === 'Manaus';
    const cbmam = BENCHMARK_PERMANENTE_CBMAM[nome] || 0;
    const opVals = BENCHMARK_MUNICIPIOS_OPERACIONAL[nome] || {};
    const opamv = opVals.opamv || 0;
    const opam_ref = opVals.opam_ref || 0;
    const prevfogo = opVals.prevfogo || 0;
    const fn = opVals.fn || 0;
    const brig_mun = opVals.brig_mun || 0;
    const brig_semas = opVals.brig_semas || 0;
    // Total em atuação na operação (Col M da planilha oficial)
    const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

    result.push({
      mun: nome,
      tipo: isCap ? 'capital' : 'interior',
      cbmam, // Efetivo CBMAM (818 no total dos polos)
      serv_ord: cbmam,
      ord: cbmam,
      servico: cbmam,
      opamv,
      opam_ref,
      prevfogo,
      fn,
      marinha: 0,
      cbmsp: 0,
      brig_mun,
      brig_semas,
      total, // 580 no total dos polos
      _custom: false,
    });
  });

  // Bases
  BASES_TEMPORARIAS_LIST.forEach((nome) => {
    const opVals = BENCHMARK_BASES_OPERACIONAL[nome] || {};
    const cbmam = 0;
    const opamv = opVals.opamv || 0;
    const opam_ref = opVals.opam_ref || 0;
    const prevfogo = opVals.prevfogo || 0;
    const fn = opVals.fn || 0;
    const brig_mun = opVals.brig_mun || 0;
    const brig_semas = opVals.brig_semas || 0;
    // Total em atuação na base (Col M da planilha oficial)
    const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

    result.push({
      mun: nome,
      tipo: 'base',
      cbmam,
      serv_ord: 0,
      ord: 0,
      servico: 0,
      opamv,
      opam_ref,
      prevfogo,
      fn,
      marinha: 0,
      cbmsp: 0,
      brig_mun,
      brig_semas,
      total, // 162 no total das bases
      _custom: false,
    });
  });

  return result;
}

// Mapeamento canônico de CRBM por município (incluindo bases temporárias vinculadas)
const BASE_CRBM_MAP = {
  'autazes posto km 53': '2º CRBM',
  anama: '2º CRBM',
  barreirinha: '2º CRBM',
  'boa vista do ramos': '2º CRBM',
  'boca do acre': '1º CRBM',
  borba: '2º CRBM',
  caapiranga: '2º CRBM',
  canutama: '1º CRBM',
  'careiro castanho': '2º CRBM',
  careiro: '2º CRBM',
  'careiro da varzea': '2º CRBM',
  'sao sebastiao do uatuma': '2º CRBM',
  urucurituba: '2º CRBM',
};

const POLO_NORM_SET = new Set(MUNICIPIOS_POLO_LIST.map((m) => norm(m)));
const BASE_NORM_SET = new Set(BASES_TEMPORARIAS_LIST.map((b) => norm(b)));

export function getCrbmByMunicipio(muniName) {
  const n = norm(muniName);
  if (!n) return null;
  if (n === 'manaus') return 'Capital';
  const entry = CRBM_DETALHAMENTO.find((c) => norm(c.municipio) === n);
  if (entry) return entry.crbm;
  if (BASE_CRBM_MAP[n]) return BASE_CRBM_MAP[n];
  return null;
}

export function getMuniTier(muniName) {
  const n = norm(muniName);
  if (n === 'manaus') return 'capital';
  if (POLO_NORM_SET.has(n)) return 'polo';
  if (BASE_NORM_SET.has(n) || n === 'careiro') return 'base';
  return 'outro';
}
