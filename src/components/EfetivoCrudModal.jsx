import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Minus, Check } from 'lucide-react';
import { efetivoDB, DEFAULT_CATEGORIES } from '../services/efetivoDatabase';
import { EfetivoIcon, AVAILABLE_ICONS } from './EfetivoIcons';

export function EfetivoCrudModal({
  isOpen,
  onClose,
  editingItem,
  itemType = 'municipio',
  onSaveSuccess,
}) {
  // Hooks devem vir ANTES de qualquer early return
  const isEditing = Boolean(editingItem && editingItem?.id);
  const [activeTab, setActiveTab] = useState('efetivo');
  const [name, setName] = useState('');
  const [tipo, setTipo] = useState(
    itemType === 'base' ? 'base_temporaria' : 'interior'
  );
  const [muniRef, setMuniRef] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('cbmam_shield');
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState({});
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (!isOpen) return;

    const state = efetivoDB.getState();
    setCategories(state.categories);

    if (editingItem) {
      setName(editingItem.muni || editingItem.base || '');
      setTipo(
        editingItem.tipo ||
          (itemType === 'base' ? 'base_temporaria' : 'interior')
      );
      setMuniRef(editingItem.muni_ref || '');
      setSelectedIcon(
        editingItem.icon || (itemType === 'base' ? 'base_camp' : 'cbmam_shield')
      );
      setNotes(editingItem.notes || '');

      const initialQt = {};
      state.categories.forEach((cat) => {
        initialQt[cat.key] = Number(editingItem[cat.key]) || 0;
      });
      setQuantities(initialQt);
    } else {
      setName('');
      setTipo(itemType === 'base' ? 'base_temporaria' : 'interior');
      setMuniRef('');
      setSelectedIcon(itemType === 'base' ? 'base_camp' : 'cbmam_shield');
      setNotes('');

      const initialQt = {};
      state.categories.forEach((cat) => {
        initialQt[cat.key] = 0;
      });
      setQuantities(initialQt);
    }
  }, [editingItem, itemType, isOpen]);

  if (!isOpen) return null;

  const handleQtyChange = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (Number(prev[key]) || 0) + delta),
    }));
  };

  const handleQtyDirectInput = (key, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setQuantities((prev) => ({
      ...prev,
      [key]: num,
    }));
  };

  const totalItemCount = Object.values(quantities).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor, informe o nome do município ou base temporária.');
      return;
    }

    const payload = {
      ...quantities,
      icon: selectedIcon,
      notes: notes.trim(),
    };

    if (itemType === 'base') {
      payload.base = name.trim();
      payload.muni_ref = muniRef.trim() || name.trim();
      if (isEditing) {
        efetivoDB.updateBase(editingItem.id, payload);
      } else {
        efetivoDB.addBase(payload);
      }
    } else {
      payload.muni = name.trim();
      payload.tipo = tipo;
      if (isEditing) {
        efetivoDB.updateMunicipio(editingItem.id, payload);
      } else {
        efetivoDB.addMunicipio(payload);
      }
    }

    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  const handleDelete = () => {
    if (!isEditing) return;
    if (
      confirm(
        `Tem certeza que deseja excluir ${name} do banco de dados operacional?`
      )
    ) {
      if (itemType === 'base') {
        efetivoDB.deleteBase(editingItem.id);
      } else {
        efetivoDB.deleteMunicipio(editingItem.id);
      }
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 840, width: '92vw', maxHeight: '90vh' }}
      >
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #182e4c 0%, #122237 100%)',
            borderBottom: '2px solid #0284c7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(14, 25, 42, 0.85)',
                border: '1.5px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
              }}
            >
              <EfetivoIcon name={selectedIcon} size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: '#f8fafc',
                    margin: 0,
                  }}
                >
                  {isEditing
                    ? `Editar Registro: ${name}`
                    : itemType === 'base'
                      ? 'Cadastrar Nova Base Temporária'
                      : 'Cadastrar Novo Município'}
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background:
                      itemType === 'base'
                        ? 'rgba(56, 189, 248, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    color: itemType === 'base' ? '#38bdf8' : '#f87171',
                    border: `1px solid ${itemType === 'base' ? '#0284c7' : '#ef4444'}`,
                  }}
                >
                  {itemType === 'base'
                    ? 'BASE TEMPORÁRIA'
                    : tipo === 'capital'
                      ? 'CAPITAL'
                      : 'INTERIOR'}
                </span>
              </div>
              <p
                style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0 0' }}
              >
                Total Atual:{' '}
                <strong style={{ color: '#38bdf8', fontSize: 13 }}>
                  {totalItemCount} Operacionais
                </strong>{' '}
                alocados
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={onClose}
            style={{
              background: '#1b2f4c',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 6,
              color: '#f8fafc',
              cursor: 'pointer',
              padding: 6,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            background: '#0f1c2e',
            borderBottom: '1px solid #243956',
            padding: '0 16px',
          }}
        >
          <button
            onClick={() => setActiveTab('efetivo')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom:
                activeTab === 'efetivo'
                  ? '2.5px solid #38bdf8'
                  : '2.5px solid transparent',
              color: activeTab === 'efetivo' ? '#ffffff' : '#94a3b8',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Quantidades por Força / Missão ({totalItemCount} Op.)
          </button>

          <button
            onClick={() => setActiveTab('icone')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom:
                activeTab === 'icone'
                  ? '2.5px solid #38bdf8'
                  : '2.5px solid transparent',
              color: activeTab === 'icone' ? '#ffffff' : '#94a3b8',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Escolher Ícone / Insígnia
          </button>

          <button
            onClick={() => setActiveTab('detalhes')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom:
                activeTab === 'detalhes'
                  ? '2.5px solid #38bdf8'
                  : '2.5px solid transparent',
              color: activeTab === 'detalhes' ? '#ffffff' : '#94a3b8',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Identificação & Notas
          </button>
        </div>

        <div
          className="modal-body"
          style={{
            background: '#101c2e',
            padding: 18,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {activeTab === 'efetivo' && (
            <div>
              <div
                style={{
                  background: '#15243b',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      fontWeight: 800,
                    }}
                  >
                    Localidade
                  </span>
                  <div
                    style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc' }}
                  >
                    {name || 'Novo Registro'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      fontWeight: 800,
                    }}
                  >
                    Total Mobilizado
                  </span>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                    }}
                  >
                    {totalItemCount} <span style={{ fontSize: 12 }}>Op.</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 10,
                }}
              >
                {categories.map((cat) => {
                  const val = Number(quantities[cat.key]) || 0;
                  return (
                    <div
                      key={cat.key}
                      style={{
                        background:
                          val > 0 ? 'rgba(30, 48, 77, 0.7)' : '#162842',
                        border:
                          val > 0
                            ? `1.5px solid ${cat.color}`
                            : '1px solid rgba(56, 189, 248, 0.18)',
                        borderRadius: 8,
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        transition: 'all 0.2s ease',
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
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <EfetivoIcon name={cat.icon} size={20} />
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 800,
                                color: '#f8fafc',
                              }}
                            >
                              {cat.short}
                            </div>
                            <div style={{ fontSize: 9, color: '#94a3b8' }}>
                              {cat.label}
                            </div>
                          </div>
                        </div>
                        {val > 0 && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 900,
                              color: cat.color,
                              background: 'rgba(0,0,0,0.3)',
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            ATIVO
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 'auto',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.key, -5)}
                          style={{
                            background: '#1b2f4c',
                            border: '1px solid #243956',
                            borderRadius: 4,
                            color: '#94a3b8',
                            fontSize: 10,
                            fontWeight: 900,
                            padding: '4px 6px',
                            cursor: 'pointer',
                          }}
                          title="Diminuir 5"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.key, -1)}
                          style={{
                            background: '#1b2f4c',
                            border: '1px solid #243956',
                            borderRadius: 4,
                            color: '#ffffff',
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Diminuir 1"
                        >
                          <Minus size={12} />
                        </button>

                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={val}
                          onChange={(e) =>
                            handleQtyDirectInput(cat.key, e.target.value)
                          }
                          style={{
                            flex: 1,
                            background: '#111d2e',
                            border: '1.5px solid rgba(56, 189, 248, 0.4)',
                            borderRadius: 4,
                            color: '#ffffff',
                            fontSize: 14,
                            fontWeight: 900,
                            textAlign: 'center',
                            padding: '4px 0',
                            fontFamily: 'monospace',
                            outline: 'none',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.key, 1)}
                          style={{
                            background: '#1b2f4c',
                            border: '1px solid #243956',
                            borderRadius: 4,
                            color: '#ffffff',
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Aumentar 1"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.key, 5)}
                          style={{
                            background: '#1b2f4c',
                            border: '1px solid #243956',
                            borderRadius: 4,
                            color: '#38bdf8',
                            fontSize: 10,
                            fontWeight: 900,
                            padding: '4px 6px',
                            cursor: 'pointer',
                          }}
                          title="Aumentar 5"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'icone' && (
            <div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                Selecione o brasão ou ícone tático que melhor representa esta
                unidade no mapa e nas listagens:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: 10,
                }}
              >
                {AVAILABLE_ICONS.map((ico) => {
                  const isSelected = selectedIcon === ico.id;
                  return (
                    <div
                      key={ico.id}
                      onClick={() => setSelectedIcon(ico.id)}
                      style={{
                        background: isSelected
                          ? 'rgba(2, 132, 199, 0.25)'
                          : '#162842',
                        border: isSelected
                          ? '2px solid #38bdf8'
                          : '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: 8,
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 0 14px rgba(56, 189, 248, 0.4)'
                          : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <EfetivoIcon name={ico.id} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: isSelected ? '#ffffff' : '#e2e8f0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ico.label}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: '#94a3b8',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ico.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} color="#0c1626" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'detalhes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Nome da Localidade (Município ou Base):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Manaus, Borba, Autazes Posto Km 53..."
                  style={{
                    width: '100%',
                    background: '#15243b',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 800,
                    outline: 'none',
                  }}
                />
              </div>

              {itemType === 'base' ? (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Município de Referência / Vínculo:
                  </label>
                  <input
                    type="text"
                    value={muniRef}
                    onChange={(e) => setMuniRef(e.target.value)}
                    placeholder="Ex: Autazes, Borba, Careiro..."
                    style={{
                      width: '100%',
                      background: '#15243b',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: '#64748b',
                      marginTop: 3,
                      display: 'block',
                    }}
                  >
                    Esta base temporária será vinculada a este município no mapa
                    operacional.
                  </span>
                </div>
              ) : (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Classificação Operacional:
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setTipo('interior')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background:
                          tipo === 'interior'
                            ? 'rgba(2, 132, 199, 0.3)'
                            : '#15243b',
                        border:
                          tipo === 'interior'
                            ? '1.5px solid #38bdf8'
                            : '1px solid #243956',
                        borderRadius: 6,
                        color: tipo === 'interior' ? '#ffffff' : '#94a3b8',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Interior do Amazonas
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo('capital')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background:
                          tipo === 'capital'
                            ? 'rgba(239, 68, 68, 0.3)'
                            : '#15243b',
                        border:
                          tipo === 'capital'
                            ? '1.5px solid #ef4444'
                            : '1px solid #243956',
                        borderRadius: 6,
                        color: tipo === 'capital' ? '#ffffff' : '#94a3b8',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Capital (Manaus / Comando)
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Observações Operacionais / Notas de Campo:
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais de rádio, contatos do comandante de pelotão, coordenadas ou acessos..."
                  style={{
                    width: '100%',
                    background: '#15243b',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: 12,
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="modal-footer"
          style={{
            background: '#15243b',
            borderTop: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 18px',
          }}
        >
          <div>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid #ef4444',
                  borderRadius: 6,
                  color: '#f87171',
                  padding: '7px 14px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Trash2 size={14} />
                Excluir Registro
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#1c2f4c',
                border: '1px solid #243956',
                borderRadius: 6,
                color: '#cbd5e1',
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1.5px solid #38bdf8',
                borderRadius: 6,
                color: '#ffffff',
                padding: '7px 20px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Save size={14} />
              {isEditing ? 'Salvar Alterações' : 'Criar Registro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
