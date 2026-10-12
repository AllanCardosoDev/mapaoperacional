import React, { useState } from 'react';
import { X, Trash2, Copy, Check } from 'lucide-react';
import { TokenSvg } from './TokenSvg';

export function TokenEditModal({
  token,
  onSave,
  onDelete,
  onDuplicate,
  onClose
}) {
  if (!token) return null;

  const [label, setLabel] = useState(token.label || '');
  const [count, setCount] = useState(token.count || 10);

  const handleSave = () => {
    onSave({
      ...token,
      label,
      count: token.type === 'efetivo' ? count : undefined
    });
    onClose();
  };

  return (
    <div className="tactical-modal-overlay open" onClick={onClose}>
      <div className="tactical-modal-box" onClick={(e) => e.stopPropagation()} style={{ width: 380 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TokenSvg type={token.type} count={count} width={34} height={24} />
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
              Gerenciar Recurso
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
              Identificador / Prefixo Tático
            </label>
            <input 
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: AT-01, Harpia 02, ABT-10..."
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 4,
                color: '#fff',
                padding: '6px 10px',
                fontSize: 12
              }}
            />
          </div>

          {token.type === 'efetivo' && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Quantidade de Militares
              </label>
              <input 
                type="number"
                min="1"
                max="99"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 4,
                  color: '#fff',
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            </div>
          )}

          <div style={{ fontSize: 11, color: '#64748b' }}>
            Posicionado em: <strong style={{ color: '#38bdf8' }}>{token.muni || 'Amazonas'}</strong>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button 
              className="btn-tactical" 
              onClick={() => { onDelete(token.id); onClose(); }}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              title="Excluir este recurso"
            >
              <Trash2 size={13} />
              Excluir
            </button>
            <button 
              className="btn-tactical" 
              onClick={() => { onDuplicate(token); onClose(); }}
              title="Duplicar recurso"
            >
              <Copy size={13} />
              Duplicar
            </button>
          </div>

          <button className="btn-tactical btn-primary" onClick={handleSave}>
            <Check size={13} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
