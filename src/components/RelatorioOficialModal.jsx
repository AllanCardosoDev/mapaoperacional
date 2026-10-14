import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Search, 
  Users, 
  Shield, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Printer
} from 'lucide-react';
import { 
  OPERACAO_EFETIVO_MUNICIPIOS, 
  RESUMO_EXECUTIVO_OFICIAL 
} from '../data/operacaoAmazonasData';

export function RelatorioOficialModal({ onClose, onSelectMuni }) {
  const [activeTab, setActiveTab] = useState('tabela'); // 'tabela' | 'focos' | 'resumo'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMunis = useMemo(() => {
    if (!searchTerm.trim()) return OPERACAO_EFETIVO_MUNICIPIOS;
    const q = searchTerm.toLowerCase();
    return OPERACAO_EFETIVO_MUNICIPIOS.filter(m => 
      m.muni.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const totaisCalculados = useMemo(() => {
    let serv_ord = 0;
    let seg = 0;
    let brigadista = 0;
    let brigadista_sema = 0;

    OPERACAO_EFETIVO_MUNICIPIOS.forEach(item => {
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
      total_brigadistas: brigadista + brigadista_sema,
      total_geral: serv_ord + seg + brigadista + brigadista_sema
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container"
        style={{ 
          maxWidth: 1080, 
          width: '95%', 
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#090d16',
          border: '1.5px solid #0284c7',
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Relatório */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ef4444'
            }}>
              <Shield size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', letterSpacing: 0.5 }}>
                OPERAÇÃO AMAZONAS • RELATÓRIO OFICIAL DE EFETIVO
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                CBMAM • Comando de Bombeiros do Interior (CBI) • Força-Tarefa de Incêndios Florestais
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="btn-tactical" 
              onClick={handlePrint}
              title="Imprimir ou Salvar em PDF"
            >
              <Printer size={14} />
              Imprimir / PDF
            </button>
            <button 
              className="btn-tactical btn-icon-only" 
              onClick={onClose}
              title="Fechar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Abas e Filtro */}
        <div style={{
          padding: '10px 20px',
          background: '#0c121e',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`sidebar-tab-btn ${activeTab === 'tabela' ? 'active' : ''}`}
              onClick={() => setActiveTab('tabela')}
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: 5 }} />
              Quadro de Efetivo (Oficial CBMAM)
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'resumo' ? 'active' : ''}`}
              onClick={() => setActiveTab('resumo')}
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              <Users size={14} style={{ display: 'inline', marginRight: 5 }} />
              Resumo Executivo (623 Homens)
            </button>
          </div>

          {activeTab === 'tabela' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '4px 10px',
              gap: 6
            }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Filtrar município ou base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 12,
                  outline: 'none',
                  width: 180
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Corpo do Conteúdo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* =================================================================
              ABA 1: QUADRO DE EFETIVO OFICIAL (TABELA DA FOTO)
              ================================================================= */}
          {activeTab === 'tabela' && (
            <div>
              {/* Tabela Formatada exatamente como o documento oficial */}
              <div style={{
                borderRadius: 8,
                overflow: 'hidden',
                border: '1.5px solid #1e3a8a',
                background: '#090d16'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: '#ffffff', textAlign: 'center' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 900, letterSpacing: 0.5 }}>
                        MUNICÍPIO / BASE OPERACIONAL
                      </th>
                      <th style={{ padding: '10px 8px', fontWeight: 900, background: '#1d4ed8', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        SERV. ORDINÁRIO
                      </th>
                      <th style={{ padding: '10px 8px', fontWeight: 900, background: '#1e40af', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        SEG
                      </th>
                      <th style={{ padding: '10px 8px', fontWeight: 900, background: '#ea580c', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        BRIGADISTA
                      </th>
                      <th style={{ padding: '10px 8px', fontWeight: 900, background: '#047857', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        BRIGADISTA SEMA
                      </th>
                      <th style={{ padding: '10px 8px', fontWeight: 900, background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                        SUBTOTAL
                      </th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>
                        AÇÕES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunis.map((row, idx) => {
                      const subtotal = (row.serv_ord || 0) + (row.seg || 0) + (row.brigadista || 0) + (row.brigadista_sema || 0);
                      const isBaseTemp = row.tipo === 'base_temporaria';
                      const isCapital = row.tipo === 'capital';

                      return (
                        <tr 
                          key={idx}
                          style={{
                            background: idx % 2 === 0 ? '#0f172a' : '#0c121e',
                            borderBottom: '1px solid #1e293b'
                          }}
                        >
                          <td style={{ padding: '8px 14px', fontWeight: 700, color: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {isCapital && <span style={{ padding: '2px 6px', background: '#dc2626', borderRadius: 3, fontSize: 9, fontWeight: 900 }}>CAPITAL</span>}
                              {isBaseTemp && <span style={{ padding: '2px 6px', background: '#0284c7', borderRadius: 3, fontSize: 9, fontWeight: 900 }}>BASE TEMP</span>}
                              <span>{row.muni}</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: row.serv_ord > 0 ? '#ef4444' : '#64748b' }}>
                            {row.serv_ord || '-'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: row.seg > 0 ? '#facc15' : '#64748b' }}>
                            {row.seg || '-'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: row.brigadista > 0 ? '#fb923c' : '#64748b' }}>
                            {row.brigadista || '-'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: row.brigadista_sema > 0 ? '#4ade80' : '#64748b' }}>
                            {row.brigadista_sema || '-'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', fontWeight: 900, color: '#38bdf8' }}>
                            {subtotal}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                              className="btn-tactical"
                              style={{ padding: '3px 8px', fontSize: 10 }}
                              onClick={() => {
                                onSelectMuni(row.muni_ref || row.muni);
                                onClose();
                              }}
                              title="Localizar no mapa"
                            >
                              <MapPin size={11} />
                              Ver no Mapa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#1e293b', fontWeight: 900, borderTop: '2px solid #38bdf8' }}>
                      <td style={{ padding: '12px 14px', color: '#f8fafc' }}>
                        TOTAL GERAL OPERACIONAL
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: '#ef4444', fontSize: 14 }}>
                        {totaisCalculados.serv_ord}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: '#facc15', fontSize: 14 }}>
                        {totaisCalculados.seg}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: '#fb923c', fontSize: 14 }}>
                        {totaisCalculados.brigadista}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: '#4ade80', fontSize: 14 }}>
                        {totaisCalculados.brigadista_sema}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', color: '#38bdf8', fontSize: 15 }}>
                        {totaisCalculados.total_geral}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Destaque das 2 Opções de Brigadistas */}
              <div style={{
                marginTop: 16,
                padding: '12px 16px',
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid #0284c7',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={20} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>
                      TOTAL CONSOLIDADO DE BRIGADISTAS EM CAMPO: {totaisCalculados.total_brigadistas} BRIGADISTAS
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      Opção 1: <strong style={{ color: '#fb923c' }}>{totaisCalculados.brigadista} Brigadistas Municipais/Gerais</strong> • 
                      Opção 2: <strong style={{ color: '#4ade80' }}>{totaisCalculados.brigadista_sema} Brigadistas SEMA-AM</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(234, 88, 12, 0.2)',
                    border: '1px solid #ea580c',
                    color: '#fdba74',
                    fontSize: 11,
                    fontWeight: 800
                  }}>
                    BRIGADISTA: {totaisCalculados.brigadista}
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    color: '#86efac',
                    fontSize: 11,
                    fontWeight: 800
                  }}>
                    BRIGADISTA SEMA: {totaisCalculados.brigadista_sema}
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* =================================================================
              ABA 3: RESUMO EXECUTIVO OFICIAL (TABELA RESUMO EFETIVO 623 HOMENS)
              ================================================================= */}
          {activeTab === 'resumo' && (
            <div>
              <div style={{
                maxWidth: 640,
                margin: '0 auto',
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid #1e40af',
                background: '#090d16',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  background: '#1e40af',
                  color: '#ffffff',
                  padding: '12px 18px',
                  fontWeight: 900,
                  fontSize: 14,
                  textAlign: 'center',
                  letterSpacing: 0.5
                }}>
                  RESUMO EFETIVO • MISSÃO OPERAÇÃO AMAZONAS
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#172554', color: '#93c5fd', borderBottom: '2px solid #1e3a8a' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 900 }}>MISSÃO</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900 }}>CAPITAL</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900 }}>INTERIOR</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900, background: '#1e3a8a' }}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#f8fafc' }}>
                        SV ORD (Serviço Ordinário)
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#ef4444' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.serv_ord.capital}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#f8fafc' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.serv_ord.interior}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900, color: '#ef4444', background: 'rgba(30, 58, 138, 0.25)', fontSize: 14 }}>
                        {RESUMO_EXECUTIVO_OFICIAL.serv_ord.total}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#f8fafc' }}>
                        SEG (Serv. Extraordinário Gratificado)
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#facc15' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.seg.capital}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#94a3b8' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.seg.interior}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900, color: '#facc15', background: 'rgba(30, 58, 138, 0.25)', fontSize: 14 }}>
                        {RESUMO_EXECUTIVO_OFICIAL.seg.total}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#f8fafc' }}>
                        BRIGADISTA (Municipal + SEMA)
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#94a3b8' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.brigadistas.capital}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#fb923c' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.brigadistas.interior}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 900, color: '#fb923c', background: 'rgba(30, 58, 138, 0.25)', fontSize: 14 }}>
                        {RESUMO_EXECUTIVO_OFICIAL.brigadistas.total}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#0f172a', borderTop: '2px solid #38bdf8' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 900, color: '#f8fafc', fontSize: 14 }}>
                        TOTAL GERAL
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 900, color: '#f8fafc', fontSize: 15 }}>
                        {RESUMO_EXECUTIVO_OFICIAL.total_geral.capital}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 900, color: '#f8fafc', fontSize: 15 }}>
                        {RESUMO_EXECUTIVO_OFICIAL.total_geral.interior}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 900, color: '#38bdf8', fontSize: 17, background: 'rgba(56, 189, 248, 0.2)' }}>
                        {RESUMO_EXECUTIVO_OFICIAL.total_geral.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Informações Complementares Oficiais */}
              <div style={{ marginTop: 20, textAlign: 'center', color: '#64748b', fontSize: 11 }}>
                Documento emitido conforme Diretriz Operacional CBMAM / SEDEC • Dados válidos para a Operação Amazonas 2026
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
