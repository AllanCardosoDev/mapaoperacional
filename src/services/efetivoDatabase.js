// =============================================================================
// BANCO DE DADOS REATIVO DE EFETIVO DA OPERAÇÃO AMAZONAS (CBMAM)
// Persistência Local (localStorage) + Memória + CRUD Completo + 100% Fiel à Planilha
// =============================================================================

const STORAGE_KEY_MUNICIPIOS = 'cbmam_efetivo_municipios_v2_1302';
const STORAGE_KEY_BASES = 'cbmam_efetivo_bases_v2_1302';
const STORAGE_KEY_CATEGORIES = 'cbmam_efetivo_categories_v2_1302';

// -----------------------------------------------------------------------------
// DADOS ORIGINAIS DA PLANILHA OFICIAL (TOTAL GERAL: 1.302 OPERACIONAIS)
// -----------------------------------------------------------------------------
export const DEFAULT_CATEGORIES = [
  { key: 'serv_ord', label: 'Serviço Ordinário', short: 'SV ORD', color: '#dc2626', icon: 'cbmam_shield', desc: 'Militares CBMAM' },
  { key: 'opamv', label: 'OPAM Verão (26/10)', short: 'OPAMV', color: '#f59e0b', icon: 'flame_amber', desc: 'Reforço Operação Amazonas' },
  { key: 'opam_ref', label: 'OPAM Reforço (21/10)', short: 'OPAM REF', color: '#0284c7', icon: 'shield_blue', desc: 'Reforço Operação Amazonas' },
  { key: 'inc_1', label: 'Incêndio Florestal 1 (29/10)', short: 'INC 1', color: '#ef4444', icon: 'fire_red', desc: 'Turma de Combate a Incêndio' },
  { key: 'inc_2', label: 'Incêndio Florestal 2 (17/11)', short: 'INC 2', color: '#f97316', icon: 'fire_orange', desc: 'Turma de Combate a Incêndio' },
  { key: 'inc_3', label: 'Incêndio Florestal 3 (30/10)', short: 'INC 3', color: '#eab308', icon: 'fire_yellow', desc: 'Turma de Combate a Incêndio' },
  { key: 'cbmsp', label: 'Bombeiros SP (CBMSP)', short: 'CBM SP', color: '#8b5cf6', icon: 'cbmsp_shield', desc: 'Apoio Interestadual de São Paulo' },
  { key: 'prevfogo', label: 'Prevfogo / IBAMA', short: 'PREVFOGO', color: '#10b981', icon: 'prevfogo_badge', desc: 'Brigadistas Federais IBAMA' },
  { key: 'fn', label: 'Força Nacional', short: 'FN', color: '#06b6d4', icon: 'fn_badge', desc: 'Força Nacional de Segurança Pública' },
  { key: 'icmbio', label: 'ICMBio', short: 'ICMBio', color: '#14b8a6', icon: 'icmbio_badge', desc: 'Instituto Chico Mendes de Conservação' },
  { key: 'brig_mun', label: 'Brigadista Municipal', short: 'BRIG MUN', color: '#ea580c', icon: 'brigadista_mun', desc: 'Defesa Civil Municipal' },
  { key: 'brig_sema', label: 'Brigadista SEMA', short: 'BRIG SEMA S', color: '#16a34a', icon: 'brigadista_sema', desc: 'SEMA / Governo do Amazonas' },
];

