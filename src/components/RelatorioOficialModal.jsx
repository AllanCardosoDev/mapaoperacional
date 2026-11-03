import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Search,
  Users,
  Shield,
  MapPin,
  Printer,
  Flame,
  Plane,
  Truck,
  Building2,
} from 'lucide-react';
import {
  OPERACAO_EFETIVO_MUNICIPIOS,
  PREVFOGO_RECURSOS_DISPONIVEIS,
  FOCOS_COMBATE_ATIVOS,
} from '../data/operacaoAmazonasData';

export function RelatorioOficialModal({ tokens = [], onClose, onSelectMuni }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'tabela' | 'documento' | 'focos'
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

  // Consolidação de tokens ativos por município para exibir viaturas e aeronaves
  const muniTokensSummary = useMemo(() => {
    const map = new Map();
    tokens.forEach((tk) => {
      const mName = tk.muni;
      if (!mName) return;
      if (!map.has(mName)) {
        map.set(mName, { viaturas: 0, aeronaves: 0, fluvial: 0, items: [] });
      }
      const entry = map.get(mName);
      entry.items.push(tk);
      if (tk.type && tk.type.startsWith('vtr_')) entry.viaturas += 1;
      else if (
        tk.type === 'air_tractor' ||
        tk.type === 'helicoptero' ||
        tk.type === 'kc390'
      )
        entry.aeronaves += 1;
      else if (tk.type === 'embarcacao') entry.fluvial += 1;
    });
    return map;
  }, [tokens]);

  // Municípios filtrados da tabela
  const filteredMunis = useMemo(() => {
    if (!searchTerm.trim()) return OPERACAO_EFETIVO_MUNICIPIOS;
    const q = searchTerm.toLowerCase();
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(
      (m) =>
        m.muni.toLowerCase().includes(q) ||
        (m.tipo && m.tipo.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  // Totais do efetivo calculados
  const totaisCalculados = useMemo(() => {
    let serv_ord = 0;
    let seg = 0;
    let brigadista = 0;
    let brigadista_sema = 0;

    OPERACAO_EFETIVO_MUNICIPIOS.forEach((item) => {
      serv_ord += item.serv_ord || 0;
      seg += item.seg || 0;
      brigadista += item.brigadista || 0;
      brigadista_sema += item.brigadista_sema || 0;
    });

    return {
      serv_ord,
      seg,
      brigadista,
      brigadista_sema,
      total_militares: serv_ord + seg,
      total_brigadistas: brigadista + brigadista_sema,
      total_geral: serv_ord + seg + brigadista + brigadista_sema,
    };
  }, []);

  // Totais de meios operacionais
  const totalMeios = useMemo(() => {
    let vtrs = 0;
    let aeros = 0;
    let barcos = 0;
    tokens.forEach((tk) => {
      if (tk.type && tk.type.startsWith('vtr_')) vtrs += 1;
      else if (
        tk.type === 'air_tractor' ||
        tk.type === 'helicoptero' ||
        tk.type === 'kc390'
      )
        aeros += 1;
      else if (tk.type === 'embarcacao') barcos += 1;
    });
    return {
      viaturas: vtrs || 4, // fallback realista
      aeronaves: aeros || 10,
      fluvial: barcos || 1,
    };
  }, [tokens]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container relatorio-modal-container"
        style={{
          maxWidth: 1180,
          width: '96%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: '1.5px solid #0284c7',
          borderRadius: 14,
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
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
                width: 48,
                height: 48,
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
                style={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>OPERAÇÃO AMAZONAS</span>
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                    letterSpacing: '0.5px',
                  }}
                >
                  RELATÓRIO OFICIAL DE EFETIVO
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Corpo de Bombeiros Militar do Amazonas (CBMAM) • Comando de
                Bombeiros do Interior (CBI)
              </div>
            </div>
          </div>

          {/* Botões de Ação do Topo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn-tactical btn-primary"
              onClick={handlePrint}
              style={{ padding: '7px 14px', fontSize: 11.5, borderRadius: 20 }}
              title="Gerar PDF oficial ou imprimir relatório em folha A4"
            >
              <Printer size={15} />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button
              className="btn-tactical"
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Fechar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ===================================================================
            BARRA DE ABAS VISUAIS & BUSCA RÁPIDA
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
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`sidebar-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'dashboard'
                    ? '1px solid #38bdf8'
                    : '1px solid transparent',
              }}
            >
              <Users size={14} style={{ display: 'inline', marginRight: 6 }} />
              Painel Executivo Visual
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'tabela' ? 'active' : ''}`}
              onClick={() => setActiveTab('tabela')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'tabela'
                    ? '1px solid #38bdf8'
                    : '1px solid transparent',
              }}
            >
              <FileText
                size={14}
                style={{ display: 'inline', marginRight: 6 }}
              />
              Quadro de Efetivo & Bases (623 Op.)
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'documento' ? 'active' : ''}`}
              onClick={() => setActiveTab('documento')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'documento'
                    ? '1px solid #facc15'
                    : '1px solid transparent',
                color: activeTab === 'documento' ? '#fde047' : undefined,
              }}
            >
              <Printer
                size={14}
                style={{ display: 'inline', marginRight: 6 }}
              />
              Prancha Documental A4 (Oficial)
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'focos' ? 'active' : ''}`}
              onClick={() => setActiveTab('focos')}
              style={{
                padding: '6px 14px',
                fontSize: 11.5,
                borderRadius: 20,
                border:
                  activeTab === 'focos'
                    ? '1px solid #ef4444'
                    : '1px solid transparent',
              }}
            >
              <Flame size={14} style={{ display: 'inline', marginRight: 6 }} />
              Focos & Prevfogo ({FOCOS_COMBATE_ATIVOS.length})
            </button>
          </div>

          {activeTab === 'tabela' && (
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
              ABA 1: PAINEL EXECUTIVO VISUAL (DASHBOARD COM CARDS E GRÁFICOS)
              ================================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Fileira de Indicadores Principais (KPIs em Cards) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 12,
                }}
              >
                {/* 1. Efetivo Geral */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1.5px solid #ef4444',
                    borderRadius: 12,
                    padding: '14px 16px',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.2)',
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
                      Efetivo Geral Homologado
                    </span>
                    <Shield size={16} color="#ef4444" />
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: '#ffffff',
                      marginTop: 4,
                    }}
                  >
                    623{' '}
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
                    273 Militares CBMAM • 350 Brigadistas
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
                      fontSize: 28,
                      fontWeight: 900,
                      color: '#38bdf8',
                      marginTop: 4,
                    }}
                  >
                    273{' '}
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
                    267 Serv. Ordinário • 6 SEG Gratificado
                  </div>
                </div>

                {/* 3. Brigadistas Civis */}
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
                      fontSize: 28,
                      fontWeight: 900,
                      color: '#fb923c',
                      marginTop: 4,
                    }}
                  >
                    350{' '}
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
                    197 Municipais • 153 SEMA (Estadual)
                  </div>
                </div>

                {/* 4. Meios Operacionais */}
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
                      Meios Aéreos & Terrestres
                    </span>
                    <Plane size={16} color="#facc15" />
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: '#facc15',
                      marginTop: 4,
                    }}
                  >
                    {totalMeios.aeronaves}{' '}
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
                    {totalMeios.viaturas} Viaturas VTR • {totalMeios.fluvial}{' '}
                    Fluvial
                  </div>
                </div>
              </div>

              {/* Quadro Comparativo Territorial: Capital x Interior */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
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
                    <Building2 size={16} color="#38bdf8" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      Distribuição na Capital (Manaus)
                    </span>
                    <span
                      style={{
                        background: '#dc2626',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: 10,
                      }}
                    >
                      123 Op.
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                    }}
                  >
                    • <strong>117 Militares</strong> em Serviço Ordinário
                    (Comando Geral, CBMAM QG, Prontidão Metropolitana)
                    <br />• <strong>6 Militares</strong> em Serviço
                    Extraordinário Gratificado (SEG)
                    <br />• <strong>1 Base Avançada Aeromóvel:</strong> Harpias
                    Helo e Centro Integrado
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
                    <MapPin size={16} color="#f97316" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      Distribuição no Interior (35 Municípios & Bases)
                    </span>
                    <span
                      style={{
                        background: '#0284c7',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: 10,
                      }}
                    >
                      500 Op.
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                    }}
                  >
                    • <strong>150 Militares</strong> em pelotões de combate do
                    interior e bases avançadas
                    <br />• <strong>197 Brigadistas Municipais</strong> atuando
                    nas brigadas das prefeituras
                    <br />• <strong>153 Brigadistas SEMA-AM</strong> destacados
                    para Unidades de Conservação e Sul do AM
                  </div>
                </div>
              </div>

              {/* Meios Aéreos e Focos de Combate */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: 16,
                }}
              >
                {/* Frota Aérea Operacional */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Plane size={16} color="#facc15" />
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: '#ffffff',
                        }}
                      >
                        Frota Aérea Oficial em Operação (10 Aeronaves)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: '#facc15',
                        fontWeight: 800,
                      }}
                    >
                      100% Disponível
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        background: '#090d16',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#fde047',
                        }}
                      >
                        4x Air Tractor AT-802F
                      </div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                        Combate Aéreo a Incêndio (3.100L água/retardante)
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#090d16',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#86efac',
                        }}
                      >
                        4x Helicópteros Harpia (AS350)
                      </div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                        Helibalde Bambi Bucket (540L) e infiltração rápida
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#090d16',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#93c5fd',
                        }}
                      >
                        1x KC-390 Millennium FAB
                      </div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                        Transporte estratégico de tropas e carga pesada
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#090d16',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#cbd5e1',
                        }}
                      >
                        1x Cessna Grand Caravan
                      </div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                        Reconhecimento visual, comando e enlace de rádio
                      </div>
                    </div>
                  </div>
                </div>

                {/* Síntese Operação Arco do Fogo */}
                <div
                  style={{
                    background: 'rgba(234, 88, 12, 0.12)',
                    border: '1.5px solid #ea580c',
                    borderRadius: 12,
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <Flame size={16} color="#fb923c" />
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: '#fdba74',
                      }}
                    >
                      Prioridade Estratégica: Arco do Fogo
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#f8fafc',
                      lineHeight: 1.5,
                      marginBottom: 10,
                    }}
                  >
                    Concentração massiva de meios e brigadistas nas calhas dos
                    rios Madeira e Purus.
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: '#cbd5e1' }}>
                        • Apuí / Transamazônica:
                      </span>
                      <strong style={{ color: '#facc15' }}>
                        21 Operacionais
                      </strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: '#cbd5e1' }}>
                        • Humaitá / BR-319:
                      </span>
                      <strong style={{ color: '#facc15' }}>
                        21 Operacionais
                      </strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: '#cbd5e1' }}>
                        • Lábrea / Sul do AM:
                      </span>
                      <strong style={{ color: '#facc15' }}>
                        32 Operacionais
                      </strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: '#cbd5e1' }}>
                        • Manicoré / Médio Madeira:
                      </span>
                      <strong style={{ color: '#facc15' }}>
                        30 Operacionais
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 2: QUADRO DE EFETIVO OFICIAL COMPLETO (TABELA COM FILTRO)
              ================================================================= */}
          {activeTab === 'tabela' && (
            <div>
              <div
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(56, 189, 248, 0.3)',
                  background: '#090d16',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 11.5,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          'linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%)',
                        color: '#ffffff',
                        textAlign: 'center',
                      }}
                    >
                      <th
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          fontWeight: 900,
                          letterSpacing: 0.5,
                        }}
                      >
                        MUNICÍPIO / BASE OPERACIONAL
                      </th>
                      <th
                        style={{
                          padding: '10px 8px',
                          fontWeight: 900,
                          background: 'rgba(29, 78, 216, 0.8)',
                          borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        SERV. ORDINÁRIO
                      </th>
                      <th
                        style={{
                          padding: '10px 8px',
                          fontWeight: 900,
                          background: 'rgba(30, 64, 175, 0.8)',
                          borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        SEG
                      </th>
                      <th
                        style={{
                          padding: '10px 8px',
                          fontWeight: 900,
                          background: 'rgba(234, 88, 12, 0.8)',
                          borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        BRIGADISTA
                      </th>
                      <th
                        style={{
                          padding: '10px 8px',
                          fontWeight: 900,
                          background: 'rgba(4, 120, 87, 0.8)',
                          borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        BRIG. SEMA
                      </th>
                      <th
                        style={{
                          padding: '10px 8px',
                          fontWeight: 900,
                          background: 'rgba(15, 23, 42, 0.9)',
                          borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        SUBTOTAL
                      </th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>
                        LOCALIZAÇÃO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunis.map((row, idx) => {
                      const subtotal =
                        (row.serv_ord || 0) +
                        (row.seg || 0) +
                        (row.brigadista || 0) +
                        (row.brigadista_sema || 0);
                      const isBaseTemp = row.tipo === 'base_temporaria';
                      const isCapital = row.tipo === 'capital';
                      const isPrevfogo = row.tipo === 'prevfogo';

                      const targetMuni = row.muni_ref || row.muni;
                      const resourceSummary = muniTokensSummary.get(targetMuni);

                      return (
                        <tr
                          key={idx}
                          style={{
                            background:
                              idx % 2 === 0
                                ? 'rgba(15, 23, 42, 0.6)'
                                : 'rgba(11, 17, 32, 0.8)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          <td
                            style={{
                              padding: '8px 14px',
                              fontWeight: 700,
                              color: '#f8fafc',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              {isCapital && (
                                <span
                                  style={{
                                    padding: '2px 6px',
                                    background: '#dc2626',
                                    color: '#fff',
                                    borderRadius: 4,
                                    fontSize: 9,
                                    fontWeight: 900,
                                  }}
                                >
                                  CAPITAL
                                </span>
                              )}
                              {isBaseTemp && (
                                <span
                                  style={{
                                    padding: '2px 6px',
                                    background: '#0284c7',
                                    color: '#fff',
                                    borderRadius: 4,
                                    fontSize: 9,
                                    fontWeight: 900,
                                  }}
                                >
                                  BASE TEMP
                                </span>
                              )}
                              {isPrevfogo && (
                                <span
                                  style={{
                                    padding: '2px 6px',
                                    background: '#15803d',
                                    color: '#fff',
                                    borderRadius: 4,
                                    fontSize: 9,
                                    fontWeight: 900,
                                  }}
                                >
                                  PREVFOGO
                                </span>
                              )}
                              <span>{row.muni}</span>

                              {/* Indicadores de Viaturas e Aeronaves se houver */}
                              {resourceSummary &&
                                resourceSummary.aeronaves > 0 && (
                                  <span
                                    title={`${resourceSummary.aeronaves} Aeronave(s)`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 2,
                                      background: 'rgba(250, 204, 21, 0.2)',
                                      color: '#facc15',
                                      padding: '1px 5px',
                                      borderRadius: 8,
                                      fontSize: 9,
                                      fontWeight: 800,
                                    }}
                                  >
                                    <Plane size={10} />{' '}
                                    {resourceSummary.aeronaves}
                                  </span>
                                )}
                              {resourceSummary &&
                                resourceSummary.viaturas > 0 && (
                                  <span
                                    title={`${resourceSummary.viaturas} Viatura(s)`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 2,
                                      background: 'rgba(248, 113, 113, 0.2)',
                                      color: '#f87171',
                                      padding: '1px 5px',
                                      borderRadius: 8,
                                      fontSize: 9,
                                      fontWeight: 800,
                                    }}
                                  >
                                    <Truck size={10} />{' '}
                                    {resourceSummary.viaturas}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontWeight: 800,
                              color: row.serv_ord > 0 ? '#ef4444' : '#64748b',
                            }}
                          >
                            {row.serv_ord || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontWeight: 800,
                              color: row.seg > 0 ? '#facc15' : '#64748b',
                            }}
                          >
                            {row.seg || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontWeight: 800,
                              color: row.brigadista > 0 ? '#fb923c' : '#64748b',
                            }}
                          >
                            {row.brigadista || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontWeight: 800,
                              color:
                                row.brigadista_sema > 0 ? '#4ade80' : '#64748b',
                            }}
                          >
                            {row.brigadista_sema || '-'}
                          </td>
                          <td
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontWeight: 900,
                              color: '#38bdf8',
                            }}
                          >
                            {subtotal}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                              className="btn-tactical"
                              style={{
                                padding: '4px 9px',
                                fontSize: 10,
                                borderRadius: 14,
                              }}
                              onClick={() => {
                                onSelectMuni(targetMuni);
                                onClose();
                              }}
                              title="Visualizar no mapa tático"
                            >
                              <MapPin size={11} color="#38bdf8" />
                              Ver no Mapa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        background:
                          'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
                        fontWeight: 900,
                        borderTop: '2px solid #38bdf8',
                      }}
                    >
                      <td style={{ padding: '12px 14px', color: '#f8fafc' }}>
                        TOTAL GERAL OPERACIONAL
                      </td>
                      <td
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          color: '#ef4444',
                          fontSize: 13.5,
                        }}
                      >
                        {totaisCalculados.serv_ord}
                      </td>
                      <td
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          color: '#facc15',
                          fontSize: 13.5,
                        }}
                      >
                        {totaisCalculados.seg}
                      </td>
                      <td
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          color: '#fb923c',
                          fontSize: 13.5,
                        }}
                      >
                        {totaisCalculados.brigadista}
                      </td>
                      <td
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          color: '#4ade80',
                          fontSize: 13.5,
                        }}
                      >
                        {totaisCalculados.brigadista_sema}
                      </td>
                      <td
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          color: '#38bdf8',
                          fontSize: 15,
                        }}
                      >
                        {totaisCalculados.total_geral}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Destaque das 2 Opções de Brigadistas */}
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 18px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={20} color="#38bdf8" />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#f8fafc',
                      }}
                    >
                      TOTAL CONSOLIDADO DE BRIGADISTAS EM CAMPO:{' '}
                      {totaisCalculados.total_brigadistas} BRIGADISTAS
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      Opção 1:{' '}
                      <strong style={{ color: '#fb923c' }}>
                        {totaisCalculados.brigadista} Brigadistas
                        Municipais/Gerais
                      </strong>{' '}
                      • Opção 2:{' '}
                      <strong style={{ color: '#4ade80' }}>
                        {totaisCalculados.brigadista_sema} Brigadistas SEMA-AM
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      background: 'rgba(234, 88, 12, 0.2)',
                      border: '1px solid #ea580c',
                      color: '#fdba74',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    BRIGADISTA: {totaisCalculados.brigadista}
                  </div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#86efac',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    BRIGADISTA SEMA: {totaisCalculados.brigadista_sema}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 3: PRANCHA DOCUMENTAL OFICIAL A4 (PRONTA PARA IMPRESSÃO / PDF)
              ================================================================= */}
          {activeTab === 'documento' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
                <button
                  className="btn-tactical btn-primary"
                  onClick={handlePrint}
                  style={{
                    padding: '8px 18px',
                    fontSize: 12,
                    borderRadius: 20,
                  }}
                >
                  <Printer size={15} /> Imprimir / Salvar em PDF Agora
                </button>
              </div>

              {/* Folha A4 Simulação Visual Oficial (Estilo Papel Timbrado Militar) */}
              <div
                id="printable-official-report"
                className="printable-sheet-a4"
                style={{
                  width: '100%',
                  maxWidth: 820,
                  background: '#ffffff',
                  color: '#090d16',
                  padding: '36px 44px',
                  borderRadius: 6,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              >
                {/* Cabeçalho do Documento Oficial A4 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2.5px solid #b91c1c',
                    paddingBottom: 14,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="/brasao-cbmam.png"
                      alt="Brasão CBMAM"
                      style={{ width: 64, height: 64, objectFit: 'contain' }}
                    />
                  </div>

                  <div
                    style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 900,
                        color: '#090d16',
                        letterSpacing: '0.5px',
                      }}
                    >
                      GOVERNO DO ESTADO DO AMAZONAS
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: '#334155',
                      }}
                    >
                      SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA • SSP-AM
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 900,
                        color: '#b91c1c',
                      }}
                    >
                      CORPO DE BOMBEIROS MILITAR DO AMAZONAS — CBMAM
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      COMANDO DE BOMBEIROS DO INTERIOR (CBI) • FORÇA-TAREFA DE
                      INCÊNDIOS FLORESTAIS
                    </div>
                  </div>

                  <div
                    style={{
                      width: 68,
                      height: 68,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        border: '2px solid #0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f9ff',
                        color: '#0284c7',
                        fontWeight: 900,
                        fontSize: 10,
                        textAlign: 'center',
                        lineHeight: 1.1,
                      }}
                    >
                      MISSÃO
                      <br />
                      AMAZONAS
                    </div>
                  </div>
                </div>

                {/* Título do Relatório e Metadados */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '10px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: '#0f172a',
                      }}
                    >
                      BOLETIM DIÁRIO OPERACIONAL Nº 142/2026 — EFETIVO E MEIOS
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>
                      Operação Amazonas • Monitoramento e Combate a Incêndios
                      Florestais (CBI)
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: 10.5,
                      color: '#334155',
                    }}
                  >
                    <div>
                      <strong>Data:</strong> {emissionTimestamp.date}
                    </div>
                    <div>
                      <strong>Horário de Emissão:</strong>{' '}
                      {emissionTimestamp.time}
                    </div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span style={{ color: '#dc2626', fontWeight: 800 }}>
                        OPERAÇÃO ATIVA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumo Executivo Oficial (Tabela Compacta Oficial 623 Homens) */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    1. QUADRO RESUMO GERAL DE EFETIVO EMPREGADO
                  </div>

                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 11,
                      border: '1px solid #cbd5e1',
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
                          CATEGORIA / FORÇA
                        </th>
                        <th
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                          }}
                        >
                          CAPITAL
                        </th>
                        <th
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                          }}
                        >
                          INTERIOR
                        </th>
                        <th
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 900,
                            background: '#1e3a8a',
                          }}
                        >
                          TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>
                          Militares - Serviço Ordinário (SV ORD)
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          117
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          150
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#f1f5f9',
                          }}
                        >
                          267
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>
                          Militares - Serviço Gratificado (SEG)
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          6
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          0
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#f1f5f9',
                          }}
                        >
                          6
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>
                          Brigadistas Civis (Municipais / Gerais)
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          0
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          197
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#f1f5f9',
                          }}
                        >
                          197
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>
                          Brigadistas SEMA-AM (Estaduais / UCs)
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          0
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          153
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            fontWeight: 800,
                            background: '#f1f5f9',
                          }}
                        >
                          153
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr
                        style={{
                          background: '#f8fafc',
                          fontWeight: 900,
                          borderTop: '2px solid #0f172a',
                        }}
                      >
                        <td style={{ padding: '7px 10px', color: '#090d16' }}>
                          TOTAL CONSOLIDADO EM CAMPO
                        </td>
                        <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                          123
                        </td>
                        <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                          500
                        </td>
                        <td
                          style={{
                            padding: '7px 8px',
                            textAlign: 'center',
                            color: '#b91c1c',
                            fontSize: 13,
                            background: '#fee2e2',
                          }}
                        >
                          623
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Meios Operacionais Resumo A4 */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    2. MEIOS AÉREOS, TERRESTRES E FLUVIAIS MOBILIZADOS
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 8,
                      fontSize: 10.5,
                    }}
                  >
                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '6px 8px',
                        background: '#f8fafc',
                      }}
                    >
                      <strong style={{ color: '#b91c1c' }}>
                        Aeronaves: 10 unidades
                      </strong>
                      <div style={{ color: '#475569', marginTop: 2 }}>
                        4 Air Tractor • 4 Helicópteros Harpia • 1 KC-390 • 1
                        C-208 Caravan
                      </div>
                    </div>
                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '6px 8px',
                        background: '#f8fafc',
                      }}
                    >
                      <strong style={{ color: '#0369a1' }}>
                        Viaturas Terrestres
                      </strong>
                      <div style={{ color: '#475569', marginTop: 2 }}>
                        Caminhões ABT Combate • Pick-ups 4x4 Florestais •
                        Resgate UR
                      </div>
                    </div>
                    <div
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '6px 8px',
                        background: '#f8fafc',
                      }}
                    >
                      <strong style={{ color: '#047857' }}>
                        Recursos Especiais
                      </strong>
                      <div style={{ color: '#475569', marginTop: 2 }}>
                        134 Brigadistas Prevfogo / IBAMA • Lanchas Rápidas CBI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribuição por Município A4 (Tabela em 2 colunas para caber perfeitamente na folha) */}
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    3. DISTRIBUIÇÃO MUNICIPAL ANALÍTICA DE FORÇA
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                    }}
                  >
                    {/* Metade 1 */}
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 9.5,
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: '#f1f5f9',
                            borderBottom: '1px solid #cbd5e1',
                          }}
                        >
                          <th style={{ padding: '4px 6px', textAlign: 'left' }}>
                            MUNICÍPIO / BASE
                          </th>
                          <th
                            style={{ padding: '4px 4px', textAlign: 'center' }}
                          >
                            MIL
                          </th>
                          <th
                            style={{ padding: '4px 4px', textAlign: 'center' }}
                          >
                            BRIG
                          </th>
                          <th
                            style={{
                              padding: '4px 4px',
                              textAlign: 'center',
                              fontWeight: 800,
                            }}
                          >
                            TOT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {OPERACAO_EFETIVO_MUNICIPIOS.slice(0, 19).map(
                          (m, i) => (
                            <tr
                              key={i}
                              style={{ borderBottom: '1px solid #f1f5f9' }}
                            >
                              <td
                                style={{ padding: '3px 6px', fontWeight: 600 }}
                              >
                                {m.muni}
                              </td>
                              <td
                                style={{
                                  padding: '3px 4px',
                                  textAlign: 'center',
                                }}
                              >
                                {(m.serv_ord || 0) + (m.seg || 0) || '-'}
                              </td>
                              <td
                                style={{
                                  padding: '3px 4px',
                                  textAlign: 'center',
                                }}
                              >
                                {(m.brigadista || 0) +
                                  (m.brigadista_sema || 0) || '-'}
                              </td>
                              <td
                                style={{
                                  padding: '3px 4px',
                                  textAlign: 'center',
                                  fontWeight: 800,
                                }}
                              >
                                {(m.serv_ord || 0) +
                                  (m.seg || 0) +
                                  (m.brigadista || 0) +
                                  (m.brigadista_sema || 0)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>

                    {/* Metade 2 */}
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 9.5,
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: '#f1f5f9',
                            borderBottom: '1px solid #cbd5e1',
                          }}
                        >
                          <th style={{ padding: '4px 6px', textAlign: 'left' }}>
                            MUNICÍPIO / BASE
                          </th>
                          <th
                            style={{ padding: '4px 4px', textAlign: 'center' }}
                          >
                            MIL
                          </th>
                          <th
                            style={{ padding: '4px 4px', textAlign: 'center' }}
                          >
                            BRIG
                          </th>
                          <th
                            style={{
                              padding: '4px 4px',
                              textAlign: 'center',
                              fontWeight: 800,
                            }}
                          >
                            TOT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {OPERACAO_EFETIVO_MUNICIPIOS.slice(19).map((m, i) => (
                          <tr
                            key={i}
                            style={{ borderBottom: '1px solid #f1f5f9' }}
                          >
                            <td style={{ padding: '3px 6px', fontWeight: 600 }}>
                              {m.muni}
                            </td>
                            <td
                              style={{
                                padding: '3px 4px',
                                textAlign: 'center',
                              }}
                            >
                              {(m.serv_ord || 0) + (m.seg || 0) || '-'}
                            </td>
                            <td
                              style={{
                                padding: '3px 4px',
                                textAlign: 'center',
                              }}
                            >
                              {(m.brigadista || 0) + (m.brigadista_sema || 0) ||
                                '-'}
                            </td>
                            <td
                              style={{
                                padding: '3px 4px',
                                textAlign: 'center',
                                fontWeight: 800,
                              }}
                            >
                              {(m.serv_ord || 0) +
                                (m.seg || 0) +
                                (m.brigadista || 0) +
                                (m.brigadista_sema || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Termo de Encerramento e Assinatura Militar */}
                <div
                  style={{
                    marginTop: 20,
                    borderTop: '1px solid #cbd5e1',
                    paddingTop: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    fontSize: 10,
                    color: '#334155',
                  }}
                >
                  <div>
                    <div>
                      <strong>Emitido por:</strong> Sistema de Comando e
                      Controle CBMAM
                    </div>
                    <div>
                      <strong>Autenticação:</strong> CBI-FT-AM-2026-OFICIAL
                    </div>
                    <div>
                      Documento oficial de circulação restrita operacional.
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', width: 240 }}>
                    <div
                      style={{
                        borderBottom: '1px solid #000000',
                        marginBottom: 4,
                        height: 26,
                      }}
                    />
                    <div style={{ fontWeight: 800, color: '#090d16' }}>
                      COMANDANTE DO CBI — CBMAM
                    </div>
                    <div style={{ fontSize: 9, color: '#64748b' }}>
                      Comando de Bombeiros do Interior
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 4: FOCOS DE COMBATE ATIVOS & PREVFOGO
              ================================================================= */}
          {activeTab === 'focos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Seção 1: Focos Ativos Georreferenciados */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Flame size={18} color="#ef4444" />
                  <span
                    style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}
                  >
                    Focos Ativos Georreferenciados em Combate (
                    {FOCOS_COMBATE_ATIVOS.length} Focos)
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 10,
                  }}
                >
                  {FOCOS_COMBATE_ATIVOS.map((foco) => (
                    <div
                      key={foco.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 10,
                        padding: '12px 14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: '#ffffff',
                          }}
                        >
                          {foco.muni}
                        </span>
                        <span
                          style={{
                            background:
                              foco.status === 'ativo' ? '#dc2626' : '#d97706',
                            color: '#fff',
                            fontSize: 9.5,
                            fontWeight: 900,
                            padding: '2px 7px',
                            borderRadius: 10,
                            textTransform: 'uppercase',
                          }}
                        >
                          {foco.status === 'ativo'
                            ? 'Em Combate'
                            : 'Controlado'}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#93c5fd',
                          marginBottom: 4,
                        }}
                      >
                        {foco.local}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#94a3b8',
                          marginBottom: 8,
                        }}
                      >
                        {foco.detalhe}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 10.5,
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                          paddingTop: 6,
                        }}
                      >
                        <span
                          style={{ color: '#38bdf8', fontFamily: 'monospace' }}
                        >
                          {foco.lat_dms} • {foco.lon_dms}
                        </span>
                        <strong style={{ color: '#facc15' }}>
                          {foco.efetivo} Brigadistas
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 2: Recursos Prevfogo / IBAMA */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Shield size={18} color="#22c55e" />
                  <span
                    style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}
                  >
                    Bases Prevfogo / IBAMA em Terras Indígenas (Total: 134
                    Brigadistas)
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 10,
                  }}
                >
                  {PREVFOGO_RECURSOS_DISPONIVEIS.map((pf, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(21, 128, 61, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: 10,
                        padding: '12px 14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: '#86efac',
                          }}
                        >
                          {pf.muni}
                        </span>
                        <span
                          style={{
                            background: '#15803d',
                            color: '#fff',
                            fontSize: 10,
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
                          gap: 4,
                        }}
                      >
                        {pf.bases.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            style={{
                              fontSize: 10.5,
                              color: '#d1fae5',
                              display: 'flex',
                              justifyContent: 'space-between',
                              background: 'rgba(15, 23, 42, 0.6)',
                              padding: '4px 8px',
                              borderRadius: 4,
                            }}
                          >
                            <span>{b.local}</span>
                            <strong>{b.efetivo} Op.</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
