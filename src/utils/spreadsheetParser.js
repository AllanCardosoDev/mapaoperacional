import * as XLSX from 'xlsx';
import { AMAZONAS_DATA } from '../data/amazonasData.js';
import { OPERACAO_RECURSOS_MUNICIPIOS } from '../data/operacaoAmazonasData.js';

/**
 * Extrai a data no formato YYYY-MM-DD a partir do nome do arquivo ou conteúdo
 */
export function extractDateFromSpreadsheet(fileName, sheetHeader = '') {
  // 1. Tentar padrão do nome: "03.11.2026 ...", "03-11-2026 ...", "2026-11-03 ..."
  const m1 = fileName.match(/(\d{2})[.\-/](\d{2})[.\-/](\d{4})/);
  if (m1) {
    return `${m1[3]}-${m1[2]}-${m1[1]}`;
  }
  const mIso = fileName.match(/(\d{4})[.\-/](\d{2})[.\-/](\d{2})/);
  if (mIso) {
    return `${mIso[1]}-${mIso[2]}-${mIso[3]}`;
  }

  // 2. Tentar padrão de texto dentro da planilha: "03 / NOV / 2026"
  const mTxt = sheetHeader.match(
    /(\d{1,2})\s*\/?\s*([A-Za-zçÇ]{3,4})\s*\/?\s*(\d{4})/i
  );
  if (mTxt) {
    const day = mTxt[1].padStart(2, '0');
    const monStr = mTxt[2].toLowerCase();
    const months = {
      jan: '01',
      fev: '02',
      mar: '03',
      abr: '04',
      mai: '05',
      jun: '06',
      jul: '07',
      ago: '08',
      set: '09',
      out: '10',
      nov: '11',
      dez: '12',
    };
    const mon = months[monStr.slice(0, 3)] || '11';
    const year = mTxt[3];
    return `${year}-${mon}-${day}`;
  }

  // 3. Fallback: data de hoje
  return new Date().toISOString().slice(0, 10);
}

/**
 * Localiza as coordenadas centrais do município para posicionamento dos ícones
 */
function findCoordinates(muniName) {
  if (!muniName) return { x: 500, y: 500 };
  const clean = muniName.trim().toLowerCase();

  // Tratamento especial para bases conhecidas
  if (clean.includes('posto km 53') || clean.includes('km 53')) {
    const autazes = AMAZONAS_DATA.municipalities.find(
      (m) => m.name === 'Autazes'
    );
    return autazes
      ? { x: autazes.cx + 25, y: autazes.cy + 15 }
      : { x: 620, y: 490 };
  }
  if (
    clean.includes('careiro da várzea') ||
    clean.includes('careiro da varzea')
  ) {
    const cv = AMAZONAS_DATA.municipalities.find(
      (m) =>
        m.name.toLowerCase().includes('várzea') ||
        m.name.toLowerCase().includes('varzea')
    );
    return cv ? { x: cv.cx, y: cv.cy } : { x: 580, y: 460 };
  }
  if (clean.includes('careiro castanho')) {
    const c = AMAZONAS_DATA.municipalities.find((m) => m.name === 'Careiro');
    return c ? { x: c.cx, y: c.cy } : { x: 550, y: 490 };
  }

  const direct = AMAZONAS_DATA.municipalities.find(
    (m) => m.name.toLowerCase() === clean
  );
  if (direct) return { x: direct.cx, y: direct.cy };

  const partial = AMAZONAS_DATA.municipalities.find(
    (m) =>
      clean.includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(clean)
  );
  if (partial) return { x: partial.cx, y: partial.cy };

  return { x: 520, y: 480 };
}

/**
 * Processa o ArrayBuffer ou Uint8Array de um arquivo .xlsx e gera a estrutura completa
 */
