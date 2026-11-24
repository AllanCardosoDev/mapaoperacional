import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  RefreshCw,
  Edit3,
  Save,
  Check,
  RotateCcw,
  Building2,
  Tent,
  Layers,
  Shield,
  PieChart,
  Users,
} from 'lucide-react';
import {
  MUNICIPIOS_POLO_LIST,
  BASES_TEMPORARIAS_LIST,
  BENCHMARK_PERMANENTE_CBMAM,
  BENCHMARK_MUNICIPIOS_OPERACIONAL,
  BENCHMARK_BASES_OPERACIONAL,
  EFETIVO_GERAL_INSTITUICOES,
  CRBM_DETALHAMENTO,
  CRBM_SUBTOTAIS,
  norm,
} from '../data/efetivoOficial';

export function EfetivoModal({
  onClose,
  dbEfetivo = null,
  reportDate = null,
  initialEditMode = false,
  onSaveEfetivo = async () => {},
  onSelectMuni = () => {},
}) {
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'municipios' | 'bases' | 'geral' | 'crbm' | 'resumo'
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Inicializa mapa de edições com fallback inteligente para os benchmarks oficiais
  const [editedData, setEditedData] = useState(() => {
    const map = {};

    // 1. Municípios Polo (26)
    MUNICIPIOS_POLO_LIST.forEach((nome) => {
      const isCap = nome === 'Manaus';
      const found = (dbEfetivo || []).find(
        (r) =>
          norm(r.mun) === norm(nome) &&
          (r.tipo === 'capital' || r.tipo === 'interior' || !r.tipo)
      );
      const bm = BENCHMARK_MUNICIPIOS_OPERACIONAL[nome] || {};
      const bm_perm = BENCHMARK_PERMANENTE_CBMAM[nome] || 0;

      map[`mun:${norm(nome)}`] = {
        nome,
        tipo: isCap ? 'capital' : 'interior',
        cbmam: Number(
          found?._custom ? (found.cbmam ?? bm_perm) : found?.cbmam || bm_perm
        ),
        serv_ord: Number(
          found?._custom
            ? (found.serv_ord ?? found.cbmam ?? bm_perm)
            : found?.cbmam || bm_perm
        ),
        opamv: Number(
          found?._custom
            ? (found.opamv ?? bm.opamv ?? 0)
            : found?.opamv || bm.opamv || 0
        ),
        opam_ref: Number(
          found?._custom
            ? (found.opam_ref ?? bm.opam_ref ?? 0)
            : found?.opam_ref || bm.opam_ref || 0
        ),
        prevfogo: Number(
          found?._custom
            ? (found.prevfogo ?? bm.prevfogo ?? 0)
            : found?.prevfogo || bm.prevfogo || 0
        ),
        fn: Number(
          found?._custom ? (found.fn ?? bm.fn ?? 0) : found?.fn || bm.fn || 0
        ),
        brig_mun: Number(
          found?._custom
            ? (found.brig_mun ?? bm.brig_mun ?? 0)
            : found?.brig_mun || bm.brig_mun || 0
        ),
        brig_semas: Number(
          found?._custom
            ? (found.brig_semas ?? bm.brig_semas ?? 0)
            : found?.brig_semas || bm.brig_semas || 0
        ),
      };
    });

    // 2. Bases Temporárias (12)
    BASES_TEMPORARIAS_LIST.forEach((nome) => {
      const found = (dbEfetivo || []).find(
        (r) =>
          (r.tipo === 'base' || norm(r.mun).includes('km 53')) &&
          (norm(r.mun) === norm(nome) ||
            (norm(nome).includes('km 53') && norm(r.mun).includes('km 53')))
      );
      const bm = BENCHMARK_BASES_OPERACIONAL[nome] || {};

      map[`base:${norm(nome)}`] = {
        nome,
        tipo: 'base',
        cbmam: 0,
        serv_ord: 0,
        opamv: Number(
          found?._custom
            ? (found.opamv ?? bm.opamv ?? 0)
            : found?.opamv || bm.opamv || 0
        ),
        opam_ref: Number(
          found?._custom
            ? (found.opam_ref ?? bm.opam_ref ?? 0)
            : found?.opam_ref || bm.opam_ref || 0
        ),
        prevfogo: Number(
          found?._custom
            ? (found.prevfogo ?? bm.prevfogo ?? 0)
            : found?.prevfogo || bm.prevfogo || 0
        ),
        fn: Number(
          found?._custom ? (found.fn ?? bm.fn ?? 0) : found?.fn || bm.fn || 0
        ),
        brig_mun: Number(
          found?._custom
            ? (found.brig_mun ?? bm.brig_mun ?? 0)
            : found?.brig_mun || bm.brig_mun || 0
        ),
        brig_semas: Number(
          found?._custom
            ? (found.brig_semas ?? bm.brig_semas ?? 0)
            : found?.brig_semas || bm.brig_semas || 0
        ),
      };
    });

    return map;
  });

  // Atualiza editedData quando dbEfetivo chega do Supabase
  useEffect(() => {
    if (!dbEfetivo || dbEfetivo.length === 0) return;
    setEditedData((prev) => {
      const next = { ...prev };
      dbEfetivo.forEach((r) => {
        if (!r.mun) return;
        const isBase =
          r.tipo === 'base' ||
          BASES_TEMPORARIAS_LIST.some((b) => norm(b) === norm(r.mun));
        const key = `${isBase ? 'base' : 'mun'}:${norm(r.mun)}`;
        const nomeOriginal = isBase
          ? BASES_TEMPORARIAS_LIST.find((b) => norm(b) === norm(r.mun)) || r.mun
          : MUNICIPIOS_POLO_LIST.find((m) => norm(m) === norm(r.mun)) || r.mun;

        const bm = isBase
          ? BENCHMARK_BASES_OPERACIONAL[nomeOriginal] || {}
          : BENCHMARK_MUNICIPIOS_OPERACIONAL[nomeOriginal] || {};
        const bm_perm = isBase
          ? 0
          : BENCHMARK_PERMANENTE_CBMAM[nomeOriginal] || 0;

        const cbmam = isBase
          ? 0
          : Number(r._custom ? (r.cbmam ?? bm_perm) : r.cbmam || bm_perm);
        const serv_ord = cbmam;
        const opamv = Number(
          r._custom ? (r.opamv ?? bm.opamv ?? 0) : r.opamv || bm.opamv || 0
        );
        const opam_ref = Number(
          r._custom
            ? (r.opam_ref ?? bm.opam_ref ?? 0)
            : r.opam_ref || bm.opam_ref || 0
        );
        const prevfogo = Number(
          r._custom
            ? (r.prevfogo ?? bm.prevfogo ?? 0)
            : r.prevfogo || bm.prevfogo || 0
        );
        const fn = Number(
          r._custom ? (r.fn ?? bm.fn ?? 0) : r.fn || bm.fn || 0
        );
        const brig_mun = Number(
          r._custom
            ? (r.brig_mun ?? bm.brig_mun ?? 0)
            : r.brig_mun || bm.brig_mun || 0
        );
        const brig_semas = Number(
          r._custom
            ? (r.brig_semas ?? bm.brig_semas ?? 0)
            : r.brig_semas || bm.brig_semas || 0
        );

        next[key] = {
          nome: nomeOriginal,
          tipo: isBase ? 'base' : r.mun === 'Manaus' ? 'capital' : 'interior',
          cbmam,
          serv_ord,
          opamv,
          opam_ref,
          prevfogo,
          fn,
          brig_mun,
          brig_semas,
          _custom: !!r._custom,
        };
      });
      return next;
    });
  }, [dbEfetivo]);

  // Manipulador de alteração de campo em modo de edição
  const handleCellChange = (key, field, val) => {
    const numVal = Math.max(0, parseInt(val, 10) || 0);
    setEditedData((prev) => {
      const current = prev[key] || {};
      return {
        ...prev,
        [key]: {
          ...current,
          [field]: numVal,
          _custom: true,
        },
      };
    });
  };

  // Listas processadas
  const municipiosList = useMemo(() => {
    return MUNICIPIOS_POLO_LIST.map((nome) => {
      const data = editedData[`mun:${norm(nome)}`] || {};
      const cbmam = Number(
        data._custom
          ? (data.cbmam ?? BENCHMARK_PERMANENTE_CBMAM[nome] ?? 0)
          : data.cbmam || BENCHMARK_PERMANENTE_CBMAM[nome] || 0
      );
      const serv_ord = cbmam;
      const opamv = Number(
        data._custom
          ? (data.opamv ?? BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.opamv ?? 0)
          : data.opamv || BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.opamv || 0
      );
      const opam_ref = Number(
        data._custom
          ? (data.opam_ref ??
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.opam_ref ??
              0)
          : data.opam_ref ||
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.opam_ref ||
              0
      );
      const prevfogo = Number(
        data._custom
          ? (data.prevfogo ??
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.prevfogo ??
              0)
          : data.prevfogo ||
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.prevfogo ||
              0
      );
      const fn = Number(
        data._custom
          ? (data.fn ?? BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.fn ?? 0)
          : data.fn || BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.fn || 0
      );
      const brig_mun = Number(
        data._custom
          ? (data.brig_mun ??
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.brig_mun ??
              0)
          : data.brig_mun ||
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.brig_mun ||
              0
      );
      const brig_semas = Number(
        data._custom
          ? (data.brig_semas ??
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.brig_semas ??
              0)
          : data.brig_semas ||
              BENCHMARK_MUNICIPIOS_OPERACIONAL[nome]?.brig_semas ||
              0
      );
      // Total em atuação na operação (Col M da planilha)
      const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;
      return {
        key: `mun:${norm(nome)}`,
        nome,
        tipo: nome === 'Manaus' ? 'capital' : 'interior',
        cbmam,
        serv_ord,
        opamv,
        opam_ref,
        prevfogo,
        fn,
        brig_mun,
        brig_semas,
        total,
      };
    });
  }, [editedData]);

  const basesList = useMemo(() => {
    return BASES_TEMPORARIAS_LIST.map((nome) => {
      const data = editedData[`base:${norm(nome)}`] || {};
      const cbmam = 0;
      const serv_ord = 0;
      const opamv = Number(
        data._custom
          ? (data.opamv ?? BENCHMARK_BASES_OPERACIONAL[nome]?.opamv ?? 0)
          : data.opamv || BENCHMARK_BASES_OPERACIONAL[nome]?.opamv || 0
      );
      const opam_ref = Number(
        data._custom
          ? (data.opam_ref ?? BENCHMARK_BASES_OPERACIONAL[nome]?.opam_ref ?? 0)
          : data.opam_ref || BENCHMARK_BASES_OPERACIONAL[nome]?.opam_ref || 0
      );
      const prevfogo = Number(
        data._custom
          ? (data.prevfogo ?? BENCHMARK_BASES_OPERACIONAL[nome]?.prevfogo ?? 0)
          : data.prevfogo || BENCHMARK_BASES_OPERACIONAL[nome]?.prevfogo || 0
      );
      const fn = Number(
        data._custom
          ? (data.fn ?? BENCHMARK_BASES_OPERACIONAL[nome]?.fn ?? 0)
          : data.fn || BENCHMARK_BASES_OPERACIONAL[nome]?.fn || 0
      );
      const brig_mun = Number(
        data._custom
          ? (data.brig_mun ?? BENCHMARK_BASES_OPERACIONAL[nome]?.brig_mun ?? 0)
          : data.brig_mun || BENCHMARK_BASES_OPERACIONAL[nome]?.brig_mun || 0
      );
      const brig_semas = Number(
        data._custom
          ? (data.brig_semas ??
              BENCHMARK_BASES_OPERACIONAL[nome]?.brig_semas ??
              0)
          : data.brig_semas ||
              BENCHMARK_BASES_OPERACIONAL[nome]?.brig_semas ||
              0
      );
      // Total em atuação na base (Col M da planilha)
      const total = opamv + opam_ref + prevfogo + fn + brig_mun + brig_semas;
      return {
        key: `base:${norm(nome)}`,
        nome,
        tipo: 'base',
        cbmam,
        serv_ord,
        opamv,
        opam_ref,
        prevfogo,
        fn,
        brig_mun,
        brig_semas,
        total,
      };
    });
  }, [editedData]);

  // Filtragem da busca
  const filterRows = (list) => {
    if (!search.trim()) return list;
    const q = norm(search);
    return list.filter((r) => norm(r.nome).includes(q));
  };

  const filteredMunis = filterRows(municipiosList);
  const filteredBases = filterRows(basesList);

  // Subtotais específicos de Municípios Polo e Bases
  const subtotalMunis = useMemo(() => {
    return municipiosList.reduce(
      (acc, r) => {
        acc.cbmam += r.cbmam || 0;
        acc.serv_ord += r.serv_ord || 0;
        acc.opamv += r.opamv || 0;
        acc.opam_ref += r.opam_ref || 0;
        acc.prevfogo += r.prevfogo || 0;
        acc.fn += r.fn || 0;
        acc.brig_mun += r.brig_mun || 0;
        acc.brig_semas += r.brig_semas || 0;
        acc.total += r.total || 0;
        return acc;
      },
      {
        cbmam: 0,
        serv_ord: 0,
        opamv: 0,
        opam_ref: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_semas: 0,
        total: 0,
      }
    );
  }, [municipiosList]);

  const subtotalBases = useMemo(() => {
    return basesList.reduce(
      (acc, r) => {
        acc.cbmam += r.cbmam || 0;
        acc.serv_ord += r.serv_ord || 0;
        acc.opamv += r.opamv || 0;
        acc.opam_ref += r.opam_ref || 0;
        acc.prevfogo += r.prevfogo || 0;
        acc.fn += r.fn || 0;
        acc.brig_mun += r.brig_mun || 0;
        acc.brig_semas += r.brig_semas || 0;
        acc.total += r.total || 0;
        return acc;
      },
      {
        cbmam: 0,
        serv_ord: 0,
        opamv: 0,
        opam_ref: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_semas: 0,
        total: 0,
      }
    );
  }, [basesList]);

  // Totais consolidados
  const totals = useMemo(() => {
    const all = [...municipiosList, ...basesList];
    return all.reduce(
      (acc, r) => {
        acc.cbmam += r.cbmam || 0;
        acc.serv_ord += r.serv_ord || 0;
        acc.opamv += r.opamv || 0;
        acc.opam_ref += r.opam_ref || 0;
        acc.prevfogo += r.prevfogo || 0;
        acc.fn += r.fn || 0;
        acc.brig_mun += r.brig_mun || 0;
        acc.brig_semas += r.brig_semas || 0;
        acc.total += r.total || 0;
        if (r.tipo === 'capital' || r.nome === 'Manaus') {
          acc.capital += r.total || 0;
        } else if (r.tipo === 'base') {
          acc.bases += r.total || 0;
          acc.interior += r.total || 0;
        } else {
          acc.interiorPolos += r.total || 0;
          acc.interior += r.total || 0;
        }
        return acc;
      },
      {
        cbmam: 0,
        serv_ord: 0,
        opamv: 0,
        opam_ref: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_semas: 0,
        total: 0,
        capital: 0,
        interior: 0,
        interiorPolos: 0,
        bases: 0,
      }
    );
  }, [municipiosList, basesList]);

  // Resumo por Missão (Capital x Interior x Total x %)
  const resumoMissoes = useMemo(() => {
    const missoes = [
      { key: 'cbmam', label: 'CBMAM (Efetivo nos Municípios Polo)' },
      { key: 'opamv', label: '6ª Fase OPAMV (26/10 a 25/11)' },
      { key: 'opam_ref', label: '7ª Fase OPAMV (13/11 a 12/12)' },
      { key: 'prevfogo', label: 'PREVFOGO / IBAMA' },
      { key: 'fn', label: 'Força Nacional de Segurança Pública' },
      { key: 'brig_mun', label: 'Brigadistas Municipais' },
      { key: 'brig_semas', label: 'Brigadistas SEMA' },
    ];

    const grandTotal = totals.total || 1;

    return missoes.map((m) => {
      let cap = 0;
      let inte = 0;

      municipiosList.forEach((r) => {
        const val = r[m.key] || 0;
        if (r.tipo === 'capital' || r.nome === 'Manaus') cap += val;
        else inte += val;
      });

      basesList.forEach((r) => {
        inte += r[m.key] || 0;
      });

      const tot = cap + inte;
      const perc = ((tot / grandTotal) * 100).toFixed(1) + '%';

      return {
        ...m,
        capital: cap,
        interior: inte,
        total: tot,
        perc,
      };
    });
  }, [municipiosList, basesList, totals]);

  // Salvar edições no banco de dados Supabase
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      const payload = [...municipiosList, ...basesList].map((r) => ({
        mun: r.nome,
        tipo: r.tipo,
        cbmam: r.cbmam,
        serv_ord: r.cbmam,
        ord: r.cbmam,
        servico: r.cbmam,
        opamv: r.opamv,
        opam_ref: r.opam_ref,
        prevfogo: r.prevfogo,
        fn: r.fn,
        marinha: 0,
        cbmsp: 0,
        brig_mun: r.brig_mun,
        brig_semas: r.brig_semas,
        total: r.total,
        _custom: true,
      }));

      const res = await onSaveEfetivo(payload);
      if (!res || !res.ok) {
        throw new Error(
          res?.error ||
            'Não foi possível gravar as alterações no banco de dados.'
        );
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      setErrorMessage(
        'Falha ao gravar no Supabase: ' + (err.message || String(err))
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 1280,
          width: '96vw',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: isEditing ? '2px solid #10b981' : '1.5px solid #0284c7',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: isEditing
            ? '0 25px 60px rgba(16, 185, 129, 0.35)'
            : '0 25px 60px rgba(0,0,0,0.95)',
        }}
      >
        {/* TOPO DO MODAL */}
        <div
          className="modal-header"
          style={{
            background: isEditing
              ? 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: isEditing
              ? '2px solid #10b981'
              : '1.5px solid #dc2626',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#ffffff',
                border: '2px solid #dc2626',
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
                style={{ width: 34, height: 34, objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: '#f8fafc',
                    margin: 0,
                    letterSpacing: '0.5px',
                  }}
                >
                  PAINEL & MODIFICAÇÃO DE EFETIVO OPERACIONAL
                </h2>
                <span
                  style={{
                    background: '#eab308',
                    color: '#0f172a',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {totals.cbmam} CBMAM
                </span>
                <span
                  style={{
                    background: isEditing ? '#059669' : '#16a34a',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {totals.total} EM ATUAÇÃO
                </span>
                {isEditing && (
                  <span
                    style={{
                      background: '#10b981',
                      color: '#022c22',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 10,
                    }}
                  >
                    MODO EDIÇÃO ATIVO
                  </span>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>
                Dados integrados com a Sala de Situação CBMAM (Relatório Diário
                Oficial)
                {reportDate ? ` • Referência: ${reportDate}` : ''}
              </p>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    borderRadius: 8,
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 800,
                    border: '1.5px solid #34d399',
                    cursor: isSaving ? 'wait' : 'pointer',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
                  }}
                  title="Gravar alterações permanentemente no banco Supabase"
                >
                  {isSaving ? (
                    <RefreshCw size={14} className="spin-slow" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>
                    {isSaving ? 'Gravando no Banco...' : 'Salvar no Banco'}
                  </span>
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 8,
                    background: '#1e293b',
                    color: '#cbd5e1',
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1px solid #475569',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Cancelar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 15px',
                  borderRadius: 8,
                  background:
                    'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  border: '1px solid #10b981',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
                title="Editar os quantitativos de efetivo diretamente neste painel"
              >
                <Edit3 size={14} />
                <span>Modificar Efetivo</span>
              </button>
            )}

            <button
              className="modal-close-btn"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: 8,
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: '6px 8px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNERS */}
        {saveSuccess && (
          <div
            style={{
              background: '#064e3b',
              borderBottom: '1px solid #10b981',
              color: '#a7f3d0',
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Check size={16} color="#34d399" />
            <span>
              Efetivo atualizado e gravado no Banco de Dados com sucesso! Os
              mapas e indicadores foram sincronizados.
            </span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: '#7f1d1d',
              borderBottom: '1px solid #ef4444',
              color: '#fecaca',
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* 4 CARDS EXECUTIVOS PRINCIPAIS */}
        <div
          style={{
            padding: '12px 18px 8px',
            background: '#090d16',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {/* CARD 1: CBMAM */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.05) 100%)',
                border: '1.5px solid #eab308',
                borderRadius: 10,
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fef08a',
                    textTransform: 'uppercase',
                  }}
                >
                  CBMAM
                </span>
                <span
                  style={{
                    background: '#854d0e',
                    color: '#fef9c3',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 8,
                  }}
                >
                  26 POLOS
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#facc15',
                  margin: '2px 0',
                }}
              >
                {totals.cbmam}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                477 Capital (Manaus) • 341 Interior • *ADM 2º CRBM: 9
              </div>
            </div>

            {/* CARD 2: TOTAL EM ATUAÇÃO NA OPERAÇÃO */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 100%)',
                border: '1.5px solid #10b981',
                borderRadius: 10,
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#6ee7b7',
                    textTransform: 'uppercase',
                  }}
                >
                  TOTAL EM ATUAÇÃO NA OPERAÇÃO
                </span>
                <span
                  style={{
                    background: '#065f46',
                    color: '#a7f3d0',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 8,
                  }}
                >
                  100% COBERTURA
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#34d399',
                  margin: '2px 0',
                }}
              >
                {totals.total}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                {totals.capital} Capital • {totals.interiorPolos} Polos •{' '}
                {totals.bases} Bases
              </div>
            </div>

            {/* CARD 3: 01 | EFETIVO GERAL (TODAS AS INSTITUIÇÕES) */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(3, 105, 161, 0.04) 100%)',
                border: '1.5px solid #38bdf8',
                borderRadius: 10,
                padding: '10px 14px',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('geral')}
              title="Clique para ver o quadro geral consolidado de todas as instituições (1.470)"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#7dd3fc',
                    textTransform: 'uppercase',
                  }}
                >
                  EFETIVO GERAL (TODAS AS INSTITUIÇÕES)
                </span>
                <span
                  style={{
                    background: '#0369a1',
                    color: '#e0f2fe',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 8,
                  }}
                >
                  QUADRO 01
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#38bdf8',
                  margin: '2px 0',
                }}
              >
                1.470
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                827 CBMAM (477 Cap + 350 Int) • 643 Parceiros e Brigadas
              </div>
            </div>

            {/* CARD 4: CRBM INTERIOR */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(194, 65, 12, 0.04) 100%)',
                border: '1.5px solid #f97316',
                borderRadius: 10,
                padding: '10px 14px',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('crbm')}
              title="Clique para ver o detalhamento do efetivo dos Comandos Regionais (CRBM)"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fdba74',
                    textTransform: 'uppercase',
                  }}
                >
                  COMANDOS CRBM (INTERIOR)
                </span>
                <span
                  style={{
                    background: '#9a3412',
                    color: '#ffedd5',
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 8,
                  }}
                >
                  4 COMANDOS
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#fb923c',
                  margin: '2px 0',
                }}
              >
                350
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                296 Combatentes • 54 Saúde (1º, 2º, 3º e 4º CRBM)
              </div>
            </div>
          </div>

          {/* BARRA DE DETALHAMENTO DAS FORÇAS (PILLS COMPACTAS) */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 8,
              padding: '6px 10px',
              background: '#0d1322',
              borderRadius: 8,
              fontSize: 11,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              border: '1px solid #1e293b',
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>OPAM EM CAMPO: </span>
              <b style={{ color: '#38bdf8' }}>
                {totals.opamv + totals.opam_ref}
              </b>
              <span style={{ color: '#64748b', fontSize: 10 }}>
                {' '}
                ({totals.opamv} 6ª • {totals.opam_ref} 7ª)
              </span>
            </div>
            <span style={{ color: '#334155' }}>|</span>
            <div>
              <span style={{ color: '#94a3b8' }}>PREVFOGO IBAMA: </span>
              <b style={{ color: '#34d399' }}>{totals.prevfogo}</b>
            </div>
            <span style={{ color: '#334155' }}>|</span>
            <div>
              <span style={{ color: '#94a3b8' }}>FORÇA NACIONAL: </span>
              <b style={{ color: '#22d3ee' }}>{totals.fn}</b>
            </div>
            <span style={{ color: '#334155' }}>|</span>
            <div>
              <span style={{ color: '#94a3b8' }}>
                BRIGADISTAS (MUN + SEMA):{' '}
              </span>
              <b style={{ color: '#fb923c' }}>
                {totals.brig_mun + totals.brig_semas}
              </b>
              <span style={{ color: '#64748b', fontSize: 10 }}>
                {' '}
                ({totals.brig_mun} Mun • {totals.brig_semas} SEMA)
              </span>
            </div>
          </div>
        </div>

        {/* BARRA DE CONTROLE: ABAS & BUSCA */}
        <div
          style={{
            padding: '10px 18px',
            background: '#0d1322',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* ABAS */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('todos')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'todos'
                    ? '1.5px solid #38bdf8'
                    : '1px solid #334155',
                background: activeTab === 'todos' ? '#0369a1' : '#1e293b',
                color: activeTab === 'todos' ? '#ffffff' : '#94a3b8',
              }}
            >
              Todos ({municipiosList.length + basesList.length})
            </button>
            <button
              onClick={() => setActiveTab('municipios')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'municipios'
                    ? '1.5px solid #eab308'
                    : '1px solid #334155',
                background: activeTab === 'municipios' ? '#854d0e' : '#1e293b',
                color: activeTab === 'municipios' ? '#fef08a' : '#94a3b8',
              }}
            >
              Municípios Polo ({municipiosList.length})
            </button>
            <button
              onClick={() => setActiveTab('bases')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'bases'
                    ? '1.5px solid #f97316'
                    : '1px solid #334155',
                background: activeTab === 'bases' ? '#9a3412' : '#1e293b',
                color: activeTab === 'bases' ? '#ffedd5' : '#94a3b8',
              }}
            >
              Bases Temporárias ({basesList.length})
            </button>
            <button
              onClick={() => setActiveTab('geral')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'geral'
                    ? '1.5px solid #38bdf8'
                    : '1px solid #334155',
                background: activeTab === 'geral' ? '#0284c7' : '#1e293b',
                color: activeTab === 'geral' ? '#ffffff' : '#94a3b8',
              }}
            >
              01 | Efetivo Geral (1.470)
            </button>
            <button
              onClick={() => setActiveTab('crbm')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'crbm'
                    ? '1.5px solid #10b981'
                    : '1px solid #334155',
                background: activeTab === 'crbm' ? '#065f46' : '#1e293b',
                color: activeTab === 'crbm' ? '#ffffff' : '#94a3b8',
              }}
            >
              Comandos CRBM (350)
            </button>
            <button
              onClick={() => setActiveTab('resumo')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                border:
                  activeTab === 'resumo'
                    ? '1.5px solid #a855f7'
                    : '1px solid #334155',
                background: activeTab === 'resumo' ? '#7e22ce' : '#1e293b',
                color: activeTab === 'resumo' ? '#ffffff' : '#94a3b8',
              }}
            >
              Resumo por Missão
            </button>
          </div>

          {/* BUSCA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '5px 10px',
              minWidth: 240,
            }}
          >
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Buscar município ou base..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: 12,
                outline: 'none',
                width: '100%',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CORPO DO MODAL: TABELAS COM SCROLL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {/* TABELA: MUNICÍPIOS POLO */}
          {(activeTab === 'todos' || activeTab === 'municipios') && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#facc15',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={16} />
                  <span>
                    1. Municípios Polo Operacionais ({filteredMunis.length} de{' '}
                    {municipiosList.length})
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ color: '#facc15' }}>
                    CBMAM: {subtotalMunis.cbmam} militares
                  </span>
                  <span style={{ color: '#34d399' }}>
                    Total em Atuação: {subtotalMunis.total} operacionais
                  </span>
                </div>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#94a3b8',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      <th style={{ padding: '8px 12px' }}>Município</th>
                      <th
                        style={{
                          padding: '8px 8px',
                          textAlign: 'right',
                          color: '#facc15',
                          background: 'rgba(234, 179, 8, 0.1)',
                          fontWeight: 900,
                        }}
                      >
                        CBMAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        6ª Fase OPAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        7ª Fase OPAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Prevfogo
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Força Nac.
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Brig. Mun.
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Brig. SEMA
                      </th>
                      <th
                        style={{
                          padding: '8px 12px',
                          textAlign: 'right',
                          color: '#34d399',
                          fontWeight: 900,
                        }}
                      >
                        Total
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'center' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunis.map((r, idx) => (
                      <tr
                        key={r.key}
                        style={{
                          background: idx % 2 === 0 ? '#090d16' : '#0c121e',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <td
                          style={{
                            padding: '8px 12px',
                            fontWeight: 700,
                            color: '#f8fafc',
                          }}
                        >
                          {r.nome}
                          {r.nome === 'Manaus' && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10,
                                color: '#ef4444',
                                fontWeight: 800,
                              }}
                            >
                              (CAPITAL)
                            </span>
                          )}
                        </td>

                        {/* CBMAM */}
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'right',
                            background: 'rgba(234, 179, 8, 0.04)',
                          }}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.cbmam}
                              onChange={(e) =>
                                handleCellChange(r.key, 'cbmam', e.target.value)
                              }
                              style={{
                                ...inputStyle,
                                borderColor: '#facc15',
                                background: '#3a2e05',
                                color: '#fef08a',
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.cbmam ? '#facc15' : '#475569',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                              }}
                            >
                              {r.cbmam || '-'}
                            </span>
                          )}
                        </td>

                        {/* 6ª Fase OPAM */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.opamv}
                              onChange={(e) =>
                                handleCellChange(r.key, 'opamv', e.target.value)
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.opamv ? '#fbbf24' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.opamv || '-'}
                            </span>
                          )}
                        </td>

                        {/* 7ª Fase OPAM */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.opam_ref}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'opam_ref',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.opam_ref ? '#38bdf8' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.opam_ref || '-'}
                            </span>
                          )}
                        </td>

                        {/* Prevfogo */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.prevfogo}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'prevfogo',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.prevfogo ? '#34d399' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.prevfogo || '-'}
                            </span>
                          )}
                        </td>

                        {/* Força Nacional */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.fn}
                              onChange={(e) =>
                                handleCellChange(r.key, 'fn', e.target.value)
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.fn ? '#22d3ee' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.fn || '-'}
                            </span>
                          )}
                        </td>

                        {/* Brigada Municipal */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.brig_mun}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'brig_mun',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.brig_mun ? '#fb923c' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.brig_mun || '-'}
                            </span>
                          )}
                        </td>

                        {/* Brigada SEMA */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.brig_semas}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'brig_semas',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.brig_semas ? '#a3e635' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.brig_semas || '-'}
                            </span>
                          )}
                        </td>

                        {/* Total Linha */}
                        <td
                          style={{
                            padding: '8px 12px',
                            textAlign: 'right',
                            fontWeight: 900,
                            color: '#34d399',
                          }}
                        >
                          {r.total}
                        </td>

                        {/* Ação */}
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => onSelectMuni(r.nome)}
                            style={{
                              background: '#0369a1',
                              border: 'none',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Ver Mapa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* FOOTER TOTAL MUNICÍPIOS POLO */}
                  <tfoot>
                    <tr
                      style={{
                        background: '#1e293b',
                        color: '#f8fafc',
                        fontWeight: 900,
                        borderTop: '2px solid #eab308',
                      }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        TOTAL MUNICÍPIOS POLO
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          textAlign: 'right',
                          color: '#facc15',
                          fontSize: 13,
                          background: 'rgba(234, 179, 8, 0.15)',
                        }}
                      >
                        {subtotalMunis.cbmam}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.opamv}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.opam_ref}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.prevfogo}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.fn}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.brig_mun}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalMunis.brig_semas}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          color: '#34d399',
                          fontSize: 13,
                        }}
                      >
                        {subtotalMunis.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABELA: BASES TEMPORÁRIAS DE COMBATE */}
          {(activeTab === 'todos' || activeTab === 'bases') && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#f97316',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tent size={16} />
                  <span>
                    2. Bases Temporárias de Combate ({filteredBases.length} de{' '}
                    {basesList.length})
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ color: '#facc15' }}>
                    CBMAM: {subtotalBases.cbmam}
                  </span>
                  <span style={{ color: '#fb923c' }}>
                    Total em Atuação: {subtotalBases.total} operacionais
                  </span>
                </div>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#94a3b8',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      <th style={{ padding: '8px 12px' }}>Base Temporária</th>
                      <th
                        style={{
                          padding: '8px 8px',
                          textAlign: 'right',
                          color: '#facc15',
                          background: 'rgba(234, 179, 8, 0.1)',
                          fontWeight: 900,
                        }}
                      >
                        CBMAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        6ª Fase OPAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        7ª Fase OPAM
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Prevfogo
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Força Nac.
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Brig. Mun.
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        Brig. SEMA
                      </th>
                      <th
                        style={{
                          padding: '8px 12px',
                          textAlign: 'right',
                          color: '#fb923c',
                          fontWeight: 900,
                        }}
                      >
                        Total
                      </th>
                      <th style={{ padding: '8px 8px', textAlign: 'center' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBases.map((r, idx) => (
                      <tr
                        key={r.key}
                        style={{
                          background: idx % 2 === 0 ? '#090d16' : '#0c121e',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <td
                          style={{
                            padding: '8px 12px',
                            fontWeight: 700,
                            color: '#f8fafc',
                          }}
                        >
                          {r.nome}
                        </td>

                        {/* CBMAM */}
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'right',
                            background: 'rgba(234, 179, 8, 0.04)',
                          }}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.cbmam}
                              onChange={(e) =>
                                handleCellChange(r.key, 'cbmam', e.target.value)
                              }
                              style={{
                                ...inputStyle,
                                borderColor: '#facc15',
                                background: '#3a2e05',
                                color: '#fef08a',
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.cbmam ? '#facc15' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.cbmam || '-'}
                            </span>
                          )}
                        </td>

                        {/* 6ª Fase OPAM */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.opamv}
                              onChange={(e) =>
                                handleCellChange(r.key, 'opamv', e.target.value)
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.opamv ? '#fbbf24' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.opamv || '-'}
                            </span>
                          )}
                        </td>

                        {/* 7ª Fase OPAM */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.opam_ref}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'opam_ref',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.opam_ref ? '#38bdf8' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.opam_ref || '-'}
                            </span>
                          )}
                        </td>

                        {/* Prevfogo */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.prevfogo}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'prevfogo',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.prevfogo ? '#34d399' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.prevfogo || '-'}
                            </span>
                          )}
                        </td>

                        {/* Força Nac */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.fn}
                              onChange={(e) =>
                                handleCellChange(r.key, 'fn', e.target.value)
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.fn ? '#22d3ee' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.fn || '-'}
                            </span>
                          )}
                        </td>

                        {/* Brigada Mun */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.brig_mun}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'brig_mun',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.brig_mun ? '#fb923c' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.brig_mun || '-'}
                            </span>
                          )}
                        </td>

                        {/* Brigada SEMA */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.brig_semas}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'brig_semas',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.brig_semas ? '#a3e635' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.brig_semas || '-'}
                            </span>
                          )}
                        </td>

                        {/* Total */}
                        <td
                          style={{
                            padding: '8px 12px',
                            textAlign: 'right',
                            fontWeight: 900,
                            color: '#fb923c',
                          }}
                        >
                          {r.total}
                        </td>

                        {/* Ação */}
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => onSelectMuni(r.nome)}
                            style={{
                              background: '#0369a1',
                              border: 'none',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Ver Mapa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* FOOTER TOTAL BASES */}
                  <tfoot>
                    <tr
                      style={{
                        background: '#7c2d12',
                        color: '#ffedd5',
                        fontWeight: 900,
                        borderTop: '2px solid #f97316',
                      }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        TOTAL BASES TEMPORÁRIAS
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          textAlign: 'right',
                          color: '#facc15',
                          fontSize: 13,
                          background: 'rgba(234, 179, 8, 0.15)',
                        }}
                      >
                        {subtotalBases.cbmam}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.opamv}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.opam_ref}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.prevfogo}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.fn}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.brig_mun}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        {subtotalBases.brig_semas}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          color: '#fb923c',
                          fontSize: 13,
                        }}
                      >
                        {subtotalBases.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* RODAPÉ GERAL CONSOLIDADO (SOMA POLOS + BASES) */}
          {(activeTab === 'todos' ||
            activeTab === 'municipios' ||
            activeTab === 'bases') && (
            <div
              style={{
                marginTop: 14,
                marginBottom: 20,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #0b1329 0%, #172554 100%)',
                borderRadius: 8,
                border: '1.5px solid #3b82f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 900, color: '#93c5fd' }}
                >
                  TOTAL GERAL (SOMA MUNICÍPIOS + BASES TEMPORÁRIAS):{' '}
                  <span style={{ color: '#facc15', fontSize: 16 }}>
                    {totals.cbmam} CBMAM
                  </span>{' '}
                  •{' '}
                  <span style={{ color: '#34d399', fontSize: 16 }}>
                    {totals.total} EM ATUAÇÃO
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>
                  27 Militares (6ª Fase) + 58 Militares (7ª Fase) + 247 Prevfogo
                  + 35 Força Nacional + 222 Brig. Municipais + 153 Brig. SEMA
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid #eab308',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#fef08a',
                }}
              >
                *ADM 2º CRBM (MANAUS): 9 militares | Total Geral CBMAM Estado:{' '}
                {totals.cbmam + 9}
              </div>
            </div>
          )}

          {/* TABELA: 01 | EFETIVO GERAL — TODAS AS INSTITUIÇÕES */}
          {activeTab === 'geral' && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PieChart size={18} />
                  <span>01 | EFETIVO GERAL — TODAS AS INSTITUIÇÕES</span>
                </div>
                <span
                  style={{
                    background: '#0369a1',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  TOTAL GERAL: 1.470
                </span>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                  background: '#0c121e',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#94a3b8',
                        borderBottom: '2px solid #38bdf8',
                      }}
                    >
                      <th style={{ padding: '12px 16px' }}>
                        INSTITUIÇÃO / ORIGEM
                      </th>
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          color: '#facc15',
                        }}
                      >
                        QUANTITATIVO
                      </th>
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          color: '#38bdf8',
                        }}
                      >
                        PARTICIPAÇÃO %
                      </th>
                      <th style={{ padding: '12px 20px', width: '35%' }}>
                        DISTRIBUIÇÃO GRÁFICA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EFETIVO_GERAL_INSTITUICOES.map((item, idx) => (
                      <tr
                        key={item.instituicao}
                        style={{
                          background: idx % 2 === 0 ? '#090d16' : '#0e1626',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <td
                          style={{
                            padding: '10px 16px',
                            fontWeight: 800,
                            color: '#f8fafc',
                          }}
                        >
                          {item.instituicao}
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            textAlign: 'right',
                            fontWeight: 900,
                            fontSize: 13,
                            color:
                              item.quantitativo > 0 ? '#facc15' : '#64748b',
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.quantitativo}
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            textAlign: 'right',
                            fontWeight: 800,
                            color:
                              item.quantitativo > 0 ? '#38bdf8' : '#64748b',
                          }}
                        >
                          {item.participacao}
                        </td>
                        <td style={{ padding: '10px 20px' }}>
                          <div
                            style={{
                              background: '#1e293b',
                              borderRadius: 6,
                              height: 10,
                              overflow: 'hidden',
                              display: 'flex',
                            }}
                          >
                            <div
                              style={{
                                width: item.participacao.replace(',', '.'),
                                background: item.cor,
                                height: '100%',
                                borderRadius: 6,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background:
                          'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
                        color: '#ffffff',
                        fontWeight: 900,
                        borderTop: '2px solid #38bdf8',
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        TOTAL GERAL
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontSize: 16,
                          color: '#facc15',
                        }}
                      >
                        1470
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontSize: 13,
                        }}
                      >
                        100,0%
                      </td>
                      <td
                        style={{
                          padding: '12px 20px',
                          fontSize: 11,
                          color: '#e0f2fe',
                        }}
                      >
                        100% das forças de proteção e combate integradas
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* NOTA DE RODAPÉ OFICIAL */}
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 14px',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid #eab308',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#fef08a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>*ADM 2º CRBM (MANAUS) : 9</span>
                <span
                  style={{ color: '#cbd5e1', fontWeight: 500, fontSize: 11 }}
                >
                  • (Comando e Administração Regional sediado na Capital)
                </span>
              </div>
            </div>
          )}

          {/* TABELA: COMANDOS CRBM (350 MILITARES NO INTERIOR) */}
          {activeTab === 'crbm' && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#10b981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={18} />
                  <span>
                    DETALHAMENTO DO EFETIVO POR CRBM — INTERIOR DO ESTADO
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ color: '#38bdf8' }}>Combatentes: 296</span>
                  <span style={{ color: '#a3e635' }}>Saúde: 54</span>
                  <span
                    style={{
                      background: '#065f46',
                      color: '#a7f3d0',
                      padding: '2px 8px',
                      borderRadius: 8,
                    }}
                  >
                    Total: 350
                  </span>
                </div>
              </div>

              {/* TABELA PRINCIPAL DE CRBM */}
              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                  background: '#0c121e',
                  marginBottom: 16,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#94a3b8',
                        borderBottom: '2px solid #10b981',
                      }}
                    >
                      <th style={{ padding: '10px 14px', width: '15%' }}>
                        CRBM
                      </th>
                      <th style={{ padding: '10px 14px' }}>
                        GRUPAMENTO / MUNICÍPIO
                      </th>
                      <th
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          color: '#38bdf8',
                        }}
                      >
                        COMBATENTE
                      </th>
                      <th
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          color: '#a3e635',
                        }}
                      >
                        SAÚDE
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'right',
                          color: '#facc15',
                        }}
                      >
                        TOTAL
                      </th>
                      <th style={{ padding: '10px 10px', textAlign: 'center' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRBM_DETALHAMENTO.map((r, idx) => {
                      const isFirstOfCRBM =
                        idx === 0 || CRBM_DETALHAMENTO[idx - 1].crbm !== r.crbm;
                      return (
                        <tr
                          key={`${r.crbm}-${r.grupamento}`}
                          style={{
                            background: idx % 2 === 0 ? '#090d16' : '#0e1626',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          <td
                            style={{
                              padding: '8px 14px',
                              fontWeight: 900,
                              color: isFirstOfCRBM ? '#38bdf8' : '#64748b',
                            }}
                          >
                            {r.crbm}
                          </td>
                          <td
                            style={{
                              padding: '8px 14px',
                              fontWeight: 700,
                              color: '#f8fafc',
                            }}
                          >
                            {r.grupamento}
                          </td>
                          <td
                            style={{
                              padding: '8px 14px',
                              textAlign: 'right',
                              fontWeight: 800,
                              color: '#38bdf8',
                              fontFamily: 'monospace',
                            }}
                          >
                            {r.combatente}
                          </td>
                          <td
                            style={{
                              padding: '8px 14px',
                              textAlign: 'right',
                              fontWeight: 800,
                              color: r.saude > 0 ? '#a3e635' : '#64748b',
                              fontFamily: 'monospace',
                            }}
                          >
                            {r.saude}
                          </td>
                          <td
                            style={{
                              padding: '8px 16px',
                              textAlign: 'right',
                              fontWeight: 900,
                              fontSize: 13,
                              color: '#facc15',
                              fontFamily: 'monospace',
                            }}
                          >
                            {r.total}
                          </td>
                          <td
                            style={{ padding: '6px 10px', textAlign: 'center' }}
                          >
                            <button
                              onClick={() => onSelectMuni(r.municipio)}
                              style={{
                                background: '#0369a1',
                                border: 'none',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Ver Mapa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* QUADRO CONSOLIDADO DE SUBTOTAIS POR CRBM */}
              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1.5px solid #059669',
                  background: '#064e3b',
                }}
              >
                <div
                  style={{
                    padding: '8px 14px',
                    background: '#047857',
                    fontWeight: 900,
                    fontSize: 12,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Users size={15} />
                  <span>
                    RESUMO DE SUBTOTAIS POR CRBM (COMANDOS DO INTERIOR)
                  </span>
                </div>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#065f46', color: '#a7f3d0' }}>
                      <th style={{ padding: '8px 14px' }}>COMANDO REGIONAL</th>
                      <th style={{ padding: '8px 14px', textAlign: 'right' }}>
                        COMBATENTES
                      </th>
                      <th style={{ padding: '8px 14px', textAlign: 'right' }}>
                        SAÚDE
                      </th>
                      <th
                        style={{
                          padding: '8px 16px',
                          textAlign: 'right',
                          color: '#facc15',
                        }}
                      >
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRBM_SUBTOTAIS.map((st) => (
                      <tr
                        key={st.crbm}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.15)',
                        }}
                      >
                        <td
                          style={{
                            padding: '8px 14px',
                            fontWeight: 800,
                            color: '#f8fafc',
                          }}
                        >
                          {st.crbm}
                        </td>
                        <td
                          style={{
                            padding: '8px 14px',
                            textAlign: 'right',
                            fontWeight: 800,
                            color: '#7dd3fc',
                          }}
                        >
                          {st.combatente}
                        </td>
                        <td
                          style={{
                            padding: '8px 14px',
                            textAlign: 'right',
                            fontWeight: 800,
                            color: '#bef264',
                          }}
                        >
                          {st.saude}
                        </td>
                        <td
                          style={{
                            padding: '8px 16px',
                            textAlign: 'right',
                            fontWeight: 900,
                            fontSize: 13,
                            color: '#facc15',
                          }}
                        >
                          {st.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#022c22',
                        color: '#a7f3d0',
                        fontWeight: 900,
                        borderTop: '2px solid #10b981',
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        TOTAL GERAL CRBM (INTERIOR)
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          color: '#38bdf8',
                          fontSize: 14,
                        }}
                      >
                        296
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          color: '#a3e635',
                          fontSize: 14,
                        }}
                      >
                        54
                      </td>
                      <td
                        style={{
                          padding: '10px 16px',
                          textAlign: 'right',
                          color: '#facc15',
                          fontSize: 16,
                        }}
                      >
                        350
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABELA: RESUMO POR MISSÃO */}
          {activeTab === 'resumo' && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Layers size={16} />
                <span>
                  3. Resumo Consolidado por Missão (Capital x Interior x Total)
                </span>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: 8,
                  border: '1px solid #1e293b',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#94a3b8',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      <th style={{ padding: '10px 14px' }}>
                        Força / Missão Operacional
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                        Capital (Manaus)
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                        Comando Interior + Bases
                      </th>
                      <th
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          color: '#facc15',
                        }}
                      >
                        Efetivo Total
                      </th>
                      <th
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          color: '#38bdf8',
                        }}
                      >
                        % do Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumoMissoes.map((m, idx) => (
                      <tr
                        key={m.key}
                        style={{
                          background: idx % 2 === 0 ? '#090d16' : '#0c121e',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <td
                          style={{
                            padding: '10px 14px',
                            fontWeight: 700,
                            color: '#f8fafc',
                          }}
                        >
                          {m.label}
                        </td>
                        <td
                          style={{
                            padding: '10px 12px',
                            textAlign: 'right',
                            color: m.capital ? '#38bdf8' : '#475569',
                            fontWeight: 700,
                          }}
                        >
                          {m.capital || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px 12px',
                            textAlign: 'right',
                            color: m.interior ? '#fb923c' : '#475569',
                            fontWeight: 700,
                          }}
                        >
                          {m.interior || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px 14px',
                            textAlign: 'right',
                            color: '#facc15',
                            fontWeight: 900,
                            fontSize: 13,
                          }}
                        >
                          {m.total}
                        </td>
                        <td
                          style={{
                            padding: '10px 12px',
                            textAlign: 'right',
                            color: '#94a3b8',
                            fontWeight: 700,
                          }}
                        >
                          {m.perc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background:
                          'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                        color: '#a7f3d0',
                        fontWeight: 900,
                        borderTop: '2px solid #10b981',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        TOTAL EFETIVO INTEGRADO
                      </td>
                      <td
                        style={{
                          padding: '12px 12px',
                          textAlign: 'right',
                          color: '#38bdf8',
                          fontSize: 13,
                        }}
                      >
                        {totals.capital}
                      </td>
                      <td
                        style={{
                          padding: '12px 12px',
                          textAlign: 'right',
                          color: '#fb923c',
                          fontSize: 13,
                        }}
                      >
                        {totals.interior}
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          color: '#facc15',
                          fontSize: 15,
                        }}
                      >
                        {totals.total}
                      </td>
                      <td
                        style={{
                          padding: '12px 12px',
                          textAlign: 'right',
                          color: '#a7f3d0',
                        }}
                      >
                        100.0%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: 52,
  height: 26,
  textAlign: 'right',
  fontFamily: 'monospace',
  fontSize: 12,
  padding: '2px 4px',
  borderRadius: 4,
  border: '1px solid #10b981',
  background: '#042f2e',
  color: '#f8fafc',
  outline: 'none',
};
