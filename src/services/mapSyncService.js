import {
  MUNICIPIOS_POLO_LIST,
  BASES_TEMPORARIAS_LIST,
  BENCHMARK_PERMANENTE_CBMAM,
  BENCHMARK_MUNICIPIOS_OPERACIONAL,
  BENCHMARK_BASES_OPERACIONAL,
  getOficialEfetivoArray,
  norm,
} from '../data/efetivoOficial';
import { OPERACAO_RECURSOS_MUNICIPIOS } from '../data/operacaoAmazonasData';
import { findCoordinates } from '../utils/spreadsheetParser';

const LOCAL_STORAGE_BACKUP_PREFIX = 'cbmam_map_supabase_backup_';

/**
 * Converte a matriz de 160 meios materiais para a estrutura da coluna `recursos` do Supabase
 */
export function buildSupabaseRecursosArray() {
  const RECURSOS_COLUMNS_KEYS = [
    'abt',
    'at',
    'aem',
    'atp',
    'ata',
    'abf',
    'atf',
    'abs',
    'abtf',
    'pipa',
    'dosa',
    'crs',
    'ar',
    'ur',
    'gse',
    'mt',
    'ta',
    'quadriciclo',
    'embarcacao',
    'picape_fn',
    'picape_muni',
    'autoarp',
    'picape_esfron',
    'helicoptero',
    'aviao',
    'jetski',
  ];
  return OPERACAO_RECURSOS_MUNICIPIOS.map((r) => {
    const row = { mun: r.mun };
    for (const k of RECURSOS_COLUMNS_KEYS) {
      row[k] = Number(r[k]) || 0;
    }
    return row;
  });
}

/**
 * Converte a matriz canônica de 742 operacionais para a coluna `efetivo` do Supabase
 */
export function buildSupabaseEfetivoArray() {
  return getOficialEfetivoArray('diario');
}

const MAP_SYNC_API = '/api/map-sync';

/**
 * Lista todas as datas disponíveis no banco de dados Supabase (ordenadas da mais recente para a mais antiga)
 */
export async function fetchAvailableDates() {
  try {
    const resp = await fetch(`${MAP_SYNC_API}?action=dates`, {
      cache: 'no-store',
    });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const json = await resp.json();
    if (!json.ok) {
      throw new Error(json.error || 'Erro ao listar datas');
    }
    return Array.isArray(json.dates) ? json.dates : [];
  } catch (err) {
    console.warn('[MapSync] Aviso ao obter datas:', err);
    return [];
  }
}

/**
 * Converte o array de efetivo de uma data do Supabase em tokens no mapa caso a data não tenha map_state explícito
 */
