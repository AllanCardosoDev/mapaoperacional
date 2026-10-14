import React, { useState } from 'react';
import { Users, Shield, X, MapPin, Search, CheckCircle2, Award, ArrowUpRight, RefreshCw, Leaf, Flame, Compass } from 'lucide-react';
import { OPERACAO_EFETIVO_MUNICIPIOS, RESUMO_EXECUTIVO_OFICIAL, PREVFOGO_RECURSOS_DISPONIVEIS, FOCOS_COMBATE_ATIVOS } from '../data/operacaoAmazonasData';

export function EfetivoModal({ onClose, onSelectMuni, onSyncOfficialTokens }) {
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'municipios' | 'bases' | 'prevfogo'
  const [search, setSearch] = useState('');

  // Separar municípios e bases
  const municipiosList = OPERACAO_EFETIVO_MUNICIPIOS.filter(item => item.tipo === 'capital' || item.tipo === 'interior');
  const basesList = OPERACAO_EFETIVO_MUNICIPIOS.filter(item => item.tipo === 'base_temporaria');

  // Filtragem pela busca
  const filterList = (list) => {
    if (!search.trim()) return list;
    return list.filter(item => item.muni.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredMunis = filterList(municipiosList);
  const filteredBases = filterList(basesList);

  // Totais calculados dinamicamente
  const calcTotals = (list) => {
    return list.reduce((acc, curr) => {
      acc.serv_ord += (curr.serv_ord || 0);
      acc.seg += (curr.seg || 0);
      acc.brigadista += (curr.brigadista || 0);
      acc.brigadista_sema += (curr.brigadista_sema || 0);
      acc.total += (curr.serv_ord || 0) + (curr.seg || 0) + (curr.brigadista || 0) + (curr.brigadista_sema || 0);
      return acc;
    }, { serv_ord: 0, seg: 0, brigadista: 0, brigadista_sema: 0, total: 0 });
  };

  const totMunis = calcTotals(municipiosList);
  const totBases = calcTotals(basesList);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 1020, width: '95vw', maxHeight: '92vh' }}
      >
        {/* Topo do Modal */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderBottom: '1.5px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
            }}>
              <Users size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '0.5px' }}>
                SOMA TOTAL DE TUDO & DETALHAMENTO DE EFETIVO • CBMAM
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>
                Relatório Oficial Consolidado da OPERAÇÃO AMAZONAS • 623 Homens e Mulheres Empregados
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: '#cbd5e1', cursor: 'pointer', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* CARDS COM A SOMA TOTAL DE TUDO (DESTAQUE MÁXIMO) */}
        <div style={{ padding: '16px 20px', background: '#090d16', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
            {/* SOMA TOTAL DE TUDO */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(202, 138, 4, 0.08) 100%)',
              border: '1.5px solid #eab308',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(234, 179, 8, 0.2)'
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Soma Total
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.total_geral.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#facc15', fontWeight: 700 }}>
                Total Empregado
              </div>
            </div>

            {/* SV ORDINÁRIO */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>
                SV. Ordinário
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.serv_ord.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                117 Cap • 150 Int
              </div>
            </div>

            {/* SEG */}
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid #ca8a04',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fde047', textTransform: 'uppercase' }}>
                Militar SEG
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fde047', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.seg.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                Capital (Manaus)
              </div>
            </div>

            {/* BRIGADISTAS GERAIS */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid #f97316',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fdba74', textTransform: 'uppercase' }}>
                Brig. Gerais
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f97316', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.brigadistas_gerais.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                167 Mun • 30 Bases
              </div>
            </div>

            {/* PREVFOGO / IBAMA */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1.5px solid #22c55e',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>
                Prevfogo / IBAMA
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#4ade80', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.prevfogo.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#bbf7d0', fontWeight: 700 }}>
                7 Municípios Op.
              </div>
            </div>

            {/* BRIGADISTAS SEMA */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
                Brigadistas SEMA
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#34d399', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.brigadistas_sema.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                109 Mun • 44 Bases
              </div>
            </div>

            {/* TOTAL BRIGADISTAS */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid #0284c7',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase' }}>
                Total Brigadistas
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', margin: '4px 0' }}>
                {RESUMO_EXECUTIVO_OFICIAL.brigadistas.total}
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                197 Geral + 153 SEMA
              </div>
            </div>

            {/* CAPITAL VS INTERIOR */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '10px 10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
                Distribuição
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', margin: '6px 0 2px' }}>
                Cap: <span style={{ color: '#ef4444' }}>123</span> • Int: <span style={{ color: '#38bdf8' }}>500</span>
              </div>
              <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                Missão Estadual
              </div>
            </div>
          </div>
        </div>

        {/* Abas e Filtro de Pesquisa */}
        <div style={{ padding: '12px 20px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid #1e293b', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('todos')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'todos' ? '#b91c1c' : '#1e293b',
                borderColor: activeTab === 'todos' ? '#ef4444' : '#334155',
                color: '#ffffff'
              }}
            >
              Visão Geral ({OPERACAO_EFETIVO_MUNICIPIOS.length})
            </button>
            <button
              onClick={() => setActiveTab('municipios')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'municipios' ? '#b91c1c' : '#1e293b',
                borderColor: activeTab === 'municipios' ? '#ef4444' : '#334155',
                color: '#ffffff'
              }}
            >
              Municípios ({municipiosList.length})
            </button>
            <button
              onClick={() => setActiveTab('bases')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'bases' ? '#b91c1c' : '#1e293b',
                borderColor: activeTab === 'bases' ? '#ef4444' : '#334155',
                color: '#ffffff'
              }}
            >
              Bases Temporárias ({basesList.length})
            </button>
            <button
              onClick={() => setActiveTab('prevfogo')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: activeTab === 'prevfogo' ? '#15803d' : '#1e293b',
                borderColor: activeTab === 'prevfogo' ? '#22c55e' : '#334155',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Shield size={13} color="#4ade80" />
              <span>Prevfogo & Combates Ativos (134 • 14 Focos)</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar município ou base..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: 6,
                padding: '6px 10px 6px 30px',
                color: '#f8fafc',
                fontSize: 12
              }}
            />
          </div>
        </div>

        {/* Conteúdo das Tabelas Oficiais */}
        <div className="modal-body" style={{ padding: '16px 20px', background: '#090d16', maxHeight: '55vh' }}>
          
          {/* TABELA 1 & 2: MUNICÍPIOS */}
          {(activeTab === 'todos' || activeTab === 'municipios') && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  1. Efetivo por Município (Tabelas 1 e 2 do Relatório Oficial)
                </h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Subtotal: <strong style={{ color: '#ffffff' }}>{totMunis.total}</strong> (234 SV ORD, 6 SEG, 167 Brig., 109 Brig. SEMA)
                </span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '8px 12px' }}>MUNICÍPIO</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fca5a5' }}>SERV. ORDINÁRIO</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fde047' }}>SEG</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fdba74' }}>BRIGADISTA</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#6ee7b7' }}>BRIGADISTA SEMAS</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#ffffff' }}>TOTAL</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMunis.map((item, idx) => {
                      const rowTotal = (item.serv_ord || 0) + (item.seg || 0) + (item.brigadista || 0) + (item.brigadista_sema || 0);
                      return (
                        <tr 
                          key={item.muni} 
                          style={{ 
                            background: idx % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : '#090d16',
                            borderBottom: '1px solid #1e293b'
                          }}
                        >
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#ffffff' }}>
                            {item.muni} {item.tipo === 'capital' && <span style={{ fontSize: 10, color: '#eab308' }}>(Capital)</span>}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.serv_ord > 0 ? '#ef4444' : '#64748b', fontWeight: item.serv_ord > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.serv_ord || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.seg > 0 ? '#eab308' : '#64748b', fontWeight: item.seg > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.seg || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.brigadista > 0 ? '#f97316' : '#64748b', fontWeight: item.brigadista > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.brigadista || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.brigadista_sema > 0 ? '#10b981' : '#64748b', fontWeight: item.brigadista_sema > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.brigadista_sema || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                            {rowTotal}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                if (onSelectMuni) onSelectMuni(item.muni);
                                onClose();
                              }}
                              style={{
                                background: 'transparent',
                                border: '1px solid #0284c7',
                                color: '#38bdf8',
                                borderRadius: 4,
                                padding: '2px 8px',
                                fontSize: 11,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Visualizar no mapa"
                            >
                              <MapPin size={11} />
                              Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Linha de Subtotal dos Municípios */}
                    <tr style={{ background: '#1e293b', fontWeight: 900, borderTop: '2px solid #334155' }}>
                      <td style={{ padding: '10px 12px', color: '#ffffff' }}>SUBTOTAL MUNICÍPIOS (26 Cidades)</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#ef4444', fontFamily: 'monospace', fontSize: 13 }}>{totMunis.serv_ord}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#eab308', fontFamily: 'monospace', fontSize: 13 }}>{totMunis.seg}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#f97316', fontFamily: 'monospace', fontSize: 13 }}>{totMunis.brigadista}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#10b981', fontFamily: 'monospace', fontSize: 13 }}>{totMunis.brigadista_sema}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#ffffff', fontFamily: 'monospace', fontSize: 14 }}>{totMunis.total}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABELA 3: BASES TEMPORÁRIAS */}
          {(activeTab === 'todos' || activeTab === 'bases') && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  2. Efetivo em Bases Temporárias (Tabela 3 do Relatório Oficial)
                </h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Subtotal: <strong style={{ color: '#ffffff' }}>{totBases.total}</strong> (33 SV ORD + 25 SP, 0 SEG, 30 Brig., 44 Brig. SEMA)
                </span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '8px 12px' }}>BASE TEMPORÁRIA</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fca5a5' }}>SERV. ORDINÁRIO</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fde047' }}>SEG</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#fdba74' }}>BRIGADISTA</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#6ee7b7' }}>BRIGADISTA SEMAS</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', color: '#ffffff' }}>TOTAL</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBases.map((item, idx) => {
                      const rowTotal = (item.serv_ord || 0) + (item.seg || 0) + (item.brigadista || 0) + (item.brigadista_sema || 0);
                      return (
                        <tr 
                          key={item.muni} 
                          style={{ 
                            background: idx % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : '#090d16',
                            borderBottom: '1px solid #1e293b'
                          }}
                        >
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#ffffff' }}>
                            {item.muni}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.serv_ord > 0 ? '#ef4444' : '#64748b', fontWeight: item.serv_ord > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.serv_ord || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.seg > 0 ? '#eab308' : '#64748b', fontWeight: item.seg > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.seg || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.brigadista > 0 ? '#f97316' : '#64748b', fontWeight: item.brigadista > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.brigadista || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', color: item.brigadista_sema > 0 ? '#10b981' : '#64748b', fontWeight: item.brigadista_sema > 0 ? 800 : 400, fontFamily: 'monospace' }}>
                            {item.brigadista_sema || '-'}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                            {rowTotal}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                const targetName = item.muni_ref || item.muni;
                                if (onSelectMuni) onSelectMuni(targetName);
                                onClose();
                              }}
                              style={{
                                background: 'transparent',
                                border: '1px solid #0284c7',
                                color: '#38bdf8',
                                borderRadius: 4,
                                padding: '2px 8px',
                                fontSize: 11,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Visualizar no mapa"
                            >
                              <MapPin size={11} />
                              Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Linha de Subtotal das Bases */}
                    <tr style={{ background: '#1e293b', fontWeight: 900, borderTop: '2px solid #334155' }}>
                      <td style={{ padding: '10px 12px', color: '#ffffff' }}>TOTAL BASES TEMPORÁRIAS (10 Bases)</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#ef4444', fontFamily: 'monospace', fontSize: 13 }}>33 (+25 SP)</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#eab308', fontFamily: 'monospace', fontSize: 13 }}>0</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#f97316', fontFamily: 'monospace', fontSize: 13 }}>30</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#10b981', fontFamily: 'monospace', fontSize: 13 }}>44</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#ffffff', fontFamily: 'monospace', fontSize: 14 }}>107</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEÇÃO PREVFOGO / IBAMA & COMBATES ATIVOS (TAB OU VISÃO GERAL) */}
          {(activeTab === 'todos' || activeTab === 'prevfogo') && (
            <div style={{ marginBottom: 24, borderTop: activeTab === 'todos' ? '1px solid #1e293b' : 'none', paddingTop: activeTab === 'todos' ? 20 : 0 }}>
              
              {/* 1. PREVFOGO RECURSOS DISPONÍVEIS (134 BRIGADISTAS) */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Shield size={18} color="#4ade80" />
                    <h3 style={{ fontSize: 13, fontWeight: 900, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                      OPERAÇÃO AMAZONAS • Efetivo Disponível Prevfogo / IBAMA
                    </h3>
                  </div>
                  <span style={{ 
                    background: '#15803d', 
                    color: '#ffffff', 
                    fontWeight: 900, 
                    fontSize: 12, 
                    padding: '3px 10px', 
                    borderRadius: 12 
                  }}>
                    Total: 134 Brigadistas
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                  {PREVFOGO_RECURSOS_DISPONIVEIS.map((rec, rIdx) => (
                    <div 
                      key={rIdx}
                      style={{ 
                        background: 'rgba(21, 128, 61, 0.08)', 
                        border: '1px solid rgba(74, 222, 128, 0.3)', 
                        borderRadius: 8, 
                        padding: '10px 12px' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, borderBottom: '1px solid rgba(74, 222, 128, 0.2)', paddingBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={13} color="#4ade80" />
                          <strong style={{ fontSize: 12.5, color: '#ffffff' }}>{rec.muni}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#4ade80', fontFamily: 'monospace' }}>
                            {String(rec.total).padStart(2, '0')} brig.
                          </span>
                          <button
                            onClick={() => {
                              if (onSelectMuni) onSelectMuni(rec.muni);
                              onClose();
                            }}
                            style={{
                              background: '#15803d',
                              border: 'none',
                              color: '#ffffff',
                              borderRadius: 4,
                              padding: '2px 6px',
                              fontSize: 10,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                            title="Ver no mapa"
                          >
                            Ver
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {rec.bases.map((b, bIdx) => (
                          <div 
                            key={bIdx}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              fontSize: 11, 
                              color: '#cbd5e1',
                              background: 'rgba(15, 23, 42, 0.6)',
                              padding: '4px 6px',
                              borderRadius: 4
                            }}
                          >
                            <span>{b.local}</span>
                            <strong style={{ color: '#86efac', fontFamily: 'monospace' }}>{String(b.efetivo).padStart(2, '0')} brig.</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. COMBATES ATIVOS GEORREFERENCIADOS (14 FOCOS) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flame size={18} color="#ef4444" />
                    <h3 style={{ fontSize: 13, fontWeight: 900, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                      OPERAÇÃO AMAZONAS • Combates Ativos Georreferenciados (14 Focos)
                    </h3>
                  </div>
                  <span style={{ 
                    background: '#b91c1c', 
                    color: '#ffffff', 
                    fontWeight: 900, 
                    fontSize: 12, 
                    padding: '3px 10px', 
                    borderRadius: 12 
                  }}>
                    14 Focos • 100 Brig. em Combate
                  </span>
                </div>

                <div style={{ overflowX: 'auto', border: '1.5px solid #ef4444', borderRadius: 8 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#450a0a', color: '#fca5a5', borderBottom: '1.5px solid #ef4444' }}>
                        <th style={{ padding: '8px 10px' }}>FOCO</th>
                        <th style={{ padding: '8px 10px' }}>MUNICÍPIO / LOCAL</th>
                        <th style={{ padding: '8px 10px' }}>TERRA INDÍGENA / ASSENTAMENTO</th>
                        <th style={{ padding: '8px 10px' }}>COORDENADAS (DMS)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>EFETIVO</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>STATUS DO FOCO</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FOCOS_COMBATE_ATIVOS.map((foco, fIdx) => {
                        const isAtivo = foco.status === 'ativo';
                        const isControlado = foco.status === 'controlado';
                        const isExtinto = foco.status === 'extinto';

                        let statusBadgeBg = '#991b1b';
                        let statusBadgeColor = '#fef2f2';
                        let statusText = 'Em combate / Ativo';

                        if (isControlado) {
                          statusBadgeBg = '#b45309';
                          statusBadgeColor = '#fef3c7';
                          statusText = 'Controlado';
                        } else if (isExtinto) {
                          statusBadgeBg = '#065f46';
                          statusBadgeColor = '#d1fae5';
                          statusText = 'Extinto';
                        }

                        return (
                          <tr 
                            key={foco.id}
                            style={{ 
                              background: fIdx % 2 === 0 ? 'rgba(15, 23, 42, 0.6)' : '#090d16',
                              borderBottom: '1px solid #1e293b'
                            }}
                          >
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 800, color: '#facc15' }}>
                              #{String(fIdx + 1).padStart(2, '0')}
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <strong style={{ color: '#ffffff' }}>{foco.muni}</strong>
                              <div style={{ color: '#94a3b8', fontSize: 10.5 }}>{foco.local}</div>
                            </td>
                            <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>
                              {foco.detalhe}
                            </td>
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#38bdf8', fontSize: 11 }}>
                              {foco.lat_dms} <br /> {foco.lon_dms}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 900, color: '#facc15', fontSize: 12 }}>
                              {String(foco.efetivo).padStart(2, '0')} brig.
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <span style={{
                                background: statusBadgeBg,
                                color: statusBadgeColor,
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                display: 'inline-block'
                              }}>
                                {statusText}
                              </span>
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  if (onSelectMuni) onSelectMuni(foco.muni);
                                  onClose();
                                }}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #ef4444',
                                  color: '#fca5a5',
                                  borderRadius: 4,
                                  padding: '2px 8px',
                                  fontSize: 10.5,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                                title="Ver município no mapa"
                              >
                                <MapPin size={11} />
                                Ver
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABELA 4: RESUMO EXECUTIVO MISSÃO */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              3. Resumo Efetivo (Tabela Oficial de Consolidação)
            </h3>
            <div style={{ overflowX: 'auto', border: '1.5px solid #059669', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#064e3b', color: '#a7f3d0', borderBottom: '1px solid #059669' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>MISSÃO</th>
                    <th style={{ padding: '10px 14px' }}>CAPITAL (MANAUS)</th>
                    <th style={{ padding: '10px 14px' }}>INTERIOR (61 MUNICÍPIOS)</th>
                    <th style={{ padding: '10px 14px', color: '#ffffff', fontWeight: 900 }}>TOTAL GERAL</th>
                  </tr>
                </thead>
                <tbody style={{ background: '#090d16' }}>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#ffffff' }}>SV ORD (Serviço Ordinário CBMAM)</td>
                    <td style={{ padding: '10px 14px', color: '#ef4444', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>117</td>
                    <td style={{ padding: '10px 14px', color: '#ef4444', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>150</td>
                    <td style={{ padding: '10px 14px', color: '#f87171', fontFamily: 'monospace', fontWeight: 900, fontSize: 14 }}>267</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#ffffff' }}>SEG (Serviço Extraordinário Gratificado)</td>
                    <td style={{ padding: '10px 14px', color: '#fde047', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>6</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace', fontSize: 13 }}>0</td>
                    <td style={{ padding: '10px 14px', color: '#facc15', fontFamily: 'monospace', fontWeight: 900, fontSize: 14 }}>6</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#ffffff' }}>BRIGADISTA (Gerais + SEMA Amazonas)</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: 'monospace', fontSize: 13 }}>0</td>
                    <td style={{ padding: '10px 14px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>350</td>
                    <td style={{ padding: '10px 14px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 900, fontSize: 14 }}>350</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.15)', borderTop: '2px solid #10b981' }}>
                    <td style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 900, color: '#34d399', fontSize: 13 }}>TOTAL DE OPERACIONAIS</td>
                    <td style={{ padding: '12px 14px', color: '#ffffff', fontFamily: 'monospace', fontWeight: 900, fontSize: 15 }}>123</td>
                    <td style={{ padding: '12px 14px', color: '#ffffff', fontFamily: 'monospace', fontWeight: 900, fontSize: 15 }}>500</td>
                    <td style={{ padding: '12px 14px', color: '#facc15', fontFamily: 'monospace', fontWeight: 900, fontSize: 18 }}>623</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rodapé com Ação de Sincronizar Fichas no Mapa */}
        <div className="modal-footer" style={{ background: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                padding: '6px 14px',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Carregar todos os 623 operacionais e 10 aeronaves diretamente no mapa"
            >
              <RefreshCw size={14} />
              <span>Sincronizar Efetivo Oficial no Mapa</span>
            </button>
          )}

          <button 
            className="btn-tactical btn-primary" 
            onClick={onClose}
            style={{ padding: '6px 16px' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