export function parseSpreadsheetBuffer(buffer, fileName = '') {
  const wb = XLSX.read(buffer, { type: 'array' });

  // 1. Procurar a aba principal de relatório / efetivo
  const candidateNames = [
    'RELATORIO',
    'RELATORIO1',
    'RELATÓRIO',
    'EFETIVO TOTAL ',
    'EFETIVO',
    'DADOS',
  ];
  let sheetName = candidateNames.find((n) => wb.SheetNames.includes(n));
  if (!sheetName) {
    sheetName = wb.SheetNames[0];
  }

  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error('Aba de dados não encontrada na planilha.');

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  // 2. Extrair data do relatório
  let headerText = '';
  for (let r = 0; r < Math.min(10, rows.length); r++) {
    headerText += ' ' + (rows[r] ? rows[r].join(' ') : '');
  }
  const reportDate = extractDateFromSpreadsheet(fileName, headerText);

  // 3. Localizar linha de cabeçalho dos municípios
  let muniStartRow = -1;
  for (let r = 0; r < Math.min(25, rows.length); r++) {
    const row = rows[r] || [];
    const text = row.map((c) => String(c || '').toUpperCase()).join(' ');
    if (text.includes('MUNICÍPIO') || text.includes('MUNICIPIO')) {
      muniStartRow = r + 1;
      break;
    }
  }

  if (muniStartRow === -1) muniStartRow = 8; // Linha 8 por padrão

  const parsedMunis = [];
  const parsedBases = [];

  // Ler municípios permanentes (lado esquerdo)
  for (let r = muniStartRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;
    const name = String(row[1] || row[0] || '').trim();
    if (
      !name ||
      name.toUpperCase() === 'TOTAL' ||
      name.toUpperCase() === 'MUNICÍPIO'
    ) {
      if (name.toUpperCase() === 'TOTAL') break;
      continue;
    }

    // Se for cabeçalho de viaturas
    if (
      name.toUpperCase().includes('ABT') ||
      name.toUpperCase().includes('VIATURAS')
    ) {
      break;
    }

    const ef_permanente = Number(row[2]) || 0;
    const serv_ord = Number(row[3]) || 0;
    const opam = Number(row[4]) || 0;
    const opam_extra = Number(row[5]) || 0;
    const inc1 = Number(row[6]) || 0;
    const inc2 = Number(row[7]) || 0;
    const inc3 = Number(row[8]) || 0;
    const cbmsp = Number(row[9]) || 0;
    const prevfogo = Number(row[10]) || 0;
    const fn = Number(row[11]) || 0;
    const brig_mun = Number(row[12]) || 0;
    const brig_sema = Number(row[13]) || 0;
    const marinha = Number(row[14]) || 0;
    const total =
      Number(row[15]) ||
      serv_ord +
        opam +
        opam_extra +
        inc1 +
        inc2 +
        inc3 +
        cbmsp +
        prevfogo +
        fn +
        brig_mun +
        brig_sema +
        marinha;

    parsedMunis.push({
      muni: name,
      ef_permanente,
      serv_ord,
      opam,
      opam_extra,
      inc1,
      inc2,
      inc3,
      cbmsp,
      prevfogo,
      fn,
      brigadista: brig_mun,
      brigadista_sema: brig_sema,
      marinha,
      cbmam_militares: serv_ord + opam + opam_extra + inc1 + inc2 + inc3,
      total,
      tipo: name.toLowerCase() === 'manaus' ? 'capital' : 'interior',
    });
  }

  // Ler bases temporárias (lado direito, colunas 16+)
  for (let r = muniStartRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;
    const baseName = String(row[17] || row[16] || '').trim();
    if (
      !baseName ||
      baseName.toUpperCase() === 'TOTAL' ||
      baseName.toUpperCase() === 'BASES TEMPORÁRIAS'
    ) {
      if (baseName.toUpperCase() === 'TOTAL') break;
      continue;
    }

    const opam = Number(row[21]) || 0;
    const opam_extra = Number(row[22]) || 0;
    const inc1 = Number(row[23]) || 0;
    const inc2 = Number(row[24]) || 0;
    const inc3 = Number(row[25]) || 0;
    const cbmsp = Number(row[26]) || 0;
    const prevfogo = Number(row[27]) || 0;
    const fn = Number(row[28]) || 0;
    const brig_mun = Number(row[29]) || 0;
    const brig_sema = Number(row[30]) || 0;
    const marinha = Number(row[31]) || 0;
    const total =
      Number(row[32]) ||
      opam +
        opam_extra +
        inc1 +
        inc2 +
        inc3 +
        cbmsp +
        prevfogo +
        fn +
        brig_mun +
        brig_sema +
        marinha;

    parsedBases.push({
      muni: baseName,
      base: baseName,
      ef_permanente: 0,
      serv_ord: 0,
      opam,
      opam_extra,
      inc1,
      inc2,
      inc3,
      cbmsp,
      prevfogo,
      fn,
      brigadista: brig_mun,
      brigadista_sema: brig_sema,
      marinha,
      cbmam_militares: opam + opam_extra + inc1 + inc2 + inc3,
      total,
      tipo: 'base_temporaria',
    });
  }

  const allPersonnel = [...parsedMunis, ...parsedBases];

  // 3. Ler Tabela de RECURSOS / VIATURAS (linhas seguintes de RELATORIO1)
  let recursosHeaderRow = -1;
  for (let r = 20; r < rows.length; r++) {
    const row = rows[r] || [];
    const text = row.map((c) => String(c || '').toUpperCase()).join(' ');
    if (
      (text.includes('ABT') && text.includes('ATF')) ||
      (text.includes('RECURSOS') && text.includes('MUNICÍPIO')) ||
      (text.includes('ABT') && text.includes('AR'))
    ) {
      recursosHeaderRow = r;
      break;
    }
  }

  const parsedRecursos = [];
  if (recursosHeaderRow !== -1) {
    const headerRow = rows[recursosHeaderRow];
    const colMap = {};
    headerRow.forEach((cell, idx) => {
      const clean = String(cell || '')
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '');

      if (clean === 'ABT') colMap.abt = idx;
      else if (clean === 'AT') colMap.at = idx;
      else if (clean === 'ATP') colMap.atp = idx;
      else if (clean === 'ATA') colMap.ata = idx;
      else if (clean === 'ABF') colMap.abf = idx;
      else if (clean === 'ATF') colMap.atf = idx;
      else if (clean === 'ABS') colMap.abs = idx;
      else if (clean === 'PIPA') colMap.pipa = idx;
      else if (clean === 'DOSA') colMap.dosa = idx;
      else if (clean === 'CRS') colMap.crs = idx;
      else if (clean === 'AR') colMap.ar = idx;
      else if (clean === 'UR') colMap.ur = idx;
      else if (clean === 'GSE') colMap.gse = idx;
      else if (clean === 'MT') colMap.mt = idx;
      else if (clean === 'TA') colMap.ta = idx;
      else if (clean.includes('EMBARC')) colMap.embarcacao = idx;
      else if (clean.includes('PICAPEFN')) colMap.picape_fn = idx;
      else if (clean.includes('PICAPEMUNI')) colMap.picape_muni = idx;
      else if (clean.includes('AUTOARP')) colMap.autoarp = idx;
      else if (clean.includes('ESFRON')) colMap.picape_esfron = idx;
      else if (clean.includes('HELIC')) colMap.helicoptero = idx;
      else if (clean.includes('AVIAO')) colMap.aviao = idx;
      else if (clean.includes('JETSKI')) colMap.jetski = idx;
      else if (clean.includes('QUADRI')) colMap.quadriciclo = idx;
      else if (clean === 'AEM') colMap.aem = idx;
      else if (clean === 'TOTAL') colMap.total = idx;
    });

    for (let r = recursosHeaderRow + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;
      const muniName = String(row[1] || row[0] || '').trim();
      if (!muniName || muniName.toUpperCase().includes('TOTAL')) {
        if (muniName.toUpperCase().includes('TOTAL')) break;
        continue;
      }

      const rec = {
        muni: muniName,
        abt: Number(row[colMap.abt]) || 0,
        at: Number(row[colMap.at]) || 0,
        atp: Number(row[colMap.atp]) || 0,
        ata: Number(row[colMap.ata]) || 0,
        abf: Number(row[colMap.abf]) || 0,
        atf: Number(row[colMap.atf]) || 0,
        abs: Number(row[colMap.abs]) || 0,
        pipa: Number(row[colMap.pipa]) || 0,
        dosa: Number(row[colMap.dosa]) || 0,
        crs: Number(row[colMap.crs]) || 0,
        ar: Number(row[colMap.ar]) || 0,
        ur: Number(row[colMap.ur]) || 0,
        gse: Number(row[colMap.gse]) || 0,
        mt: Number(row[colMap.mt]) || 0,
        ta: Number(row[colMap.ta]) || 0,
        embarcacao: Number(row[colMap.embarcacao]) || 0,
        picape_fn: Number(row[colMap.picape_fn]) || 0,
        picape_muni: Number(row[colMap.picape_muni]) || 0,
        autoarp: Number(row[colMap.autoarp]) || 0,
        picape_esfron: Number(row[colMap.picape_esfron]) || 0,
        helicoptero: Number(row[colMap.helicoptero]) || 0,
        aviao: Number(row[colMap.aviao]) || 0,
        jetski: Number(row[colMap.jetski]) || 0,
        quadriciclo: Number(row[colMap.quadriciclo]) || 0,
        aem: Number(row[colMap.aem]) || 0,
      };

      const rowTotal =
        Number(row[colMap.total]) ||
        rec.abt +
          rec.at +
          rec.atp +
          rec.ata +
          rec.abf +
          rec.atf +
          rec.abs +
          rec.pipa +
          rec.dosa +
          rec.crs +
          rec.ar +
          rec.ur +
          rec.gse +
          rec.mt +
          rec.ta +
          rec.embarcacao +
          rec.picape_fn +
          rec.picape_muni +
          rec.autoarp +
          rec.picape_esfron +
          rec.helicoptero +
          rec.aviao +
          rec.jetski +
          rec.quadriciclo +
          rec.aem;

      rec.total = rowTotal;
      if (rowTotal > 0 || muniName.length > 2) {
        parsedRecursos.push(rec);
      }
    }
  }

  // Fallback se não encontrou recursos na planilha
  const effectiveRecursos =
    parsedRecursos.length > 0
      ? parsedRecursos
      : OPERACAO_RECURSOS_MUNICIPIOS.map((r) => ({
          ...r,
          muni: r.mun,
        }));

  // 4. Gerar tokens táticos posicionados no mapa (Efetivo + Viaturas + Aeronaves)
  const tokens = [];
  const muniStatuses = {};
  const muniNotes = {};

  allPersonnel.forEach((item) => {
    const name = item.muni;
    const coords = findCoordinates(name);
    let offsetIdx = 0;

    const pushTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;

      tokens.push({
        id: `tk-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: name,
        x: Math.round(coords.x + offX),
        y: Math.round(coords.y + offY),
        count,
        label,
      });
    };

    // Militares CBMAM
    const milTotal = item.cbmam_militares || 0;
    if (milTotal > 0) {
      pushTk('serv_ord', milTotal, `${milTotal} Militares CBMAM`);
    }

    // Prevfogo
    if (item.prevfogo > 0) {
      pushTk('prevfogo', item.prevfogo, `${item.prevfogo} Prevfogo`);
    }

    // Força Nacional
    if (item.fn > 0) {
      pushTk('fn', item.fn, `${item.fn} Força Nacional`);
    }

    // Brigadistas Municipais
    if (item.brigadista > 0) {
      pushTk('brigadista', item.brigadista, `${item.brigadista} Brig. Mun.`);
    }

    // Brigadistas SEMA
    if (item.brigadista_sema > 0) {
      pushTk(
        'brigadista_sema',
        item.brigadista_sema,
        `${item.brigadista_sema} Brig. SEMA`
      );
    }

    muniStatuses[name] = 'normal';
  });

  // Gerar tokens de Viaturas, Aeronaves e Embarcações
  effectiveRecursos.forEach((rec) => {
    const name = rec.muni;
    const coords = findCoordinates(name);
    let offsetIdx = 3;

    const pushVtrTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;

      tokens.push({
        id: `tk-vtr-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: name,
        x: Math.round(coords.x + offX),
        y: Math.round(coords.y + offY),
        count,
        label,
      });
    };

    if (rec.abt > 0) pushVtrTk('vtr_abt', rec.abt, `${rec.abt} ABT CBMAM`);

    const florestalCount =
      (rec.atf || 0) +
      (rec.abf || 0) +
      (rec.ata || 0) +
      (rec.at || 0) +
      (rec.picape_esfron || 0) +
      (rec.picape_fn || 0) +
      (rec.picape_muni || 0) +
      (rec.ar || 0);
    if (florestalCount > 0)
      pushVtrTk(
        'vtr_florestal',
        florestalCount,
        `${florestalCount} Combate/Apoio Florestal`
      );

    const resgateCount =
      (rec.ur || 0) +
      (rec.abs || 0) +
      (rec.crs || 0) +
      (rec.gse || 0) +
      (rec.dosa || 0);
    if (resgateCount > 0)
      pushVtrTk('vtr_ur', resgateCount, `${resgateCount} UR / Resgate / GSE`);

    const fluvialCount = (rec.embarcacao || 0) + (rec.jetski || 0);
    if (fluvialCount > 0)
      pushVtrTk(
        'embarcacao',
        fluvialCount,
        `${fluvialCount} Fluvial (Lancha/Jet)`
      );

    if (rec.helicoptero > 0)
      pushVtrTk(
        'helicoptero',
        rec.helicoptero,
        `${rec.helicoptero} Harpia CBMAM`
      );

    if (rec.aviao > 0)
      pushVtrTk('air_tractor', rec.aviao, `${rec.aviao} Air Tractor`);
  });

  // 5. Gerar formato de coluna efetivo e recursos para o Supabase daily_reports
  const supabaseEfetivo = allPersonnel.map((item) => ({
    mun: item.muni,
    ord: item.serv_ord || 0,
    seg: 0,
    brig: (item.brigadista || 0) + (item.brigadista_sema || 0),
    servico: item.serv_ord || 0,
    opamv: item.opam || 0,
    opam_ref: item.opam_extra || 0,
    inc1: item.inc1 || 0,
    inc2: item.inc2 || 0,
    inc3: item.inc3 || 0,
    cbmsp: item.cbmsp || 0,
    prevfogo: item.prevfogo || 0,
    fn: item.fn || 0,
    marinha: item.marinha || 0,
    brig_mun: item.brigadista || 0,
    brig_semas: item.brigadista_sema || 0,
    cbmam: item.cbmam_militares || 0,
  }));

  const RECURSOS_KEYS = [
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

  const supabaseRecursos = effectiveRecursos.map((r) => {
    const row = { mun: r.muni };
    for (const k of RECURSOS_KEYS) {
      row[k] = Number(r[k]) || 0;
    }
    return row;
  });

  const totalEmpregado = allPersonnel.reduce(
    (acc, curr) => acc + (curr.total || 0),
    0
  );

  const totalRecursos = effectiveRecursos.reduce(
    (acc, curr) => acc + (curr.total || 0),
    0
  );

  return {
    reportDate,
    shift: 'noturno',
    totalEmpregado,
    totalRecursos,
    municipios: parsedMunis,
    bases: parsedBases,
    recursos: effectiveRecursos,
    tokens,
    muniStatuses,
    muniNotes,
    supabaseEfetivo,
    supabaseRecursos,
  };
}

