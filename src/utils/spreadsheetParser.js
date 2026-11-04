import * as XLSX from 'xlsx';
import { AMAZONAS_DATA } from '../data/amazonasData.js';

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

  // 4. Gerar tokens táticos posicionados no mapa
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

  // Garantir meios aéreos e viaturas padrão da operação caso não estejam na planilha
  const hasAero = tokens.some(
    (t) => t.type === 'air_tractor' || t.type === 'helicoptero'
  );
  if (!hasAero) {
    tokens.push(
      {
        id: 'tk-harpia-01',
        type: 'helicoptero',
        muni: 'Manaus',
        x: 575,
        y: 440,
        label: 'Harpia 01',
      },
      {
        id: 'tk-harpia-02',
        type: 'helicoptero',
        muni: 'Manaus',
        x: 605,
        y: 440,
        label: 'Harpia 02',
      },
      {
        id: 'tk-harpia-03',
        type: 'helicoptero',
        muni: 'Humaitá',
        x: 495,
        y: 720,
        label: 'Harpia 03',
      },
      {
        id: 'tk-at-01',
        type: 'air_tractor',
        muni: 'Apuí',
        x: 670,
        y: 725,
        label: 'Air Tractor 01',
      },
      {
        id: 'tk-at-02',
        type: 'air_tractor',
        muni: 'Apuí',
        x: 645,
        y: 745,
        label: 'Air Tractor 02',
      },
      {
        id: 'tk-at-03',
        type: 'air_tractor',
        muni: 'Humaitá',
        x: 470,
        y: 735,
        label: 'Air Tractor 03',
      },
      {
        id: 'tk-at-04',
        type: 'air_tractor',
        muni: 'Lábrea',
        x: 345,
        y: 780,
        label: 'Air Tractor 04',
      },
      {
        id: 'tk-at-05',
        type: 'air_tractor',
        muni: 'Boca do Acre',
        x: 260,
        y: 720,
        label: 'Air Tractor 05',
      },
      {
        id: 'tk-at-06',
        type: 'air_tractor',
        muni: 'Manicoré',
        x: 580,
        y: 690,
        label: 'Air Tractor 06',
      },
      {
        id: 'tk-at-07',
        type: 'air_tractor',
        muni: 'Novo Aripuanã',
        x: 635,
        y: 670,
        label: 'Air Tractor 07',
      },
      {
        id: 'tk-vtr-abt-01',
        type: 'vtr_abt',
        muni: 'Manaus',
        x: 565,
        y: 475,
        label: 'ABT-29 CBMAM',
      },
      {
        id: 'tk-vtr-ur-01',
        type: 'vtr_ur',
        muni: 'Manaus',
        x: 590,
        y: 485,
        label: 'UR-Resgate CBMAM',
      },
      {
        id: 'tk-vtr-4x4-01',
        type: 'vtr_florestal',
        muni: 'Humaitá',
        x: 485,
        y: 745,
        label: 'Pick-up 4x4 Florestal',
      },
      {
        id: 'tk-vtr-4x4-02',
        type: 'vtr_florestal',
        muni: 'Apuí',
        x: 630,
        y: 715,
        label: 'Pick-up 4x4 Sul AM',
      },
      {
        id: 'tk-fluvial-01',
        type: 'embarcacao',
        muni: 'Manaus',
        x: 545,
        y: 460,
        label: 'Lancha Rápida Fluvial',
      }
    );
  }

  // 5. Gerar formato de coluna efetivo para o Supabase daily_reports
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

  const totalEmpregado = allPersonnel.reduce(
    (acc, curr) => acc + (curr.total || 0),
    0
  );

  return {
    reportDate,
    shift: 'noturno',
    totalEmpregado,
    municipios: parsedMunis,
    bases: parsedBases,
    tokens,
    muniStatuses,
    muniNotes,
    supabaseEfetivo,
  };
}