export const DEFAULT_MUNICIPIOS = [
  { id: 'muni_manaus', muni: 'Manaus', tipo: 'capital', serv_ord: 108, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 14, prevfogo: 0, fn: 9, brig_mun: 0, brig_sema: 0, icon: 'cbmam_shield', notes: 'Comando Geral & Capital' },
  { id: 'muni_apui', muni: 'Apuí', tipo: 'interior', serv_ord: 5, opamv: 2, opam_ref: 0, inc_1: 3, inc_2: 0, inc_3: 2, cbmsp: 0, prevfogo: 0, fn: 4, brig_mun: 0, brig_sema: 15, icon: 'fire_orange', notes: 'Arco do Fogo - Sul do Amazonas' },
  { id: 'muni_atalaia', muni: 'Atalaia do Norte', tipo: 'interior', serv_ord: 8, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 15, brig_sema: 0, icon: 'brigadista_mun', notes: 'Fronteira Oeste' },
  { id: 'muni_autazes', muni: 'Autazes', tipo: 'interior', serv_ord: 5, opamv: 2, opam_ref: 20, inc_1: 4, inc_2: 3, inc_3: 0, cbmsp: 0, prevfogo: 38, fn: 0, brig_mun: 13, brig_sema: 6, icon: 'prevfogo_badge', notes: 'Base Operacional Central' },
  { id: 'muni_barcelos', muni: 'Barcelos', tipo: 'interior', serv_ord: 7, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 12, brig_sema: 0, icon: 'brigadista_mun', notes: 'Calha do Rio Negro' },
  { id: 'muni_coari', muni: 'Coari', tipo: 'interior', serv_ord: 7, opamv: 2, opam_ref: 1, inc_1: 1, inc_2: 2, inc_3: 1, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 23, brig_sema: 12, icon: 'fire_red', notes: 'Médio Solimões' },
  { id: 'muni_envira', muni: 'Envira', tipo: 'interior', serv_ord: 5, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 11, brig_sema: 0, icon: 'brigadista_mun', notes: 'Sudoeste do Amazonas' },
  { id: 'muni_humaita', muni: 'Humaitá', tipo: 'interior', serv_ord: 29, opamv: 4, opam_ref: 1, inc_1: 2, inc_2: 0, inc_3: 3, cbmsp: 0, prevfogo: 0, fn: 3, brig_mun: 0, brig_sema: 15, icon: 'cbmam_shield', notes: 'Calha do Rio Madeira - Sul' },
  { id: 'muni_iranduba', muni: 'Iranduba', tipo: 'interior', serv_ord: 28, opamv: 0, opam_ref: 48, inc_1: 3, inc_2: 4, inc_3: 6, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 0, brig_sema: 0, icon: 'shield_blue', notes: 'Região Metropolitana' },
  { id: 'muni_itacoatiara', muni: 'Itacoatiara', tipo: 'interior', serv_ord: 24, opamv: 0, opam_ref: 26, inc_1: 0, inc_2: 6, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 0, brig_sema: 0, icon: 'shield_blue', notes: 'Polo Médio Amazonas' },
  { id: 'muni_itapiranga', muni: 'Itapiranga', tipo: 'interior', serv_ord: 6, opamv: 0, opam_ref: 4, inc_1: 2, inc_2: 0, inc_3: 1, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 11, brig_sema: 0, icon: 'brigadista_mun', notes: 'Interior' },
  { id: 'muni_jutai', muni: 'Jutaí', tipo: 'interior', serv_ord: 4, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 11, brig_sema: 0, icon: 'brigadista_mun', notes: 'Alto Solimões' },
  { id: 'muni_labrea', muni: 'Lábrea', tipo: 'interior', serv_ord: 5, opamv: 2, opam_ref: 0, inc_1: 3, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 4, brig_mun: 10, brig_sema: 15, icon: 'fire_orange', notes: 'Calha do Rio Purus - Arco do Fogo' },
  { id: 'muni_manaquiri', muni: 'Manaquiri', tipo: 'interior', serv_ord: 7, opamv: 5, opam_ref: 0, inc_1: 0, inc_2: 2, inc_3: 2, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 7, brig_sema: 9, icon: 'brigadista_sema', notes: 'Região Metropolitana' },
  { id: 'muni_manacapuru', muni: 'Manacapuru', tipo: 'interior', serv_ord: 30, opamv: 0, opam_ref: 5, inc_1: 3, inc_2: 6, inc_3: 1, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 0, brig_sema: 0, icon: 'cbmam_shield', notes: 'Polo Baixo Solimões' },
  { id: 'muni_manicore', muni: 'Manicoré', tipo: 'interior', serv_ord: 8, opamv: 2, opam_ref: 0, inc_1: 0, inc_2: 3, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 20, brig_sema: 7, icon: 'brigadista_mun', notes: 'Calha do Rio Madeira' },
  { id: 'muni_maues', muni: 'Maués', tipo: 'interior', serv_ord: 5, opamv: 2, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 4, cbmsp: 0, prevfogo: 14, fn: 0, brig_mun: 13, brig_sema: 0, icon: 'prevfogo_badge', notes: 'Baixo Amazonas' },
  { id: 'muni_nhamunda', muni: 'Nhamundá', tipo: 'interior', serv_ord: 1, opamv: 4, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 15, brig_sema: 0, icon: 'brigadista_mun', notes: 'Fronteira com Pará' },
  { id: 'muni_novo_airao', muni: 'Novo Airão', tipo: 'interior', serv_ord: 15, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 2, inc_3: 2, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 2, brig_sema: 0, icon: 'cbmam_shield', notes: 'Anavilhanas / Rio Negro' },
  { id: 'muni_novo_aripuana', muni: 'Novo Aripuanã', tipo: 'interior', serv_ord: 4, opamv: 4, opam_ref: 0, inc_1: 2, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 0, brig_sema: 12, icon: 'brigadista_sema', notes: 'Calha do Rio Madeira' },
  { id: 'muni_parintins', muni: 'Parintins', tipo: 'interior', serv_ord: 35, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 8, fn: 0, brig_mun: 0, brig_sema: 0, icon: 'cbmam_shield', notes: 'Polo Baixo Amazonas' },
  { id: 'muni_pres_figueiredo', muni: 'Presidente Figueiredo', tipo: 'interior', serv_ord: 26, opamv: 0, opam_ref: 0, inc_1: 1, inc_2: 9, inc_3: 3, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 3, brig_sema: 0, icon: 'fire_red', notes: 'BR-174 Norte' },
  { id: 'muni_rio_preto_eva', muni: 'Rio Preto da Eva', tipo: 'interior', serv_ord: 22, opamv: 0, opam_ref: 12, inc_1: 2, inc_2: 4, inc_3: 2, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 2, brig_sema: 0, icon: 'cbmam_shield', notes: 'AM-010 Leste' },
  { id: 'muni_tabatinga', muni: 'Tabatinga', tipo: 'interior', serv_ord: 26, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 3, brig_sema: 0, icon: 'cbmam_shield', notes: 'Tríplice Fronteira' },
  { id: 'muni_tapaua', muni: 'Tapauá', tipo: 'interior', serv_ord: 3, opamv: 2, opam_ref: 2, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 5, brig_sema: 12, icon: 'brigadista_sema', notes: 'Calha do Rio Purus' },
  { id: 'muni_tefe', muni: 'Tefé', tipo: 'interior', serv_ord: 26, opamv: 0, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, fn: 0, brig_mun: 5, brig_sema: 0, icon: 'cbmam_shield', notes: 'Polo Médio Solimões' },
];

