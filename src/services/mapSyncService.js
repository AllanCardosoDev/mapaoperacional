import { supabase } from './supabaseClient';
import {
  OPERACAO_EFETIVO_MUNICIPIOS,
  OPERACAO_RECURSOS_MUNICIPIOS,
} from '../data/operacaoAmazonasData';
import { AMAZONAS_DATA } from '../data/amazonasData';

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
 * Converte a matriz de 886 operacionais para a estrutura da coluna `efetivo` do Supabase
 */
export function buildSupabaseEfetivoArray() {
  return OPERACAO_EFETIVO_MUNICIPIOS.map((item) => {
    return {
      mun: item.muni,
      ord: item.serv_ord || 0,
      seg: item.seg || 0,
      brig: (item.brigadista || 0) + (item.brigadista_sema || 0),
      servico: item.serv_ord || 0,
      opamv: item.opam || 0,
      opam_ref: item.opam_extra || 0,
      inc1: 0,
      inc2: item.inc2 || 0,
      inc3: 0,
      cbmsp: 0,
      prevfogo: item.prevfogo || 0,
      fn: item.fn || 0,
      marinha: 0,
      brig_mun: item.brigadista || 0,
      brig_semas: item.brigadista_sema || 0,
      cbmam: item.cbmam_militares || item.serv_ord || 0,
    };
  });
}

/**
 * Lista todas as datas disponíveis no banco de dados Supabase (ordenadas da mais recente para a mais antiga)
 */
export async function fetchAvailableDates() {
  try {
    const { data: rows, error } = await supabase
      .from('daily_reports')
      .select('report_date, shift, updated_at')
      .order('report_date', { ascending: false })
      .order('shift', { ascending: false });

    if (error) {
      console.warn(
        '[MapSync] Erro ao buscar datas no Supabase:',
        error.message
      );
      return [];
    }

    // Filtrar datas futuras de teste (> 2026-11-10) e agrupar únicas
    const dateMap = new Map();
    (rows || []).forEach((r) => {
      if (!r.report_date || r.report_date > '2026-11-10') return;
      if (!dateMap.has(r.report_date)) {
        dateMap.set(r.report_date, {
          date: r.report_date,
          shift: r.shift,
          updatedAt: r.updated_at,
        });
      }
    });

    return Array.from(dateMap.values());
  } catch (err) {
    console.error('[MapSync] Falha ao obter datas:', err);
    return [];
  }
}

/**
 * Converte o array de efetivo de uma data do Supabase em tokens no mapa caso a data não tenha map_state explícito
 */
