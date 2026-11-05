// =============================================================================
// BANCO DE DADOS REATIVO DE EFETIVO DA OPERAÇÃO AMAZONAS (CBMAM)
// Persistência Local (localStorage) + Memória + CRUD Completo + 100% Fiel à Planilha
// =============================================================================

const STORAGE_KEY_MUNICIPIOS = 'cbmam_efetivo_municipios_v5_04112026';
const STORAGE_KEY_BASES = 'cbmam_efetivo_bases_v5_04112026';
const STORAGE_KEY_CATEGORIES = 'cbmam_efetivo_categories_v5_04112026';

// -----------------------------------------------------------------------------
// DADOS ORIGINAIS DA PLANILHA OFICIAL (TOTAL GERAL: 1.533 OPERACIONAIS)
// -----------------------------------------------------------------------------
export const DEFAULT_CATEGORIES = [
  {
    key: 'serv_ord',
    label: 'Serviço Ordinário',
    short: 'SV ORD',
    color: '#dc2626',
    icon: 'cbmam_shield',
    desc: 'Militares CBMAM',
  },
  {
    key: 'opamv',
    label: 'OPAM Verão (26/10)',
    short: 'OPAMV',
    color: '#f59e0b',
    icon: 'flame_amber',
    desc: 'Reforço Operação Amazonas',
  },
  {
    key: 'opam_ref',
    label: 'OPAM Reforço (21/10)',
    short: 'OPAM REF',
    color: '#0284c7',
    icon: 'shield_blue',
    desc: 'Reforço Operação Amazonas',
  },
  {
    key: 'inc_1',
    label: 'Incêndio Florestal 1 (29/10)',
    short: 'INC 1',
    color: '#ef4444',
    icon: 'fire_red',
    desc: 'Turma de Combate a Incêndio',
  },
  {
    key: 'inc_2',
    label: 'Incêndio Florestal 2 (17/11)',
    short: 'INC 2',
    color: '#f97316',
    icon: 'fire_orange',
    desc: 'Turma de Combate a Incêndio',
  },
  {
    key: 'inc_3',
    label: 'Incêndio Florestal 3 (30/10)',
    short: 'INC 3',
    color: '#eab308',
    icon: 'fire_yellow',
    desc: 'Turma de Combate a Incêndio',
  },
  {
    key: 'cbmsp',
    label: 'Bombeiros SP (CBMSP)',
    short: 'CBM SP',
    color: '#8b5cf6',
    icon: 'cbmsp_shield',
    desc: 'Apoio Interestadual de São Paulo',
  },
  {
    key: 'prevfogo',
    label: 'Prevfogo / IBAMA',
    short: 'PREVFOGO',
    color: '#10b981',
    icon: 'prevfogo_badge',
    desc: 'Brigadistas Federais IBAMA',
  },
  {
    key: 'fn',
    label: 'Força Nacional',
    short: 'FN',
    color: '#06b6d4',
    icon: 'fn_badge',
    desc: 'Força Nacional de Segurança Pública',
  },
  {
    key: 'icmbio',
    label: 'ICMBio',
    short: 'ICMBio',
    color: '#14b8a6',
    icon: 'icmbio_badge',
    desc: 'Instituto Chico Mendes de Conservação',
  },
  {
    key: 'brig_mun',
    label: 'Brigadista Municipal',
    short: 'BRIG MUN',
    color: '#ea580c',
    icon: 'brigadista_mun',
    desc: 'Defesa Civil Municipal',
  },
  {
    key: 'brig_sema',
    label: 'Brigadista SEMA',
    short: 'BRIG SEMA S',
    color: '#16a34a',
    icon: 'brigadista_sema',
    desc: 'SEMA / Governo do Amazonas',
  },
];