export function generateTokensFromEfetivo(efetivoList) {
  if (!Array.isArray(efetivoList) || efetivoList.length === 0) return null;

  const tokens = [];
  efetivoList.forEach((item) => {
    const muniName = item.mun;
    if (!muniName) return;

    const coords = findCoordinates(muniName);
    const cx = coords.x;
    const cy = coords.y;

    let offsetIdx = 0;
    const addTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;
      tokens.push({
        id: `tk-${muniName.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: muniName,
        x: Math.round(cx + offX),
        y: Math.round(cy + offY),
        count,
        label,
      });
    };

    const milCount =
      Number(item.cbmam) ||
      Number(item.servico) ||
      (Number(item.ord) || 0) +
        (Number(item.opamv) || 0) +
        (Number(item.opam_ref) || 0);

    if (milCount > 0)
      addTk('serv_ord', milCount, `${milCount} Militares CBMAM`);
    if (Number(item.cbmsp) > 0)
      addTk('serv_ord', Number(item.cbmsp), `${item.cbmsp} CBMSP`);
    if (Number(item.prevfogo) > 0)
      addTk('prevfogo', Number(item.prevfogo), `${item.prevfogo} Prevfogo`);
    if (Number(item.fn) > 0)
      addTk('fn', Number(item.fn), `${item.fn} Força Nacional`);
    if (Number(item.brig_mun) > 0)
      addTk('brigadista', Number(item.brig_mun), `${item.brig_mun} Brig. Mun.`);
    if (Number(item.brig_semas) > 0)
      addTk(
        'brigadista_sema',
        Number(item.brig_semas),
        `${item.brig_semas} Brig. SEMA`
      );
    if (!item.brig_mun && !item.brig_semas && Number(item.brig) > 0) {
      addTk('brigadista', Number(item.brig), `${item.brig} Brigadistas`);
    }
  });

  return tokens.length > 0 ? tokens : null;
}

/**
 * Converte o array de recursos de uma data do Supabase em tokens no mapa caso a data não tenha map_state explícito
 */
function generateTokensFromRecursos(recursosList) {
  if (!Array.isArray(recursosList) || recursosList.length === 0) return [];
  const tokens = [];

  recursosList.forEach((rec) => {
    const muniName = rec.mun || rec.muni;
    if (!muniName) return;

    const coords = findCoordinates(muniName);
    const cx = coords.x;
    const cy = coords.y;

    let offsetIdx = 3;
    const addTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;
      tokens.push({
        id: `tk-vtr-${muniName.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: muniName,
        x: Math.round(cx + offX),
        y: Math.round(cy + offY),
        count,
        label,
      });
    };

    if (rec.abt > 0) addTk('vtr_abt', rec.abt, `${rec.abt} ABT CBMAM`);
    const florestal =
      (rec.atf || 0) +
      (rec.abf || 0) +
      (rec.ata || 0) +
      (rec.at || 0) +
      (rec.picape_esfron || 0) +
      (rec.picape_fn || 0) +
      (rec.picape_muni || 0) +
      (rec.ar || 0);
    if (florestal > 0)
      addTk('vtr_florestal', florestal, `${florestal} Combate/Apoio Florestal`);
    const resgate =
      (rec.ur || 0) +
      (rec.abs || 0) +
      (rec.crs || 0) +
      (rec.gse || 0) +
      (rec.dosa || 0);
    if (resgate > 0) addTk('vtr_ur', resgate, `${resgate} UR / Resgate / GSE`);
    const fluvial = (rec.embarcacao || 0) + (rec.jetski || 0);
    if (fluvial > 0)
      addTk('embarcacao', fluvial, `${fluvial} Fluvial (Lancha/Jet)`);
    if (rec.helicoptero > 0)
      addTk('helicoptero', rec.helicoptero, `${rec.helicoptero} Harpia CBMAM`);
    if (rec.aviao > 0)
      addTk('air_tractor', rec.aviao, `${rec.aviao} Air Tractor`);
  });

  return tokens;
}

/**
 * Harmoniza o array de efetivo de qualquer relatório com os benchmarks oficiais
 * Garante que nunca apareçam dados zerados e que bata exatamente 742 operacionais
 */