export const DEFAULT_BASES = [
  { id: 'base_autazes_km53', base: 'Autazes Posto Km 53', muni_ref: 'Autazes', serv_ord: 0, opamv: 4, opam_ref: 22, inc_1: 0, inc_2: 0, inc_3: 2, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 0, brig_sema: 6, icon: 'base_camp', notes: 'Posto de Estrada AM-254 Km 53' },
  { id: 'base_bvr', base: 'Boa Vista do Ramos', muni_ref: 'Boa Vista do Ramos', serv_ord: 0, opamv: 0, opam_ref: 3, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 11, brig_sema: 0, icon: 'brigadista_mun', notes: 'Base Temporária Fluvial' },
  { id: 'base_boca_acre', base: 'Boca do Acre', muni_ref: 'Boca do Acre', serv_ord: 0, opamv: 4, opam_ref: 0, inc_1: 3, inc_2: 2, inc_3: 0, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 0, brig_sema: 15, icon: 'fire_orange', notes: 'Extremo Sul - Divisa Acre' },
  { id: 'base_borba', base: 'Borba', muni_ref: 'Borba', serv_ord: 0, opamv: 4, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 20, icmbio: 0, fn: 0, brig_mun: 0, brig_sema: 10, icon: 'prevfogo_badge', notes: 'PDS Axinin / TI Coata' },
  { id: 'base_caapiranga', base: 'Caapiranga', muni_ref: 'Caapiranga', serv_ord: 0, opamv: 0, opam_ref: 2, inc_1: 0, inc_2: 0, inc_3: 3, cbmsp: 11, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 3, brig_sema: 0, icon: 'cbmsp_shield', notes: 'Apoio Integrado Bombeiros SP' },
  { id: 'base_canutama', base: 'Canutama', muni_ref: 'Canutama', serv_ord: 0, opamv: 4, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 0, brig_sema: 11, icon: 'brigadista_sema', notes: 'Calha do Purus' },
  { id: 'base_careiro_castanho', base: 'Careiro Castanho', muni_ref: 'Careiro', serv_ord: 0, opamv: 3, opam_ref: 4, inc_1: 0, inc_2: 5, inc_3: 2, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 6, brig_sema: 8, icon: 'fire_orange', notes: 'BR-319 Sul' },
  { id: 'base_careiro_varzea', base: 'Careiro da Várzea', muni_ref: 'Careiro da Várzea', serv_ord: 0, opamv: 0, opam_ref: 25, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 18, icmbio: 0, fn: 0, brig_mun: 0, brig_sema: 0, icon: 'prevfogo_badge', notes: 'Área Indígena TI Sissaíma / Ponciano' },
  { id: 'base_urucurituba', base: 'Urucurituba', muni_ref: 'Urucurituba', serv_ord: 0, opamv: 2, opam_ref: 0, inc_1: 0, inc_2: 0, inc_3: 0, cbmsp: 0, prevfogo: 0, icmbio: 0, fn: 0, brig_mun: 18, brig_sema: 0, icon: 'brigadista_mun', notes: 'Médio Amazonas' },
];