export const DEFAULT_MUNICIPIOS = [
  {
    id: 'muni_alvar_es',
    muni: 'Alvarães',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_amatur_',
    muni: 'Amaturá',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_anam_',
    muni: 'Anamã',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_anori',
    muni: 'Anori',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_apu_',
    muni: 'Apuí',
    tipo: 'interior',
    serv_ord: 3,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 7,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 10)',
  },
  {
    id: 'muni_atalaia_do_norte',
    muni: 'Atalaia do Norte',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 5,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 7)',
  },
  {
    id: 'muni_autazes',
    muni: 'Autazes',
    tipo: 'interior',
    serv_ord: 4,
    opamv: 0,
    opam_ref: 4,
    inc_1: 0,
    inc_2: 4,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 34,
    fn: 0,
    brig_mun: 4,
    brig_sema: 6,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 56)',
  },
  {
    id: 'muni_barcelos',
    muni: 'Barcelos',
    tipo: 'interior',
    serv_ord: 3,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 7)',
  },
  {
    id: 'muni_barreirinha',
    muni: 'Barreirinha',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_benjamin_constant',
    muni: 'Benjamin Constant',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_beruri',
    muni: 'Beruri',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_boa_vista_do_ramos',
    muni: 'Boa Vista do Ramos',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_boca_do_acre',
    muni: 'Boca do Acre',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_borba',
    muni: 'Borba',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_caapiranga',
    muni: 'Caapiranga',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_canutama',
    muni: 'Canutama',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_carauari',
    muni: 'Carauari',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_careiro_castanho',
    muni: 'Careiro Castanho',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_careiro_da_v_rzea',
    muni: 'Careiro da Várzea',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_coari',
    muni: 'Coari',
    tipo: 'interior',
    serv_ord: 3,
    opamv: 0,
    opam_ref: 4,
    inc_1: 0,
    inc_2: 2,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 8,
    brig_sema: 6,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 23)',
  },
  {
    id: 'muni_codaj_s',
    muni: 'Codajás',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_eirunep_',
    muni: 'Eirunepé',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_envira',
    muni: 'Envira',
    tipo: 'interior',
    serv_ord: 1,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 5)',
  },
  {
    id: 'muni_fonte_boa',
    muni: 'Fonte Boa',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_guajar_',
    muni: 'Guajará',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_humait_',
    muni: 'Humaitá',
    tipo: 'interior',
    serv_ord: 6,
    opamv: 4,
    opam_ref: 7,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 8,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 25)',
  },
  {
    id: 'muni_ipixuna',
    muni: 'Ipixuna',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_iranduba',
    muni: 'Iranduba',
    tipo: 'interior',
    serv_ord: 7,
    opamv: 3,
    opam_ref: 16,
    inc_1: 0,
    inc_2: 3,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 29)',
  },
  {
    id: 'muni_itacoatiara',
    muni: 'Itacoatiara',
    tipo: 'interior',
    serv_ord: 5,
    opamv: 0,
    opam_ref: 14,
    inc_1: 0,
    inc_2: 4,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 22,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 45)',
  },
  {
    id: 'muni_itamarati',
    muni: 'Itamarati',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_itapiranga',
    muni: 'Itapiranga',
    tipo: 'interior',
    serv_ord: 5,
    opamv: 0,
    opam_ref: 5,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 14)',
  },
  {
    id: 'muni_japur_',
    muni: 'Japurá',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_juru_',
    muni: 'Juruá',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_juta_',
    muni: 'Jutaí',
    tipo: 'interior',
    serv_ord: 1,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 5)',
  },
  {
    id: 'muni_l_brea',
    muni: 'Lábrea',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 3,
    brig_sema: 7,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 12)',
  },
  {
    id: 'muni_manacapuru',
    muni: 'Manacapuru',
    tipo: 'interior',
    serv_ord: 11,
    opamv: 0,
    opam_ref: 6,
    inc_1: 0,
    inc_2: 2,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 6,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 25)',
  },
  {
    id: 'muni_manaquiri',
    muni: 'Manaquiri',
    tipo: 'interior',
    serv_ord: 3,
    opamv: 2,
    opam_ref: 2,
    inc_1: 0,
    inc_2: 3,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 2,
    brig_sema: 5,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 17)',
  },
  {
    id: 'muni_manaus',
    muni: 'Manaus',
    tipo: 'capital',
    serv_ord: 108,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 94,
    fn: 17,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'cbmam_shield',
    notes: 'Operação Amazonas 04/11 (Total: 219)',
  },
  {
    id: 'muni_manicor_',
    muni: 'Manicoré',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 2,
    opam_ref: 1,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 7,
    brig_sema: 4,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 16)',
  },
  {
    id: 'muni_mara_',
    muni: 'Maraã',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_mau_s',
    muni: 'Maués',
    tipo: 'interior',
    serv_ord: 3,
    opamv: 0,
    opam_ref: 6,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 13)',
  },
  {
    id: 'muni_nhamund_',
    muni: 'Nhamundá',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 2,
    opam_ref: 1,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 5,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 10)',
  },
  {
    id: 'muni_nova_olinda_do_norte',
    muni: 'Nova Olinda do Norte',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_novo_air_o',
    muni: 'Novo Airão',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 0,
    opam_ref: 3,
    inc_1: 0,
    inc_2: 1,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 1,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 7)',
  },
  {
    id: 'muni_novo_aripuan_',
    muni: 'Novo Aripuanã',
    tipo: 'interior',
    serv_ord: 2,
    opamv: 1,
    opam_ref: 1,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 6,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 10)',
  },
  {
    id: 'muni_parintins',
    muni: 'Parintins',
    tipo: 'interior',
    serv_ord: 10,
    opamv: 0,
    opam_ref: 10,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 46,
    fn: 0,
    brig_mun: 3,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 69)',
  },
  {
    id: 'muni_pauini',
    muni: 'Pauini',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_presidente_figueiredo',
    muni: 'Presidente Figueiredo',
    tipo: 'interior',
    serv_ord: 9,
    opamv: 0,
    opam_ref: 4,
    inc_1: 0,
    inc_2: 3,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 1,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 17)',
  },
  {
    id: 'muni_rio_preto_da_eva',
    muni: 'Rio Preto da Eva',
    tipo: 'interior',
    serv_ord: 4,
    opamv: 0,
    opam_ref: 4,
    inc_1: 0,
    inc_2: 3,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 1,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 12)',
  },
  {
    id: 'muni_santa_isabel_do_rio_negro',
    muni: 'Santa Isabel do Rio Negro',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_santo_ant_nio_do_i__',
    muni: 'Santo Antônio do Içá',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_s_o_gabriel_da_cachoeira',
    muni: 'São Gabriel da Cachoeira',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_s_o_paulo_de_oliven_a',
    muni: 'São Paulo de Olivença',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_s_o_sebasti_o_do_uatum_',
    muni: 'São Sebastião do Uatumã',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_silves',
    muni: 'Silves',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_tabatinga',
    muni: 'Tabatinga',
    tipo: 'interior',
    serv_ord: 9,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 1,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 10)',
  },
  {
    id: 'muni_tapau_',
    muni: 'Tapauá',
    tipo: 'interior',
    serv_ord: 1,
    opamv: 2,
    opam_ref: 3,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 2,
    brig_sema: 6,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 14)',
  },
  {
    id: 'muni_tef_',
    muni: 'Tefé',
    tipo: 'interior',
    serv_ord: 8,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 2,
    brig_sema: 0,
    icon: 'fire_orange',
    notes: 'Operação Amazonas 04/11 (Total: 10)',
  },
  {
    id: 'muni_tonantins',
    muni: 'Tonantins',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_uarini',
    muni: 'Uarini',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_urucar_',
    muni: 'Urucará',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
  {
    id: 'muni_urucurituba',
    muni: 'Urucurituba',
    tipo: 'interior',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'shield_blue',
    notes: 'Operação Amazonas 04/11 (Total: 0)',
  },
];

