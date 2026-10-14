import React, { useState } from 'react';
import { Plane, Shield, X, MapPin, Search, ExternalLink, Zap } from 'lucide-react';
import { OPERACAO_AERONAVES } from '../data/operacaoAmazonasData';
import { TokenSvg } from './TokenSvg';

export function AeronavesModal({ onClose, onSelectMuni }) {
  const [filterType, setFilterType] = useState('todos'); // 'todos' | 'asa_fixa' | 'asa_rotativa'
  const [search, setSearch] = useState('');

  const filteredAeronaves = OPERACAO_AERONAVES.filter(aero => {
    const matchesFilter = filterType === 'todos' || aero.category === filterType;
    const matchesSearch = 
      aero.name.toLowerCase().includes(search.toLowerCase()) ||
      aero.muni.toLowerCase().includes(search.toLowerCase()) ||
      aero.base.toLowerCase().includes(search.toLowerCase()) ||
      aero.prefix.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countAsaFixa = OPERACAO_AERONAVES.filter(a => a.category === 'asa_fixa').length;
  const countAsaRotativa = OPERACAO_AERONAVES.filter(a => a.category === 'asa_rotativa').length;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 860, width: '92vw', maxHeight: '90vh' }}
      >
        {/* Topo do Modal */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderBottom: '1.5px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              width: 38,
              height: 38,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}>
              <Plane size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '0.5px' }}>
                ONDE ESTÃO AS AERONAVES • OPERAÇÃO AMAZONAS
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>
                Localização e Base de Emprego das 10 Aeronaves Operacionais (CBMAM & FAB)
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

        {/* Resumo Rápido & Filtros */}
        <div style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.75)', borderBottom: '1px solid #1e293b', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setFilterType('todos')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: filterType === 'todos' ? '#0284c7' : '#1e293b',
                borderColor: filterType === 'todos' ? '#38bdf8' : '#334155',
                color: '#ffffff'
              }}
            >
              Todas (10)
            </button>
            <button
              onClick={() => setFilterType('asa_fixa')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: filterType === 'asa_fixa' ? '#0284c7' : '#1e293b',
                borderColor: filterType === 'asa_fixa' ? '#38bdf8' : '#334155',
                color: '#ffffff'
              }}
            >
              Asa Fixa ({countAsaFixa})
            </button>
            <button
              onClick={() => setFilterType('asa_rotativa')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                background: filterType === 'asa_rotativa' ? '#0284c7' : '#1e293b',
                borderColor: filterType === 'asa_rotativa' ? '#38bdf8' : '#334155',
                color: '#ffffff'
              }}
            >
              Asa Rotativa / Helicópteros ({countAsaRotativa})
            </button>
          </div>

          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar aeronave ou cidade..."
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

        {/* Lista de Aeronaves em Cartões Táticos */}
        <div className="modal-body" style={{ padding: '16px 20px', background: '#090d16' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
            {filteredAeronaves.map(aero => (
              <div 
                key={aero.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: aero.category === 'asa_rotativa' ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(2, 132, 199, 0.4)',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                }}
              >
                {/* Cabeçalho do Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', borderRadius: 8, border: '1px solid #334155' }}>
                      <TokenSvg type={aero.type} size={36} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>
                        {aero.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                        {aero.prefix}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: aero.category === 'asa_rotativa' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                    color: aero.category === 'asa_rotativa' ? '#34d399' : '#38bdf8',
                    border: `1px solid ${aero.category === 'asa_rotativa' ? '#059669' : '#0284c7'}`
                  }}>
                    {aero.category_label}
                  </span>
                </div>

                {/* Detalhes de Localização e Missão */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8' }}>Município:</span>
                    <strong style={{ color: '#facc15', fontSize: 13 }}>{aero.muni}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <Shield size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ color: '#94a3b8' }}>Base Operacional: </span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{aero.base}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <Zap size={14} color="#f97316" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ color: '#94a3b8' }}>Capacidade / Emprego: </span>
                      <span style={{ color: '#cbd5e1' }}>{aero.capacity} • {aero.role}</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Localizar no Mapa */}
                <div style={{ marginTop: 'auto', paddingTop: 6, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      if (onSelectMuni) onSelectMuni(aero.muni);
                      onClose();
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      border: '1px solid #38bdf8',
                      borderRadius: 6,
                      padding: '5px 12px',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={13} />
                    <span>Ver no Mapa ({aero.muni})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="modal-footer" style={{ background: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Total Operacional: <strong style={{ color: '#38bdf8' }}>10 Aeronaves</strong> (7 Asa Fixa + 3 Helicópteros)
          </div>
          <button 
            className="btn-tactical btn-accent" 
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
