import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { efetivoDB } from '../services/efetivoDatabase';
import { EfetivoIcon } from './EfetivoIcons';
import { EfetivoCrudModal } from './EfetivoCrudModal';

export function EfetivoGestaoPanel({ onSelectMuni, _onDeployMuniForces }) {
  const [dbState, setDbState] = useState(() => efetivoDB.getState());
  const [subTab, setSubTab] = useState('municipios'); // 'municipios' | 'bases' | 'resumo'
  const [searchTerm, setSearchTerm] = useState('');

  // Controle do modal de edição/criação
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemType, setItemType] = useState('municipio');
  const fileInputRef = React.useRef(null);

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const ok = efetivoDB.importJSON(text);
        if (ok) {
          setDbState(efetivoDB.getState());
          alert('Efetivo importado com sucesso do Relatório Diário CBMAM!');
        } else {
          alert(
            'Formato de arquivo inválido. Por favor envie o arquivo .json exportado pelo sistema.'
          );
        }
      } catch (err) {
        alert('Erro ao processar arquivo: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    // Inscrever nas alterações do banco de dados
    const unsubscribe = efetivoDB.subscribe((newState) => {
      setDbState(newState);
    });
    return () => unsubscribe();
  }, []);

  const { municipios, bases, categories, totals } = dbState;

  // Filtragem por busca
  const filteredMunicipios = municipios.filter(
    (m) =>
      m.muni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBases = bases.filter(
    (b) =>
      b.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.muni_ref &&
        b.muni_ref.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreateModal = (type) => {
    setItemType(type);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item, type) => {
    setItemType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = (item, type) => {
    const itemName = item.muni || item.base;
    if (
      confirm(`Deseja realmente excluir ${itemName} da planilha operacional?`)
    ) {
      if (type === 'base') {
        efetivoDB.deleteBase(item.id);
      } else {
        efetivoDB.deleteMunicipio(item.id);
      }
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Deseja restaurar os dados originais da planilha oficial (1.533 operacionais)? Todas as alterações locais serão substituídas pelos valores oficiais.'
      )
    ) {
      efetivoDB.resetToDefaults();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: 10,
      }}
    >
      {/* Sub-Tabs do Gerenciador */}
      <div
        style={{
          display: 'flex',
          background: '#0e1a2b',
          borderRadius: 8,
          padding: 3,
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}
      >
        <button
          onClick={() => setSubTab('municipios')}
          style={{
            flex: 1,
            padding: '6px 4px',
            background:
              subTab === 'municipios'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'transparent',
            border: 'none',
            borderRadius: 6,
            color: subTab === 'municipios' ? '#ffffff' : '#94a3b8',
            fontSize: 10.5,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Municípios ({municipios.length})
        </button>

        <button
          onClick={() => setSubTab('bases')}
          style={{
            flex: 1,
            padding: '6px 4px',
            background:
              subTab === 'bases'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'transparent',
            border: 'none',
            borderRadius: 6,
            color: subTab === 'bases' ? '#ffffff' : '#94a3b8',
            fontSize: 10.5,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Bases ({bases.length})
        </button>

        <button
          onClick={() => setSubTab('resumo')}
          style={{
            flex: 1,
            padding: '6px 4px',
            background:
              subTab === 'resumo'
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'transparent',
            border: 'none',
            borderRadius: 6,
            color: subTab === 'resumo' ? '#ffffff' : '#94a3b8',
            fontSize: 10.5,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Resumo ({totals.totalGeral})
        </button>
      </div>

      {/* Barra de Ações Rápidas & Busca */}
      {subTab !== 'resumo' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={13}
              color="#38bdf8"
              style={{ position: 'absolute', left: 8 }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                subTab === 'municipios'
                  ? 'Filtrar município...'
                  : 'Filtrar base...'
              }
              style={{
                width: '100%',
                background: '#15243b',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 6,
                padding: '5px 8px 5px 26px',
                color: '#ffffff',
                fontSize: 11,
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={() =>
              handleOpenCreateModal(
                subTab === 'municipios' ? 'municipio' : 'base'
              )
            }
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: '1px solid #38bdf8',
              borderRadius: 6,
              color: '#ffffff',
              padding: '5px 9px',
              fontSize: 10.5,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
            }}
            title={
              subTab === 'municipios'
                ? 'Cadastrar Novo Município'
                : 'Cadastrar Nova Base'
            }
          >
            <Plus size={13} />
            <span>Novo</span>
          </button>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 1: MUNICÍPIOS (26)
          ===================================================================== */}
      {subTab === 'municipios' && (
        <div
          className="tactical-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingRight: 6,
          }}
        >
          {filteredMunicipios.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: 11,
                padding: '20px 0',
              }}
            >
              Nenhum município localizado.
            </div>
          ) : (
            filteredMunicipios.map((m) => {
              const totalMuni = totals.byMunicipio[m.muni] || 0;

              // Missões ativas neste município
              const activeMissions = categories.filter(
                (c) => Number(m[c.key]) > 0
              );

              return (
                <div
                  key={m.id}
                  style={{
                    background: '#15243b',
                    border: '1px solid rgba(56, 189, 248, 0.22)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    transition: 'all 0.18s ease',
                  }}
                >
                  {/* Linha Principal: Ícone, Nome e Total */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      onClick={() => onSelectMuni && onSelectMuni(m.muni)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        flex: 1,
                      }}
                      title="Clique para localizar este município no mapa"
                    >
                      <EfetivoIcon name={m.icon} size={24} />
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>{m.muni}</span>
                          {m.tipo === 'capital' && (
                            <span
                              style={{
                                fontSize: 8.5,
                                fontWeight: 900,
                                background: '#b91c1c',
                                color: '#fef2f2',
                                padding: '1px 5px',
                                borderRadius: 4,
                              }}
                            >
                              CAPITAL
                            </span>
                          )}
                        </div>
                        {m.notes && (
                          <div
                            style={{
                              fontSize: 9,
                              color: '#94a3b8',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 140,
                            }}
                          >
                            {m.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Efetivo Badge */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span
                        onClick={() => onSelectMuni && onSelectMuni(m.muni)}
                        style={{
                          background: 'rgba(2, 132, 199, 0.25)',
                          border: '1px solid rgba(56, 189, 248, 0.5)',
                          borderRadius: 6,
                          color: '#38bdf8',
                          fontSize: 11,
                          fontWeight: 900,
                          padding: '2px 7px',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                        }}
                        title="Efetivo Total neste Município"
                      >
                        {totalMuni} Op.
                      </span>

                      {/* Botão Editar (CRUD) */}
                      <button
                        onClick={() => handleOpenEditModal(m, 'municipio')}
                        style={{
                          background: '#1e3454',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: 4,
                          color: '#f8fafc',
                          padding: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Modificar dados, números e ícone deste município"
                      >
                        <Edit3 size={13} color="#38bdf8" />
                      </button>

                      {/* Botão Excluir */}
                      <button
                        onClick={() => handleDeleteItem(m, 'municipio')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 4,
                          color: '#f87171',
                          padding: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Excluir este município da base"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Badges de Forças Presentes neste Município */}
                  {activeMissions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {activeMissions.map((c) => (
                        <span
                          key={c.key}
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            background: 'rgba(15, 23, 42, 0.85)',
                            border: `1px solid ${c.color}`,
                            color: '#ffffff',
                            padding: '1px 5px',
                            borderRadius: 4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          title={`${c.label}: ${m[c.key]} homens/mulheres`}
                        >
                          <span style={{ color: c.color }}>{c.short}:</span>
                          <strong style={{ color: '#ffffff' }}>
                            {m[c.key]}
                          </strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: BASES TEMPORÁRIAS (9)
          ===================================================================== */}
      {subTab === 'bases' && (
        <div
          className="tactical-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingRight: 6,
          }}
        >
          {filteredBases.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: 11,
                padding: '20px 0',
              }}
            >
              Nenhuma base temporária localizada.
            </div>
          ) : (
            filteredBases.map((b) => {
              const totalBase = totals.byBase[b.base] || 0;
              const activeMissions = categories.filter(
                (c) => Number(b[c.key]) > 0
              );

              return (
                <div
                  key={b.id}
                  style={{
                    background: '#15243b',
                    border: '1px solid rgba(56, 189, 248, 0.22)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      onClick={() =>
                        onSelectMuni && onSelectMuni(b.muni_ref || b.base)
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        flex: 1,
                      }}
                      title={`Vínculo: ${b.muni_ref}. Clique para ver no mapa.`}
                    >
                      <EfetivoIcon name={b.icon} size={24} />
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: '#f8fafc',
                          }}
                        >
                          {b.base}
                        </div>
                        <div style={{ fontSize: 9.5, color: '#38bdf8' }}>
                          Ref: {b.muni_ref || 'Amazonas'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: 6,
                          color: '#bae6fd',
                          fontSize: 11,
                          fontWeight: 900,
                          padding: '2px 7px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {totalBase} Op.
                      </span>

                      <button
                        onClick={() => handleOpenEditModal(b, 'base')}
                        style={{
                          background: '#1e3454',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: 4,
                          color: '#f8fafc',
                          padding: 4,
                          cursor: 'pointer',
                        }}
                        title="Modificar base temporária"
                      >
                        <Edit3 size={13} color="#38bdf8" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(b, 'base')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 4,
                          color: '#f87171',
                          padding: 4,
                          cursor: 'pointer',
                        }}
                        title="Excluir base temporária"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {activeMissions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {activeMissions.map((c) => (
                        <span
                          key={c.key}
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            background: 'rgba(15, 23, 42, 0.85)',
                            border: `1px solid ${c.color}`,
                            color: '#ffffff',
                            padding: '1px 5px',
                            borderRadius: 4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span style={{ color: c.color }}>{c.short}:</span>
                          <strong>{b[c.key]}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: RESUMO CONSOLIDADO (TABELA 3 DA PLANILHA OFICIAL)
          ===================================================================== */}
      {subTab === 'resumo' && (
        <div
          className="tactical-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingRight: 6,
          }}
        >
          {/* Cartão de Destaque do Total Geral */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(22, 36, 58, 0.9) 100%)',
              border: '1.5px solid #0284c7',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                }}
              >
                Total Geral da Operação
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'monospace',
                }}
              >
                {totals.totalGeral}{' '}
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}
                >
                  Operacionais
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', gap: 12 }}>
              <div>
                <div
                  style={{ fontSize: 9.5, color: '#f87171', fontWeight: 800 }}
                >
                  CAPITAL
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 900, color: '#fca5a5' }}
                >
                  {totals.capital}
                </div>
              </div>
              <div
                style={{ width: 1, background: 'rgba(56, 189, 248, 0.25)' }}
              />
              <div>
                <div
                  style={{ fontSize: 9.5, color: '#4ade80', fontWeight: 800 }}
                >
                  INTERIOR
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 900, color: '#86efac' }}
                >
                  {totals.interior}
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Missões Fiel à Planilha */}
          <div
            style={{
              background: '#15243b',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 11,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#0e1c2e',
                    borderBottom: '1.5px solid #243956',
                    color: '#38bdf8',
                    fontSize: 9.5,
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>
                    Missão / Força
                  </th>
                  <th style={{ padding: '6px 6px', textAlign: 'right' }}>
                    Cap.
                  </th>
                  <th style={{ padding: '6px 6px', textAlign: 'right' }}>
                    Int.
                  </th>
                  <th
                    style={{
                      padding: '6px 8px',
                      textAlign: 'right',
                      color: '#ffffff',
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const mStat = totals.byMission[cat.key] || {
                    capital: 0,
                    interior: 0,
                    total: 0,
                  };
                  return (
                    <tr
                      key={cat.key}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        background:
                          mStat.total > 0
                            ? 'transparent'
                            : 'rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <td
                        style={{
                          padding: '6px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <EfetivoIcon name={cat.icon} size={16} />
                        <span
                          style={{
                            fontWeight: 800,
                            color: mStat.total > 0 ? '#f8fafc' : '#64748b',
                          }}
                        >
                          {cat.short}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '6px 6px',
                          textAlign: 'right',
                          color: mStat.capital > 0 ? '#f87171' : '#64748b',
                          fontWeight: mStat.capital > 0 ? 800 : 400,
                        }}
                      >
                        {mStat.capital}
                      </td>
                      <td
                        style={{
                          padding: '6px 6px',
                          textAlign: 'right',
                          color: mStat.interior > 0 ? '#4ade80' : '#64748b',
                          fontWeight: mStat.interior > 0 ? 800 : 400,
                        }}
                      >
                        {mStat.interior}
                      </td>
                      <td
                        style={{
                          padding: '6px 8px',
                          textAlign: 'right',
                          fontWeight: 900,
                          color: mStat.total > 0 ? '#ffffff' : '#64748b',
                          fontFamily: 'monospace',
                        }}
                      >
                        {mStat.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    background: '#0e1c2e',
                    borderTop: '2px solid #0284c7',
                    color: '#ffffff',
                    fontWeight: 900,
                  }}
                >
                  <td style={{ padding: '7px 8px' }}>TOTAL</td>
                  <td
                    style={{
                      padding: '7px 6px',
                      textAlign: 'right',
                      color: '#fca5a5',
                    }}
                  >
                    {totals.capital}
                  </td>
                  <td
                    style={{
                      padding: '7px 6px',
                      textAlign: 'right',
                      color: '#86efac',
                    }}
                  >
                    {totals.interior}
                  </td>
                  <td
                    style={{
                      padding: '7px 8px',
                      textAlign: 'right',
                      color: '#38bdf8',
                      fontSize: 13,
                      fontFamily: 'monospace',
                    }}
                  >
                    {totals.totalGeral}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Botões Utilitários de Banco de Dados */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            style={{ display: 'none' }}
          />

          <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 'auto',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={async () => {
                const res = await efetivoDB.syncFromApi();
                if (res.success) {
                  setDbState(efetivoDB.getState());
                  alert(
                    'Efetivo sincronizado com sucesso diretamente da API pública do CBMAM!'
                  );
                } else {
                  alert(
                    'API do CBMAM offline ou inacessível no momento: ' +
                      res.error +
                      '\nVocê pode importar diretamente o arquivo .json pelo botão "Importar Relatório".'
                  );
                }
              }}
              style={{
                flex: 1,
                minWidth: '90px',
                padding: '6px 8px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: '1px solid #10b981',
                borderRadius: 6,
                color: '#ffffff',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
              title="Sincronizar automaticamente com a API do Relatório Diário (/api/public/efetivo)"
            >
              <RotateCcw size={13} />
              <span>Sincronizar API</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                minWidth: '90px',
                padding: '6px 8px',
                background: '#047857',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 6,
                color: '#ffffff',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
              title="Importar dados de efetivo exportados pelo Relatório Diário CBMAM (.json)"
            >
              <Upload size={13} />
              <span>Importar Relatório</span>
            </button>

            <button
              onClick={() => efetivoDB.exportJSON()}
              style={{
                flex: 1,
                minWidth: '90px',
                padding: '6px 8px',
                background: '#1b2f4c',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 6,
                color: '#cbd5e1',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
              title="Baixar cópia de segurança em formato JSON"
            >
              <Download size={13} />
              <span>Exportar</span>
            </button>

            <button
              onClick={handleResetDefaults}
              style={{
                flex: 1,
                minWidth: '90px',
                padding: '6px 8px',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                borderRadius: 6,
                color: '#facc15',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
              title="Restaurar valores de fábrica fiéis à planilha CBMAM"
            >
              <RotateCcw size={13} />
              <span>Restaurar</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de CRUD Completo */}
      {modalOpen && (
        <EfetivoCrudModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editingItem={editingItem}
          itemType={itemType}
          onSaveSuccess={() => setDbState(efetivoDB.getState())}
        />
      )}
    </div>
  );
}
