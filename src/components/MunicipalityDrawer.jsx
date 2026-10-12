import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  MapPin, 
  Plus, 
  Trash2, 
  Users, 
  Plane, 
  Truck, 
  Anchor, 
  Shield, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { TokenSvg } from './TokenSvg';

export function MunicipalityDrawer({
  muni,
  muniTokens = [],
  muniStatus = 'normal',
  onUpdateMuniStatus,
  muniNotes = '',
  onUpdateMuniNotes,
  onAddToken,
  onRemoveToken,
  onClose
}) {
  const [personnelToAdd, setPersonnelToAdd] = useState(10);
  const [personnelType, setPersonnelType] = useState('efetivo_militar');

  if (!muni) return null;

  const handleAddPersonnel = () => {
    let label = `${personnelToAdd} Bombeiros`;
    if (personnelType === 'efetivo_brigadista') label = `${personnelToAdd} Brigadistas`;
    if (personnelType === 'efetivo_prevfogo') label = `${personnelToAdd} Prevfogo`;

    onAddToken(muni, {
      type: personnelType,
      count: personnelToAdd,
      label
    });
  };

  return (
    <aside className="details-drawer">
      {/* Cabeçalho do Drawer */}
      <div className="drawer-header">
        <div className="drawer-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={16} color="#ef4444" />
            <h3>{muni.name}</h3>
            {muni.in_arco_fogo && (
              <span 
                style={{ 
                  background: 'rgba(234, 88, 12, 0.2)', 
                  border: '1px solid #ea580c', 
                  color: '#f97316', 
                  fontSize: 9.5, 
                  fontWeight: 800, 
                  padding: '2px 6px', 
                  borderRadius: 4, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3 
                }}
              >
                <Flame size={10} />
                ARCO DO FOGO
              </span>
            )}
          </div>
          <p>{muni.region_info?.macro} • {muni.region_info?.cbm}</p>
        </div>

        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Fechar painel"
        >
          <X size={18} />
        </button>
      </div>

      <div className="drawer-body">
        {/* Nível de Prontidão Operacional */}
        <div className="info-card-block">
          <span className="block-title">Status Operacional</span>
          <div className="status-badge-selector">
            <button
              className={`status-opt-btn opt-green ${muniStatus === 'normal' ? 'active' : ''}`}
              onClick={() => onUpdateMuniStatus(muni.name, 'normal')}
            >
              Normal
            </button>
            <button
              className={`status-opt-btn opt-amber ${muniStatus === 'alerta' ? 'active' : ''}`}
              onClick={() => onUpdateMuniStatus(muni.name, 'alerta')}
            >
              Alerta
            </button>
            <button
              className={`status-opt-btn opt-orange ${muniStatus === 'arco_fogo' ? 'active' : ''}`}
              onClick={() => onUpdateMuniStatus(muni.name, 'arco_fogo')}
            >
              Arco do Fogo
            </button>
            <button
              className={`status-opt-btn opt-red ${muniStatus === 'emergencia' ? 'active' : ''}`}
              onClick={() => onUpdateMuniStatus(muni.name, 'emergencia')}
            >
              Emergência
            </button>
          </div>
        </div>

        {/* Recursos Alocados Atualmente */}
        <div className="info-card-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="block-title">Recursos Alocados</span>
            <span style={{ fontSize: 11, fontWeight: 'bold', color: '#38bdf8' }}>
              {muniTokens.length} ativos
            </span>
          </div>

          <div className="allocated-resources-list">
            {muniTokens.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
                Nenhum recurso alocado neste município. Use os botões abaixo ou arraste da barra lateral.
              </div>
            ) : (
              muniTokens.map((tk) => (
                <div key={tk.id} className="allocated-item-row">
                  <div className="alloc-item-info">
                    <div className="alloc-item-icon">
                      <TokenSvg type={tk.type} count={tk.count} width={28} height={20} />
                    </div>
                    <div>
                      <div className="alloc-item-name">{tk.label || tk.type}</div>
                      {tk.count && (
                        <div style={{ 
                          fontSize: 9.5, 
                          color: tk.type === 'efetivo_prevfogo' ? '#22c55e' : (tk.type === 'efetivo_brigadista' ? '#f97316' : '#ef4444')
                        }}>
                          {tk.count} operacionais
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="alloc-item-actions">
                    <button 
                      className="btn-delete-alloc" 
                      onClick={() => onRemoveToken(tk.id)} 
                      title="Remover recurso do mapa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adição Rápida de Efetivo por Categoria */}
        <div className="info-card-block">
          <span className="block-title">Alocar Efetivo (Tropa)</span>

          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_militar' ? 'active' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 4 }}
              onClick={() => setPersonnelType('efetivo_militar')}
            >
              Militares
            </button>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_brigadista' ? 'active' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 4 }}
              onClick={() => setPersonnelType('efetivo_brigadista')}
            >
              Brigadistas
            </button>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_prevfogo' ? 'active' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 4 }}
              onClick={() => setPersonnelType('efetivo_prevfogo')}
            >
              Prevfogo
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input 
              type="number"
              min="1"
              max="99"
              value={personnelToAdd}
              onChange={(e) => setPersonnelToAdd(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: 60,
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 4,
                color: '#fff',
                padding: '4px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            />
            <button
              className="btn-tactical btn-primary"
              style={{ 
                flex: 1, 
                padding: '5px 8px', 
                fontSize: 11,
                background: personnelType === 'efetivo_prevfogo' ? '#15803d' : (personnelType === 'efetivo_brigadista' ? '#c2410c' : undefined)
              }}
              onClick={handleAddPersonnel}
            >
              <Users size={13} />
              + Alocar ({personnelToAdd} Op.)
            </button>
          </div>
        </div>

        {/* Adição Rápida de Viaturas e Aeronaves */}
        <div className="info-card-block">
          <span className="block-title">Adicionar Meios de Apoio</span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'air_tractor', label: 'Air Tractor' })}
            >
              <Plane size={12} color="#facc15" />
              + Air Tractor
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'helicoptero', label: 'Harpia Helo' })}
            >
              <Shield size={12} color="#86efac" />
              + Harpia Helo
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_abt', label: 'ABT Caminhão' })}
            >
              <Truck size={12} color="#f87171" />
              + Caminhão ABT
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_florestal', label: 'Pick-up 4x4' })}
            >
              <Truck size={12} color="#fb923c" />
              + Pick-up 4x4
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_ur', label: 'Resgate UR' })}
            >
              <AlertTriangle size={12} color="#38bdf8" />
              + Resgate UR
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'embarcacao', label: 'Lancha Fluvial' })}
            >
              <Anchor size={12} color="#38bdf8" />
              + Lancha Fluvial
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'kc390', label: 'KC-390' })}
            >
              <Plane size={12} color="#94a3b8" />
              + KC-390 Carga
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '5px 6px' }}
              onClick={() => onAddToken(muni, { type: 'brasao_cbi', label: 'Brasão CBI' })}
            >
              <Shield size={12} color="#dc2626" />
              + Brasão Base
            </button>
          </div>
        </div>

        {/* Registro de Ocorrência / Notas Táticas */}
        <div className="info-card-block">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={13} color="#94a3b8" />
            <span className="block-title">Observações da Operação</span>
          </div>

          <textarea
            rows="3"
            placeholder="Registre comandos de rádio, focos ativos, condições meteorológicas ou observações..."
            value={muniNotes}
            onChange={(e) => onUpdateMuniNotes(muni.name, e.target.value)}
            style={{
              width: '100%',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 4,
              color: '#ffffff',
              padding: '6px 8px',
              fontSize: 11,
              fontFamily: 'inherit',
              resize: 'none'
            }}
          />
        </div>
      </div>
    </aside>
  );
}
