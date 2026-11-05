import React, { useState, useMemo } from 'react';
import { X, Search, RefreshCw, TreePine, Upload } from 'lucide-react';
import {
  OPERACAO_EFETIVO_MUNICIPIOS,
  RESUMO_EXECUTIVO_OFICIAL,
  PREVFOGO_RECURSOS_DISPONIVEIS,
} from '../data/operacaoAmazonasData';

export function EfetivoModal({
  onClose,
  onSelectMuni,
  onSyncOfficialTokens,
  onUploadSpreadsheet,
}) {
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'municipios' | 'bases' | 'resumo' | 'prevfogo'
  const [search, setSearch] = useState('');

  // Separar municípios permanentes (26) e bases temporárias (11)
  const municipiosList = useMemo(() => {
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(
      (item) => item.tipo === 'capital' || item.tipo === 'interior'
    );
  }, []);

  const basesList = useMemo(() => {
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(
      (item) => item.tipo === 'base_temporaria'
    );
  }, []);

  // Filtragem pela busca
  const filterList = (list) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((item) => item.muni.toLowerCase().includes(q));
  };

  const filteredMunis = filterList(municipiosList);
  const filteredBases = filterList(basesList);

  // Totais calculados
  const calcTotals = (list) => {
    return list.reduce(
      (acc, curr) => {
        acc.ef_permanente += curr.ef_permanente || 0;
        acc.serv_ord += curr.serv_ord || 0;
        acc.opam += curr.opam || 0;
        acc.opam_extra += curr.opam_extra || 0;
        acc.inc2 += curr.inc2 || 0;
        acc.cbmam += curr.cbmam_militares || 0;
        acc.prevfogo += curr.prevfogo || 0;
        acc.fn += curr.fn || 0;
        acc.brigadista += curr.brigadista || 0;
        acc.brigadista_sema += curr.brigadista_sema || 0;
        acc.total += curr.total || 0;
        return acc;
      },
      {
        ef_permanente: 0,
        serv_ord: 0,
        opam: 0,
        opam_extra: 0,
        inc2: 0,
        cbmam: 0,
        prevfogo: 0,
        fn: 0,
        brigadista: 0,
        brigadista_sema: 0,
        total: 0,
      }
    );
  };

  const totMunis = calcTotals(municipiosList);
  const totBases = calcTotals(basesList);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 1120,
          width: '96vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: '1.5px solid #0284c7',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
        }}
      >
        {/* Topo do Modal */}
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1.5px solid #ef4444',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
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
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: 0,
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>SOMA TOTAL DE TUDO & DETALHAMENTO DE EFETIVO</span>
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  886 OPERACIONAIS
                </span>
              </h2>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>
                Briefing Oficial 03/11/2026 - 8h30 • Coordenador:{' '}
                <strong style={{ color: '#cbd5e1' }}>
                  {RESUMO_EXECUTIVO_OFICIAL.coordenador}
                </strong>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onUploadSpreadsheet && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1px solid #10b981',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
                title="Subir arquivo de Efetivo (.json exportado do sistema ou .xlsx) para atualizar todo o efetivo no mapa"
              >
                <Upload size={14} />
                <span>Importar Efetivo</span>
                <input
                  type="file"
                  accept=".json,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUploadSpreadsheet(file);
                      onClose();
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            )}
            <button
              className="modal-close-btn"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: 6,
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: 6,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CARDS COM A SOMA TOTAL DE TUDO (KPIs CONSOLIDADOS) */}
        <div
          style={{
            padding: '12px 18px',
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
            {/* SOMA TOTAL DE TUDO */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(202, 138, 4, 0.08) 100%)',
                border: '1.5px solid #eab308',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(234, 179, 8, 0.2)',
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
                Soma Total
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  margin: '2px 0',
                }}
              >
                {RESUMO_EXECUTIVO_OFICIAL.total_geral.total}
              </div>
              <div style={{ fontSize: 9, color: '#facc15', fontWeight: 700 }}>
                Total Empregado
              </div>
            </div>

            {/* MILITARES CBMAM */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid #0284c7',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#7dd3fc',
                  textTransform: 'uppercase',
                }}
              >
                Militares CBMAM
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  margin: '2px 0',
                }}
              >
                {RESUMO_EXECUTIVO_OFICIAL.total_militares_cbmam.total}
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>
                211 Ord • 192 OPAM • 40 INC2
              </div>
            </div>

            {/* PREVFOGO / IBAMA */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1.5px solid #22c55e',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: '#86efac',
                  textTransform: 'uppercase',
                }}
              >
                Prevfogo / IBAMA
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#4ade80',
                  fontFamily: 'monospace',
                  margin: '2px 0',
                }}
              >
                {RESUMO_EXECUTIVO_OFICIAL.prevfogo.total}
              </div>
              <div style={{ fontSize: 9, color: '#bbf7d0', fontWeight: 700 }}>
                94 Cap • 153 Interior
              </div>
            </div>

            {/* FORÇA NACIONAL */}
            <div
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid #0284c7',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#7dd3fc',
                  textTransform: 'uppercase',
                }}
              >
                Força Nacional
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  margin: '2px 0',
                }}
              >
                {RESUMO_EXECUTIVO_OFICIAL.fn.total}
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>
                17 Cap • 18 Interior
              </div>
            </div>

            {/* BRIGADISTAS FLORESTAIS */}
            <div
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid #f97316',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#fdba74',
                  textTransform: 'uppercase',
                }}
              >
                Brigadistas (Mun+SEMA)
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#f97316',
                  fontFamily: 'monospace',
                  margin: '2px 0',
                }}
              >
                {RESUMO_EXECUTIVO_OFICIAL.total_brigadistas.total}
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>
                78 Mun • 83 SEMA
              </div>
            </div>

            {/* DISTRIBUIÇÃO */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #334155',
                borderRadius: 8,
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                }}
              >
                Distribuição
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: '4px 0 2px',
                }}
              >
                Cap: <span style={{ color: '#ef4444' }}>233</span> • Int:{' '}
                <span style={{ color: '#38bdf8' }}>653</span>
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>
                26,3% vs 73,7%
              </div>
            </div>
          </div>
        </div>

        {/* Abas e Filtro de Pesquisa */}
        <div
          style={{
            padding: '10px 18px',
            background: 'rgba(15, 23, 42, 0.9)',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('todos')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'todos' ? '#ef4444' : '#1e293b',
                borderColor: activeTab === 'todos' ? '#ef4444' : '#334155',
                color: '#ffffff',
              }}
            >
              Todos ({municipiosList.length + basesList.length} Polos)
            </button>
            <button
              onClick={() => setActiveTab('municipios')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'municipios' ? '#0284c7' : '#1e293b',
                borderColor: activeTab === 'municipios' ? '#38bdf8' : '#334155',
                color: '#ffffff',
              }}
            >
              Municípios Permanentes ({municipiosList.length})
            </button>
            <button
              onClick={() => setActiveTab('bases')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'bases' ? '#b91c1c' : '#1e293b',
                borderColor: activeTab === 'bases' ? '#ef4444' : '#334155',
                color: '#ffffff',
              }}
            >
              Bases Temporárias ({basesList.length})
            </button>
            <button
              onClick={() => setActiveTab('prevfogo')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'prevfogo' ? '#15803d' : '#1e293b',
                borderColor: activeTab === 'prevfogo' ? '#22c55e' : '#334155',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <TreePine size={13} color="#4ade80" />
              <span>Prevfogo IBAMA (247)</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: 230 }}>
            <Search
              size={13}
              color="#94a3b8"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar município ou base..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: 6,
                padding: '5px 10px 5px 30px',
                color: '#f8fafc',
                fontSize: 11.5,
              }}
            />
          </div>
        </div>

        {/* Conteúdo das Tabelas Oficiais */}
        <div
          className="modal-body"
          style={{
            padding: '16px 20px',
            background: '#090d16',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {/* TABELA 1: MUNICÍPIOS PERMANENTES */}
          {(activeTab === 'todos' || activeTab === 'municipios') && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: '#38bdf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}
                >
                  1. Municípios com Efetivo Permanente (26 Municípios •
                  Subtotal: {totMunis.total})
                </h3>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 11.5,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        borderBottom: '1.5px solid #334155',
                        color: '#94a3b8',
                      }}
                    >
                      <th style={{ padding: '8px 12px' }}>MUNICÍPIO</th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#cbd5e1',
                        }}
                      >
                        EF. PERM.
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#fca5a5',
                        }}
                      >
                        SV ORD
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        6ª OPAM
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        OPAM EXT
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#fca5a5',
                        }}
                      >
                        INC 2
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                          fontWeight: 900,
                        }}
                      >
                        MIL. CBM
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#86efac',
                        }}
                      >
                        PREVFOGO
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#7dd3fc',
                        }}
                      >
                        FN
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#fdba74',
                        }}
                      >
                        BRIG MUN
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#a7f3d0',
                        }}
                      >
                        BRIG SEMA
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#ffffff',
                          fontWeight: 900,
                        }}
                      >
                        TOTAL
                      </th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                        AÇÃO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunis.map((item, idx) => (
                      <tr
                        key={item.muni}
                        style={{
                          background:
                            idx % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : '#090d16',
                          borderBottom: '1px solid #1e293b',
                        }}
                      >
                        <td
                          style={{
                            padding: '7px 12px',
                            fontWeight: 700,
                            color: '#ffffff',
                          }}
                        >
                          {item.muni}{' '}
                          {item.tipo === 'capital' && (
                            <span
                              style={{
                                fontSize: 9.5,
                                color: '#ef4444',
                                marginLeft: 4,
                                fontWeight: 900,
                              }}
                            >
                              (CAPITAL)
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: '#94a3b8',
                          }}
                        >
                          {item.ef_permanente}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.serv_ord ? '#ef4444' : '#64748b',
                            fontWeight: item.serv_ord ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.serv_ord || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.opam ? '#38bdf8' : '#64748b',
                            fontWeight: item.opam ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.opam || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.opam_extra ? '#38bdf8' : '#64748b',
                            fontWeight: item.opam_extra ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.opam_extra || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.inc2 ? '#ef4444' : '#64748b',
                            fontWeight: item.inc2 ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.inc2 || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: '#38bdf8',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            background: 'rgba(56, 189, 248, 0.08)',
                          }}
                        >
                          {item.cbmam_militares}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.prevfogo ? '#4ade80' : '#64748b',
                            fontWeight: item.prevfogo ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.prevfogo || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.fn ? '#38bdf8' : '#64748b',
                            fontWeight: item.fn ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.fn || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.brigadista ? '#f97316' : '#64748b',
                            fontWeight: item.brigadista ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.brigadista || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.brigadista_sema ? '#10b981' : '#64748b',
                            fontWeight: item.brigadista_sema ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.brigadista_sema || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            fontWeight: 900,
                            color: '#ffffff',
                            fontFamily: 'monospace',
                            background: 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          {item.total}
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'right' }}>
                          {onSelectMuni && (
                            <button
                              onClick={() => {
                                onSelectMuni(item.muni);
                                onClose();
                              }}
                              style={{
                                background: 'rgba(56, 189, 248, 0.15)',
                                border: '1px solid #38bdf8',
                                color: '#38bdf8',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Ver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#0f172a',
                        borderTop: '2px solid #334155',
                        color: '#ffffff',
                        fontWeight: 900,
                      }}
                    >
                      <td style={{ padding: '9px 12px' }}>
                        TOTAL MUNICÍPIOS (26)
                      </td>
                      <td style={{ padding: '9px 6px', textAlign: 'center' }}>
                        {totMunis.ef_permanente}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#ef4444',
                        }}
                      >
                        {totMunis.serv_ord}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totMunis.opam}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totMunis.opam_extra}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#ef4444',
                        }}
                      >
                        {totMunis.inc2}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totMunis.cbmam}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#4ade80',
                        }}
                      >
                        {totMunis.prevfogo}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totMunis.fn}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#f97316',
                        }}
                      >
                        {totMunis.brigadista}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#10b981',
                        }}
                      >
                        {totMunis.brigadista_sema}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#ffffff',
                          background: '#dc2626',
                        }}
                      >
                        {totMunis.total}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABELA 2: BASES TEMPORÁRIAS */}
          {(activeTab === 'todos' || activeTab === 'bases') && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}
                >
                  2. Bases Temporárias da Operação (11 Bases • Subtotal:{' '}
                  {totBases.total})
                </h3>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 11.5,
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#0f172a',
                        borderBottom: '1.5px solid #334155',
                        color: '#94a3b8',
                      }}
                    >
                      <th style={{ padding: '8px 12px' }}>BASE TEMPORÁRIA</th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        6ª OPAM
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        OPAM EXT
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#fca5a5',
                        }}
                      >
                        INC 2
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                          fontWeight: 900,
                        }}
                      >
                        MIL. CBM
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#86efac',
                        }}
                      >
                        PREVFOGO
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#7dd3fc',
                        }}
                      >
                        FN
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#fdba74',
                        }}
                      >
                        BRIG MUN
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#a7f3d0',
                        }}
                      >
                        BRIG SEMA
                      </th>
                      <th
                        style={{
                          padding: '8px 6px',
                          textAlign: 'center',
                          color: '#ffffff',
                          fontWeight: 900,
                        }}
                      >
                        TOTAL
                      </th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                        AÇÃO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBases.map((item, idx) => (
                      <tr
                        key={item.muni}
                        style={{
                          background:
                            idx % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : '#090d16',
                          borderBottom: '1px solid #1e293b',
                        }}
                      >
                        <td
                          style={{
                            padding: '7px 12px',
                            fontWeight: 700,
                            color: '#ffffff',
                          }}
                        >
                          <span
                            style={{
                              background: '#1e3a8a',
                              color: '#93c5fd',
                              fontSize: 9,
                              padding: '1px 5px',
                              borderRadius: 4,
                              marginRight: 6,
                            }}
                          >
                            BASE
                          </span>
                          {item.muni}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.opam ? '#38bdf8' : '#64748b',
                            fontWeight: item.opam ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.opam || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.opam_extra ? '#38bdf8' : '#64748b',
                            fontWeight: item.opam_extra ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.opam_extra || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.inc2 ? '#ef4444' : '#64748b',
                            fontWeight: item.inc2 ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.inc2 || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: '#38bdf8',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            background: 'rgba(56, 189, 248, 0.08)',
                          }}
                        >
                          {item.cbmam_militares}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.prevfogo ? '#4ade80' : '#64748b',
                            fontWeight: item.prevfogo ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.prevfogo || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.fn ? '#38bdf8' : '#64748b',
                            fontWeight: item.fn ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.fn || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.brigadista ? '#f97316' : '#64748b',
                            fontWeight: item.brigadista ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.brigadista || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            color: item.brigadista_sema ? '#10b981' : '#64748b',
                            fontWeight: item.brigadista_sema ? 800 : 400,
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.brigadista_sema || '-'}
                        </td>
                        <td
                          style={{
                            padding: '7px 6px',
                            textAlign: 'center',
                            fontWeight: 900,
                            color: '#ffffff',
                            fontFamily: 'monospace',
                            background: 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          {item.total}
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'right' }}>
                          {onSelectMuni && (
                            <button
                              onClick={() => {
                                onSelectMuni(item.muni_ref || item.muni);
                                onClose();
                              }}
                              style={{
                                background: 'rgba(250, 204, 21, 0.15)',
                                border: '1px solid #facc15',
                                color: '#facc15',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Ver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#0f172a',
                        borderTop: '2px solid #334155',
                        color: '#ffffff',
                        fontWeight: 900,
                      }}
                    >
                      <td style={{ padding: '9px 12px' }}>
                        TOTAL BASES TEMPORÁRIAS (11)
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totBases.opam}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totBases.opam_extra}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#ef4444',
                        }}
                      >
                        {totBases.inc2}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totBases.cbmam}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#4ade80',
                        }}
                      >
                        {totBases.prevfogo}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#38bdf8',
                        }}
                      >
                        {totBases.fn}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#f97316',
                        }}
                      >
                        {totBases.brigadista}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#10b981',
                        }}
                      >
                        {totBases.brigadista_sema}
                      </td>
                      <td
                        style={{
                          padding: '9px 6px',
                          textAlign: 'center',
                          color: '#ffffff',
                          background: '#dc2626',
                        }}
                      >
                        {totBases.total}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABELA PREVFOGO */}
          {activeTab === 'prevfogo' && (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 12,
                }}
              >
                {PREVFOGO_RECURSOS_DISPONIVEIS.map((pf) => (
                  <div
                    key={pf.muni}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1.5px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: 10,
                      padding: '14px 16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
                        paddingBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 900,
                          color: '#86efac',
                        }}
                      >
                        {pf.muni}
                      </span>
                      <span
                        style={{
                          background: '#15803d',
                          color: '#fff',
                          fontSize: 10.5,
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 12,
                        }}
                      >
                        {pf.total} Brigadistas
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {pf.bases.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          style={{
                            fontSize: 11,
                            color: '#d1fae5',
                            background: 'rgba(15, 23, 42, 0.6)',
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid rgba(34, 197, 94, 0.15)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: 700,
                            }}
                          >
                            <span>{b.local}</span>
                            <span style={{ color: '#4ade80' }}>
                              {b.efetivo} Op.
                            </span>
                          </div>
                          {b.detalhe && (
                            <div
                              style={{
                                fontSize: 9.5,
                                color: '#94a3b8',
                                marginTop: 2,
                              }}
                            >
                              {b.detalhe}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ação de Sincronizar Fichas no Mapa */}
        <div
          className="modal-footer"
          style={{
            background: '#0f172a',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
          }}
        >
          {onSyncOfficialTokens && (
            <button
              onClick={() => {
                onSyncOfficialTokens();
                onClose();
              }}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                border: '1px solid #34d399',
                borderRadius: 6,
                padding: '7px 16px',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Carregar todos os 886 operacionais e 10 aeronaves diretamente no mapa"
            >
              <RefreshCw size={14} />
              <span>Sincronizar Efetivo Oficial (886) no Mapa</span>
            </button>
          )}

          <button
            className="btn-tactical btn-primary"
            onClick={onClose}
            style={{ padding: '6px 18px', fontSize: 12, borderRadius: 6 }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