function harmonizeWithBenchmarks(efetivoArray) {
  const baseNormSet = new Set(BASES_TEMPORARIAS_LIST.map((b) => norm(b)));
  const efMap = new Map();

  if (Array.isArray(efetivoArray)) {
    efetivoArray.forEach((r) => {
      if (!r?.mun) return;
      const isBase =
        r.tipo === 'base' ||
        norm(r.mun).includes('km 53') ||
        (r.tipo !== 'capital' &&
          r.tipo !== 'interior' &&
          baseNormSet.has(norm(r.mun)));
      efMap.set(`${isBase ? 'base' : 'mun'}:${norm(r.mun)}`, r);
    });
  }

  const harmonized = [];

  // 1. Polos (26)
  MUNICIPIOS_POLO_LIST.forEach((nome) => {
    const isCap = nome === 'Manaus';
    const key = `mun:${norm(nome)}`;
    const raw = efMap.get(key);
    const bm = BENCHMARK_MUNICIPIOS_OPERACIONAL[nome] || {};
    const bm_perm = BENCHMARK_PERMANENTE_CBMAM[nome] || 0;

    const cbmam = Number(
      raw?._custom
        ? (raw.cbmam ?? raw.serv_ord ?? bm_perm)
        : raw?.cbmam || raw?.serv_ord || bm_perm
    );
    const serv_ord = cbmam;
    const opamv = Number(
      raw?._custom ? (raw.opamv ?? bm.opamv ?? 0) : raw?.opamv || bm.opamv || 0
    );
    const opam_ref = Number(
      raw?._custom
        ? (raw.opam_ref ?? bm.opam_ref ?? 0)
        : raw?.opam_ref || bm.opam_ref || 0
    );
    const prevfogo = Number(
      raw?._custom
        ? (raw.prevfogo ?? bm.prevfogo ?? 0)
        : raw?.prevfogo || bm.prevfogo || 0
    );
    const fn = Number(
      raw?._custom ? (raw.fn ?? bm.fn ?? 0) : raw?.fn || bm.fn || 0
    );
    const brig_mun = Number(
      raw?._custom
        ? (raw.brig_mun ?? bm.brig_mun ?? 0)
        : raw?.brig_mun || bm.brig_mun || 0
    );
    const brig_semas = Number(
      raw?._custom
        ? (raw.brig_semas ?? bm.brig_semas ?? 0)
        : raw?.brig_semas || bm.brig_semas || 0
    );
    // Total em atuação na operação (Col M da planilha oficial)
    const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

    harmonized.push({
      mun: nome,
      tipo: isCap ? 'capital' : 'interior',
      serv_ord,
      ord: serv_ord,
      servico: serv_ord,
      cbmam,
      opamv,
      opam_ref,
      prevfogo,
      fn,
      marinha: 0,
      cbmsp: 0,
      brig_mun,
      brig_semas,
      total,
      _custom: !!raw?._custom,
    });
  });

  // 2. Bases (12)
  BASES_TEMPORARIAS_LIST.forEach((nome) => {
    const key = `base:${norm(nome)}`;
    const raw = efMap.get(key);
    const bm = BENCHMARK_BASES_OPERACIONAL[nome] || {};

    const opamv = Number(
      raw?._custom ? (raw.opamv ?? bm.opamv ?? 0) : raw?.opamv || bm.opamv || 0
    );
    const opam_ref = Number(
      raw?._custom
        ? (raw.opam_ref ?? bm.opam_ref ?? 0)
        : raw?.opam_ref || bm.opam_ref || 0
    );
    const prevfogo = Number(
      raw?._custom
        ? (raw.prevfogo ?? bm.prevfogo ?? 0)
        : raw?.prevfogo || bm.prevfogo || 0
    );
    const fn = Number(
      raw?._custom ? (raw.fn ?? bm.fn ?? 0) : raw?.fn || bm.fn || 0
    );
    const brig_mun = Number(
      raw?._custom
        ? (raw.brig_mun ?? bm.brig_mun ?? 0)
        : raw?.brig_mun || bm.brig_mun || 0
    );
    const brig_semas = Number(
      raw?._custom
        ? (raw.brig_semas ?? bm.brig_semas ?? 0)
        : raw?.brig_semas || bm.brig_semas || 0
    );
    // Total em atuação na base (Col M da planilha oficial)
    const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

    harmonized.push({
      mun: nome,
      tipo: 'base',
      serv_ord: 0,
      ord: 0,
      servico: 0,
      cbmam: 0,
      opamv,
      opam_ref,
      prevfogo,
      fn,
      marinha: 0,
      cbmsp: 0,
      brig_mun,
      brig_semas,
      total,
      _custom: !!raw?._custom,
    });
  });

  return harmonized;
}

/**
 * Busca o estado do mapa para uma data específica (ou o mais recente oficial se omitido)
 * Fonte: Supabase (persiste edições manuais do usuário em produção)
 */
