import React, { useState, useMemo } from 'react';
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
  FileText,
  Info,
  CheckCircle2,
  Leaf
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

  // Totalizadores específicos deste município
  const breakdown = useMemo(() => {
    let militares = 0;
    let brigadistas = 0;
    let prevfogo = 0;
    let viaturas = 0;
    let aeronaves = 0;
    let fluvial = 0;

    muniTokens.forEach(tk => {
      if (tk.type === 'efetivo_militar' || tk.type === 'efetivo') {
        militares += (tk.count || 10);
      } else if (tk.type === 'efetivo_brigadista') {
        brigadistas += (tk.count || 10);
      } else if (tk.type === 'efetivo_prevfogo') {
        prevfogo += (tk.count || 10);
      } else if (tk.type.startsWith('vtr_')) {
        viaturas += 1;
      } else if (tk.type === 'air_tractor' || tk.type === 'helicoptero' || tk.type === 'kc390') {
        aeronaves += 1;
      } else if (tk.type === 'embarcacao') {
        fluvial += 1;
      }
    });

    return {
      militares,
      brigadistas,
      prevfogo,
      totalEfetivo: militares + brigadistas + prevfogo,
      viaturas,
      aeronaves,
      fluvial,
      totalAtivos: muniTokens.length
    };
  }, [muniTokens]);

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
            <MapPin size={18} color="#ef4444" />
            <h3 style={{ fontSize: 18 }}>{muni.name}</h3>
            {muni.in_arco_fogo && (
              <span 
                style={{ 
                  background: 'rgba(234, 88, 12, 0.25)', 
                  border: '1px solid #ea580c', 
                  color: '#f97316', 
                  fontSize: 10, 
                  fontWeight: 900, 
                  padding: '2px 6px', 
                  borderRadius: 4, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3 
                }}
              >
                <Flame size={12} />
                ARCO DO FOGO
              </span>
            )}
          </div>
          <p style={{ color: '#38bdf8', fontSize: 11.5 }}>
            {muni.region_info?.macro} • {muni.region_info?.cbm}
          </p>
        </div>

        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Fechar painel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="drawer-body">
        {/* RESUMO GERAL DAS FORÇAS ALOCADAS NO MUNICÍPIO */}
        <div className="info-card-block" style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="block-title" style={{ color: '#38bdf8' }}>Quadro Resumo Municipal</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>
              {breakdown.totalAtivos} ativos cadastrados
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ background: '#101726', padding: '6px 8px', borderRadius: 4, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 9.5, color: '#94a3b8', textTransform: 'uppercase' }}>Efetivo Total</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>{breakdown.totalEfetivo} <span style={{ fontSize: 11, fontWeight: 'normal' }}>Op.</span></div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>
                {breakdown.militares} Mil • {breakdown.brigadistas} Brig • {breakdown.prevfogo} PF
              </div>
            </div>

            <div style={{ background: '#101726', padding: '6px 8px', borderRadius: 4, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 9.5, color: '#94a3b8', textTransform: 'uppercase' }}>Viaturas (VTRs)</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#f87171' }}>{breakdown.viaturas} <span style={{ fontSize: 11, fontWeight: 'normal' }}>VTR</span></div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>Caminhões e Pick-ups</div>
            </div>

            <div style={{ background: '#101726', padding: '6px 8px', borderRadius: 4, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 9.5, color: '#94a3b8', textTransform: 'uppercase' }}>Aeronaves</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#facc15' }}>{breakdown.aeronaves} <span style={{ fontSize: 11, fontWeight: 'normal' }}>Aero</span></div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>Air Tractor e Harpias</div>
            </div>

            <div style={{ background: '#101726', padding: '6px 8px', borderRadius: 4, border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 9.5, color: '#94a3b8', textTransform: 'uppercase' }}>Fluvial</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8' }}>{breakdown.fluvial} <span style={{ fontSize: 11, fontWeight: 'normal' }}>Barco</span></div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>Lanchas Rápidas</div>
            </div>
          </div>
        </div>

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

        {/* LISTA DETALHADA DE TODOS OS RECURSOS INSERIDOS */}
        <div className="info-card-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="block-title">Detalhamento dos Recursos</span>
            <span style={{ fontSize: 11, fontWeight: 'bold', color: '#38bdf8' }}>
              {muniTokens.length} itens
            </span>
          </div>

          <div className="allocated-resources-list">
            {muniTokens.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic', padding: '14px 0', textAlign: 'center' }}>
                Nenhum recurso cadastrado para este município ainda. Utilize os botões abaixo para inserir.
              </div>
            ) : (
              muniTokens.map((tk) => {
                let badgeColor = '#ef4444';
                if (tk.type === 'efetivo_brigadista') badgeColor = '#f97316';
                if (tk.type === 'efetivo_prevfogo') badgeColor = '#22c55e';
                if (tk.type === 'air_tractor') badgeColor = '#facc15';
                if (tk.type === 'helicoptero') badgeColor = '#86efac';
                if (tk.type === 'embarcacao') badgeColor = '#38bdf8';

                return (
                  <div key={tk.id} className="allocated-item-row" style={{ borderLeft: `3px solid ${badgeColor}` }}>
                    <div className="alloc-item-info">
                      <div className="alloc-item-icon">
                        <TokenSvg type={tk.type} count={tk.count} width={32} height={22} />
                      </div>
                      <div>
                        <div className="alloc-item-name" style={{ fontSize: 11.5 }}>{tk.label || tk.type}</div>
                        {tk.count ? (
                          <div style={{ fontSize: 9.5, color: badgeColor, fontWeight: 'bold' }}>
                            {tk.count} operacionais em prontidão
                          </div>
                        ) : (
                          <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                            Unidade móvel ativa
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
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Adição Rápida de Efetivo por Categoria */}
        <div className="info-card-block">
          <span className="block-title">Inserir Novo Efetivo</span>

          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_militar' ? 'active opt-red' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 5 }}
              onClick={() => setPersonnelType('efetivo_militar')}
            >
              Militares CBM
            </button>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_brigadista' ? 'active opt-orange' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 5 }}
              onClick={() => setPersonnelType('efetivo_brigadista')}
            >
              Brigadistas
            </button>
            <button
              className={`status-opt-btn ${personnelType === 'efetivo_prevfogo' ? 'active opt-green' : ''}`}
              style={{ flex: 1, fontSize: 10, padding: 5 }}
              onClick={() => setPersonnelType('efetivo_prevfogo')}
            >
              Prevfogo IBAMA
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
                padding: '5px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            />
            <button
              className="btn-tactical btn-primary"
              style={{ 
                flex: 1, 
                padding: '6px 10px', 
                fontSize: 11,
                background: personnelType === 'efetivo_prevfogo' ? '#15803d' : (personnelType === 'efetivo_brigadista' ? '#c2410c' : undefined)
              }}
              onClick={handleAddPersonnel}
            >
              <Users size={13} />
              + Inserir ({personnelToAdd} Op.)
            </button>
          </div>
        </div>

        {/* Adição Rápida de Viaturas e Aeronaves */}
        <div className="info-card-block">
          <span className="block-title">Inserir Meios Operacionais (VTR / Aero)</span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'air_tractor', label: 'Air Tractor' })}
            >
              <Plane size={12} color="#facc15" />
              + Air Tractor
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'helicoptero', label: 'Harpia Helo' })}
            >
              <Shield size={12} color="#86efac" />
              + Harpia Helo
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_abt', label: 'ABT Caminhão' })}
            >
              <Truck size={12} color="#f87171" />
              + Caminhão ABT
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_florestal', label: 'Pick-up 4x4' })}
            >
              <Truck size={12} color="#fb923c" />
              + Pick-up 4x4
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'vtr_ur', label: 'Resgate UR' })}
            >
              <AlertTriangle size={12} color="#38bdf8" />
              + Resgate UR
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'embarcacao', label: 'Lancha Fluvial' })}
            >
              <Anchor size={12} color="#38bdf8" />
              + Lancha Fluvial
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() => onAddToken(muni, { type: 'kc390', label: 'KC-390' })}
            >
              <Plane size={12} color="#94a3b8" />
              + KC-390 Carga
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
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