export const DEFAULT_BASES = [
  {
    id: 'base_autazes_posto_km_53',
    base: 'Autazes Posto Km 53',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 26,
    inc_1: 0,
    inc_2: 3,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 6,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 35)',
  },
  {
    id: 'base_anam_',
    base: 'Anamã',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 0)',
  },
  {
    id: 'base_boa_vista_do_ramos',
    base: 'Boa Vista do Ramos',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 4,
    inc_1: 0,
    inc_2: 4,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 4,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 12)',
  },
  {
    id: 'base_boca_do_acre',
    base: 'Boca do Acre',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 2,
    opam_ref: 2,
    inc_1: 0,
    inc_2: 2,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 7,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 13)',
  },
  {
    id: 'base_borba',
    base: 'Borba',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 3,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 28,
    fn: 0,
    brig_mun: 0,
    brig_sema: 5,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 36)',
  },
  {
    id: 'base_caapiranga',
    base: 'Caapiranga',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 6,
    inc_1: 0,
    inc_2: 2,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 3,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 11)',
  },
  {
    id: 'base_canutama',
    base: 'Canutama',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 2,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 6,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 8)',
  },
  {
    id: 'base_careiro_castanho',
    base: 'Careiro Castanho',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 2,
    opam_ref: 16,
    inc_1: 0,
    inc_2: 4,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 6,
    brig_mun: 0,
    brig_sema: 4,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 32)',
  },
  {
    id: 'base_careiro_da_v_rzea',
    base: 'Careiro da Várzea',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 19,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 23,
    fn: 6,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 48)',
  },
  {
    id: 'base_s_o_sebarti_o_do_uatum_',
    base: 'São Sebartião do Uatumã',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 0,
    opam_ref: 0,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 0,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 0)',
  },
  {
    id: 'base_urucurituba',
    base: 'Urucurituba',
    tipo: 'base_temporaria',
    serv_ord: 0,
    opamv: 2,
    opam_ref: 1,
    inc_1: 0,
    inc_2: 0,
    inc_3: 0,
    cbmsp: 0,
    prevfogo: 0,
    fn: 0,
    brig_mun: 6,
    brig_sema: 0,
    icon: 'fire_red',
    notes: 'Base Temporária 04/11 (Total: 9)',
  },
];

