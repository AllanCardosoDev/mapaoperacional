import React, { useState } from 'react';
import { 
  Plane, 
  Truck, 
  Anchor, 
  Users, 
  Shield, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Flame, 
  HelpCircle,
  MapPin, 
  Leaf
} from 'lucide-react';
import { TACTICAL_TOKENS } from '../data/tacticalAssets';
import { TokenSvg } from './TokenSvg';

export function TacticalSidebar({ 
  onDragStartToken, 
  selectedMuni, 
  onAddTokenToMuni,
  deployedMunis = [],
  onSelectMuni,
  isOpen = true,
  onToggleSidebar,
  onOpenEfetivo,
  onOpenAeronaves
}) {
  const [activeTab, setActiveTab] = useState('efetivo'); // Abre direto em efetivo por padrão ou aeronaves
  const [personnelCategory, setPersonnelCategory] = useState('efetivo_militar'); // 'efetivo_militar' | 'efetivo_seg' | 'efetivo_brigadista' | 'efetivo_brigadista_sema' | 'efetivo_prevfogo'
  const [personnelCount, setPersonnelCount] = useState(10);

  // Se a barra estiver recolhida para o mapa ser visto na totalidade
  if (!isOpen) {
    return (
      <button 
        className="floating-sidebar-toggle"
        onClick={onToggleSidebar}
        title="Expandir Hangar de Recursos e Contingente"
      >
        <ChevronRight size={18} color="#38bdf8" />
        <span>Hangar / Efetivo</span>
      </button>
    );
  }

  const getFilteredTokens = () => {
    switch (activeTab) {
      case 'aeronaves':
        return TACTICAL_TOKENS.filter(t => t.category === 'aeronave');
      case 'viaturas':
        return TACTICAL_TOKENS.filter(t => t.category === 'viatura');
      case 'fluvial':
        return TACTICAL_TOKENS.filter(t => t.category === 'fluvial');
      case 'brasoes':
        return TACTICAL_TOKENS.filter(t => t.category === 'brasao');
      default:
        return [];
    }
  };

  const getPersonnelLabel = () => {
    if (personnelCategory === 'efetivo_militar') return `${personnelCount} Militares (Serv. Ord.)`;
    if (personnelCategory === 'efetivo_seg') return `${personnelCount} Militares (SEG)`;
    if (personnelCategory === 'efetivo_brigadista') return `${personnelCount} Brigadistas`;
    if (personnelCategory === 'efetivo_brigadista_sema') return `${personnelCount} Brigadistas SEMA`;
    if (personnelCategory === 'efetivo_prevfogo') return `${personnelCount} Prevfogo IBAMA`;
    return `${personnelCount} Operacionais`;
  };

  return (
    <aside className="tactical-sidebar">
      {/* Botão de aba na borda lateral para recolher com 1 clique */}
      <button 
        className="sidebar-edge-tab"
        onClick={onToggleSidebar}
        title="Recolher barra lateral para ver o mapa na totalidade"
      >
        <ChevronLeft size={16} color="#38bdf8" />
      </button>

      {/* Topo da barra lateral com botão de fechar/recolher */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Shield size={16} color="#38bdf8" />
          Hangar & Prontidão
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            className="sidebar-close-btn"
            onClick={onToggleSidebar}
            title="Fechar lateral para ver o mapa na totalidade"
            style={{
              background: '#090d16',
              border: '1px solid #0284c7',
              borderRadius: 6,
              padding: '4px 10px',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={14} color="#38bdf8" />
            <span>Fechar Lateral</span>
          </button>
        </div>
      </div>

      {/* Abas de Categorias */}
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab-btn ${activeTab === 'efetivo' ? 'active' : ''}`}
          onClick={() => setActiveTab('efetivo')}
          title="Efetivo: Bombeiros Militares, Brigadistas e Prevfogo IBAMA"
        >
          <Users size={13} style={{ display: 'inline', marginRight: 4 }} />
          Efetivo
        </button>
        <button 
          className={`sidebar-tab-btn ${activeTab === 'aeronaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('aeronaves')}
          title="Aeronaves de Asas Fixas e Rotativas"
        >
          <Plane size={13} style={{ display: 'inline', marginRight: 4 }} />
          Aéreas
        </button>
        <button 
          className={`sidebar-tab-btn ${activeTab === 'viaturas' ? 'active' : ''}`}
          onClick={() => setActiveTab('viaturas')}
          title="Viaturas Terrestres Operacionais"
        >
          <Truck size={13} style={{ display: 'inline', marginRight: 4 }} />
          Viaturas
        </button>
        <button 
          className={`sidebar-tab-btn ${activeTab === 'fluvial' ? 'active' : ''}`}
          onClick={() => setActiveTab('fluvial')}
          title="Embarcações Fluviais"
        >
          <Anchor size={13} style={{ display: 'inline', marginRight: 4 }} />
          Fluvial
        </button>
        <button 
          className={`sidebar-tab-btn ${activeTab === 'brasoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('brasoes')}
          title="Brasões e Unidades Regionais"
        >
          <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
          Brasões
        </button>
      </div>

      <div className="sidebar-content">
        {/* =================================================================
            SEÇÃO ESPECIAL DE EFETIVO: MILITARES (ORD/SEG), BRIGADISTAS (GERAL/SEMA) E PREVFOGO
            ================================================================= */}
        {activeTab === 'efetivo' && (
          <div className="personnel-config-box">
            {onOpenEfetivo && (
              <button
                className="btn-tactical"
                onClick={onOpenEfetivo}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                  border: '1.5px solid #ef4444',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 12,
                  justifyContent: 'center',
                  marginBottom: 12,
                  padding: '8px 10px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                }}
                title="Clique para ver a soma total de tudo e as informações referentes ao efetivo"
              >
                <Users size={15} color="#ffffff" />
                <span>Soma Total do Efetivo (623)</span>
              </button>
            )}

            <span className="resource-section-title">
              Tipo de Força / Contingente
            </span>

            {/* Seletor entre Militares (Ord / SEG), Brigadistas (Geral / SEMA) e Prevfogo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
              {/* 1. Bombeiros Militares - Serv. Ordinário */}
              <button
                className={`btn-tactical ${personnelCategory === 'efetivo_militar' ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  border: personnelCategory === 'efetivo_militar' ? '1.5px solid #ef4444' : '1px solid #334155',
                  background: personnelCategory === 'efetivo_militar' ? 'rgba(220, 38, 38, 0.25)' : '#0f172a'
                }}
                onClick={() => setPersonnelCategory('efetivo_militar')}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontWeight: 800 }}>Militar (Serv. Ordinário)</span>
              </button>

              {/* 2. Militares - SEG */}
              <button
                className={`btn-tactical ${personnelCategory === 'efetivo_seg' ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  border: personnelCategory === 'efetivo_seg' ? '1.5px solid #eab308' : '1px solid #334155',
                  background: personnelCategory === 'efetivo_seg' ? 'rgba(234, 179, 8, 0.25)' : '#0f172a',
                  color: personnelCategory === 'efetivo_seg' ? '#fde047' : 'inherit'
                }}
                onClick={() => setPersonnelCategory('efetivo_seg')}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
                <span style={{ fontWeight: 800 }}>Militar (SEG Gratificado)</span>
              </button>

              {/* 3. Brigadistas (Municipal / Geral) */}
              <button
                className={`btn-tactical ${personnelCategory === 'efetivo_brigadista' ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  border: personnelCategory === 'efetivo_brigadista' ? '1.5px solid #f97316' : '1px solid #334155',
                  background: personnelCategory === 'efetivo_brigadista' ? 'rgba(234, 88, 12, 0.25)' : '#0f172a',
                  color: personnelCategory === 'efetivo_brigadista' ? '#fdba74' : 'inherit'
                }}
                onClick={() => setPersonnelCategory('efetivo_brigadista')}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
                <span style={{ fontWeight: 800 }}>Brigadista (Geral / Município)</span>
              </button>

              {/* 4. Brigadistas SEMA-AM */}
              <button
                className={`btn-tactical ${personnelCategory === 'efetivo_brigadista_sema' ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  border: personnelCategory === 'efetivo_brigadista_sema' ? '1.5px solid #10b981' : '1px solid #334155',
                  background: personnelCategory === 'efetivo_brigadista_sema' ? 'rgba(16, 185, 129, 0.25)' : '#0f172a',
                  color: personnelCategory === 'efetivo_brigadista_sema' ? '#86efac' : 'inherit'
                }}
                onClick={() => setPersonnelCategory('efetivo_brigadista_sema')}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontWeight: 800 }}>Brigadista SEMA (Estadual)</span>
              </button>

              {/* 5. Prevfogo IBAMA */}
              <button
                className={`btn-tactical ${personnelCategory === 'efetivo_prevfogo' ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  border: personnelCategory === 'efetivo_prevfogo' ? '1.5px solid #22c55e' : '1px solid #334155',
                  background: personnelCategory === 'efetivo_prevfogo' ? 'rgba(21, 128, 61, 0.25)' : '#0f172a',
                  color: personnelCategory === 'efetivo_prevfogo' ? '#86efac' : 'inherit'
                }}
                onClick={() => setPersonnelCategory('efetivo_prevfogo')}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontWeight: 800 }}>Prevfogo / IBAMA</span>
              </button>
            </div>

            <span className="resource-section-title">
              Quantidade de Operacionais
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{personnelCount} Op.</span>
            </span>

            {/* Presets comuns de tropa conforme Relatório Operacional */}
            <div className="preset-buttons-row" style={{ flexWrap: 'wrap', gap: 4 }}>
              {[4, 6, 7, 8, 10, 12, 14, 15, 17, 20, 21, 38].map(val => (
                <button
                  key={val}
                  className={`preset-btn ${personnelCount === val ? 'active' : ''}`}
                  onClick={() => setPersonnelCount(val)}
                  style={{ minWidth: 28 }}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Seletor numérico personalizado */}
            <div className="custom-number-input">
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Outro valor:</span>
              <input 
                type="number" 
                min="1" 
                max="99" 
                value={personnelCount} 
                onChange={(e) => setPersonnelCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* Card para Arrastar para o Mapa */}
            <div 
              className="token-item-card"
              draggable="true"
              onDragStart={(e) => onDragStartToken(e, { 
                type: personnelCategory, 
                count: personnelCount, 
                label: getPersonnelLabel() 
              })}
              onClick={() => {
                if (selectedMuni) {
                  onAddTokenToMuni(selectedMuni, { 
                    type: personnelCategory, 
                    count: personnelCount, 
                    label: getPersonnelLabel() 
                  });
                }
              }}
              style={{ marginTop: 6 }}
              title={selectedMuni ? `Clique para alocar em ${selectedMuni.name} ou arraste para qualquer ponto do mapa` : 'Arraste para o município desejado no mapa'}
            >
              <div className="token-preview">
                <TokenSvg type={personnelCategory} count={personnelCount} width={76} height={50} />
              </div>
              <div className="token-title">{getPersonnelLabel()}</div>
              <div className="token-desc">Arraste para o mapa ou clique</div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTRAS CATEGORIAS (AERONAVES, VIATURAS, FLUVIAL, BRASÕES)
            ================================================================= */}
        {activeTab !== 'efetivo' && (
          <div className="resource-section">
            {activeTab === 'aeronaves' && onOpenAeronaves && (
              <button
                className="btn-tactical"
                onClick={onOpenAeronaves}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1.5px solid #38bdf8',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 12,
                  justifyContent: 'center',
                  marginBottom: 12,
                  padding: '8px 10px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
                }}
                title="Clique para ver a localização das 10 aeronaves empregadas"
              >
                <Plane size={15} color="#facc15" />
                <span>Onde estão as Aeronaves (10)</span>
              </button>
            )}

            <div className="resource-section-title">
              Recursos Disponíveis
              <span className="drag-instruction">Arraste p/ o mapa</span>
            </div>

            <div className="token-tray">
              {getFilteredTokens().map(item => (
                <div
                  key={item.id}
                  className="token-item-card"
                  draggable="true"
                  onDragStart={(e) => onDragStartToken(e, { type: item.type, label: item.label })}
                  onClick={() => {
                    if (selectedMuni) {
                      onAddTokenToMuni(selectedMuni, item);
                    }
                  }}
                  title={selectedMuni ? `Clique para adicionar a ${selectedMuni.name} ou arraste para o mapa` : 'Arraste para qualquer município do mapa'}
                >
                  <div className="token-preview">
                    <TokenSvg type={item.type} width={item.width * 0.75} height={item.height * 0.75} />
                  </div>
                  <div className="token-title">{item.label}</div>
                  <div className="token-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notificação se um município estiver selecionado */}
        {selectedMuni && (
          <div style={{
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid #0284c7',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 11
          }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} />
              Município Ativo: {selectedMuni.name}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: 10, marginTop: 2 }}>
              Qualquer recurso arrastado ou clicado será vinculado a este município.
            </div>
          </div>
        )}

        {/* Lista de Municípios com Força Mobilizada */}
        <div className="resource-section" style={{ marginTop: 'auto' }}>
          <div className="resource-section-title">
            Mobilização Ativa
            <span style={{ color: '#38bdf8' }}>{deployedMunis.length} municípios</span>
          </div>

          <div style={{ 
            maxHeight: 180, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4 
          }}>
            {deployedMunis.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic', padding: '6px 0' }}>
                Nenhum recurso alocado ainda.
              </div>
            ) : (
              deployedMunis.map(({ name, count, items, inArco }) => (
                <div 
                  key={name}
                  onClick={() => onSelectMuni(name)}
                  style={{
                    background: inArco ? 'rgba(234, 88, 12, 0.15)' : 'var(--bg-surface-elevated)',
                    border: inArco ? '1px solid rgba(234, 88, 12, 0.5)' : '1px solid var(--border-subtle)',
                    borderRadius: 4,
                    padding: '5px 8px',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {inArco && <Flame size={12} color="#ea580c" />}
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{name}</span>
                  </div>
                  <span style={{ 
                    fontSize: 10, 
                    fontWeight: 800, 
                    background: '#1e293b', 
                    padding: '2px 6px', 
                    borderRadius: 4,
                    color: '#38bdf8'
                  }}>
                    {count} rec.
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
