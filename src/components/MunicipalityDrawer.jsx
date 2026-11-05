import React, { useState, useMemo } from 'react';
import {
  X,
  Flame,
  MapPin,
  Trash2,
  Users,
  Plane,
  Truck,
  Anchor,
  Shield,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { TokenSvg } from './TokenSvg';
import {
  PREVFOGO_RECURSOS_DISPONIVEIS,
  FOCOS_COMBATE_ATIVOS,
  OPERACAO_RECURSOS_MUNICIPIOS,
  OPERACAO_EFETIVO_MUNICIPIOS,
} from '../data/operacaoAmazonasData';

export function MunicipalityDrawer({
  muni,
  muniTokens = [],
  muniStatus = 'normal',
  onUpdateMuniStatus,
  muniNotes = '',
  onUpdateMuniNotes,
  onAddToken,
  onRemoveToken,
  onClose,
  dbEfetivo = null,
  dbRecursos = null,
}) {
  const [personnelToAdd, setPersonnelToAdd] = useState(10);
  const [personnelType, setPersonnelType] = useState('efetivo_militar');

  // Informações de Prevfogo / IBAMA deste município se houver
  const prevfogoData = useMemo(() => {
    if (!muni) return null;
    return (
      PREVFOGO_RECURSOS_DISPONIVEIS.find(
        (p) => p.muni.toLowerCase() === muni.name.toLowerCase()
      ) || null
    );
  }, [muni]);

  // Focos de Combate Ativos deste município se houver
  const focosData = useMemo(() => {
    if (!muni) return [];
    return FOCOS_COMBATE_ATIVOS.filter(
      (f) => f.muni.toLowerCase() === muni.name.toLowerCase()
    );
  }, [muni]);

  // Efetivo Oficial (Consome Banco Supabase em harmonia ou fallback institucional)
  const officialEfetivo = useMemo(() => {
    if (!muni) return null;
    const nameLow = (muni.name || '').toLowerCase().trim();
    const normalize = (s) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    const targetNorm = normalize(nameLow);

    if (Array.isArray(dbEfetivo) && dbEfetivo.length > 0) {
      const found = dbEfetivo.find((e) => {
        const n = normalize(e.mun || e.muni || '');
        return (
          n === targetNorm ||
          (targetNorm === 'careiro' && n.includes('careiro')) ||
          (n === 'careiro' && targetNorm.includes('careiro'))
        );
      });
      if (found) return found;
    }
    return (
      OPERACAO_EFETIVO_MUNICIPIOS.find((e) => {
        const n = normalize(e.muni || '');
        return (
          n === targetNorm ||
          (targetNorm === 'careiro' && n.includes('careiro')) ||
          (n === 'careiro' && targetNorm.includes('careiro'))
        );
      }) || null
    );
  }, [muni, dbEfetivo]);

  // Recursos e Viaturas Oficiais deste município (Supabase ou fallback oficial)
  const recursosData = useMemo(() => {
    if (!muni) return null;
    const normalize = (s) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    const targetNorm = normalize(muni.name || '');

    if (Array.isArray(dbRecursos) && dbRecursos.length > 0) {
      const found = dbRecursos.find((r) => {
        const n = normalize(r.mun || r.muni || '');
        return (
          n === targetNorm ||
          (targetNorm === 'careiro' && n.includes('careiro')) ||
          (n === 'careiro' && targetNorm.includes('careiro'))
        );
      });
      if (found) {
        const total = Object.keys(found).reduce((acc, k) => {
          if (
            k !== 'mun' &&
            k !== 'muni' &&
            k !== 'total' &&
            typeof found[k] === 'number'
          ) {
            return acc + found[k];
          }
          return acc;
        }, 0);
        return { ...found, total: found.total || total };
      }
    }
    return (
      OPERACAO_RECURSOS_MUNICIPIOS.find(
        (r) => r.mun.toLowerCase() === muni.name.toLowerCase()
      ) || null
    );
  }, [muni, dbRecursos]);

  // Totalizadores específicos deste município
  const breakdown = useMemo(() => {
    if (!muni)
      return {
        militares: 0,
        brigadistas: 0,
        prevfogo: 0,
        totalEfetivo: 0,
        viaturas: 0,
        aeronaves: 0,
        fluvial: 0,
        totalAtivos: 0,
      };
    let militares = 0;
    let brigadistas = 0;
    let prevfogo = 0;
    let viaturas = 0;
    let aeronaves = 0;
    let fluvial = 0;

    muniTokens.forEach((tk) => {
      const t = tk.type || '';
      if (
        t === 'efetivo_militar' ||
        t === 'efetivo' ||
        t === 'serv_ord' ||
        t === 'efetivo_seg' ||
        t === 'seg' ||
        t === 'opam' ||
        t === 'efetivo_fn' ||
        t === 'fn' ||
        t === 'cbmsp'
      ) {
        militares += tk.count || 10;
      } else if (
        t === 'efetivo_brigadista' ||
        t === 'efetivo_brigadista_sema' ||
        t === 'brigadista' ||
        t === 'brigadista_sema'
      ) {
        brigadistas += tk.count || 10;
      } else if (t === 'efetivo_prevfogo' || t === 'prevfogo') {
        prevfogo += tk.count || 10;
      } else if (t.startsWith('vtr_') || t === 'caminhao' || t === 'pick_up') {
        viaturas += tk.count || 1;
      } else if (
        t === 'air_tractor' ||
        t === 'helicoptero' ||
        t === 'kc390' ||
        t === 'aviao'
      ) {
        aeronaves += tk.count || 1;
      } else if (t === 'embarcacao' || t === 'jetski') {
        fluvial += tk.count || 1;
      }
    });

    // Se nenhum token de pessoal foi cadastrado no mapa, busca o efetivo do banco de dados (Supabase)
    if (
      militares === 0 &&
      brigadistas === 0 &&
      prevfogo === 0 &&
      officialEfetivo
    ) {
      militares =
        (officialEfetivo.cbmam ||
          officialEfetivo.ord ||
          officialEfetivo.servico ||
          0) +
        (officialEfetivo.fn || 0) +
        (officialEfetivo.cbmsp || 0);
      brigadistas =
        officialEfetivo.brig ||
        (officialEfetivo.brig_mun || 0) + (officialEfetivo.brig_semas || 0);
      prevfogo = officialEfetivo.prevfogo || 0;
    }

    // Se nenhum token de viatura/meios foi cadastrado no mapa, busca os recursos do banco de dados
    if (viaturas === 0 && recursosData) {
      const vtrCount =
        (recursosData.abt || 0) +
        (recursosData.at || 0) +
        (recursosData.atp || 0) +
        (recursosData.ata || 0) +
        (recursosData.abf || 0) +
        (recursosData.atf || 0) +
        (recursosData.abs || 0) +
        (recursosData.pipa || 0) +
        (recursosData.dosa || 0) +
        (recursosData.crs || 0) +
        (recursosData.ar || 0) +
        (recursosData.ur || 0) +
        (recursosData.gse || 0) +
        (recursosData.mt || 0) +
        (recursosData.picape_fn || 0) +
        (recursosData.picape_muni || 0) +
        (recursosData.picape_esfron || 0) +
        (recursosData.autoarp || 0) +
        (recursosData.quadriciclo || 0);
      viaturas = vtrCount;
    }
    if (aeronaves === 0 && recursosData) {
      aeronaves = (recursosData.helicoptero || 0) + (recursosData.aviao || 0);
    }
    if (fluvial === 0 && recursosData) {
      fluvial = (recursosData.embarcacao || 0) + (recursosData.jetski || 0);
    }

    const totalEfetivo = militares + brigadistas + prevfogo;
    const totalAtivos =
      muniTokens.length > 0
        ? muniTokens.length
        : (totalEfetivo > 0 ? 1 : 0) + (viaturas > 0 ? 1 : 0);

    return {
      militares,
      brigadistas,
      prevfogo,
      totalEfetivo,
      viaturas,
      aeronaves,
      fluvial,
      totalAtivos,
    };
  }, [muni, muniTokens, officialEfetivo, recursosData]);

  if (!muni) return null;

  const handleAddPersonnel = () => {
    let label = `${personnelToAdd} Bombeiros`;
    if (personnelType === 'efetivo_brigadista')
      label = `${personnelToAdd} Brigadistas`;
    if (personnelType === 'efetivo_prevfogo')
      label = `${personnelToAdd} Prevfogo`;

    onAddToken(muni, {
      type: personnelType,
      count: personnelToAdd,
      label,
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
                  gap: 3,
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
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
          }}
          title="Fechar painel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="drawer-body">
        {/* RESUMO GERAL DAS FORÇAS ALOCADAS NO MUNICÍPIO */}
        <div
          className="info-card-block"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #0284c7',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span className="block-title" style={{ color: '#38bdf8' }}>
              Quadro Resumo Municipal
            </span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>
              {breakdown.totalAtivos} ativos cadastrados
            </span>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                Efetivo Total
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#ffffff' }}>
                {breakdown.totalEfetivo}{' '}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#38bdf8',
                  }}
                >
                  Op.
                </span>
              </div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>
                {breakdown.militares} Mil • {breakdown.brigadistas} Brig •{' '}
                {breakdown.prevfogo} PF
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                Viaturas (VTRs)
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#f87171' }}>
                {breakdown.viaturas}{' '}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#fca5a5',
                  }}
                >
                  VTR
                </span>
              </div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>
                Caminhões e Pick-ups
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                Aeronaves
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#facc15' }}>
                {breakdown.aeronaves}{' '}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#fde047',
                  }}
                >
                  Aero
                </span>
              </div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>
                Air Tractor e Harpias
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                Fluvial
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#38bdf8' }}>
                {breakdown.fluvial}{' '}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#7dd3fc',
                  }}
                >
                  Barco
                </span>
              </div>
              <div style={{ fontSize: 8.5, color: '#64748b' }}>
                Lanchas Rápidas
              </div>
            </div>
          </div>
        </div>

        {/* EFETIVO OFICIAL HOMOLOGADO NO BANCO DE DADOS (SUPABASE) */}
        {officialEfetivo && (
          <div
            className="info-card-block"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid #10b981',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} color="#34d399" />
                <span
                  className="block-title"
                  style={{ color: '#6ee7b7', fontWeight: 900 }}
                >
                  Efetivo Homologado (Banco Supabase)
                </span>
              </div>
              <span
                style={{
                  background: '#065f46',
                  color: '#ecfdf5',
                  fontWeight: 900,
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
              >
                {(officialEfetivo.cbmam ||
                  officialEfetivo.ord ||
                  officialEfetivo.servico ||
                  0) +
                  (officialEfetivo.seg || 0) +
                  (officialEfetivo.fn || 0) +
                  (officialEfetivo.cbmsp || 0) +
                  (officialEfetivo.prevfogo || 0) +
                  (officialEfetivo.brig ||
                    (officialEfetivo.brig_mun || 0) +
                      (officialEfetivo.brig_semas || 0))}{' '}
                Op.
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: 6,
              }}
            >
              {(officialEfetivo.cbmam ||
                officialEfetivo.ord ||
                officialEfetivo.servico ||
                0) > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#f87171',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Militares CBMAM
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.cbmam ||
                      officialEfetivo.ord ||
                      officialEfetivo.servico}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
              {(officialEfetivo.seg || 0) > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#facc15',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    SEG Gratificado
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.seg}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
              {((officialEfetivo.brig || 0) > 0 ||
                (officialEfetivo.brig_mun || 0) > 0) && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#fb923c',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Brigadistas Mun.
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.brig_mun || officialEfetivo.brig}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
              {(officialEfetivo.brig_semas || 0) > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#4ade80',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Brigadistas SEMA
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.brig_semas}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
              {(officialEfetivo.prevfogo || 0) > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#4ade80',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Prevfogo IBAMA
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.prevfogo}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
              {(officialEfetivo.fn || 0) > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#60a5fa',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Força Nacional
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}
                  >
                    {officialEfetivo.fn}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Op.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREVFOGO / IBAMA - SEÇÃO EXECUTIVA SE HOUVER RECURSOS NESTE MUNICÍPIO */}
        {prevfogoData && (
          <div
            className="info-card-block"
            style={{
              background: 'rgba(21, 128, 61, 0.12)',
              border: '1.5px solid #22c55e',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={16} color="#4ade80" />
                <span
                  className="block-title"
                  style={{ color: '#86efac', fontWeight: 900 }}
                >
                  Prevfogo / IBAMA Disponível
                </span>
              </div>
              <span
                style={{
                  background: '#15803d',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
              >
                {prevfogoData.total} Brigadistas
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {prevfogoData.bases.map((b, bIdx) => (
                <div
                  key={bIdx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: 6,
                    padding: '6px 10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: '#f0fdf4',
                      }}
                    >
                      {b.local}
                    </div>
                    <div style={{ fontSize: 10, color: '#86efac' }}>
                      {b.detalhe}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#4ade80',
                      fontFamily: 'monospace',
                    }}
                  >
                    {String(b.efetivo).padStart(2, '0')}{' '}
                    <span style={{ fontSize: 9.5, color: '#cbd5e1' }}>
                      brig.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMBATES ATIVOS GEORREFERENCIADOS NO MUNICÍPIO */}
        {focosData.length > 0 && (
          <div
            className="info-card-block"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1.5px solid #ef4444',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame size={16} color="#ef4444" />
                <span
                  className="block-title"
                  style={{ color: '#fca5a5', fontWeight: 900 }}
                >
                  Combates Ativos Georreferenciados
                </span>
              </div>
              <span
                style={{
                  background: '#b91c1c',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
              >
                {focosData.length} {focosData.length === 1 ? 'Foco' : 'Focos'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {focosData.map((foco) => {
                const isAtivo = foco.status === 'ativo';
                const isControlado = foco.status === 'controlado';
                const isExtinto = foco.status === 'extinto';

                let statusBadgeBg = '#991b1b';
                let statusBadgeColor = '#fef2f2';
                let statusLabel = 'Em combate / Ativo';

                if (isControlado) {
                  statusBadgeBg = '#b45309';
                  statusBadgeColor = '#fef3c7';
                  statusLabel = 'Controlado';
                } else if (isExtinto) {
                  statusBadgeBg = '#065f46';
                  statusBadgeColor = '#d1fae5';
                  statusLabel = 'Extinto';
                }

                return (
                  <div
                    key={foco.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: `1px solid ${isAtivo ? '#ef4444' : isControlado ? '#f59e0b' : '#10b981'}`,
                      borderRadius: 6,
                      padding: '8px 10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#ffffff',
                        }}
                      >
                        {foco.local}
                      </div>
                      <span
                        style={{
                          background: statusBadgeBg,
                          color: statusBadgeColor,
                          fontSize: 9.5,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 10.5,
                        color: '#94a3b8',
                        marginBottom: 4,
                      }}
                    >
                      {foco.detalhe}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 10.5,
                        color: '#cbd5e1',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: 4,
                      }}
                    >
                      <span
                        style={{ fontFamily: 'monospace', color: '#38bdf8' }}
                      >
                        {foco.lat_dms} • {foco.lon_dms}
                      </span>
                      <span style={{ fontWeight: 800, color: '#facc15' }}>
                        {String(foco.efetivo).padStart(2, '0')} brigadistas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIATURAS & MEIOS OPERACIONAIS OFICIAIS ALOCADOS */}
        {recursosData && recursosData.total > 0 && (
          <div
            className="info-card-block"
            style={{
              background: 'rgba(30, 58, 138, 0.15)',
              border: '1.5px solid #3b82f6',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={16} color="#60a5fa" />
                <span
                  className="block-title"
                  style={{ color: '#93c5fd', fontWeight: 900 }}
                >
                  Meios e Viaturas Alocados
                </span>
              </div>
              <span
                style={{
                  background: '#1d4ed8',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
              >
                {recursosData.total}{' '}
                {recursosData.total === 1 ? 'Recurso' : 'Recursos'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 6,
              }}
            >
              {recursosData.abt > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#f87171',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Auto Bomba Tanque
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.abt}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      ABT
                    </span>
                  </div>
                </div>
              )}
              {recursosData.atf > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#fbbf24',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Tanque Florestal
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.atf}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      ATF
                    </span>
                  </div>
                </div>
              )}
              {recursosData.ar > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#60a5fa',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Apoio Rápido 4x4
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.ar}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      AR
                    </span>
                  </div>
                </div>
              )}
              {recursosData.ur > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#c084fc',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Unidade Resgate
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.ur}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      UR
                    </span>
                  </div>
                </div>
              )}
              {recursosData.mt > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#38bdf8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Motocicleta
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.mt}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      MT
                    </span>
                  </div>
                </div>
              )}
              {recursosData.embarcacao > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#2dd4bf',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Embarcação / Lancha
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.embarcacao}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Fluvial
                    </span>
                  </div>
                </div>
              )}
              {recursosData.jetski > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#2dd4bf',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Jet Ski Tático
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.jetski}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Jet Ski
                    </span>
                  </div>
                </div>
              )}
              {recursosData.helicoptero > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#facc15',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Helicóptero Harpia
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.helicoptero}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Harpia
                    </span>
                  </div>
                </div>
              )}
              {recursosData.aviao > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#facc15',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Avião Air Tractor
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.aviao}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      Aero
                    </span>
                  </div>
                </div>
              )}
              {recursosData.dosa > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#94a3b8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    DOSA
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.dosa}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      DOSA
                    </span>
                  </div>
                </div>
              )}
              {recursosData.gse > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 6,
                    padding: '6px 8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: '#94a3b8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    GSE Apoio
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: '#ffffff',
                    }}
                  >
                    {recursosData.gse}{' '}
                    <span
                      style={{
                        fontSize: 9.5,
                        color: '#cbd5e1',
                        fontWeight: 400,
                      }}
                    >
                      GSE
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="block-title">Detalhamento dos Recursos</span>
            <span
              style={{ fontSize: 11, fontWeight: 'bold', color: '#38bdf8' }}
            >
              {muniTokens.length} itens
            </span>
          </div>

          <div className="allocated-resources-list">
            {muniTokens.length === 0 ? (
              <div
                style={{
                  color: '#64748b',
                  fontSize: 11,
                  fontStyle: 'italic',
                  padding: '14px 0',
                  textAlign: 'center',
                }}
              >
                Nenhum recurso cadastrado para este município ainda. Utilize os
                botões abaixo para inserir.
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
                  <div
                    key={tk.id}
                    className="allocated-item-row"
                    style={{ borderLeft: `3px solid ${badgeColor}` }}
                  >
                    <div className="alloc-item-info">
                      <div className="alloc-item-icon">
                        <TokenSvg
                          type={tk.type}
                          count={tk.count}
                          width={32}
                          height={22}
                        />
                      </div>
                      <div>
                        <div
                          className="alloc-item-name"
                          style={{ fontSize: 11.5 }}
                        >
                          {tk.label || tk.type}
                        </div>
                        {tk.type?.startsWith('vtr_') ||
                        tk.type === 'embarcacao' ||
                        tk.type === 'helicoptero' ||
                        tk.type === 'air_tractor' ||
                        tk.type === 'kc390' ? (
                          <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                            {tk.count || 1}{' '}
                            {(tk.count || 1) === 1
                              ? 'recurso / viatura em operação'
                              : 'recursos / viaturas em operação'}
                          </div>
                        ) : tk.count ? (
                          <div
                            style={{
                              fontSize: 9.5,
                              color: badgeColor,
                              fontWeight: 'bold',
                            }}
                          >
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="1"
              max="99"
              value={personnelToAdd}
              onChange={(e) =>
                setPersonnelToAdd(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{
                width: 64,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 8,
                color: '#fff',
                padding: '7px',
                textAlign: 'center',
                fontWeight: 'bold',
                outline: 'none',
              }}
            />
            <button
              className="btn-tactical btn-primary"
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 11.5,
                borderRadius: 8,
                background:
                  personnelType === 'efetivo_prevfogo'
                    ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                    : personnelType === 'efetivo_brigadista'
                      ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
                      : undefined,
              }}
              onClick={handleAddPersonnel}
            >
              <Users size={14} />+ Inserir ({personnelToAdd} Op.)
            </button>
          </div>
        </div>

        {/* Adição Rápida de Viaturas e Aeronaves */}
        <div className="info-card-block">
          <span className="block-title">
            Inserir Meios Operacionais (VTR / Aero)
          </span>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}
          >
            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'air_tractor', label: 'Air Tractor' })
              }
            >
              <Plane size={12} color="#facc15" />+ Air Tractor
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'helicoptero', label: 'Harpia Helo' })
              }
            >
              <Shield size={12} color="#86efac" />+ Harpia Helo
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'vtr_abt', label: 'ABT Caminhão' })
              }
            >
              <Truck size={12} color="#f87171" />+ Caminhão ABT
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, {
                  type: 'vtr_florestal',
                  label: 'Pick-up 4x4',
                })
              }
            >
              <Truck size={12} color="#fb923c" />+ Pick-up 4x4
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'vtr_ur', label: 'Resgate UR' })
              }
            >
              <AlertTriangle size={12} color="#38bdf8" />+ Resgate UR
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, {
                  type: 'embarcacao',
                  label: 'Lancha Fluvial',
                })
              }
            >
              <Anchor size={12} color="#38bdf8" />+ Lancha Fluvial
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'kc390', label: 'KC-390' })
              }
            >
              <Plane size={12} color="#94a3b8" />+ KC-390 Carga
            </button>

            <button
              className="btn-tactical"
              style={{ fontSize: 10.5, padding: '6px 6px' }}
              onClick={() =>
                onAddToken(muni, { type: 'brasao_cbi', label: 'Brasão CBI' })
              }
            >
              <Shield size={12} color="#dc2626" />+ Brasão Base
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
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 8,
              color: '#ffffff',
              padding: '8px 10px',
              fontSize: 11,
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </aside>
  );
}