// -----------------------------------------------------------------------------
// CLASSE SINGLETON GERENCIADORA DO BANCO DE DADOS
// -----------------------------------------------------------------------------
class EfetivoDatabase {
  constructor() {
    this.listeners = new Set();
    this.municipios = this.loadFromStorage(STORAGE_KEY_MUNICIPIOS, DEFAULT_MUNICIPIOS);
    this.bases = this.loadFromStorage(STORAGE_KEY_BASES, DEFAULT_BASES);
    this.categories = this.loadFromStorage(STORAGE_KEY_CATEGORIES, DEFAULT_CATEGORIES);
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
      localStorage.setItem(STORAGE_KEY_MUNICIPIOS, JSON.stringify(this.municipios));
      localStorage.setItem(STORAGE_KEY_BASES, JSON.stringify(this.bases));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
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
    this.listeners.forEach(fn => {
      try { fn(data); } catch (e) { console.error(e); }
    });
    window.dispatchEvent(new CustomEvent('cbmam-efetivo-db-change', { detail: data }));
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
    this.categories.forEach(cat => {
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
    this.municipios.forEach(m => {
      let muniSum = 0;
      const isCapital = m.tipo === 'capital' || m.muni.toLowerCase() === 'manaus';

      this.categories.forEach(cat => {
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
    this.bases.forEach(b => {
      let baseSum = 0;
      this.categories.forEach(cat => {
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
    const idx = this.municipios.findIndex(m => m.id === id || m.muni === id);
    if (idx !== -1) {
      this.municipios[idx] = { ...this.municipios[idx], ...updates };
      this.saveToStorage();
      return this.municipios[idx];
    }
    return null;
  }

  deleteMunicipio(id) {
    const initialLen = this.municipios.length;
    this.municipios = this.municipios.filter(m => m.id !== id && m.muni !== id);
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
    const idx = this.bases.findIndex(b => b.id === id || b.base === id);
    if (idx !== -1) {
      this.bases[idx] = { ...this.bases[idx], ...updates };
      this.saveToStorage();
      return this.bases[idx];
    }
    return null;
  }

  deleteBase(id) {
    const initialLen = this.bases.length;
    this.bases = this.bases.filter(b => b.id !== id && b.base !== id);
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
    const key = (catData.key || `cat_${Date.now()}`).toLowerCase().replace(/\s+/g, '_');
    if (this.categories.some(c => c.key === key)) {
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
    const idx = this.categories.findIndex(c => c.key === key);
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
      throw new Error(`A categoria '${key}' é essencial e não pode ser excluída.`);
    }
    this.categories = this.categories.filter(c => c.key !== key);
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
  exportJSON() {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      municipios: this.municipios,
      bases: this.bases,
      categories: this.categories,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbmam_efetivo_matriz_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (Array.isArray(data.municipios)) {
        this.municipios = data.municipios;
      }
      if (Array.isArray(data.bases)) {
        this.bases = data.bases;
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
}

export const efetivoDB = new EfetivoDatabase();
