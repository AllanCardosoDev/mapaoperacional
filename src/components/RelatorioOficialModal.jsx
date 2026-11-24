import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Search,
  Users,
  Shield,
  Printer,
  Flame,
  Plane,
  Building2,
  TreePine,
  Truck,
  BarChart3,
  FileSpreadsheet,
  Copy,
  Check,
  MapPin,
  Tent,
  Award,
} from 'lucide-react';
import {
  MUNICIPIOS_POLO_LIST,
  BASES_TEMPORARIAS_LIST,
  BENCHMARK_PERMANENTE_CBMAM,
  BENCHMARK_MUNICIPIOS_OPERACIONAL,
  BENCHMARK_BASES_OPERACIONAL,
  CRBM_DETALHAMENTO,
  CRBM_SUBTOTAIS,
  ADM_2_CRBM_MANAUS,
  getCrbmByMunicipio,
  norm,
} from '../data/efetivoOficial';
import {
  PREVFOGO_RECURSOS_DISPONIVEIS,
  OPERACAO_RECURSOS_MUNICIPIOS,
  RESUMO_RECURSOS_OFICIAL,
} from '../data/operacaoAmazonasData';
import { AMAZONAS_DATA } from '../data/amazonasData';

const ARCO_FOGO_SET = new Set(
  AMAZONAS_DATA.municipalities
    .filter((m) => m.in_arco_fogo)
    .map((m) => norm(m.name))
);

function formatDateBR(iso) {
  if (!iso) {
    return new Date().toLocaleDateString('pt-BR', {
      timeZone: 'America/Manaus',
    });
  }
  const parts = String(iso).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return iso;
}

function fmtNum(val) {
  return Number(val || 0).toLocaleString('pt-BR');
}

