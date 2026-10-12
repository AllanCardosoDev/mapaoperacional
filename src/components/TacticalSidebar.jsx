import React, { useState } from 'react';
import { 
  Plane, 
  Truck, 
  Anchor, 
  Users, 
  Shield, 
  Plus, 
  ChevronRight, 
  Flame, 
  HelpCircle,
  MapPin
} from 'lucide-react';
import { TACTICAL_TOKENS } from '../data/tacticalAssets';
import { TokenSvg } from './TokenSvg';

export function TacticalSidebar({ 
  onDragStartToken, 
  selectedMuni, 
  onAddTokenToMuni,
  deployedMunis = [],
  onSelectMuni
}) {
  const [activeTab, setActiveTab] = useState('aeronaves');
  const [personnelCount, setPersonnelCount] = useState(10);

  const getFilteredTokens = () => {
    switch (activeTab) {
      case 'aeronaves':
        return TACTICAL_TOKENS.filter(t => t.category === 'aeronave');
      case 'viaturas':
        return TACTICAL_TOKENS.filter(t => t.category === 'viatura');
      case 'fluvial':
        return TACTICAL_TOKENS.filter(t => t.category === 'fluvial');
      case 'efetivo':
        return TACTICAL_TOKENS.filter(t => t.category === 'efetivo');
      case 'brasoes':
        return TACTICAL_TOKENS.filter(t => t.category === 'brasao');
      default:
        return TACTICAL_TOKENS;
    }
  };

  return (
    <aside className="tactical-sidebar">
      {/* Topo da barra lateral */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Shield size={16} color="#38bdf8" />
          Hangar & Prontidão
        </div>
        <span className="drag-instruction" title="Você pode arrastar para o mapa ou clicar com um município selecionado">
          Arraste p/ o mapa
        </span>
      </div>

      {/* Abas de Categorias */}
      <div className="sidebar-tabs">
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
          className={`sidebar-tab-btn ${activeTab === 'efetivo' ? 'active' : ''}`}
          onClick={() => setActiveTab('efetivo')}
          title="Efetivo de Militares"
        >
          <Users size={13} style={{ display: 'inline', marginRight: 4 }} />
          Efetivo
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
        {/* Seção especial para Efetivo com seletor de número dinâmico */}
        {activeTab === 'efetivo' && (
          <div className="personnel-config-box">
            <span className="resource-section-title">
              Contingente por Posição
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{personnelCount} BM</span>
            </span>

            {/* Presets comuns vistos no quadro (4, 7, 9, 14...) */}
            <div className="preset-buttons-row">
              {[4, 7, 9, 14, 20].map(val => (
                <button
                  key={val}
                  className={`preset-btn ${personnelCount === val ? 'active' : ''}`}
                  onClick={() => setPersonnelCount(val)}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Seletor numérico personalizado */}
            <div className="custom-number-input">
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Personalizado:</span>
              <input 
                type="number" 
                min="1" 
                max="99" 
                value={personnelCount} 
                onChange={(e) => setPersonnelCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div 
              className="token-item-card"
              draggable="true"
              onDragStart={(e) => onDragStartToken(e, { type: 'efetivo', count: personnelCount })}
              style={{ marginTop: 8 }}
            >
              <div className="token-preview">
                <TokenSvg type="efetivo" count={personnelCount} width={75} height={52} />
              </div>
              <div className="token-title">Guarnição de {personnelCount} Bombeiros</div>
              <div className="token-desc">Arraste para alocar no município</div>
            </div>
          </div>
        )}

        {/* Lista de Tokens Draggables da Categoria Ativa */}
        {activeTab !== 'efetivo' && (
          <div className="resource-section">
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
                      onAddTokenToMuni(selectedMuni, item.type);
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
              Qualquer recurso arrastado ou adicionado será vinculado a este município.
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
