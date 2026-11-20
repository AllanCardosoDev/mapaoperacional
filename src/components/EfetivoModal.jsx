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
} from 'lucide-react';

// Lista canônica oficial dos 26 Municípios Polo
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

// Lista canônica oficial das 12 Bases Temporárias de Combate
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

function norm(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function EfetivoModal({
  onClose,
  dbEfetivo = null,
  reportDate = null,
  initialEditMode = false,
  onSaveEfetivo = async () => {},
  onSelectMuni = () => {},
}) {
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'municipios' | 'bases' | 'resumo'
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Inicializa mapa de edições a partir de dbEfetivo ou benchmarks
  const [editedData, setEditedData] = useState(() => {
    const map = {};
    // Carrega municípios polo
    MUNICIPIOS_POLO_LIST.forEach((nome) => {
      const isCap = nome === 'Manaus';
      const found = (dbEfetivo || []).find(
        (r) =>
          norm(r.mun) === norm(nome) &&
          (r.tipo === 'capital' || r.tipo === 'interior' || !r.tipo)
      );
      map[`mun:${norm(nome)}`] = {
        nome,
        tipo: isCap ? 'capital' : 'interior',
        serv_ord: Number(
          found?.cbmam ||
            found?.serv_ord ||
            found?.ord ||
            found?.servico ||
            (isCap ? 477 : 0)
        ),
        opamv: Number(found?.opamv || 0),
        opam_ref: Number(found?.opam_ref || 0),
        prevfogo: Number(found?.prevfogo || 0),
        fn: Number(found?.fn || 0),
        brig_mun: Number(
          found?.brig_mun ||
            (found?.brig && !found?.brig_semas ? found.brig : 0)
        ),
        brig_semas: Number(found?.brig_semas || 0),
      };
    });

    // Carrega bases temporárias
    BASES_TEMPORARIAS_LIST.forEach((nome) => {
      const found = (dbEfetivo || []).find(
        (r) =>
          norm(r.mun) === norm(nome) ||
          (r.tipo === 'base' && norm(r.mun) === norm(nome))
      );
      map[`base:${norm(nome)}`] = {
        nome,
        tipo: 'base',
        serv_ord: Number(
          found?.cbmam || found?.serv_ord || found?.ord || found?.servico || 0
        ),
        opamv: Number(found?.opamv || 0),
        opam_ref: Number(found?.opam_ref || 0),
        prevfogo: Number(found?.prevfogo || 0),
        fn: Number(found?.fn || 0),
        brig_mun: Number(found?.brig_mun || 0),
        brig_semas: Number(found?.brig_semas || 0),
      };
    });

    return map;
  });

  // Atualiza editedData quando dbEfetivo muda do banco
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

        next[key] = {
          nome: nomeOriginal,
          tipo: isBase ? 'base' : r.mun === 'Manaus' ? 'capital' : 'interior',
          serv_ord: Number(r.cbmam || r.serv_ord || r.ord || r.servico || 0),
          opamv: Number(r.opamv || 0),
          opam_ref: Number(r.opam_ref || 0),
          prevfogo: Number(r.prevfogo || 0),
          fn: Number(r.fn || 0),
          brig_mun: Number(r.brig_mun || 0),
          brig_semas: Number(r.brig_semas || 0),
        };
      });
      return next;
    });
  }, [dbEfetivo]);

  // Manipulador de alteração de campo em modo de edição
  const handleCellChange = (key, field, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setEditedData((prev) => {
      const current = prev[key] || {};
      return {
        ...prev,
        [key]: {
          ...current,
          [field]: num,
        },
      };
    });
  };

  // Listas processadas
  const municipiosList = useMemo(() => {
    return MUNICIPIOS_POLO_LIST.map((nome) => {
      const data = editedData[`mun:${norm(nome)}`] || {
        nome,
        tipo: nome === 'Manaus' ? 'capital' : 'interior',
      };
      const serv_ord = data.serv_ord || 0;
      const opamv = data.opamv || 0;
      const opam_ref = data.opam_ref || 0;
      const cbmam = serv_ord + opamv + opam_ref;
      const prevfogo = data.prevfogo || 0;
      const fn = data.fn || 0;
      const brig_mun = data.brig_mun || 0;
      const brig_semas = data.brig_semas || 0;
      const total = cbmam + prevfogo + fn + brig_mun + brig_semas;
      return {
        key: `mun:${norm(nome)}`,
        nome,
        tipo: data.tipo,
        serv_ord,
        opamv,
        opam_ref,
        cbmam,
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
      const data = editedData[`base:${norm(nome)}`] || { nome, tipo: 'base' };
      const serv_ord = data.serv_ord || 0;
      const opamv = data.opamv || 0;
      const opam_ref = data.opam_ref || 0;
      const cbmam = serv_ord + opamv + opam_ref;
      const prevfogo = data.prevfogo || 0;
      const fn = data.fn || 0;
      const brig_mun = data.brig_mun || 0;
      const brig_semas = data.brig_semas || 0;
      const total = cbmam + prevfogo + fn + brig_mun + brig_semas;
      return {
        key: `base:${norm(nome)}`,
        nome,
        tipo: 'base',
        serv_ord,
        opamv,
        opam_ref,
        cbmam,
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

  // Totais consolidados
  const totals = useMemo(() => {
    const all = [...municipiosList, ...basesList];
    return all.reduce(
      (acc, r) => {
        acc.serv_ord += r.serv_ord || 0;
        acc.opamv += r.opamv || 0;
        acc.opam_ref += r.opam_ref || 0;
        acc.cbmam += r.cbmam || 0;
        acc.prevfogo += r.prevfogo || 0;
        acc.fn += r.fn || 0;
        acc.brig_mun += r.brig_mun || 0;
        acc.brig_semas += r.brig_semas || 0;
        acc.total += r.total || 0;
        if (r.tipo === 'capital' || r.nome === 'Manaus') {
          acc.capital += r.total || 0;
        } else {
          acc.interior += r.total || 0;
        }
        return acc;
      },
      {
        serv_ord: 0,
        opamv: 0,
        opam_ref: 0,
        cbmam: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_semas: 0,
        total: 0,
        capital: 0,
        interior: 0,
      }
    );
  }, [municipiosList, basesList]);

  // Salvar edições no banco de dados Supabase
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      // Constrói array no formato oficial para tabela daily_reports.efetivo
      const payload = [...municipiosList, ...basesList].map((r) => ({
        mun: r.nome,
        tipo: r.tipo,
        cbmam: r.cbmam,
        serv_ord: r.serv_ord,
        ord: r.serv_ord,
        servico: r.serv_ord,
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

      await onSaveEfetivo(payload);
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
          maxWidth: 1220,
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
              : '1.5px solid #ef4444',
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
                    background: isEditing ? '#059669' : '#dc2626',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {totals.total} OPERACIONAIS
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
                Dados integrados com o Banco de Dados do Relatório Diário CBMAM
                {reportDate ? ` • Data: ${reportDate}` : ''}
              </p>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO: EDITAR, SALVAR, FECHAR */}
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

        {/* CARDS DE KPIS CONSOLIDADOS */}
        <div
          style={{
            padding: '10px 18px',
            background: '#090d16',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 8,
            }}
          >
            {/* TOTAL GERAL */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.05) 100%)',
                border: '1.5px solid #eab308',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#fef08a',
                  textTransform: 'uppercase',
                }}
              >
                TOTAL EMPREGADO
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#facc15',
                  margin: '2px 0',
                }}
              >
                {totals.total}
              </div>
              <div style={{ fontSize: 10, color: '#ca8a04', fontWeight: 700 }}>
                {totals.capital} Cap • {totals.interior} Int
              </div>
            </div>

            {/* CBMAM PERMANENTE / ORD */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.05) 100%)',
                border: '1px solid #ef4444',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#fca5a5',
                  textTransform: 'uppercase',
                }}
              >
                CBMAM PERMANENTE
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#f87171',
                  margin: '2px 0',
                }}
              >
                {totals.serv_ord}
              </div>
              <div style={{ fontSize: 10, color: '#fca5a5' }}>
                Serviço Diário Ordinário
              </div>
            </div>

            {/* CBMAM OPAM (REFORÇO) */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(3, 105, 161, 0.05) 100%)',
                border: '1px solid #0284c7',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#7dd3fc',
                  textTransform: 'uppercase',
                }}
              >
                CBMAM OPAM (6ª+7ª)
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#38bdf8',
                  margin: '2px 0',
                }}
              >
                {totals.opamv + totals.opam_ref}
              </div>
              <div style={{ fontSize: 10, color: '#7dd3fc' }}>
                {totals.opamv} (6ª) • {totals.opam_ref} (7ª)
              </div>
            </div>

            {/* PREVFOGO IBAMA */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
                border: '1px solid #10b981',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#6ee7b7',
                  textTransform: 'uppercase',
                }}
              >
                PREVFOGO IBAMA
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#34d399',
                  margin: '2px 0',
                }}
              >
                {totals.prevfogo}
              </div>
              <div style={{ fontSize: 10, color: '#6ee7b7' }}>
                Brigadistas Federais
              </div>
            </div>

            {/* FORÇA NACIONAL */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.05) 100%)',
                border: '1px solid #06b6d4',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#67e8f9',
                  textTransform: 'uppercase',
                }}
              >
                FORÇA NACIONAL
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#22d3ee',
                  margin: '2px 0',
                }}
              >
                {totals.fn}
              </div>
              <div style={{ fontSize: 10, color: '#67e8f9' }}>Apoio FNSP</div>
            </div>

            {/* BRIGADISTAS (MUN + SEMA) */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(194, 65, 12, 0.05) 100%)',
                border: '1px solid #f97316',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#fdba74',
                  textTransform: 'uppercase',
                }}
              >
                BRIGADISTAS
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#fb923c',
                  margin: '2px 0',
                }}
              >
                {totals.brig_mun + totals.brig_semas}
              </div>
              <div style={{ fontSize: 10, color: '#fdba74' }}>
                {totals.brig_mun} Mun • {totals.brig_semas} SEMA
              </div>
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
          <div style={{ display: 'flex', gap: 6 }}>
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
                    ? '1.5px solid #38bdf8'
                    : '1px solid #334155',
                background: activeTab === 'municipios' ? '#0369a1' : '#1e293b',
                color: activeTab === 'municipios' ? '#ffffff' : '#94a3b8',
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
                    ? '1.5px solid #38bdf8'
                    : '1px solid #334155',
                background: activeTab === 'bases' ? '#0369a1' : '#1e293b',
                color: activeTab === 'bases' ? '#ffffff' : '#94a3b8',
              }}
            >
              Bases Temporárias ({basesList.length})
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

        {/* CORPO DO MODAL: TABELA COM SCROLL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {/* TABELA: MUNICÍPIOS POLO */}
          {(activeTab === 'todos' || activeTab === 'municipios') && (
            <div style={{ marginBottom: 20 }}>
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
                <Building2 size={16} />
                <span>
                  1. Municípios Polo Operacionais ({filteredMunis.length} de{' '}
                  {municipiosList.length})
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
                      <th style={{ padding: '8px 12px' }}>Município</th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        CBMAM Perm.
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
                          color: '#facc15',
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

                        {/* CBMAM Permanente */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.serv_ord}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'serv_ord',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.serv_ord ? '#f87171' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.serv_ord || '-'}
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
                            color: '#facc15',
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
                </table>
              </div>
            </div>
          )}

          {/* TABELA: BASES TEMPORÁRIAS DE COMBATE */}
          {(activeTab === 'todos' || activeTab === 'bases') && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#f97316',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Tent size={16} />
                <span>
                  2. Bases Temporárias de Combate ({filteredBases.length} de{' '}
                  {basesList.length})
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
                      <th style={{ padding: '8px 12px' }}>Base Temporária</th>
                      <th style={{ padding: '8px 8px', textAlign: 'right' }}>
                        CBMAM Perm.
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
                          color: '#facc15',
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

                        {/* CBMAM Perm */}
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={r.serv_ord}
                              onChange={(e) =>
                                handleCellChange(
                                  r.key,
                                  'serv_ord',
                                  e.target.value
                                )
                              }
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              style={{
                                color: r.serv_ord ? '#f87171' : '#475569',
                                fontWeight: 700,
                              }}
                            >
                              {r.serv_ord || '-'}
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
                            color: '#facc15',
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
  width: 50,
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
