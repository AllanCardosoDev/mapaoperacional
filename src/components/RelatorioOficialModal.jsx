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
  Compass,
} from 'lucide-react';
import {
  OPERACAO_EFETIVO_MUNICIPIOS,
  RESUMO_EXECUTIVO_OFICIAL,
  PREVFOGO_RECURSOS_DISPONIVEIS,
} from '../data/operacaoAmazonasData';

export function RelatorioOficialModal({ onClose, onSelectMuni }) {
  const [activeTab, setActiveTab] = useState('documento'); // 'documento' | 'dashboard' | 'tabelas' | 'prevfogo'
  const [searchTerm, setSearchTerm] = useState('');

  // Data e hora de emissão do relatório
  const emissionTimestamp = useMemo(() => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      date: dateFormatted,
      time: timeFormatted,
      raw: now.toLocaleDateString('pt-BR'),
    };
  }, []);

  // Separação em Tabela 1 (Municípios com Efetivo Permanente) e Tabela 2 (Bases Temporárias)
  const tabela1Municipios = useMemo(() => {
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(
      (m) => m.tipo === 'capital' || m.tipo === 'interior'
    );
  }, []);

  const tabela2Bases = useMemo(() => {
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(
      (m) => m.tipo === 'base_temporaria'
    );
  }, []);

  // Filtro de busca aplicado
  const filteredTabela1 = useMemo(() => {
    if (!searchTerm.trim()) return tabela1Municipios;
    const q = searchTerm.toLowerCase();
    return tabela1Municipios.filter((m) => m.muni.toLowerCase().includes(q));
  }, [searchTerm, tabela1Municipios]);

  const filteredTabela2 = useMemo(() => {
    if (!searchTerm.trim()) return tabela2Bases;
    const q = searchTerm.toLowerCase();
    return tabela2Bases.filter((m) => m.muni.toLowerCase().includes(q));
  }, [searchTerm, tabela2Bases]);

  // Totais calculados da Tabela 1
  const totTabela1 = useMemo(() => {
    return tabela1Municipios.reduce(
      (acc, item) => {
        acc.ef_permanente += item.ef_permanente || 0;
        acc.serv_ord += item.serv_ord || 0;
        acc.opam += item.opam || 0;
        acc.opam_extra += item.opam_extra || 0;
        acc.inc2 += item.inc2 || 0;
        acc.cbmam += item.cbmam_militares || 0;
        acc.prevfogo += item.prevfogo || 0;
        acc.fn += item.fn || 0;
        acc.brig_mun += item.brigadista || 0;
        acc.brig_sema += item.brigadista_sema || 0;
        acc.total += item.total || 0;
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
        brig_mun: 0,
        brig_sema: 0,
        total: 0,
      }
    );
  }, [tabela1Municipios]);

  // Totais calculados da Tabela 2
  const totTabela2 = useMemo(() => {
    return tabela2Bases.reduce(
      (acc, item) => {
        acc.opam += item.opam || 0;
        acc.opam_extra += item.opam_extra || 0;
        acc.inc2 += item.inc2 || 0;
        acc.cbmam += item.cbmam_militares || 0;
        acc.prevfogo += item.prevfogo || 0;
        acc.fn += item.fn || 0;
        acc.brig_mun += item.brigadista || 0;
        acc.brig_sema += item.brigadista_sema || 0;
        acc.total += item.total || 0;
        return acc;
      },
      {
        opam: 0,
        opam_extra: 0,
        inc2: 0,
        cbmam: 0,
        prevfogo: 0,
        fn: 0,
        brig_mun: 0,
        brig_sema: 0,
        total: 0,
      }
    );
  }, [tabela2Bases]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container relatorio-modal-container"
        style={{
          maxWidth: 1240,
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
        {/* ===================================================================
            CABEÇALHO MILITAR INSTITUCIONAL
            =================================================================== */}
        <div
          style={{
            padding: '14px 20px',
            background:
              'linear-gradient(90deg, #0b1329 0%, #172554 50%, #0f172a 100%)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Brasão Oficial do CBMAM */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#ffffff',
                border: '2.5px solid #dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="/brasao-cbmam.png"
                alt="Brasão CBMAM"
                style={{ width: 42, height: 42, objectFit: 'contain' }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span>OPERAÇÃO AMAZONAS + VERDE</span>
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 10.5,
                    fontWeight: 900,
                    padding: '2px 9px',
                    borderRadius: 12,
                    letterSpacing: '0.5px',
                  }}
                >
                  886 OPERACIONAIS
                </span>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid #38bdf8',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  24 HORAS
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3 }}>
                SALA DE SITUAÇÃO CBMAM • Coordenador:{' '}
                <strong>{RESUMO_EXECUTIVO_OFICIAL.coordenador}</strong> •
                Briefing:{' '}
                <strong>{RESUMO_EXECUTIVO_OFICIAL.data_briefing}</strong>
              </div>
            </div>
          </div>

          {/* Botões de Ação do Topo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn-tactical btn-primary"
              onClick={handlePrint}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
              }}
              title="Gerar PDF oficial ou imprimir relatório em folha A4"
            >
              <Printer size={15} />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button
              className="btn-tactical"
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Fechar"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ===================================================================
            BARRA DE ABAS
            =================================================================== */}
        <div
          style={{
            padding: '8px 18px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              className={`sidebar-tab-btn ${activeTab === 'documento' ? 'active' : ''}`}
              onClick={() => setActiveTab('documento')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'documento'
                    ? '1.5px solid #facc15'
                    : '1px solid transparent',
                color: activeTab === 'documento' ? '#fde047' : undefined,
                fontWeight: 800,
              }}
            >
              <FileText
                size={14}
                style={{ display: 'inline', marginRight: 6 }}
              />
              Prancha Documental A4 (Oficial)
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'dashboard'
                    ? '1.5px solid #38bdf8'
                    : '1px solid transparent',
                fontWeight: 800,
              }}
            >
              <Users size={14} style={{ display: 'inline', marginRight: 6 }} />
              Painel Executivo Visual (886)
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'tabelas' ? 'active' : ''}`}
              onClick={() => setActiveTab('tabelas')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'tabelas'
                    ? '1.5px solid #38bdf8'
                    : '1px solid transparent',
                fontWeight: 800,
              }}
            >
              <Building2
                size={14}
                style={{ display: 'inline', marginRight: 6 }}
              />
              Tabelas do Briefing (26 Mun + 11 Bases)
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'prevfogo' ? 'active' : ''}`}
              onClick={() => setActiveTab('prevfogo')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'prevfogo'
                    ? '1.5px solid #22c55e'
                    : '1px solid transparent',
                color: activeTab === 'prevfogo' ? '#4ade80' : undefined,
                fontWeight: 800,
              }}
            >
              <TreePine
                size={14}
                style={{ display: 'inline', marginRight: 6 }}
              />
              Prevfogo IBAMA (247 Brigadistas)
            </button>
          </div>

          {activeTab === 'tabelas' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 20,
                padding: '4px 12px',
                gap: 6,
              }}
            >
              <Search size={14} color="#38bdf8" />
              <input
                type="text"
                placeholder="Filtrar município ou base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 11.5,
                  outline: 'none',
                  width: 170,
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================
            CORPO DO RELATÓRIO
            =================================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {/* =================================================================
              ABA 1: PRANCHA DOCUMENTAL A4 (OFICIAL DE IMPRESSÃO / PDF)
              ================================================================= */}
          {activeTab === 'documento' && (
            <div
              className="printable-a4-sheet"
              style={{
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: 8,
                padding: '30px 36px',
                maxWidth: 1040,
                margin: '0 auto',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              {/* CABEÇALHO DO DOCUMENTO A4 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2.5px solid #dc2626',
                  paddingBottom: 14,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img
                    src="/brasao-cbmam.png"
                    alt="Brasão CBMAM"
                    style={{ width: 56, height: 56, objectFit: 'contain' }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#991b1b',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      GOVERNO DO ESTADO DO AMAZONAS
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#1e293b',
                      }}
                    >
                      SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA — SSP-AM
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: '#0f172a',
                      }}
                    >
                      CORPO DE BOMBEIROS MILITAR DO AMAZONAS — CBMAM
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: '#475569',
                      }}
                    >
                      COMANDO DE BOMBEIROS DO INTERIOR (CBI) • SALA DE SITUAÇÃO
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    fontSize: 10.5,
                    color: '#334155',
                    borderLeft: '2px solid #e2e8f0',
                    paddingLeft: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                    }}
                  >
                    OPERAÇÃO AMAZONAS + VERDE
                  </div>
                  <div>
                    <strong>Data / Hora Briefing:</strong>{' '}
                    {RESUMO_EXECUTIVO_OFICIAL.data_briefing}
                  </div>
                  <div>
                    <strong>Coordenador:</strong>{' '}
                    <span style={{ color: '#991b1b', fontWeight: 800 }}>
                      {RESUMO_EXECUTIVO_OFICIAL.coordenador}
                    </span>
                  </div>
                  <div>
                    <strong>Emissão do Sistema:</strong>{' '}
                    {emissionTimestamp.date} às {emissionTimestamp.time}
                  </div>
                </div>
              </div>

              {/* TÍTULO PRINCIPAL DO RELATÓRIO */}
              <div
                style={{
                  background:
                    'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%)',
                  padding: '8px 14px',
                  borderRadius: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                  border: '1px solid #cbd5e1',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#0f172a',
                      letterSpacing: '0.4px',
                    }}
                  >
                    RELATÓRIO DIÁRIO AMAZONAS + VERDE - 24 HORAS
                  </span>
                  <span
                    style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}
                  >
                    • Consolidação Geral de Efetivo e Meios Operacionais
                  </span>
                </div>
                <div
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: 4,
                  }}
                >
                  TOTAL: 886 OPERACIONAIS
                </div>
              </div>

              {/* TABELA 3 EM DESTAQUE NO TOPO DO DOCUMENTO: RESUMO GERAL CONSOLIDADO (CAPITAL X INTERIOR) */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    3. QUADRO RESUMO GERAL CONSOLIDADO (CAPITAL X INTERIOR)
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    Fonte: Briefing Oficial CBMAM 03/11/2026
                  </span>
                </div>

                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 10.5,
                    border: '1.5px solid #0f172a',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                      <th
                        style={{
                          padding: '6px 10px',
                          textAlign: 'left',
                          fontWeight: 800,
                        }}
                      >
                        FORÇA / CONTINGENTE OPERACIONAL
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          width: '18%',
                        }}
                      >
                        CAPITAL (MANAUS)
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          width: '18%',
                        }}
                      >
                        INTERIOR (36 POLOS)
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          width: '18%',
                          background: '#991b1b',
                        }}
                      >
                        TOTAL GERAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Militares CBMAM — Serviço Ordinário (SV ORD)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        122
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        89
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        211
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Militares CBMAM — 6ª Fase OPAMV (25/1)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        0
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        27
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        27
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Militares CBMAM — OPAMV Fase Extra / Reforço (07/11)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        0
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        165
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        165
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Militares CBMAM — INC 2 (17/11)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        0
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        40
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        40
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: '1.5px solid #94a3b8',
                        background: '#eff6ff',
                      }}
                    >
                      <td
                        style={{
                          padding: '5px 10px',
                          fontWeight: 900,
                          color: '#1e3a8a',
                        }}
                      >
                        SUBTOTAL MILITARES CBMAM
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#1e3a8a',
                        }}
                      >
                        122
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#1e3a8a',
                        }}
                      >
                        321
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#1e3a8a',
                          background: '#dbeafe',
                        }}
                      >
                        443
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Brigadistas Federais — Prevfogo / IBAMA
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        94
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        153
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        247
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Força Nacional de Segurança Pública (FN)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        17
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        18
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        35
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Brigadistas Municipais (Prefeituras)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        0
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        78
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        78
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '5px 10px', fontWeight: 700 }}>
                        Brigadistas SEMA-AM (Estadual / Unidades de Conservação)
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        0
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        83
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 800,
                          background: '#f8fafc',
                        }}
                      >
                        83
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: '1.5px solid #94a3b8',
                        background: '#f0fdf4',
                      }}
                    >
                      <td
                        style={{
                          padding: '5px 10px',
                          fontWeight: 900,
                          color: '#166534',
                        }}
                      >
                        SUBTOTAL FORÇAS PARCEIRAS & BRIGADAS
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#166534',
                        }}
                      >
                        111
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#166534',
                        }}
                      >
                        332
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: '#166534',
                          background: '#dcfce7',
                        }}
                      >
                        443
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#fef2f2',
                        borderTop: '2px solid #991b1b',
                      }}
                    >
                      <td
                        style={{
                          padding: '7px 10px',
                          fontWeight: 900,
                          fontSize: 11.5,
                          color: '#991b1b',
                        }}
                      >
                        TOTAL GERAL EMPREGADO NA OPERAÇÃO
                      </td>
                      <td
                        style={{
                          padding: '7px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          fontSize: 12,
                          color: '#0f172a',
                        }}
                      >
                        233
                      </td>
                      <td
                        style={{
                          padding: '7px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          fontSize: 12,
                          color: '#0f172a',
                        }}
                      >
                        653
                      </td>
                      <td
                        style={{
                          padding: '7px 8px',
                          textAlign: 'center',
                          fontWeight: 900,
                          fontSize: 13,
                          background: '#fee2e2',
                          color: '#991b1b',
                        }}
                      >
                        886
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* TABELA 1: MUNICÍPIOS COM EFETIVO PERMANENTE (26 MUNICÍPIOS) */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    1. QUADRO DE MUNICÍPIOS COM EFETIVO PERMANENTE (26 POLOS)
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    Efetivo Permanente Cadastrado: <strong>818</strong> | Total
                    Ativo: <strong>682</strong>
                  </span>
                </div>

                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 9.5,
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                      <th
                        style={{
                          padding: '5px 6px',
                          textAlign: 'left',
                          fontWeight: 800,
                        }}
                      >
                        MUNICÍPIO
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                        }}
                      >
                        EF. PERM.
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                        }}
                      >
                        SV ORD
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                        }}
                      >
                        6ª OPAM
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                        }}
                      >
                        OPAM EXT
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '6%',
                        }}
                      >
                        INC 2
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 800,
                          width: '8%',
                          background: '#1e3a8a',
                        }}
                      >
                        MIL. CBM
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                          color: '#86efac',
                        }}
                      >
                        PREVFOGO
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '5%',
                          color: '#93c5fd',
                        }}
                      >
                        FN
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                          color: '#fdba74',
                        }}
                      >
                        BRIG MUN
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '8%',
                          color: '#a7f3d0',
                        }}
                      >
                        BRIG SEMA
                      </th>
                      <th
                        style={{
                          padding: '5px 5px',
                          textAlign: 'center',
                          fontWeight: 900,
                          width: '8%',
                          background: '#b91c1c',
                        }}
                      >
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabela1Municipios.map((m, idx) => (
                      <tr
                        key={m.muni}
                        style={{
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <td style={{ padding: '4px 6px', fontWeight: 700 }}>
                          {m.muni}
                          {m.tipo === 'capital' && (
                            <span
                              style={{
                                fontSize: 8.5,
                                color: '#dc2626',
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
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: '#64748b',
                          }}
                        >
                          {m.ef_permanente}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: m.serv_ord ? 800 : 400,
                          }}
                        >
                          {m.serv_ord || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: m.opam ? '#1d4ed8' : '#94a3b8',
                          }}
                        >
                          {m.opam || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: m.opam_extra ? '#1d4ed8' : '#94a3b8',
                          }}
                        >
                          {m.opam_extra || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: m.inc2 ? '#b91c1c' : '#94a3b8',
                          }}
                        >
                          {m.inc2 || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#eff6ff',
                          }}
                        >
                          {m.cbmam_militares || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: m.prevfogo ? 800 : 400,
                            color: m.prevfogo ? '#15803d' : '#94a3b8',
                          }}
                        >
                          {m.prevfogo || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: m.fn ? 800 : 400,
                            color: m.fn ? '#0369a1' : '#94a3b8',
                          }}
                        >
                          {m.fn || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: m.brigadista ? '#c2410c' : '#94a3b8',
                          }}
                        >
                          {m.brigadista || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: m.brigadista_sema ? '#047857' : '#94a3b8',
                          }}
                        >
                          {m.brigadista_sema || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 5px',
                            textAlign: 'center',
                            fontWeight: 900,
                            background: '#fee2e2',
                            color: '#991b1b',
                          }}
                        >
                          {m.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        fontWeight: 900,
                      }}
                    >
                      <td style={{ padding: '6px 6px' }}>
                        TOTAL MUNICÍPIOS (26)
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela1.ef_permanente}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela1.serv_ord}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela1.opam}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela1.opam_extra}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela1.inc2}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          background: '#1e3a8a',
                        }}
                      >
                        {totTabela1.cbmam}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#86efac',
                        }}
                      >
                        {totTabela1.prevfogo}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        {totTabela1.fn}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#fdba74',
                        }}
                      >
                        {totTabela1.brig_mun}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#a7f3d0',
                        }}
                      >
                        {totTabela1.brig_sema}
                      </td>
                      <td
                        style={{
                          padding: '6px 5px',
                          textAlign: 'center',
                          background: '#dc2626',
                          color: '#ffffff',
                        }}
                      >
                        {totTabela1.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* TABELA 2: BASES TEMPORÁRIAS DA OPERAÇÃO (11 BASES) */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    2. QUADRO DE BASES TEMPORÁRIAS AVANÇADAS (11 BASES)
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    Total Empregado em Bases Temporárias: <strong>204</strong>
                  </span>
                </div>

                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 9.5,
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                      <th
                        style={{
                          padding: '5px 6px',
                          textAlign: 'left',
                          fontWeight: 800,
                        }}
                      >
                        BASE TEMPORÁRIA
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '8%',
                        }}
                      >
                        6ª OPAM
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '8%',
                        }}
                      >
                        OPAM EXT
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '7%',
                        }}
                      >
                        INC 2
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 800,
                          width: '9%',
                          background: '#1e3a8a',
                        }}
                      >
                        MIL. CBM
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '8%',
                          color: '#86efac',
                        }}
                      >
                        PREVFOGO
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '6%',
                          color: '#93c5fd',
                        }}
                      >
                        FN
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '8%',
                          color: '#fdba74',
                        }}
                      >
                        BRIG MUN
                      </th>
                      <th
                        style={{
                          padding: '5px 4px',
                          textAlign: 'center',
                          fontWeight: 700,
                          width: '9%',
                          color: '#a7f3d0',
                        }}
                      >
                        BRIG SEMA
                      </th>
                      <th
                        style={{
                          padding: '5px 5px',
                          textAlign: 'center',
                          fontWeight: 900,
                          width: '9%',
                          background: '#b91c1c',
                        }}
                      >
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabela2Bases.map((b, idx) => (
                      <tr
                        key={b.muni}
                        style={{
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <td style={{ padding: '4px 6px', fontWeight: 700 }}>
                          {b.muni}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: b.opam ? '#1d4ed8' : '#94a3b8',
                          }}
                        >
                          {b.opam || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: b.opam_extra ? '#1d4ed8' : '#94a3b8',
                          }}
                        >
                          {b.opam_extra || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: b.inc2 ? '#b91c1c' : '#94a3b8',
                          }}
                        >
                          {b.inc2 || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#eff6ff',
                          }}
                        >
                          {b.cbmam_militares || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: b.prevfogo ? 800 : 400,
                            color: b.prevfogo ? '#15803d' : '#94a3b8',
                          }}
                        >
                          {b.prevfogo || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            fontWeight: b.fn ? 800 : 400,
                            color: b.fn ? '#0369a1' : '#94a3b8',
                          }}
                        >
                          {b.fn || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: b.brigadista ? '#c2410c' : '#94a3b8',
                          }}
                        >
                          {b.brigadista || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 4px',
                            textAlign: 'center',
                            color: b.brigadista_sema ? '#047857' : '#94a3b8',
                          }}
                        >
                          {b.brigadista_sema || '-'}
                        </td>
                        <td
                          style={{
                            padding: '4px 5px',
                            textAlign: 'center',
                            fontWeight: 900,
                            background: '#fee2e2',
                            color: '#991b1b',
                          }}
                        >
                          {b.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        fontWeight: 900,
                      }}
                    >
                      <td style={{ padding: '6px 6px' }}>
                        TOTAL BASES TEMPORÁRIAS (11)
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela2.opam}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela2.opam_extra}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {totTabela2.inc2}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          background: '#1e3a8a',
                        }}
                      >
                        {totTabela2.cbmam}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#86efac',
                        }}
                      >
                        {totTabela2.prevfogo}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#93c5fd',
                        }}
                      >
                        {totTabela2.fn}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#fdba74',
                        }}
                      >
                        {totTabela2.brig_mun}
                      </td>
                      <td
                        style={{
                          padding: '6px 4px',
                          textAlign: 'center',
                          color: '#a7f3d0',
                        }}
                      >
                        {totTabela2.brig_sema}
                      </td>
                      <td
                        style={{
                          padding: '6px 5px',
                          textAlign: 'center',
                          background: '#dc2626',
                          color: '#ffffff',
                        }}
                      >
                        {totTabela2.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* MEIOS OPERACIONAIS & COMBATE AÉREO */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 24,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '12px 14px',
                  background: '#f8fafc',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#0f172a',
                      marginBottom: 4,
                    }}
                  >
                    MEIOS OPERACIONAIS EMPREGADOS (AÉREO / TERRESTRE / FLUVIAL)
                  </div>
                  <div
                    style={{ fontSize: 10, color: '#334155', lineHeight: 1.5 }}
                  >
                    • <strong>10 Aeronaves:</strong> 7 Aviões Air Tractor
                    AT-802F (combate a incêndio) + 3 Helicópteros Harpia
                    (resgate/comando).
                    <br />• <strong>4 Viaturas Operacionais:</strong> Caminhões
                    Auto Bomba Tanque (ABT) e Pick-ups 4x4 de Ataque Rápido.
                    <br />• <strong>1 Embarcação Fluvial:</strong> Lancha de
                    resgate rápido e transporte fluvial de combate.
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#0f172a',
                      marginBottom: 4,
                    }}
                  >
                    EQUILÍBRIO OPERACIONAL DAS FORÇAS
                  </div>
                  <div
                    style={{ fontSize: 10, color: '#334155', lineHeight: 1.5 }}
                  >
                    • <strong>Militares CBMAM:</strong> 443 homens e mulheres
                    (50,0% do efetivo mobilizado).
                    <br />• <strong>Forças Parceiras & Brigadistas:</strong> 443
                    combatentes (Prevfogo 247 + FN 35 + Brig. 161).
                    <br />• <strong>Concentração Estratégica:</strong> 73,7% no
                    Interior (653) e 26,3% na Capital (233).
                  </div>
                </div>
              </div>

              {/* ASSINATURA OFICIAL DO COORDENADOR */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid #cbd5e1',
                  paddingTop: 16,
                  marginTop: 10,
                }}
              >
                <div style={{ fontSize: 9.5, color: '#64748b' }}>
                  Autenticação Digital: CBMAM-CBI-OPAMV-2026-0311-886
                  <br />
                  Sistema Integrado de Gestão e Monitoramento de Efetivo
                </div>

                <div style={{ textAlign: 'center', width: 280 }}>
                  <div
                    style={{
                      borderBottom: '1.5px solid #0f172a',
                      marginBottom: 4,
                      width: '100%',
                    }}
                  />
                  <div
                    style={{ fontSize: 11, fontWeight: 900, color: '#0f172a' }}
                  >
                    {RESUMO_EXECUTIVO_OFICIAL.coordenador}
                  </div>
                  <div style={{ fontSize: 9.5, color: '#475569' }}>
                    Coordenador da Sala de Situação — CBMAM
                    <br />
                    Operação Amazonas + Verde
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 2: PAINEL EXECUTIVO VISUAL (DASHBOARD COM CARDS E GRÁFICOS)
              ================================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Fileira de Indicadores Principais (KPIs) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                }}
              >
                {/* 1. Efetivo Geral */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1.5px solid #ef4444',
                    borderRadius: 12,
                    padding: '14px 16px',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
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
                        color: '#fca5a5',
                        textTransform: 'uppercase',
                      }}
                    >
                      Total Geral Empregado
                    </span>
                    <Shield size={16} color="#ef4444" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#ffffff',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    886{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#fca5a5',
                      }}
                    >
                      Operacionais
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    443 Militares CBMAM • 443 Parceiros/Brig.
                  </div>
                </div>

                {/* 2. Militares CBMAM */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
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
                        color: '#7dd3fc',
                        textTransform: 'uppercase',
                      }}
                    >
                      Militares CBMAM
                    </span>
                    <Users size={16} color="#38bdf8" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#38bdf8',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    443{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#93c5fd',
                      }}
                    >
                      Militares
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    211 SV ORD • 27 OPAM • 165 Ref • 40 INC2
                  </div>
                </div>

                {/* 3. Prevfogo IBAMA */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(34, 197, 94, 0.35)',
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
                        color: '#86efac',
                        textTransform: 'uppercase',
                      }}
                    >
                      Prevfogo / IBAMA
                    </span>
                    <TreePine size={16} color="#22c55e" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#4ade80',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    247{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#86efac',
                      }}
                    >
                      Brig. Federais
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    94 Capital • 153 Interior (5 Polos)
                  </div>
                </div>

                {/* 4. Força Nacional */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(14, 165, 233, 0.35)',
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
                        color: '#7dd3fc',
                        textTransform: 'uppercase',
                      }}
                    >
                      Força Nacional (FN)
                    </span>
                    <Compass size={16} color="#38bdf8" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#38bdf8',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    35{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#7dd3fc',
                      }}
                    >
                      Operacionais
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    17 Capital • 18 Interior (Manacapuru, Careiro)
                  </div>
                </div>

                {/* 5. Brigadistas (Mun + SEMA) */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(249, 115, 22, 0.35)',
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
                        color: '#fdba74',
                        textTransform: 'uppercase',
                      }}
                    >
                      Brigadistas Civis
                    </span>
                    <Flame size={16} color="#f97316" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#fb923c',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    161{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#fdba74',
                      }}
                    >
                      Brigadistas
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    78 Municipais • 83 SEMA (Estadual)
                  </div>
                </div>

                {/* 6. Meios Aéreos */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(250, 204, 21, 0.35)',
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
                        color: '#fde047',
                        textTransform: 'uppercase',
                      }}
                    >
                      Meios Operacionais
                    </span>
                    <Plane size={16} color="#facc15" />
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#facc15',
                      marginTop: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    10{' '}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#fef08a',
                      }}
                    >
                      Aeronaves
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}
                  >
                    7 Air Tractor • 3 Harpia • 4 VTRs • 1 Fluvial
                  </div>
                </div>
              </div>

              {/* Distribuição Territorial: Capital x Interior */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: '18px 22px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Building2 size={18} color="#ef4444" />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      CAPITAL (MANAUS) — 233 OPERACIONAIS (26,3%)
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                    }}
                  >
                    • <strong>122 Militares CBMAM</strong> em serviço ordinário
                    de prontidão.
                    <br />•{' '}
                    <strong>
                      94 Brigadistas Federais Prevfogo / IBAMA
                    </strong>{' '}
                    (Sede e Base Flores).
                    <br />• <strong>
                      17 Homens da Força Nacional (FN)
                    </strong>{' '}
                    integrados.
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 8,
                      background: '#1e293b',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '26.3%',
                        height: '100%',
                        background: '#ef4444',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <TreePine size={18} color="#38bdf8" />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      INTERIOR — 653 OPERACIONAIS (73,7%)
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                    }}
                  >
                    • <strong>321 Militares CBMAM</strong> (89 SV ORD, 27 OPAM,
                    165 Reforço, 40 INC 2).
                    <br />• <strong>
                      153 Brigadistas Prevfogo / IBAMA
                    </strong>{' '}
                    (Parintins, Autazes, Borba, etc).
                    <br />• <strong>18 Força Nacional</strong> +{' '}
                    <strong>161 Brigadistas</strong> (78 Mun + 83 SEMA).
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 8,
                      background: '#1e293b',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '73.7%',
                        height: '100%',
                        background: '#38bdf8',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 3: TABELAS DO BRIEFING OFICIAL
              ================================================================= */}
          {activeTab === 'tabelas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Tabela 1: Municípios com Efetivo Permanente */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#38bdf8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    1. Municípios com Efetivo Permanente (26 Polos • Subtotal:{' '}
                    {totTabela1.total})
                  </h3>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Efetivo Permanente:{' '}
                    <strong>{totTabela1.ef_permanente}</strong> | Militares
                    CBMAM: <strong>{totTabela1.cbmam}</strong>
                  </span>
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
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#cbd5e1',
                          }}
                        >
                          EF. PERM.
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#fca5a5',
                          }}
                        >
                          SV ORD
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#93c5fd',
                          }}
                        >
                          6ª OPAM
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#93c5fd',
                          }}
                        >
                          OPAM EXT
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#fca5a5',
                          }}
                        >
                          INC 2
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                            fontWeight: 900,
                          }}
                        >
                          MIL. CBM
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#86efac',
                          }}
                        >
                          PREVFOGO
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#7dd3fc',
                          }}
                        >
                          FN
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#fdba74',
                          }}
                        >
                          BRIG MUN
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#a7f3d0',
                          }}
                        >
                          BRIG SEMA
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
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
                      {filteredTabela1.map((m, idx) => (
                        <tr
                          key={m.muni}
                          style={{
                            background:
                              idx % 2 === 0
                                ? 'rgba(15, 23, 42, 0.6)'
                                : '#090d16',
                            borderBottom: '1px solid #1e293b',
                          }}
                        >
                          <td
                            style={{
                              padding: '8px 12px',
                              fontWeight: 700,
                              color: '#ffffff',
                            }}
                          >
                            {m.muni}
                            {m.tipo === 'capital' && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  color: '#ef4444',
                                  marginLeft: 6,
                                  fontWeight: 900,
                                }}
                              >
                                (CAPITAL)
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: '#94a3b8',
                            }}
                          >
                            {m.ef_permanente}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.serv_ord ? '#ef4444' : '#64748b',
                              fontWeight: m.serv_ord ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.serv_ord || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.opam ? '#38bdf8' : '#64748b',
                              fontWeight: m.opam ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.opam || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.opam_extra ? '#38bdf8' : '#64748b',
                              fontWeight: m.opam_extra ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.opam_extra || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.inc2 ? '#ef4444' : '#64748b',
                              fontWeight: m.inc2 ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.inc2 || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: '#38bdf8',
                              fontWeight: 900,
                              fontFamily: 'monospace',
                              background: 'rgba(56, 189, 248, 0.08)',
                            }}
                          >
                            {m.cbmam_militares}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.prevfogo ? '#4ade80' : '#64748b',
                              fontWeight: m.prevfogo ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.prevfogo || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.fn ? '#38bdf8' : '#64748b',
                              fontWeight: m.fn ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.fn || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.brigadista ? '#f97316' : '#64748b',
                              fontWeight: m.brigadista ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.brigadista || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: m.brigadista_sema ? '#10b981' : '#64748b',
                              fontWeight: m.brigadista_sema ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {m.brigadista_sema || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              fontWeight: 900,
                              color: '#ffffff',
                              fontFamily: 'monospace',
                              background: 'rgba(239, 68, 68, 0.15)',
                            }}
                          >
                            {m.total}
                          </td>
                          <td
                            style={{ padding: '8px 12px', textAlign: 'right' }}
                          >
                            {onSelectMuni && (
                              <button
                                onClick={() => {
                                  onSelectMuni(m.muni);
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
                                Ver no Mapa
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
                        <td style={{ padding: '10px 12px' }}>
                          TOTAL MUNICÍPIOS (26)
                        </td>
                        <td
                          style={{ padding: '10px 8px', textAlign: 'center' }}
                        >
                          {totTabela1.ef_permanente}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#ef4444',
                          }}
                        >
                          {totTabela1.serv_ord}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela1.opam}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela1.opam_extra}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#ef4444',
                          }}
                        >
                          {totTabela1.inc2}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela1.cbmam}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#4ade80',
                          }}
                        >
                          {totTabela1.prevfogo}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela1.fn}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#f97316',
                          }}
                        >
                          {totTabela1.brig_mun}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#10b981',
                          }}
                        >
                          {totTabela1.brig_sema}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#ffffff',
                            background: '#dc2626',
                          }}
                        >
                          {totTabela1.total}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Tabela 2: Bases Temporárias */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#f59e0b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    2. Bases Temporárias da Operação (11 Bases • Subtotal:{' '}
                    {totTabela2.total})
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
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#93c5fd',
                          }}
                        >
                          6ª OPAM
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#93c5fd',
                          }}
                        >
                          OPAM EXT
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#fca5a5',
                          }}
                        >
                          INC 2
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                            fontWeight: 900,
                          }}
                        >
                          MIL. CBM
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#86efac',
                          }}
                        >
                          PREVFOGO
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#7dd3fc',
                          }}
                        >
                          FN
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#fdba74',
                          }}
                        >
                          BRIG MUN
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
                            textAlign: 'center',
                            color: '#a7f3d0',
                          }}
                        >
                          BRIG SEMA
                        </th>
                        <th
                          style={{
                            padding: '8px 8px',
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
                      {filteredTabela2.map((b, idx) => (
                        <tr
                          key={b.muni}
                          style={{
                            background:
                              idx % 2 === 0
                                ? 'rgba(15, 23, 42, 0.6)'
                                : '#090d16',
                            borderBottom: '1px solid #1e293b',
                          }}
                        >
                          <td
                            style={{
                              padding: '8px 12px',
                              fontWeight: 700,
                              color: '#ffffff',
                            }}
                          >
                            <span
                              style={{
                                background: '#1e3a8a',
                                color: '#93c5fd',
                                fontSize: 9.5,
                                padding: '1px 6px',
                                borderRadius: 4,
                                marginRight: 6,
                              }}
                            >
                              BASE
                            </span>
                            {b.muni}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.opam ? '#38bdf8' : '#64748b',
                              fontWeight: b.opam ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.opam || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.opam_extra ? '#38bdf8' : '#64748b',
                              fontWeight: b.opam_extra ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.opam_extra || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.inc2 ? '#ef4444' : '#64748b',
                              fontWeight: b.inc2 ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.inc2 || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: '#38bdf8',
                              fontWeight: 900,
                              fontFamily: 'monospace',
                              background: 'rgba(56, 189, 248, 0.08)',
                            }}
                          >
                            {b.cbmam_militares}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.prevfogo ? '#4ade80' : '#64748b',
                              fontWeight: b.prevfogo ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.prevfogo || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.fn ? '#38bdf8' : '#64748b',
                              fontWeight: b.fn ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.fn || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.brigadista ? '#f97316' : '#64748b',
                              fontWeight: b.brigadista ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.brigadista || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              color: b.brigadista_sema ? '#10b981' : '#64748b',
                              fontWeight: b.brigadista_sema ? 800 : 400,
                              fontFamily: 'monospace',
                            }}
                          >
                            {b.brigadista_sema || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px 8px',
                              textAlign: 'center',
                              fontWeight: 900,
                              color: '#ffffff',
                              fontFamily: 'monospace',
                              background: 'rgba(239, 68, 68, 0.15)',
                            }}
                          >
                            {b.total}
                          </td>
                          <td
                            style={{ padding: '8px 12px', textAlign: 'right' }}
                          >
                            {onSelectMuni && (
                              <button
                                onClick={() => {
                                  onSelectMuni(b.muni_ref || b.muni);
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
                                Ver no Mapa
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
                        <td style={{ padding: '10px 12px' }}>
                          TOTAL BASES TEMPORÁRIAS (11)
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela2.opam}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela2.opam_extra}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#ef4444',
                          }}
                        >
                          {totTabela2.inc2}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela2.cbmam}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#4ade80',
                          }}
                        >
                          {totTabela2.prevfogo}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#38bdf8',
                          }}
                        >
                          {totTabela2.fn}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#f97316',
                          }}
                        >
                          {totTabela2.brig_mun}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#10b981',
                          }}
                        >
                          {totTabela2.brig_sema}
                        </td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            color: '#ffffff',
                            background: '#dc2626',
                          }}
                        >
                          {totTabela2.total}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 4: PREVFOGO & FOCOS DE COMBATE
              ================================================================= */}
          {activeTab === 'prevfogo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header Prevfogo */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1.5px solid #22c55e',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <TreePine size={20} color="#4ade80" />
                    <span>PREVFOGO / IBAMA — 247 BRIGADISTAS EM OPERAÇÃO</span>
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: '#bbf7d0', marginTop: 4 }}
                  >
                    Recursos mobilizados em cooperação com o CBMAM em Terras
                    Indígenas e Unidades de Conservação Federais
                  </div>
                </div>

                <div
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    fontSize: 20,
                    fontWeight: 900,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontFamily: 'monospace',
                  }}
                >
                  247 Op.
                </div>
              </div>

              {/* Grid das Bases do Prevfogo */}
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
                          fontSize: 14,
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
                          fontSize: 11,
                          fontWeight: 900,
                          padding: '3px 8px',
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
                                fontSize: 10,
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
      </div>
    </div>
  );
}