export function RelatorioOficialModal({
  dbEfetivo = [],
  dbRecursos = null,
  reportDate = null,
  onClose,
  onSelectMuni,
}) {
  const [activeTab, setActiveTab] = useState('documento'); // 'documento' | 'dashboard' | 'tabelas' | 'crbm' | 'recursos' | 'prevfogo'
  const [searchTerm, setSearchTerm] = useState('');
  const [crbmFilter, setCrbmFilter] = useState('todos');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [exportingXlsx, setExportingXlsx] = useState(false);

  const emissionInfo = useMemo(() => {
    const now = new Date();
    let dateLong = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    let timeStr = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    try {
      dateLong = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Manaus',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(now);
      timeStr = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Manaus',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);
    } catch {
      // fallback
    }
    return {
      dateLong,
      time: timeStr,
      refBR: formatDateBR(reportDate),
      refIso: reportDate || now.toISOString().slice(0, 10),
    };
  }, [reportDate]);

  // 1. Consolida os 26 Municípios Polo em tempo real a partir de dbEfetivo (com fallback canônico)
  const polosList = useMemo(() => {
    return MUNICIPIOS_POLO_LIST.map((nome, idx) => {
      const found = (dbEfetivo || []).find(
        (r) =>
          norm(r.mun) === norm(nome) &&
          (r.tipo === 'capital' || r.tipo === 'interior' || !r.tipo)
      );
      const bm = BENCHMARK_MUNICIPIOS_OPERACIONAL[nome] || {};
      const bmPerm = BENCHMARK_PERMANENTE_CBMAM[nome] || 0;
      const isCustom = !!found?._custom;

      const cbmam = Number(
        isCustom ? (found.cbmam ?? bmPerm) : found?.cbmam || bmPerm
      );
      const opamv = Number(
        isCustom
          ? (found.opamv ?? bm.opamv ?? 0)
          : found?.opamv || bm.opamv || 0
      );
      const opam_ref = Number(
        isCustom
          ? (found.opam_ref ?? bm.opam_ref ?? 0)
          : found?.opam_ref || bm.opam_ref || 0
      );
      const prevfogo = Number(
        isCustom
          ? (found.prevfogo ?? bm.prevfogo ?? 0)
          : found?.prevfogo || bm.prevfogo || 0
      );
      const fn = Number(
        isCustom ? (found.fn ?? bm.fn ?? 0) : found?.fn || bm.fn || 0
      );
      const brig_mun = Number(
        isCustom
          ? (found.brig_mun ?? bm.brig_mun ?? 0)
          : found?.brig_mun || bm.brig_mun || 0
      );
      const brig_semas = Number(
        isCustom
          ? (found.brig_semas ?? bm.brig_semas ?? 0)
          : found?.brig_semas || bm.brig_semas || 0
      );
      const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

      return {
        ordem: idx + 1,
        nome,
        tipo: nome === 'Manaus' ? 'capital' : 'interior',
        crbm: getCrbmByMunicipio(nome) || 'Interior',
        inArco: ARCO_FOGO_SET.has(norm(nome)),
        cbmam,
        opamv,
        opam_ref,
        prevfogo,
        fn,
        brig_mun,
        brig_semas,
        total,
      };
    });
  }, [dbEfetivo]);

  // 2. Consolida as 12 Bases Temporárias em tempo real a partir de dbEfetivo
  const basesList = useMemo(() => {
    return BASES_TEMPORARIAS_LIST.map((nome, idx) => {
      const found = (dbEfetivo || []).find(
        (r) =>
          (r.tipo === 'base' || norm(r.mun).includes('km 53')) &&
          (norm(r.mun) === norm(nome) ||
            (norm(nome).includes('km 53') && norm(r.mun).includes('km 53')))
      );
      const bm = BENCHMARK_BASES_OPERACIONAL[nome] || {};
      const isCustom = !!found?._custom;

      const opamv = Number(
        isCustom
          ? (found.opamv ?? bm.opamv ?? 0)
          : found?.opamv || bm.opamv || 0
      );
      const opam_ref = Number(
        isCustom
          ? (found.opam_ref ?? bm.opam_ref ?? 0)
          : found?.opam_ref || bm.opam_ref || 0
      );
      const prevfogo = Number(
        isCustom
          ? (found.prevfogo ?? bm.prevfogo ?? 0)
          : found?.prevfogo || bm.prevfogo || 0
      );
      const fn = Number(
        isCustom ? (found.fn ?? bm.fn ?? 0) : found?.fn || bm.fn || 0
      );
      const brig_mun = Number(
        isCustom
          ? (found.brig_mun ?? bm.brig_mun ?? 0)
          : found?.brig_mun || bm.brig_mun || 0
      );
      const brig_semas = Number(
        isCustom
          ? (found.brig_semas ?? bm.brig_semas ?? 0)
          : found?.brig_semas || bm.brig_semas || 0
      );
      const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;

      return {
        ordem: idx + 1,
        nome,
        tipo: 'base',
        crbm: getCrbmByMunicipio(nome) || '2º CRBM',
        inArco: ARCO_FOGO_SET.has(norm(nome)),
        cbmam: 0,
        opamv,
        opam_ref,
        prevfogo,
        fn,
        brig_mun,
        brig_semas,
        total,
      };
    });
  }, [dbEfetivo]);

  // 3. Subtotais e Total Geral dinâmicos
  const sumList = (list) =>
    list.reduce(
      (acc, r) => {
        acc.cbmam += r.cbmam;
        acc.opamv += r.opamv;
        acc.opam_ref += r.opam_ref;
        acc.prevfogo += r.prevfogo;
        acc.fn += r.fn;
        acc.brig_mun += r.brig_mun;
        acc.brig_semas += r.brig_semas;
        acc.total += r.total;
        return acc;
      },
      {
        cbmam: 0,
        opamv: 0,
        opam_ref: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_semas: 0,
        total: 0,
      }
    );

  const totPolos = useMemo(() => sumList(polosList), [polosList]);
  const totBases = useMemo(() => sumList(basesList), [basesList]);

  const totGeral = useMemo(() => {
    const cbmamCap = polosList.find((p) => p.nome === 'Manaus')?.cbmam ?? 477;
    const cbmamIntPolos = totPolos.cbmam - cbmamCap;
    const cbmamIntComAdm = cbmamIntPolos + ADM_2_CRBM_MANAUS;
    const opamv = totPolos.opamv + totBases.opamv;
    const opam_ref = totPolos.opam_ref + totBases.opam_ref;
    const prevfogo = totPolos.prevfogo + totBases.prevfogo;
    const fn = totPolos.fn + totBases.fn;
    const brig_mun = totPolos.brig_mun + totBases.brig_mun;
    const brig_semas = totPolos.brig_semas + totBases.brig_semas;
    const totalAtuacao = totPolos.total + totBases.total;
    const capitalAtuacao =
      polosList.find((p) => p.nome === 'Manaus')?.total ?? 0;
    const interiorAtuacao = totalAtuacao - capitalAtuacao;
    const efetivoGeralInstituicoes =
      cbmamCap + cbmamIntComAdm + brig_mun + brig_semas + fn + prevfogo;

    return {
      cbmam: totPolos.cbmam,
      cbmamCap,
      cbmamIntPolos,
      cbmamIntComAdm,
      opamv,
      opam_ref,
      opamTotal: opamv + opam_ref,
      prevfogo,
      fn,
      brig_mun,
      brig_semas,
      brigTotal: brig_mun + brig_semas,
      totalAtuacao,
      capitalAtuacao,
      interiorAtuacao,
      efetivoGeralInstituicoes,
    };
  }, [polosList, totPolos, totBases]);

  // 4. Quadro 01 — Efetivo Geral Dinâmico por Instituição
  const quadro01Instituicoes = useMemo(() => {
    const items = [
      {
        label: 'CBMAM Capital',
        valor: totGeral.cbmamCap,
        color: '#ef4444',
      },
      {
        label: 'CBMAM Interior (Polos + ADM 2º CRBM)',
        valor: totGeral.cbmamIntComAdm,
        color: '#f97316',
      },
      {
        label: 'Prevfogo / IBAMA',
        valor: totGeral.prevfogo,
        color: '#22c55e',
      },
      {
        label: 'Brigadistas Municipais',
        valor: totGeral.brig_mun,
        color: '#eab308',
      },
      {
        label: 'Brigadistas SEMA',
        valor: totGeral.brig_semas,
        color: '#10b981',
      },
      {
        label: 'Força Nacional (FNSP)',
        valor: totGeral.fn,
        color: '#38bdf8',
      },
      {
        label: 'CBMESP',
        valor: 0,
        color: '#8b5cf6',
      },
      {
        label: 'Marinha / Fuzileiros',
        valor: 0,
        color: '#64748b',
      },
    ];
    const total = Math.max(
      1,
      items.reduce((s, it) => s + it.valor, 0)
    );
    return items.map((it) => ({
      ...it,
      pct: ((it.valor / total) * 100).toFixed(1),
    }));
  }, [totGeral]);

  // 5. Top 10 Municípios em Atuação
  const top10Atuacao = useMemo(() => {
    return [...polosList, ...basesList]
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [polosList, basesList]);

  // 6. Recursos / Meios (160) — usa dbRecursos se vier preenchido, senão oficial
  const recursosList = useMemo(() => {
    const source =
      Array.isArray(dbRecursos) && dbRecursos.length > 5
        ? dbRecursos
        : OPERACAO_RECURSOS_MUNICIPIOS;
    return source.map((r) => {
      const combate =
        (Number(r.abt) || 0) +
        (Number(r.at) || 0) +
        (Number(r.ata) || 0) +
        (Number(r.abf) || 0) +
        (Number(r.atf) || 0) +
        (Number(r.abs) || 0) +
        (Number(r.abtf) || 0);
      const apoio =
        (Number(r.ar) || 0) +
        (Number(r.ur) || 0) +
        (Number(r.mt) || 0) +
        (Number(r.dosa) || 0) +
        (Number(r.gse) || 0) +
        (Number(r.crs) || 0) +
        (Number(r.autoarp) || 0) +
        (Number(r.picape_esfron) || 0) +
        (Number(r.picape_fn) || 0) +
        (Number(r.picape_muni) || 0) +
        (Number(r.quadriciclo) || 0);
      const fluvial = (Number(r.embarcacao) || 0) + (Number(r.jetski) || 0);
      const aereo = (Number(r.helicoptero) || 0) + (Number(r.aviao) || 0);
      const total = combate + apoio + fluvial + aereo;
      return {
        mun: r.mun || r.muni || '—',
        abt: Number(r.abt) || 0,
        atf: Number(r.atf) || 0,
        combate,
        ar: Number(r.ar) || 0,
        ur: Number(r.ur) || 0,
        apoio,
        fluvial,
        aereo,
        total,
      };
    });
  }, [dbRecursos]);

  const totRecursos = useMemo(() => {
    return recursosList.reduce(
      (acc, r) => {
        acc.abt += r.abt;
        acc.atf += r.atf;
        acc.combate += r.combate;
        acc.ar += r.ar;
        acc.ur += r.ur;
        acc.apoio += r.apoio;
        acc.fluvial += r.fluvial;
        acc.aereo += r.aereo;
        acc.total += r.total;
        return acc;
      },
      {
        abt: 0,
        atf: 0,
        combate: 0,
        ar: 0,
        ur: 0,
        apoio: 0,
        fluvial: 0,
        aereo: 0,
        total: 0,
      }
    );
  }, [recursosList]);

  // Filtros aplicados na aba de Tabelas e Recursos
  const applyFilter = (list) => {
    const q = norm(searchTerm);
    return list.filter((r) => {
      const nameMatch = !q || norm(r.nome || r.mun).includes(q);
      if (!nameMatch) return false;
      if (crbmFilter === 'todos') return true;
      if (crbmFilter === 'arco_fogo') return !!r.inArco;
      return r.crbm === crbmFilter;
    });
  };

  const filteredPolos = useMemo(
    () => applyFilter(polosList),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [polosList, searchTerm, crbmFilter]
  );
  const filteredBases = useMemo(
    () => applyFilter(basesList),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [basesList, searchTerm, crbmFilter]
  );
  const filteredRecursos = useMemo(() => {
    const q = norm(searchTerm);
    if (!q) return recursosList;
    return recursosList.filter((r) => norm(r.mun).includes(q));
  }, [recursosList, searchTerm]);

  // Impressão limpa A4 (sempre ativa aba documento antes de chamar print)
  const handlePrintA4 = () => {
    if (activeTab !== 'documento') {
      setActiveTab('documento');
      setTimeout(() => window.print(), 180);
    } else {
      window.print();
    }
  };

  // Copiar Resumo Executivo formatado para WhatsApp / Briefing
  const handleCopyBriefing = () => {
    const lines = [
      `*RELATÓRIO OPERACIONAL — OPERAÇÃO AMAZONAS (CBMAM/CBI)*`,
      `Referência: ${emissionInfo.refBR} | Emitido às ${emissionInfo.time} (AMT)`,
      ``,
      `*SÍNTESE DE EFETIVO*`,
      `• Efetivo Geral (Todas Instituições): *${fmtNum(totGeral.efetivoGeralInstituicoes)}*`,
      `• CBMAM Polos: *${fmtNum(totGeral.cbmam)}* (${totGeral.cbmamCap} Cap + ${totGeral.cbmamIntPolos} Int + ${ADM_2_CRBM_MANAUS} ADM 2º CRBM)`,
      `• Total em Atuação na Operação: *${fmtNum(totGeral.totalAtuacao)}* (${totPolos.total} Polos + ${totBases.total} Bases)`,
      `  - OPAM (6ª + 7ª Fase): ${totGeral.opamTotal} (${totGeral.opamv} + ${totGeral.opam_ref})`,
      `  - Prevfogo / IBAMA: ${totGeral.prevfogo}`,
      `  - Força Nacional: ${totGeral.fn}`,
      `  - Brigadistas: ${totGeral.brigTotal} (${totGeral.brig_mun} Mun + ${totGeral.brig_semas} SEMA)`,
      ``,
      `*MEIOS EMPREGADOS:* ${totRecursos.total || RESUMO_RECURSOS_OFICIAL.total_geral} (${totRecursos.combate} Combate, ${totRecursos.apoio} Apoio/Resgate, ${totRecursos.fluvial} Fluviais, ${totRecursos.aereo} Aeronaves)`,
    ];
    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 3000);
      });
    }
  };

  // Exportar Excel (.xlsx) multi-abas com carregamento dinâmico (mantém bundle inicial leve)
  const handleExportExcel = async () => {
    try {
      setExportingXlsx(true);
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      // Aba 1: Efetivo Geral
      const wsGeral = XLSX.utils.json_to_sheet([
        ...quadro01Instituicoes.map((it) => ({
          'Instituição / Origem': it.label,
          Quantitativo: it.valor,
          'Participação (%)': `${it.pct}%`,
        })),
        {
          'Instituição / Origem': 'TOTAL GERAL',
          Quantitativo: totGeral.efetivoGeralInstituicoes,
          'Participação (%)': '100.0%',
        },
      ]);
      XLSX.utils.book_append_sheet(wb, wsGeral, '01_Efetivo_Geral');

      // Aba 2: 26 Municípios Polo
      const wsPolos = XLSX.utils.json_to_sheet([
        ...polosList.map((r) => ({
          Ordem: r.ordem,
          Município: r.nome,
          CRBM: r.crbm,
          CBMAM: r.cbmam,
          '6ª Fase OPAM': r.opamv,
          '7ª Fase OPAM': r.opam_ref,
          Prevfogo: r.prevfogo,
          'Força Nacional': r.fn,
          'Brig. Municipal': r.brig_mun,
          'Brig. SEMA': r.brig_semas,
          'Total Atuação': r.total,
        })),
        {
          Ordem: '',
          Município: 'SUBTOTAL POLOS (26)',
          CRBM: '',
          CBMAM: totPolos.cbmam,
          '6ª Fase OPAM': totPolos.opamv,
          '7ª Fase OPAM': totPolos.opam_ref,
          Prevfogo: totPolos.prevfogo,
          'Força Nacional': totPolos.fn,
          'Brig. Municipal': totPolos.brig_mun,
          'Brig. SEMA': totPolos.brig_semas,
          'Total Atuação': totPolos.total,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, wsPolos, '02_Polos_26');

      // Aba 3: 12 Bases Temporárias
      const wsBases = XLSX.utils.json_to_sheet([
        ...basesList.map((r) => ({
          Ordem: r.ordem,
          'Base Temporária': r.nome,
          CRBM: r.crbm,
          CBMAM: 0,
          '6ª Fase OPAM': r.opamv,
          '7ª Fase OPAM': r.opam_ref,
          Prevfogo: r.prevfogo,
          'Força Nacional': r.fn,
          'Brig. Municipal': r.brig_mun,
          'Brig. SEMA': r.brig_semas,
          'Total Atuação': r.total,
        })),
        {
          Ordem: '',
          'Base Temporária': 'SUBTOTAL BASES (12)',
          CRBM: '',
          CBMAM: 0,
          '6ª Fase OPAM': totBases.opamv,
          '7ª Fase OPAM': totBases.opam_ref,
          Prevfogo: totBases.prevfogo,
          'Força Nacional': totBases.fn,
          'Brig. Municipal': totBases.brig_mun,
          'Brig. SEMA': totBases.brig_semas,
          'Total Atuação': totBases.total,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, wsBases, '03_Bases_12');

      // Aba 4: CRBM Detalhamento
      const wsCrbm = XLSX.utils.json_to_sheet([
        ...CRBM_DETALHAMENTO.map((c) => ({
          CRBM: c.crbm,
          Grupamento: c.grupamento,
          Combatente: c.combatente,
          Saúde: c.saude,
          Total: c.total,
        })),
        ...CRBM_SUBTOTAIS.map((s) => ({
          CRBM: s.crbm,
          Grupamento: '',
          Combatente: s.combatente,
          Saúde: s.saude,
          Total: s.total,
        })),
      ]);
      XLSX.utils.book_append_sheet(wb, wsCrbm, '04_CRBM_Interior');

      // Aba 5: Meios & Viaturas
      const wsMeios = XLSX.utils.json_to_sheet([
        ...recursosList.map((r) => ({
          Município: r.mun,
          ABT: r.abt,
          ATF: r.atf,
          'Combate Incêndio': r.combate,
          AR: r.ar,
          UR: r.ur,
          'Apoio / Resgate': r.apoio,
          Fluvial: r.fluvial,
          Aeronaves: r.aereo,
          'Total Meios': r.total,
        })),
        {
          Município: 'TOTAL GERAL MEIOS',
          ABT: totRecursos.abt,
          ATF: totRecursos.atf,
          'Combate Incêndio': totRecursos.combate,
          AR: totRecursos.ar,
          UR: totRecursos.ur,
          'Apoio / Resgate': totRecursos.apoio,
          Fluvial: totRecursos.fluvial,
          Aeronaves: totRecursos.aereo,
          'Total Meios': totRecursos.total,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, wsMeios, '05_Meios_160');

      XLSX.writeFile(
        wb,
        `CBMAM_Relatorio_Oficial_Operacao_Amazonas_${emissionInfo.refIso}.xlsx`
      );
    } catch (err) {
      console.error('Erro ao exportar Excel:', err);
      alert('Falha ao gerar arquivo Excel.');
    } finally {
      setExportingXlsx(false);
    }
  };

  // Helper de célula numérica: sempre mostra 0 (nunca tracinho!)
  const renderZeroAware = (val, activeColor = '#f8fafc', bold = true) => {
    const n = Number(val || 0);
    return (
      <span
        style={{
          color: n > 0 ? activeColor : '#475569',
          fontWeight: n > 0 && bold ? 800 : 500,
          fontFamily: "'JetBrains Mono', monospace",
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {n}
      </span>
    );
  };

  return (
    <div className="modal-backdrop relatorio-backdrop" onClick={onClose}>
      <div
        className="modal-container relatorio-modal-container"
        style={{
          maxWidth: 1280,
          width: '97%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: '1.5px solid #0284c7',
          borderRadius: 14,
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL (OCULTO NA IMPRESSÃO A4) */}
        <div
          className="no-print"
          style={{
            padding: '13px 20px',
            background:
              'linear-gradient(90deg, #0b1329 0%, #172554 50%, #0f172a 100%)',
            borderBottom: '1.5px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: '#ffffff',
                border: '2px solid #facc15',
                boxShadow: '0 0 0 2px rgba(220,38,38,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="/brasao-cbmam.png"
                alt="Brasão CBMAM"
                style={{ width: 38, height: 38, objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.5px',
                  }}
                >
                  RELATÓRIO OPERACIONAL EXECUTIVO • CBMAM
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    color: '#4ade80',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  BANCO AO VIVO • {emissionInfo.refBR}
                </span>
              </div>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 11.5,
                  color: '#94a3b8',
                }}
              >
                Operação Amazonas • {fmtNum(totGeral.efetivoGeralInstituicoes)}{' '}
                Efetivo Geral | {fmtNum(totGeral.cbmam)} CBMAM Polos |{' '}
                {fmtNum(totGeral.totalAtuacao)} em Atuação na Operação
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleCopyBriefing}
              className="btn-command btn-command-outline"
              title="Copiar resumo formatado para WhatsApp / Briefing"
            >
              {copiedSummary ? (
                <Check size={14} color="#4ade80" />
              ) : (
                <Copy size={14} color="#38bdf8" />
              )}
              <span>{copiedSummary ? 'Copiado!' : 'Briefing'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exportingXlsx}
              className="btn-command btn-command-emerald"
              title="Baixar planilha Excel (.xlsx) completa com 5 abas"
            >
              <FileSpreadsheet size={14} />
              <span>{exportingXlsx ? 'Gerando...' : 'Excel (.xlsx)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintA4}
              className="btn-command btn-command-gold"
              title="Imprimir ou Salvar como PDF em formato folha A4 oficial"
            >
              <Printer size={14} />
              <span>Imprimir / PDF A4</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: 7,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Fechar Relatório"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BARRA DE ABAS LIMPA (6 ABAS SEM DUPLICAÇÃO) */}
        <div
          className="no-print"
          style={{
            padding: '8px 20px',
            background: '#0d1424',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'documento', label: 'Documento A4 (PDF)', Icon: FileText },
              {
                id: 'dashboard',
                label: 'Dashboard Executivo',
                Icon: BarChart3,
              },
              {
                id: 'tabelas',
                label: 'Tabelas Polos & Bases (38)',
                Icon: Users,
              },
              { id: 'crbm', label: 'Comandos CRBM (350)', Icon: Shield },
              {
                id: 'recursos',
                label: `Meios & Viaturas (${totRecursos.total})`,
                Icon: Truck,
              },
              {
                id: 'prevfogo',
                label: `Prevfogo / IBAMA (${totGeral.prevfogo})`,
                Icon: TreePine,
              },
            ].map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: active
                      ? '1.5px solid #38bdf8'
                      : '1px solid rgba(148,163,184,0.2)',
                    background: active
                      ? 'rgba(2, 132, 199, 0.25)'
                      : 'rgba(15, 23, 42, 0.7)',
                    color: active ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {(activeTab === 'tabelas' || activeTab === 'recursos') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeTab === 'tabelas' && (
                <select
                  value={crbmFilter}
                  onChange={(e) => setCrbmFilter(e.target.value)}
                  style={{
                    background: '#0f172a',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    borderRadius: 7,
                    padding: '5px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <option value="todos">Todos os CRBMs</option>
                  <option value="Capital">Capital</option>
                  <option value="1º CRBM">1º CRBM</option>
                  <option value="2º CRBM">2º CRBM</option>
                  <option value="3º CRBM">3º CRBM</option>
                  <option value="4º CRBM">4º CRBM</option>
                  <option value="arco_fogo">Arco do Fogo</option>
                </select>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 7,
                  padding: '4px 9px',
                }}
              >
                <Search size={13} color="#38bdf8" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar município..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: 11.5,
                    outline: 'none',
                    width: 150,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* CORPO DO RELATÓRIO */}
        <div
          className="relatorio-scroll-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: activeTab === 'documento' ? '22px' : '18px 22px',
            background: activeTab === 'documento' ? '#111827' : '#090d16',
          }}
        >
          {/* ==============================================================
              ABA 1: DOCUMENTO OFICIAL A4 (PRONTO PARA IMPRESSÃO / PDF)
              ============================================================== */}
          {activeTab === 'documento' && (
            <div className="printable-a4-sheet">
              {/* Cabeçalho Institucional A4 */}
              <div className="a4-header">
                <img
                  src="/brasao-cbmam.png"
                  alt="Brasão CBMAM"
                  className="a4-emblem"
                />
                <div className="a4-header-center">
                  <div className="a4-gov">GOVERNO DO ESTADO DO AMAZONAS</div>
                  <div className="a4-org">
                    CORPO DE BOMBEIROS MILITAR DO AMAZONAS — CBMAM
                  </div>
                  <div className="a4-sub">
                    COMANDO DE BOMBEIROS DO INTERIOR (CBI) • SALA DE SITUAÇÃO
                  </div>
                  <div className="a4-doc-title">
                    RELATÓRIO EXECUTIVO DE EFETIVO E MEIOS — OPERAÇÃO AMAZONAS
                  </div>
                </div>
                <div className="a4-meta-box">
                  <div>
                    <b>REFERÊNCIA:</b> {emissionInfo.refBR}
                  </div>
                  <div>
                    <b>EMISSÃO:</b> {emissionInfo.time} (AMT)
                  </div>
                  <div>
                    <b>FONTE:</b> Banco Oficial CBMAM
                  </div>
                </div>
              </div>

              {/* Faixa de KPIs Executivos A4 */}
              <div className="a4-kpi-strip">
                <div className="a4-kpi-card">
                  <span className="a4-kpi-lbl">EFETIVO GERAL INTEGRADO</span>
                  <span className="a4-kpi-num">
                    {fmtNum(totGeral.efetivoGeralInstituicoes)}
                  </span>
                  <span className="a4-kpi-sub">Todas as Instituições</span>
                </div>
                <div className="a4-kpi-card accent-red">
                  <span className="a4-kpi-lbl">CBMAM (POLOS + ADM)</span>
                  <span className="a4-kpi-num">
                    {fmtNum(totGeral.cbmam + ADM_2_CRBM_MANAUS)}
                  </span>
                  <span className="a4-kpi-sub">
                    {totGeral.cbmamCap} Cap • {totGeral.cbmamIntPolos} Int •{' '}
                    {ADM_2_CRBM_MANAUS} ADM
                  </span>
                </div>
                <div className="a4-kpi-card accent-amber">
                  <span className="a4-kpi-lbl">EM ATUAÇÃO NA OPERAÇÃO</span>
                  <span className="a4-kpi-num">
                    {fmtNum(totGeral.totalAtuacao)}
                  </span>
                  <span className="a4-kpi-sub">
                    {totPolos.total} Polos • {totBases.total} Bases
                  </span>
                </div>
                <div className="a4-kpi-card accent-blue">
                  <span className="a4-kpi-lbl">MEIOS & VIATURAS</span>
                  <span className="a4-kpi-num">{totRecursos.total}</span>
                  <span className="a4-kpi-sub">
                    {totRecursos.combate} Combate • {totRecursos.aereo} Aéreo
                  </span>
                </div>
              </div>

              {/* Quadro 01 — Resumo Geral por Instituição */}
              <div className="a4-section">
                <h3 className="a4-section-title">
                  1. QUADRO GERAL POR INSTITUIÇÃO / ORIGEM
                </h3>
                <table className="a4-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>
                        Instituição / Origem
                      </th>
                      <th style={{ textAlign: 'right' }}>Quantitativo</th>
                      <th style={{ textAlign: 'right' }}>Participação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quadro01Instituicoes.map((it) => (
                      <tr key={it.label}>
                        <td style={{ fontWeight: 600 }}>{it.label}</td>
                        <td className="a4-num">{fmtNum(it.valor)}</td>
                        <td className="a4-num">{it.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>TOTAL GERAL INTEGRADO</td>
                      <td className="a4-num">
                        {fmtNum(totGeral.efetivoGeralInstituicoes)}
                      </td>
                      <td className="a4-num">100,0%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Tabela 2 — 26 Municípios Polo */}
              <div className="a4-section">
                <h3 className="a4-section-title">
                  2. DISTRIBUIÇÃO POR MUNICÍPIO POLO (26 POLOS OPERACIONAIS)
                </h3>
                <table className="a4-table a4-table-compact">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: 28 }}>#</th>
                      <th style={{ textAlign: 'left' }}>Município</th>
                      <th style={{ textAlign: 'right' }}>CBMAM</th>
                      <th style={{ textAlign: 'right' }}>6ª OPAM</th>
                      <th style={{ textAlign: 'right' }}>7ª OPAM</th>
                      <th style={{ textAlign: 'right' }}>Prevfogo</th>
                      <th style={{ textAlign: 'right' }}>Força Nac.</th>
                      <th style={{ textAlign: 'right' }}>Brig. Mun.</th>
                      <th style={{ textAlign: 'right' }}>Brig. SEMA</th>
                      <th style={{ textAlign: 'right' }}>Atuação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {polosList.map((r) => (
                      <tr key={r.nome}>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>
                          {r.ordem}
                        </td>
                        <td
                          style={{
                            fontWeight: r.nome === 'Manaus' ? 800 : 600,
                          }}
                        >
                          {r.nome}
                        </td>
                        <td className="a4-num a4-cbmam">{r.cbmam}</td>
                        <td
                          className={`a4-num ${r.opamv === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.opamv}
                        </td>
                        <td
                          className={`a4-num ${r.opam_ref === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.opam_ref}
                        </td>
                        <td
                          className={`a4-num ${r.prevfogo === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.prevfogo}
                        </td>
                        <td className={`a4-num ${r.fn === 0 ? 'a4-zero' : ''}`}>
                          {r.fn}
                        </td>
                        <td
                          className={`a4-num ${r.brig_mun === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.brig_mun}
                        </td>
                        <td
                          className={`a4-num ${r.brig_semas === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.brig_semas}
                        </td>
                        <td className="a4-num a4-total">{r.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>SUBTOTAL POLOS (26)</td>
                      <td className="a4-num">{totPolos.cbmam}</td>
                      <td className="a4-num">{totPolos.opamv}</td>
                      <td className="a4-num">{totPolos.opam_ref}</td>
                      <td className="a4-num">{totPolos.prevfogo}</td>
                      <td className="a4-num">{totPolos.fn}</td>
                      <td className="a4-num">{totPolos.brig_mun}</td>
                      <td className="a4-num">{totPolos.brig_semas}</td>
                      <td className="a4-num">{totPolos.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Tabela 3 — 12 Bases Temporárias */}
              <div className="a4-section">
                <h3 className="a4-section-title">
                  3. BASES TEMPORÁRIAS / PROVISÓRIAS (12 BASES AVANÇADAS)
                </h3>
                <table className="a4-table a4-table-compact">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: 28 }}>#</th>
                      <th style={{ textAlign: 'left' }}>Base Temporária</th>
                      <th style={{ textAlign: 'right' }}>CBMAM</th>
                      <th style={{ textAlign: 'right' }}>6ª OPAM</th>
                      <th style={{ textAlign: 'right' }}>7ª OPAM</th>
                      <th style={{ textAlign: 'right' }}>Prevfogo</th>
                      <th style={{ textAlign: 'right' }}>Força Nac.</th>
                      <th style={{ textAlign: 'right' }}>Brig. Mun.</th>
                      <th style={{ textAlign: 'right' }}>Brig. SEMA</th>
                      <th style={{ textAlign: 'right' }}>Atuação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basesList.map((r) => (
                      <tr key={r.nome}>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>
                          {r.ordem}
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.nome}</td>
                        <td className="a4-num a4-zero">0</td>
                        <td
                          className={`a4-num ${r.opamv === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.opamv}
                        </td>
                        <td
                          className={`a4-num ${r.opam_ref === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.opam_ref}
                        </td>
                        <td
                          className={`a4-num ${r.prevfogo === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.prevfogo}
                        </td>
                        <td className={`a4-num ${r.fn === 0 ? 'a4-zero' : ''}`}>
                          {r.fn}
                        </td>
                        <td
                          className={`a4-num ${r.brig_mun === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.brig_mun}
                        </td>
                        <td
                          className={`a4-num ${r.brig_semas === 0 ? 'a4-zero' : ''}`}
                        >
                          {r.brig_semas}
                        </td>
                        <td className="a4-num a4-total">{r.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>SUBTOTAL BASES (12)</td>
                      <td className="a4-num">0</td>
                      <td className="a4-num">{totBases.opamv}</td>
                      <td className="a4-num">{totBases.opam_ref}</td>
                      <td className="a4-num">{totBases.prevfogo}</td>
                      <td className="a4-num">{totBases.fn}</td>
                      <td className="a4-num">{totBases.brig_mun}</td>
                      <td className="a4-num">{totBases.brig_semas}</td>
                      <td className="a4-num">{totBases.total}</td>
                    </tr>
                    <tr className="a4-grand-row">
                      <td colSpan={2}>TOTAL GERAL (POLOS + BASES)</td>
                      <td className="a4-num">{totGeral.cbmam}</td>
                      <td className="a4-num">{totGeral.opamv}</td>
                      <td className="a4-num">{totGeral.opam_ref}</td>
                      <td className="a4-num">{totGeral.prevfogo}</td>
                      <td className="a4-num">{totGeral.fn}</td>
                      <td className="a4-num">{totGeral.brig_mun}</td>
                      <td className="a4-num">{totGeral.brig_semas}</td>
                      <td className="a4-num">{totGeral.totalAtuacao}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bloco de Assinaturas Oficiais */}
              <div className="a4-signatures">
                <div className="a4-sig-box">
                  <div className="a4-sig-line" />
                  <div className="a4-sig-name">SALA DE SITUAÇÃO / CBI</div>
                  <div className="a4-sig-role">
                    Consolidação de Dados Operacionais
                  </div>
                </div>
                <div className="a4-sig-box">
                  <div className="a4-sig-line" />
                  <div className="a4-sig-name">
                    COMANDO DE BOMBEIROS DO INTERIOR
                  </div>
                  <div className="a4-sig-role">
                    Corpo de Bombeiros Militar do Amazonas
                  </div>
                </div>
              </div>

              <div className="a4-footer-note">
                Documento gerado automaticamente pelo Sistema de Comando e
                Controle — Mapa Operacional CBMAM em {emissionInfo.dateLong} às{' '}
                {emissionInfo.time} (Horário de Manaus). *ADM 2º CRBM (Manaus):{' '}
                {ADM_2_CRBM_MANAUS} militares.
              </div>
            </div>
          )}

          {/* ==============================================================
              ABA 2: DASHBOARD EXECUTIVO COM GRÁFICOS VISUAIS
              ============================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* 4 Cards Executivos */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12,
                }}
              >
                {[
                  {
                    label: 'EFETIVO GERAL INTEGRADO',
                    val: fmtNum(totGeral.efetivoGeralInstituicoes),
                    sub: 'Todas as instituições em prontidão',
                    color: '#38bdf8',
                    Icon: Award,
                  },
                  {
                    label: 'EM ATUAÇÃO NA OPERAÇÃO',
                    val: fmtNum(totGeral.totalAtuacao),
                    sub: `${totGeral.capitalAtuacao} Capital • ${totGeral.interiorAtuacao} Interior`,
                    color: '#facc15',
                    Icon: Flame,
                  },
                  {
                    label: 'CBMAM (POLOS + ADM)',
                    val: fmtNum(totGeral.cbmam + ADM_2_CRBM_MANAUS),
                    sub: `${totGeral.cbmamCap} Cap • ${totGeral.cbmamIntPolos} Int • ${ADM_2_CRBM_MANAUS} ADM`,
                    color: '#ef4444',
                    Icon: Shield,
                  },
                  {
                    label: 'MEIOS & AERONAVES',
                    val: fmtNum(totRecursos.total),
                    sub: `${totRecursos.combate} Combate • ${totRecursos.apoio} Apoio • ${totRecursos.aereo} Aéreo`,
                    color: '#4ade80',
                    Icon: Plane,
                  },
                ].map(({ label, val, sub, color, Icon }) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid #1e293b',
                      borderTop: `3px solid ${color}`,
                      borderRadius: 12,
                      padding: '14px 16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: '#94a3b8',
                          letterSpacing: 0.6,
                        }}
                      >
                        {label}
                      </span>
                      <Icon size={16} color={color} />
                    </div>
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 900,
                        color: '#ffffff',
                        fontFamily: "'JetBrains Mono', monospace",
                        margin: '6px 0 3px',
                      }}
                    >
                      {val}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Grade de 2 colunas: Composição por Instituição + Top 10 Municípios */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                  gap: 16,
                }}
              >
                {/* Gráfico 1: Barras Horizontais por Instituição */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: '#f8fafc',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <BarChart3 size={15} color="#38bdf8" />
                    PARTICIPAÇÃO POR INSTITUIÇÃO (EFETIVO GERAL)
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {quadro01Instituicoes.map((it) => (
                      <div key={it.label}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 11.5,
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>
                            {it.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color: '#f8fafc',
                              fontWeight: 800,
                            }}
                          >
                            {it.valor}{' '}
                            <span style={{ color: '#94a3b8', fontSize: 10.5 }}>
                              ({it.pct}%)
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: 8,
                            background: 'rgba(30,41,59,0.9)',
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, Number(it.pct))}%`,
                              height: '100%',
                              background: it.color,
                              borderRadius: 999,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico 2: Top 10 Municípios em Atuação (Clicável!) */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: '#f8fafc',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <MapPin size={15} color="#facc15" />
                    TOP 10 MUNICÍPIOS / BASES EM ATUAÇÃO (CLIQUE PARA FOCAR)
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {top10Atuacao.map((m, i) => {
                      const maxVal = top10Atuacao[0]?.total || 1;
                      const pct = Math.round((m.total / maxVal) * 100);
                      return (
                        <div
                          key={`${m.tipo}-${m.nome}`}
                          onClick={() => onSelectMuni?.(m.nome)}
                          style={{
                            cursor: 'pointer',
                            padding: '5px 8px',
                            borderRadius: 7,
                            background: 'rgba(30, 41, 59, 0.45)',
                            border: '1px solid rgba(148,163,184,0.12)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: 11.5,
                              marginBottom: 4,
                            }}
                          >
                            <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                              {i + 1}. {m.nome}{' '}
                              <span
                                style={{
                                  fontSize: 9.5,
                                  color:
                                    m.tipo === 'base' ? '#fbbf24' : '#38bdf8',
                                  marginLeft: 4,
                                }}
                              >
                                {m.tipo === 'base' ? 'BASE' : m.crbm}
                              </span>
                            </span>
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 900,
                                color: '#facc15',
                              }}
                            >
                              {m.total} op.
                            </span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: 6,
                              background: 'rgba(15,23,42,0.9)',
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: m.inArco
                                  ? 'linear-gradient(90deg, #f97316, #ef4444)'
                                  : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              ABA 3: TABELAS INTERATIVAS (POLOS + BASES, ZERO TRACINHOS)
              ============================================================== */}
          {activeTab === 'tabelas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Tabela Polos */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#38bdf8',
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    <Building2 size={15} />
                    1. MUNICÍPIOS POLO ({filteredPolos.length} DE{' '}
                    {polosList.length})
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    CBMAM: <b style={{ color: '#facc15' }}>{totPolos.cbmam}</b>{' '}
                    • Em Atuação:{' '}
                    <b style={{ color: '#4ade80' }}>{totPolos.total}</b>
                  </span>
                </div>

                <div
                  style={{
                    overflowX: 'auto',
                    borderRadius: 10,
                    border: '1px solid #1e293b',
                  }}
                >
                  <table className="rel-dark-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Município</th>
                        <th style={{ textAlign: 'left' }}>CRBM</th>
                        <th style={{ textAlign: 'right', color: '#facc15' }}>
                          CBMAM
                        </th>
                        <th style={{ textAlign: 'right' }}>6ª OPAM</th>
                        <th style={{ textAlign: 'right' }}>7ª OPAM</th>
                        <th style={{ textAlign: 'right' }}>Prevfogo</th>
                        <th style={{ textAlign: 'right' }}>Força Nac.</th>
                        <th style={{ textAlign: 'right' }}>Brig. Mun.</th>
                        <th style={{ textAlign: 'right' }}>Brig. SEMA</th>
                        <th style={{ textAlign: 'right', color: '#4ade80' }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPolos.map((r) => (
                        <tr
                          key={r.nome}
                          onClick={() => onSelectMuni?.(r.nome)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                            {r.nome}
                            {r.inArco && (
                              <Flame
                                size={11}
                                color="#f97316"
                                style={{
                                  marginLeft: 6,
                                  display: 'inline',
                                  verticalAlign: 'middle',
                                }}
                              />
                            )}
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: 11 }}>
                            {r.crbm}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.cbmam, '#facc15')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.opamv, '#fbbf24')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.opam_ref, '#38bdf8')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.prevfogo, '#4ade80')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.fn, '#67e8f9')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.brig_mun, '#fb923c')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.brig_semas, '#34d399')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.total, '#4ade80')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2}>SUBTOTAL POLOS (26)</td>
                        <td style={{ textAlign: 'right', color: '#facc15' }}>
                          {totPolos.cbmam}
                        </td>
                        <td style={{ textAlign: 'right' }}>{totPolos.opamv}</td>
                        <td style={{ textAlign: 'right' }}>
                          {totPolos.opam_ref}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {totPolos.prevfogo}
                        </td>
                        <td style={{ textAlign: 'right' }}>{totPolos.fn}</td>
                        <td style={{ textAlign: 'right' }}>
                          {totPolos.brig_mun}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {totPolos.brig_semas}
                        </td>
                        <td style={{ textAlign: 'right', color: '#4ade80' }}>
                          {totPolos.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Tabela Bases */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#f59e0b',
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    <Tent size={15} />
                    2. BASES TEMPORÁRIAS ({filteredBases.length} DE{' '}
                    {basesList.length})
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Em Atuação:{' '}
                    <b style={{ color: '#fbbf24' }}>{totBases.total}</b>
                  </span>
                </div>

                <div
                  style={{
                    overflowX: 'auto',
                    borderRadius: 10,
                    border: '1px solid #1e293b',
                  }}
                >
                  <table className="rel-dark-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Base Temporária</th>
                        <th style={{ textAlign: 'left' }}>CRBM</th>
                        <th style={{ textAlign: 'right' }}>CBMAM</th>
                        <th style={{ textAlign: 'right' }}>6ª OPAM</th>
                        <th style={{ textAlign: 'right' }}>7ª OPAM</th>
                        <th style={{ textAlign: 'right' }}>Prevfogo</th>
                        <th style={{ textAlign: 'right' }}>Força Nac.</th>
                        <th style={{ textAlign: 'right' }}>Brig. Mun.</th>
                        <th style={{ textAlign: 'right' }}>Brig. SEMA</th>
                        <th style={{ textAlign: 'right', color: '#fbbf24' }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBases.map((r) => (
                        <tr
                          key={r.nome}
                          onClick={() => onSelectMuni?.(r.nome)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                            {r.nome}
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: 11 }}>
                            {r.crbm}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(0)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.opamv, '#fbbf24')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.opam_ref, '#38bdf8')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.prevfogo, '#4ade80')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.fn, '#67e8f9')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.brig_mun, '#fb923c')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.brig_semas, '#34d399')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {renderZeroAware(r.total, '#fbbf24')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2}>SUBTOTAL BASES (12)</td>
                        <td style={{ textAlign: 'right' }}>0</td>
                        <td style={{ textAlign: 'right' }}>{totBases.opamv}</td>
                        <td style={{ textAlign: 'right' }}>
                          {totBases.opam_ref}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {totBases.prevfogo}
                        </td>
                        <td style={{ textAlign: 'right' }}>{totBases.fn}</td>
                        <td style={{ textAlign: 'right' }}>
                          {totBases.brig_mun}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {totBases.brig_semas}
                        </td>
                        <td style={{ textAlign: 'right', color: '#fbbf24' }}>
                          {totBases.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              ABA 4: COMANDOS REGIONAIS CRBM (350 MILITARES INTERIOR)
              ============================================================== */}
          {activeTab === 'crbm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 10,
                }}
              >
                {CRBM_SUBTOTAIS.map((s) => (
                  <div
                    key={s.crbm}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid #1e293b',
                      borderLeft: '3px solid #f97316',
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: '#94a3b8',
                      }}
                    >
                      {s.crbm}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: '#ffffff',
                        fontFamily: "'JetBrains Mono', monospace",
                        margin: '4px 0',
                      }}
                    >
                      {s.total}
                    </div>
                    <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                      Combatente: <b>{s.combatente}</b> • Saúde:{' '}
                      <b>{s.saude}</b>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 10,
                  border: '1px solid #1e293b',
                }}
              >
                <table className="rel-dark-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>CRBM</th>
                      <th style={{ textAlign: 'left' }}>
                        Grupamento / Município
                      </th>
                      <th style={{ textAlign: 'right' }}>Combatente</th>
                      <th style={{ textAlign: 'right' }}>Saúde</th>
                      <th style={{ textAlign: 'right', color: '#facc15' }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRBM_DETALHAMENTO.map((c, idx) => (
                      <tr
                        key={`${c.crbm}-${idx}`}
                        onClick={() =>
                          c.municipio && onSelectMuni?.(c.municipio)
                        }
                        style={{
                          cursor: c.municipio ? 'pointer' : 'default',
                        }}
                      >
                        <td style={{ fontWeight: 800, color: '#38bdf8' }}>
                          {c.crbm}
                        </td>
                        <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                          {c.grupamento}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(c.combatente, '#e2e8f0')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(c.saude, '#4ade80')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(c.total, '#facc15')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>TOTAL GERAL CRBM (INTERIOR)</td>
                      <td style={{ textAlign: 'right' }}>296</td>
                      <td style={{ textAlign: 'right' }}>54</td>
                      <td style={{ textAlign: 'right', color: '#facc15' }}>
                        350
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              ABA 5: MEIOS & VIATURAS (160 MEIOS — TABELA ÚNICA SEM DUPLICAR)
              ============================================================== */}
          {activeTab === 'recursos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: 10,
                }}
              >
                {[
                  {
                    label: 'TOTAL DE MEIOS',
                    val: totRecursos.total,
                    color: '#38bdf8',
                  },
                  {
                    label: 'COMBATE A INCÊNDIO',
                    val: totRecursos.combate,
                    color: '#ef4444',
                  },
                  {
                    label: 'APOIO & RESGATE',
                    val: totRecursos.apoio,
                    color: '#facc15',
                  },
                  {
                    label: 'EMBARCAÇÕES / JET',
                    val: totRecursos.fluvial,
                    color: '#22d3ee',
                  },
                  {
                    label: 'AERONAVES',
                    val: totRecursos.aereo,
                    color: '#60a5fa',
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid #1e293b',
                      borderTop: `3px solid ${card.color}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#94a3b8',
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: '#ffffff',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginTop: 4,
                      }}
                    >
                      {card.val}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 10,
                  border: '1px solid #1e293b',
                }}
              >
                <table className="rel-dark-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Município / Base</th>
                      <th style={{ textAlign: 'right' }}>ABT</th>
                      <th style={{ textAlign: 'right' }}>ATF</th>
                      <th style={{ textAlign: 'right', color: '#f87171' }}>
                        Combate
                      </th>
                      <th style={{ textAlign: 'right' }}>AR</th>
                      <th style={{ textAlign: 'right' }}>UR</th>
                      <th style={{ textAlign: 'right', color: '#facc15' }}>
                        Apoio/Resg.
                      </th>
                      <th style={{ textAlign: 'right', color: '#22d3ee' }}>
                        Fluvial
                      </th>
                      <th style={{ textAlign: 'right', color: '#60a5fa' }}>
                        Aéreo
                      </th>
                      <th style={{ textAlign: 'right', color: '#4ade80' }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecursos.map((r) => (
                      <tr
                        key={r.mun}
                        onClick={() => onSelectMuni?.(r.mun)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                          {r.mun}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.abt)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.atf)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.combate, '#f87171')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.ar)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.ur)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.apoio, '#facc15')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.fluvial, '#22d3ee')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.aereo, '#60a5fa')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {renderZeroAware(r.total, '#4ade80')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>TOTAL GERAL DE MEIOS</td>
                      <td style={{ textAlign: 'right' }}>{totRecursos.abt}</td>
                      <td style={{ textAlign: 'right' }}>{totRecursos.atf}</td>
                      <td style={{ textAlign: 'right', color: '#f87171' }}>
                        {totRecursos.combate}
                      </td>
                      <td style={{ textAlign: 'right' }}>{totRecursos.ar}</td>
                      <td style={{ textAlign: 'right' }}>{totRecursos.ur}</td>
                      <td style={{ textAlign: 'right', color: '#facc15' }}>
                        {totRecursos.apoio}
                      </td>
                      <td style={{ textAlign: 'right', color: '#22d3ee' }}>
                        {totRecursos.fluvial}
                      </td>
                      <td style={{ textAlign: 'right', color: '#60a5fa' }}>
                        {totRecursos.aereo}
                      </td>
                      <td style={{ textAlign: 'right', color: '#4ade80' }}>
                        {totRecursos.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              ABA 6: PREVFOGO / IBAMA
              ============================================================== */}
          {activeTab === 'prevfogo' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 14,
              }}
            >
              {PREVFOGO_RECURSOS_DISPONIVEIS.map((pf) => (
                <div
                  key={pf.muni}
                  onClick={() => onSelectMuni?.(pf.muni)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 12,
                    padding: 15,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                      borderBottom: '1px solid #1e293b',
                      paddingBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      {pf.muni}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        fontWeight: 900,
                        color: '#4ade80',
                        background: 'rgba(34,197,94,0.16)',
                        padding: '2px 9px',
                        borderRadius: 999,
                      }}
                    >
                      {pf.total} brigadistas
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 7,
                    }}
                  >
                    {(pf.bases || []).map((b, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(30, 41, 59, 0.6)',
                          borderRadius: 8,
                          padding: '7px 10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              color: '#e2e8f0',
                            }}
                          >
                            {b.local}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                            {b.detalhe}
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 800,
                            color: '#86efac',
                            fontSize: 12.5,
                          }}
                        >
                          {b.efetivo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