/**
 * Processa um objeto JSON exportado da aba Efetivo do CBMAM e gera a estrutura completa
 * para exibição dos tokens e gravação no Supabase.
 */
export function parseEfetivoJson(jsonData, fileName = '') {
  const rawMunis = jsonData.municipios || jsonData.data?.municipios || [];
  const rawBases = jsonData.bases || jsonData.data?.bases || [];
  const reportDate =
    jsonData.reportDate ||
    jsonData.date ||
    extractDateFromSpreadsheet(fileName) ||
    new Date().toISOString().slice(0, 10);

  const parsedMunis = rawMunis.map((m) => {
    const name = m.muni || m.nome || '';
    const serv_ord = Number(m.serv_ord) || 0;
    const opam = Number(m.opamv) || 0;
    const opam_extra = Number(m.opam_ref) || 0;
    const inc1 = Number(m.inc_1 ?? m.inc1) || 0;
    const inc2 = Number(m.inc_2 ?? m.inc2) || 0;
    const inc3 = Number(m.inc_3 ?? m.inc3) || 0;
    const cbmsp = Number(m.cbmsp) || 0;
    const prevfogo = Number(m.prevfogo) || 0;
    const fn = Number(m.fn) || 0;
    const marinha = Number(m.icmbio ?? m.marinha) || 0;
    const brig_mun = Number(m.brig_mun) || 0;
    const brig_sema = Number(m.brig_sema ?? m.brig_semas) || 0;
    const cbmam_militares =
      serv_ord + opam + opam_extra + inc1 + inc2 + inc3 + cbmsp;
    const total =
      Number(m.total) ||
      cbmam_militares + prevfogo + fn + marinha + brig_mun + brig_sema;

    return {
      muni: name,
      serv_ord,
      opam,
      opam_extra,
      inc1,
      inc2,
      inc3,
      cbmsp,
      prevfogo,
      fn,
      marinha,
      brigadista: brig_mun,
      brigadista_sema: brig_sema,
      cbmam_militares,
      total,
      tipo:
        m.tipo || (name.toLowerCase() === 'manaus' ? 'capital' : 'interior'),
    };
  });

  const parsedBases = rawBases.map((b) => {
    const name = b.base || b.nome || '';
    const serv_ord = Number(b.serv_ord) || 0;
    const opam = Number(b.opamv) || 0;
    const opam_extra = Number(b.opam_ref) || 0;
    const inc1 = Number(b.inc_1 ?? b.inc1) || 0;
    const inc2 = Number(b.inc_2 ?? b.inc2) || 0;
    const inc3 = Number(b.inc_3 ?? b.inc3) || 0;
    const cbmsp = Number(b.cbmsp) || 0;
    const prevfogo = Number(b.prevfogo) || 0;
    const fn = Number(b.fn) || 0;
    const marinha = Number(b.icmbio ?? b.marinha) || 0;
    const brig_mun = Number(b.brig_mun) || 0;
    const brig_sema = Number(b.brig_sema ?? b.brig_semas) || 0;
    const cbmam_militares =
      serv_ord + opam + opam_extra + inc1 + inc2 + inc3 + cbmsp;
    const total =
      Number(b.total) ||
      cbmam_militares + prevfogo + fn + marinha + brig_mun + brig_sema;

    return {
      muni: name,
      base: name,
      serv_ord,
      opam,
      opam_extra,
      inc1,
      inc2,
      inc3,
      cbmsp,
      prevfogo,
      fn,
      marinha,
      brigadista: brig_mun,
      brigadista_sema: brig_sema,
      cbmam_militares,
      total,
      tipo: 'base_temporaria',
    };
  });

  const allPersonnel = [...parsedMunis, ...parsedBases];
  const totalEmpregado =
    jsonData.totals?.totalGeral ||
    allPersonnel.reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Gerar tokens táticos posicionados no mapa
  const tokens = [];
  const muniStatuses = {};
  const muniNotes = {};

  allPersonnel.forEach((item) => {
    const name = item.muni;
    const coords = findCoordinates(name);
    let offsetIdx = 0;

    const pushTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;

      tokens.push({
        id: `tk-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: name,
        x: Math.round(coords.x + offX),
        y: Math.round(coords.y + offY),
        count,
        label,
      });
    };

    if (item.cbmam_militares > 0) {
      pushTk(
        'serv_ord',
        item.cbmam_militares,
        `${item.cbmam_militares} Militares CBMAM`
      );
    }
    if (item.prevfogo > 0) {
      pushTk('prevfogo', item.prevfogo, `${item.prevfogo} Prevfogo`);
    }
    if (item.fn > 0) {
      pushTk('fn', item.fn, `${item.fn} Força Nacional`);
    }
    if (item.brigadista > 0) {
      pushTk('brigadista', item.brigadista, `${item.brigadista} Brig. Mun.`);
    }
    if (item.brigadista_sema > 0) {
      pushTk(
        'brigadista_sema',
        item.brigadista_sema,
        `${item.brigadista_sema} Brig. SEMA`
      );
    }

    muniStatuses[name] = 'normal';
    muniNotes[name] =
      `Efetivo Total: ${item.total} operacionais (${item.cbmam_militares} CBMAM)`;
  });

  // Anexar viaturas e recursos operacionais (160 meios oficiais)
  const effectiveRecursos = OPERACAO_RECURSOS_MUNICIPIOS;
  effectiveRecursos.forEach((rec) => {
    const name = rec.muni;
    const coords = findCoordinates(name);
    let offsetIdx = 3;

    const pushVtrTk = (type, count, label) => {
      if (!count || count <= 0) return;
      const offX = (offsetIdx % 3) * 28 - 28;
      const offY = Math.floor(offsetIdx / 3) * 28 - 14;
      offsetIdx += 1;

      tokens.push({
        id: `tk-vtr-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${type}-${tokens.length}`,
        type,
        muni: name,
        x: Math.round(coords.x + offX),
        y: Math.round(coords.y + offY),
        count,
        label,
      });
    };

    if (rec.abt > 0) pushVtrTk('vtr_abt', rec.abt, `${rec.abt} ABT CBMAM`);

    const florestalCount =
      (rec.atf || 0) +
      (rec.abf || 0) +
      (rec.ata || 0) +
      (rec.at || 0) +
      (rec.picape_esfron || 0) +
      (rec.picape_fn || 0) +
      (rec.picape_muni || 0) +
      (rec.ar || 0);
    if (florestalCount > 0)
      pushVtrTk(
        'vtr_florestal',
        florestalCount,
        `${florestalCount} Combate/Apoio Florestal`
      );

    const resgateCount =
      (rec.ur || 0) +
      (rec.abs || 0) +
      (rec.crs || 0) +
      (rec.gse || 0) +
      (rec.dosa || 0);
    if (resgateCount > 0)
      pushVtrTk('vtr_ur', resgateCount, `${resgateCount} UR / Resgate / GSE`);

    const fluvialCount = (rec.embarcacao || 0) + (rec.jetski || 0);
    if (fluvialCount > 0)
      pushVtrTk(
        'embarcacao',
        fluvialCount,
        `${fluvialCount} Fluvial (Lancha/Jet)`
      );

    if (rec.helicoptero > 0)
      pushVtrTk(
        'helicoptero',
        rec.helicoptero,
        `${rec.helicoptero} Harpia CBMAM`
      );

    if (rec.aviao > 0)
      pushVtrTk('air_tractor', rec.aviao, `${rec.aviao} Air Tractor`);
  });

  const supabaseEfetivo = allPersonnel.map((item) => ({
    mun: item.muni,
    ord: item.serv_ord || 0,
    seg: 0,
    brig: (item.brigadista || 0) + (item.brigadista_sema || 0),
    servico: item.serv_ord || 0,
    opamv: item.opam || 0,
    opam_ref: item.opam_extra || 0,
    inc1: item.inc1 || 0,
    inc2: item.inc2 || 0,
    inc3: item.inc3 || 0,
    cbmsp: item.cbmsp || 0,
    prevfogo: item.prevfogo || 0,
    fn: item.fn || 0,
    marinha: item.marinha || 0,
    brig_mun: item.brigadista || 0,
    brig_semas: item.brigadista_sema || 0,
    cbmam: item.cbmam_militares || 0,
    total: item.total || 0,
  }));

  const RECURSOS_KEYS = [
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

  const supabaseRecursos = effectiveRecursos.map((r) => {
    const row = { mun: r.muni };
    for (const k of RECURSOS_KEYS) {
      row[k] = Number(r[k]) || 0;
    }
    return row;
  });

  const totalRecursos = effectiveRecursos.reduce(
    (acc, curr) => acc + (curr.total || 0),
    0
  );

  return {
    reportDate,
    shift: 'noturno',
    totalEmpregado,
    totalRecursos,
    municipios: parsedMunis,
    bases: parsedBases,
    recursos: effectiveRecursos,
    tokens,
    muniStatuses,
    muniNotes,
    supabaseEfetivo,
    supabaseRecursos,
  };
}