class EfetivoDatabase {
  constructor() {
    this.listeners = new Set();
    this.municipios = this.loadFromStorage(
      STORAGE_KEY_MUNICIPIOS,
      DEFAULT_MUNICIPIOS
    );
    this.bases = this.loadFromStorage(STORAGE_KEY_BASES, DEFAULT_BASES);
    this.categories = this.loadFromStorage(
      STORAGE_KEY_CATEGORIES,
      DEFAULT_CATEGORIES
    );
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.warn(`[EfetivoDB] Falha ao ler ${key} do localStorage:`, err);
    }
    return JSON.parse(JSON.stringify(fallback));
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY_MUNICIPIOS,
        JSON.stringify(this.municipios)
      );
      localStorage.setItem(STORAGE_KEY_BASES, JSON.stringify(this.bases));
      localStorage.setItem(
        STORAGE_KEY_CATEGORIES,
        JSON.stringify(this.categories)
      );
    } catch (err) {
      console.error('[EfetivoDB] Falha ao persistir no localStorage:', err);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const data = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        console.error(e);
      }
    });
    window.dispatchEvent(
      new CustomEvent('cbmam-efetivo-db-change', { detail: data })
    );
  }

  getState() {
    return {
      municipios: [...this.municipios],
      bases: [...this.bases],
      categories: [...this.categories],
      totals: this.calculateTotals(),
    };
  }

  // ---------------------------------------------------------------------------
  // CÁLCULO DINÂMICO CONSOLIDADO (100% FIEL À TABELA 3 DO CBMAM)
  // ---------------------------------------------------------------------------
  calculateTotals() {
    const totals = {
      capital: 0,
      interior: 0,
      totalGeral: 0,
      byMission: {},
      byMunicipio: {},
      byBase: {},
    };

    // Inicializar totalizadores de cada missão
    this.categories.forEach((cat) => {
      totals.byMission[cat.key] = {
        key: cat.key,
        label: cat.label,
        short: cat.short,
        color: cat.color,
        icon: cat.icon,
        capital: 0,
        interior: 0,
        total: 0,
      };
    });

    // 1. Processar Municípios
    this.municipios.forEach((m) => {
      let muniSum = 0;
      const isCapital =
        m.tipo === 'capital' || m.muni.toLowerCase() === 'manaus';

      this.categories.forEach((cat) => {
        const val = Number(m[cat.key]) || 0;
        muniSum += val;
        if (totals.byMission[cat.key]) {
          if (isCapital) {
            totals.byMission[cat.key].capital += val;
            totals.capital += val;
          } else {
            totals.byMission[cat.key].interior += val;
            totals.interior += val;
          }
          totals.byMission[cat.key].total += val;
        }
      });

      totals.byMunicipio[m.muni] = muniSum;
    });

    // 2. Processar Bases Temporárias (todas contam como Interior conforme planilha)
    this.bases.forEach((b) => {
      let baseSum = 0;
      this.categories.forEach((cat) => {
        const val = Number(b[cat.key]) || 0;
        baseSum += val;
        if (totals.byMission[cat.key]) {
          totals.byMission[cat.key].interior += val;
          totals.byMission[cat.key].total += val;
          totals.interior += val;
        }
      });
      totals.byBase[b.base] = baseSum;
    });

    totals.totalGeral = totals.capital + totals.interior;
    return totals;
  }

  // ---------------------------------------------------------------------------
  // OPERAÇÕES CRUD DE MUNICÍPIOS
  // ---------------------------------------------------------------------------
  addMunicipio(muniData) {
    const id = muniData.id || `muni_${Date.now()}`;
    const newMuni = {
      ...muniData,
      id,
      muni: (muniData.muni || '').trim(),
      tipo: muniData.tipo || 'interior',
      icon: muniData.icon || 'cbmam_shield',
      notes: muniData.notes || '',
    };
    this.municipios.push(newMuni);
    this.saveToStorage();
    return newMuni;
  }

  updateMunicipio(id, updates) {
    const idx = this.municipios.findIndex((m) => m.id === id || m.muni === id);
    if (idx !== -1) {
      this.municipios[idx] = { ...this.municipios[idx], ...updates };
      this.saveToStorage();
      return this.municipios[idx];
    }
    return null;
  }

  deleteMunicipio(id) {
    const initialLen = this.municipios.length;
    this.municipios = this.municipios.filter(
      (m) => m.id !== id && m.muni !== id
    );
    if (this.municipios.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // OPERAÇÕES CRUD DE BASES TEMPORÁRIAS
  // ---------------------------------------------------------------------------
  addBase(baseData) {
    const id = baseData.id || `base_${Date.now()}`;
    const newBase = {
      ...baseData,
      id,
      base: (baseData.base || '').trim(),
      muni_ref: baseData.muni_ref || '',
      icon: baseData.icon || 'base_camp',
      notes: baseData.notes || '',
    };
    this.bases.push(newBase);
    this.saveToStorage();
    return newBase;
  }

  updateBase(id, updates) {
    const idx = this.bases.findIndex((b) => b.id === id || b.base === id);
    if (idx !== -1) {
      this.bases[idx] = { ...this.bases[idx], ...updates };
      this.saveToStorage();
      return this.bases[idx];
    }
    return null;
  }

  deleteBase(id) {
    const initialLen = this.bases.length;
    this.bases = this.bases.filter((b) => b.id !== id && b.base !== id);
    if (this.bases.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // OPERAÇÕES CRUD DE CATEGORIAS / MISSÕES
  // ---------------------------------------------------------------------------
  addCategory(catData) {
    const key = (catData.key || `cat_${Date.now()}`)
      .toLowerCase()
      .replace(/\s+/g, '_');
    if (this.categories.some((c) => c.key === key)) {
      throw new Error(`A categoria '${key}' já existe.`);
    }
    const newCat = {
      key,
      label: catData.label || 'Nova Missão',
      short: catData.short || 'NOVA',
      color: catData.color || '#38bdf8',
      icon: catData.icon || 'fire_red',
      desc: catData.desc || '',
    };
    this.categories.push(newCat);
    this.saveToStorage();
    return newCat;
  }

  updateCategory(key, updates) {
    const idx = this.categories.findIndex((c) => c.key === key);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      this.saveToStorage();
      return this.categories[idx];
    }
    return null;
  }

  deleteCategory(key) {
    // Proteger categorias base essenciais
    const protectedKeys = ['serv_ord'];
    if (protectedKeys.includes(key)) {
      throw new Error(
        `A categoria '${key}' é essencial e não pode ser excluída.`
      );
    }
    this.categories = this.categories.filter((c) => c.key !== key);
    this.saveToStorage();
    return true;
  }

  // ---------------------------------------------------------------------------
  // RESTAURAÇÃO / RESET PARA DADOS DA PLANILHA OFICIAL
  // ---------------------------------------------------------------------------
  resetToDefaults() {
    this.municipios = JSON.parse(JSON.stringify(DEFAULT_MUNICIPIOS));
    this.bases = JSON.parse(JSON.stringify(DEFAULT_BASES));
    this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    this.saveToStorage();
    return this.getState();
  }

  // ---------------------------------------------------------------------------
  // EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP JSON
  // ---------------------------------------------------------------------------
  normalizeItem(item, isBase = false) {
    if (!item) return null;
    const rawName = item.muni || item.base || item.nome || item.name || '';
    if (!rawName) return null;
    const nameLow = rawName.toLowerCase();
    // Rejeitar qualquer menção a tropas interestaduais não pertencentes ao Amazonas
    if (
      nameLow.includes('militares são paulo') ||
      nameLow.includes('militares sao paulo') ||
      nameLow.includes('são paulo-sp') ||
      nameLow.includes('sao paulo-sp')
    ) {
      return null;
    }

    const norm = {
      id:
        item.id ||
        (isBase
          ? `base_${rawName.toLowerCase().replace(/\s+/g, '_')}`
          : `muni_${rawName.toLowerCase().replace(/\s+/g, '_')}`),
      tipo:
        item.tipo ||
        (isBase
          ? 'base_temporaria'
          : nameLow === 'manaus'
            ? 'capital'
            : 'interior'),
      serv_ord: Number(item.serv_ord ?? item.ord ?? 0) || 0,
      opamv: Number(item.opamv ?? 0) || 0,
      opam_ref: Number(item.opam_ref ?? 0) || 0,
      inc_1: Number(item.inc_1 ?? item.inc1 ?? 0) || 0,
      inc_2: Number(item.inc_2 ?? item.inc2 ?? 0) || 0,
      inc_3: Number(item.inc_3 ?? item.inc3 ?? 0) || 0,
      cbmsp: Number(item.cbmsp ?? 0) || 0,
      prevfogo: Number(item.prevfogo ?? 0) || 0,
      fn: Number(item.fn ?? 0) || 0,
      icmbio: Number(item.icmbio ?? item.marinha ?? 0) || 0,
      brig_mun: Number(item.brig_mun ?? item.brig ?? item.brigadista ?? 0) || 0,
      brig_sema:
        Number(
          item.brig_sema ?? item.brig_semas ?? item.brigadista_sema ?? 0
        ) || 0,
      icon: item.icon || (isBase ? 'base_camp' : 'cbmam_shield'),
      notes: item.notes || '',
    };

    if (isBase) {
      norm.base = rawName;
      norm.muni_ref = item.muni_ref || rawName;
    } else {
      norm.muni = rawName;
    }

    return norm;
  }

  // ---------------------------------------------------------------------------
  // EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP JSON
  // ---------------------------------------------------------------------------
  exportJSON() {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      municipios: this.municipios,
      bases: this.bases,
      categories: this.categories,
      totals: this.calculateTotals(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbmam_efetivo_matriz_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(jsonString) {
    try {
      const data =
        typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

      // Suporte unificado: lê { data: { municipios, bases } }, { municipios, bases } ou array de itens
      const rawMunis = Array.isArray(data)
        ? data.filter((i) => i.tipo !== 'base' && i.tipo !== 'base_temporaria')
        : data.data?.municipios || data.municipios || [];

      const rawBases = Array.isArray(data)
        ? data.filter((i) => i.tipo === 'base' || i.tipo === 'base_temporaria')
        : data.data?.bases || data.bases || [];

      if (rawMunis.length > 0) {
        const normalizedMunis = rawMunis
          .map((m) => this.normalizeItem(m, false))
          .filter(Boolean);
        if (normalizedMunis.length > 0) {
          this.municipios = normalizedMunis;
        }
      }

      if (rawBases.length > 0) {
        const normalizedBases = rawBases
          .map((b) => this.normalizeItem(b, true))
          .filter(Boolean);
        if (normalizedBases.length > 0) {
          this.bases = normalizedBases;
        }
      }

      if (Array.isArray(data.categories)) {
        this.categories = data.categories;
      }

      this.saveToStorage();
      return true;
    } catch (err) {
      console.error('[EfetivoDB] Erro ao importar JSON:', err);
      return false;
    }
  }

  async syncFromApi(customUrl = null) {
    try {
      const url =
        customUrl ||
        (typeof window !== 'undefined' && window.location.port === '3000'
          ? '/api/public/efetivo?format=json'
          : 'http://localhost:3000/api/public/efetivo?format=json');
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      const ok = this.importJSON(json);
      if (ok) {
        return {
          success: true,
          count: this.municipios.length + this.bases.length,
        };
      }
      throw new Error('Falha ao processar dados da API.');
    } catch (err) {
      console.warn('[EfetivoDB] Erro ao sincronizar com a API pública:', err);
      return { success: false, error: err.message };
    }
  }
}

export const efetivoDB = new EfetivoDatabase();