function generateTokensFromEfetivo(efetivoList) {
  if (!Array.isArray(efetivoList) || efetivoList.length === 0) return null;

  const tokens = [];
  efetivoList.forEach((item) => {
    const muniName = item.mun;
    if (!muniName) return;

    const mObj = AMAZONAS_DATA.municipalities.find(
      (m) =>
        m.name.toLowerCase() === muniName.toLowerCase() ||
        muniName.toLowerCase().includes(m.name.toLowerCase())
    );
    const cx = mObj ? mObj.cx : 520;
    const cy = mObj ? mObj.cy : 480;

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
      item.cbmam ||
      0 ||
      item.servico ||
      0 ||
      (item.ord || 0) +
        (item.opamv || 0) +
        (item.opam_ref || 0) +
        (item.inc2 || 0);

    if (milCount > 0)
      addTk('serv_ord', milCount, `${milCount} Militares CBMAM`);
    if (item.prevfogo > 0)
      addTk('prevfogo', item.prevfogo, `${item.prevfogo} Prevfogo`);
    if (item.fn > 0) addTk('fn', item.fn, `${item.fn} Força Nacional`);
    if (item.brig_mun > 0)
      addTk('brigadista', item.brig_mun, `${item.brig_mun} Brig. Mun.`);
    if (item.brig_semas > 0)
      addTk(
        'brigadista_sema',
        item.brig_semas,
        `${item.brig_semas} Brig. SEMA`
      );
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

    const mObj = AMAZONAS_DATA.municipalities.find(
      (m) =>
        m.name.toLowerCase() === muniName.toLowerCase() ||
        muniName.toLowerCase().includes(m.name.toLowerCase())
    );
    const cx = mObj ? mObj.cx : 520;
    const cy = mObj ? mObj.cy : 480;

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
 * Busca o estado do mapa para uma data específica (ou o mais recente oficial se omitido)
 */
export async function fetchRemoteMapState(targetDate = null) {
  try {
    let query = supabase
      .from('daily_reports')
      .select(
        'id, report_date, shift, notes, efetivo, recursos, version, updated_at'
      );

    if (targetDate) {
      query = query.eq('report_date', targetDate);
    } else {
      query = query
        .lte('report_date', '2026-11-05')
        .order('report_date', { ascending: false });
    }

    const { data: rows, error } = await query
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('[MapSync] Erro ao buscar relatório:', error.message);
      return { ok: false, error: error.message };
    }

    if (!rows || rows.length === 0) {
      return { ok: false, empty: true, targetDate };
    }

    const report = rows[0];
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

    // Se a data já tinha map_state com tokens salvos, usa diretamente
    let tokens = mapState?.tokens || null;
    let muniStatuses = mapState?.muniStatuses || null;
    let muniNotes = mapState?.muniNotes || null;

    // Se não tinha map_state explícito mas possui efetivo/recursos estruturado no banco, sintetiza os tokens
    if (!tokens) {
      const efTokens =
        Array.isArray(report.efetivo) && report.efetivo.length > 0
          ? generateTokensFromEfetivo(report.efetivo)
          : [];
      const recTokens =
        Array.isArray(report.recursos) && report.recursos.length > 0
          ? generateTokensFromRecursos(report.recursos)
          : [];
      const combined = [...(efTokens || []), ...(recTokens || [])];
      if (combined.length > 0) tokens = combined;
    }

    return {
      ok: true,
      reportId: report.id,
      reportDate: report.report_date,
      shift: report.shift,
      hasMapState: !!mapState,
      tokens,
      muniStatuses,
      muniNotes,
      efetivo: report.efetivo || null,
      recursos: report.recursos || null,
      updatedAt: mapState?.updatedAt || report.updated_at,
    };
  } catch (err) {
    console.error('[MapSync] Falha na comunicação com Supabase:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Salva permanentemente o estado tático do mapa para uma data específica no Supabase
 * Se o registro já existir, atualiza; caso contrário, insere um novo registro.
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
  try {
    const finalDate = targetDate || '2026-11-03';

    // 1. Verificar se já existe registro para esta data
    const { data: existingRows, error: searchErr } = await supabase
      .from('daily_reports')
      .select('id, notes, efetivo, recursos, version')
      .eq('report_date', finalDate)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (searchErr) {
      console.error('[MapSync] Erro ao consultar data no Supabase:', searchErr);
      return { ok: false, error: searchErr.message };
    }

    const updatedAt = new Date().toISOString();
    const existing =
      existingRows && existingRows.length > 0 ? existingRows[0] : null;

    let notesObj = {};
    if (existing && existing.notes) {
      try {
        notesObj =
          typeof existing.notes === 'string'
            ? JSON.parse(existing.notes)
            : existing.notes;
      } catch {
        notesObj = {};
      }
    }

    notesObj.map_state = {
      version: '2.0',
      updatedAt,
      reportDate: finalDate,
      tokens: Array.isArray(tokens) ? tokens : [],
      muniStatuses: muniStatuses || {},
      muniNotes: muniNotes || {},
      efetivoMatriz: efetivoMatriz || null,
    };

    const finalEfetivo =
      supabaseEfetivo ||
      (existing?.efetivo ? existing.efetivo : buildSupabaseEfetivoArray());

    const finalRecursos =
      supabaseRecursos ||
      (existing?.recursos && existing.recursos.length > 0
        ? existing.recursos
        : buildSupabaseRecursosArray());

    let reportId = null;

    if (existing) {
      // Atualiza registro existente
      const { error: updErr } = await supabase
        .from('daily_reports')
        .update({
          notes: JSON.stringify(notesObj),
          efetivo: finalEfetivo,
          recursos: finalRecursos,
          updated_at: updatedAt,
        })
        .eq('id', existing.id);

      if (updErr) {
        console.error('[MapSync] Erro ao atualizar no Supabase:', updErr);
        return { ok: false, error: updErr.message };
      }
      reportId = existing.id;
    } else {
      // Insere novo registro para a data no Supabase
      const { data: inserted, error: insErr } = await supabase
        .from('daily_reports')
        .insert({
          report_date: finalDate,
          shift,
          notes: JSON.stringify(notesObj),
          efetivo: finalEfetivo,
          recursos: finalRecursos,
          incendios: [],
          outras: [],
          version: 1,
          created_at: updatedAt,
          updated_at: updatedAt,
        })
        .select('id')
        .single();

      if (insErr) {
        console.error(
          '[MapSync] Erro ao inserir nova data no Supabase:',
          insErr
        );
        return { ok: false, error: insErr.message };
      }
      reportId = inserted?.id;
    }

    // Backup local no localStorage vinculado à data
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
      // ignore
    }

    return {
      ok: true,
      reportId,
      reportDate: finalDate,
      updatedAt,
    };
  } catch (err) {
    console.error('[MapSync] Exceção ao salvar no Supabase:', err);
    return { ok: false, error: err.message };
  }
}