export async function fetchRemoteMapState(targetDate = null) {
  try {
    const url = targetDate
      ? `${MAP_SYNC_API}?action=state&date=${encodeURIComponent(targetDate)}`
      : `${MAP_SYNC_API}?action=state`;

    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();
    if (!json.ok) {
      throw new Error(json.error || 'Erro ao carregar estado do banco');
    }

    const report = json.report;

    if (!report) {
      const fallbackEfetivo = getOficialEfetivoArray('diario');
      return {
        ok: true,
        reportDate: targetDate || new Date().toISOString().split('T')[0],
        tokens: generateTokensFromEfetivo(fallbackEfetivo),
        efetivo: fallbackEfetivo,
        muniStatuses: null,
        muniNotes: null,
      };
    }

    let mapState = null;
    if (report.notes) {
      try {
        const parsedNotes =
          typeof report.notes === 'string'
            ? JSON.parse(report.notes)
            : report.notes;

        if (parsedNotes && parsedNotes.map_state) {
          mapState = parsedNotes.map_state;
        }
      } catch (parseErr) {
        console.warn('[MapSync] Erro no parse de notes:', parseErr);
      }
    }

    // Harmoniza o efetivo com os 742 operacionais canônicos
    const finalEfetivo = harmonizeWithBenchmarks(report.efetivo);

    let tokens = mapState?.tokens || null;
    let muniStatuses = mapState?.muniStatuses || null;
    let muniNotes = mapState?.muniNotes || null;

    if (!tokens || tokens.length === 0) {
      const efTokens = generateTokensFromEfetivo(finalEfetivo) || [];
      const recTokens =
        Array.isArray(report.recursos) && report.recursos.length > 0
          ? generateTokensFromRecursos(report.recursos)
          : [];
      const combined = [...efTokens, ...recTokens];
      if (combined.length > 0) tokens = combined;
    }

    return {
      ok: true,
      source: 'api-map-sync',
      reportId: report.id,
      reportDate: report.report_date,
      shift: report.shift,
      hasMapState: !!mapState,
      tokens,
      muniStatuses,
      muniNotes,
      efetivo: finalEfetivo,
      recursos: report.recursos || null,
      updatedAt: mapState?.updatedAt || report.updated_at,
    };
  } catch (err) {
    console.warn('[MapSync] Aviso na comunicação com o banco:', err);
    const fallbackEfetivo = getOficialEfetivoArray('diario');
    return {
      ok: true,
      reportDate: targetDate || new Date().toISOString().split('T')[0],
      tokens: generateTokensFromEfetivo(fallbackEfetivo),
      efetivo: fallbackEfetivo,
      muniStatuses: null,
      muniNotes: null,
    };
  }
}

/**
 * Salva permanentemente o estado tático do mapa para uma data específica.
 */
export async function saveRemoteMapState({
  targetDate = null,
  tokens,
  muniStatuses,
  muniNotes,
  efetivoMatriz,
  supabaseEfetivo,
  supabaseRecursos,
  shift = 'noturno',
}) {
  const finalDate = targetDate || new Date().toISOString().split('T')[0];
  const updatedAt = new Date().toISOString();

  // 1. Gravar no armazenamento local persistente vinculado à data
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_BACKUP_PREFIX}${finalDate}`,
      JSON.stringify({
        updatedAt,
        tokens,
        muniStatuses,
        muniNotes,
      })
    );
  } catch {
    // ignore local storage backup failure
  }

  // 2. Persistência no Supabase via rota segura server-side (/api/map-sync)
  try {
    const resp = await fetch(MAP_SYNC_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveMapState',
        targetDate: finalDate,
        shift,
        mapState: {
          version: '2.0',
          updatedAt,
          reportDate: finalDate,
          tokens: Array.isArray(tokens) ? tokens : [],
          muniStatuses: muniStatuses || {},
          muniNotes: muniNotes || {},
          efetivoMatriz: efetivoMatriz || null,
        },
        efetivo: supabaseEfetivo || null,
        recursos: supabaseRecursos || null,
      }),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || !json.ok) {
      console.warn('[MapSync] Erro ao salvar estado no banco:', json.error);
      return { ok: true, offline: true, reportDate: finalDate, updatedAt };
    }

    return {
      ok: true,
      reportId: json.reportId,
      reportDate: json.reportDate || finalDate,
      updatedAt: json.updatedAt || updatedAt,
    };
  } catch (err) {
    console.warn('[MapSync] Exceção ao salvar estado no banco:', err);
    return {
      ok: true,
      offline: true,
      reportDate: finalDate,
      updatedAt,
    };
  }
}

/**
 * Salva diretamente o array de efetivo na tabela daily_reports do Supabase via /api/map-sync
 */
export async function saveRemoteEfetivo(reportDate, newEfetivo) {
  try {
    const resp = await fetch(MAP_SYNC_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveEfetivo',
        reportDate: reportDate || new Date().toISOString().split('T')[0],
        efetivo: newEfetivo,
      }),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || !json.ok) {
      const errMsg =
        json.error || `Falha HTTP ${resp.status} ao gravar no banco.`;
      console.error('[MapSync] Erro ao salvar efetivo no Supabase:', errMsg);
      return { ok: false, error: errMsg };
    }

    return {
      ok: true,
      reportId: json.reportId,
      reportDate: json.reportDate,
      updatedAt: json.updatedAt,
    };
  } catch (err) {
    console.error('[MapSync] Erro ao salvar efetivo no Supabase:', err);
    return { ok: false, error: err?.message || String(err) };
  }
}
