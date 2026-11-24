import React, { useState, useEffect, useRef } from 'react';
import {
  Plane,
  Truck,
  Users,
  Camera,
  Download,
  Upload,
  Trash2,
  Maximize,
  Sparkles,
  Leaf,
  Share2,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Settings,
  Shield,
  Edit3,
  Layers,
  Flame,
  Tag,
  Monitor,
  Map as MapIcon,
} from 'lucide-react';

function formatRefDate(dateStr) {
  if (!dateStr) return 'Ao vivo';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function Header({
  stats,
  showEfetivo = true,
  onToggleShowEfetivo,
  showViaturas = false,
  onToggleShowViaturas,
  showArcoDoFogo = true,
  onToggleArcoDoFogo,
  showLabels = true,
  onToggleLabels,
  mapTheme = 'politico',
  onChangeMapTheme,
  onOpenRelatorio,
  onShareLink,
  onLoadRealScenario,
  onExportImage,
  onSaveMission,
  onLoadMission,
  onClearMap,
  onToggleFullscreen,
  onEnterBriefingMode,
  isSidebarOpen,
  onToggleSidebar,
  onOpenEfetivo,
  onOpenEditEfetivo = () => {},
  onOpenAeronaves,
  isHeaderOpen = true,
  onToggleHeader,
  selectedDate = null,
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const menuRef = useRef(null);
  const layersRef = useRef(null);

  const handleShareClick = () => {
    onShareLink();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (layersRef.current && !layersRef.current.contains(e.target)) {
        setIsLayersOpen(false);
      }
    };
    if (isMenuOpen || isLayersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isLayersOpen]);

  if (!isHeaderOpen) {
    return (
      <button
        className="floating-header-toggle"
        onClick={onToggleHeader}
        title="Descer Barra Superior (Painel de Comando e Indicadores)"
      >
        <ChevronDown size={16} color="#38bdf8" />
        <span>Descer Barra Superior / Indicadores</span>
      </button>
    );
  }

  // Números 100% dinâmicos sincronizados com o banco de dados
  const totalEfetivo = stats.totalEfetivo ?? 0;
  const militares = stats.militares ?? 0;
  const svOrd = stats.svOrd ?? 818;
  const opamExtra = stats.opamExtra ?? 0;
  const brigMun = stats.brigadistas ?? 0;
  const brigSema = stats.brigadistasSema ?? 0;
  const totalBrig = stats.totalBrigadistas ?? brigMun + brigSema;
  const prevfogo = stats.prevfogo ?? 0;
  const fn = stats.fn ?? 0;
  const forcasParceiras = prevfogo + fn + totalBrig;
  const capital = stats.capital ?? 0;
  const interior = stats.interior ?? 0;
  const totalAeronaves = (stats.asaFixa ?? 7) + (stats.rotativa ?? 3);
  const viaturasCount = stats.viaturas ?? 4;
  const fluvialCount = stats.fluvial ?? 1;
  const totalMeios = totalAeronaves + viaturasCount + fluvialCount;

  return (
    <header className="app-header">
      {/* Aba na borda inferior para recolher o cabeçalho com 1 clique */}
      <button
        className="header-edge-tab"
        onClick={onToggleHeader}
        title="Recolher barra superior para ampliar o mapa"
      >
        <ChevronUp size={16} color="#38bdf8" />
      </button>

      {/* 1. IDENTIDADE OFICIAL CBMAM */}
      <div className="header-left">
        <div
          className="emblem-badge emblem-official"
          title="Corpo de Bombeiros Militar do Amazonas — Comando de Bombeiros do Interior (CBI)"
        >
          <img
            src="/brasao-cbmam.png"
            alt="Brasão Oficial CBMAM"
            className="emblem-official-img"
          />
        </div>

        <div className="header-title-box">
          <div className="header-title-row">
            <h1 className="header-main-title">
              MAPA OPERACIONAL <span className="status-separator">•</span>{' '}
              INTERIOR
            </h1>
            <span className="op-status-badge">
              <span className="op-status-dot" />
              OPERAÇÃO AMAZONAS
            </span>
          </div>
          <div className="header-subtitle">
            CBMAM • CBI
            <span
              className="header-ref-pill"
              title="Data de referência sincronizada com o banco"
            >
              REF. {formatRefDate(selectedDate)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PODS EXECUTIVOS 100% DINÂMICOS */}
      <div className="header-stats-hub">
        {/* POD 1: EM ATUAÇÃO NA OPERAÇÃO */}
        <div
          className="exec-kpi-pod pod-gold"
          onClick={onOpenEfetivo}
          title={`Efetivo em atuação: ${totalEfetivo} (${capital} Capital / ${interior} Interior) • Efetivo CBMAM nos Polos: ${svOrd}`}
        >
          <div className="pod-icon-wrap">
            <Users size={15} color="#facc15" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">EM ATUAÇÃO</span>
              <span className="pod-badge">{svOrd} CBMAM</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{totalEfetivo}</span>
              <span className="pod-subdetail">
                <b>{militares}</b> OPAM ({opamExtra}) • <b>{capital}</b> Cap /{' '}
                <b>{interior}</b> Int
              </span>
            </div>
          </div>
        </div>

        {/* POD 2: FORÇAS PARCEIRAS & BRIGADAS */}
        <div
          className="exec-kpi-pod pod-forest"
          onClick={onOpenEfetivo}
          title={`Prevfogo: ${prevfogo} • Força Nacional: ${fn} • Brigadistas: ${totalBrig} (${brigMun} Mun + ${brigSema} SEMA)`}
        >
          <div className="pod-icon-wrap">
            <Leaf size={15} color="#4ade80" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">PARCEIROS & BRIGADAS</span>
              <span className="pod-badge green">{forcasParceiras} FORÇAS</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{forcasParceiras}</span>
              <span className="pod-subdetail">
                <b>{prevfogo}</b> Prevfogo • <b>{fn}</b> FN • <b>{totalBrig}</b>{' '}
                Brig.
              </span>
            </div>
          </div>
        </div>

        {/* POD 3: MEIOS OPERACIONAIS */}
        <div
          className="exec-kpi-pod pod-blue"
          onClick={onOpenAeronaves}
          title={`Meios em operação: ${totalAeronaves} Aeronaves, ${viaturasCount} Viaturas e ${fluvialCount} Fluvial`}
        >
          <div className="pod-icon-wrap">
            <Plane size={15} color="#38bdf8" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">MEIOS OPERACIONAIS</span>
              <span className="pod-badge blue">{totalAeronaves} AÉREOS</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{totalMeios}</span>
              <span className="pod-subdetail">
                <b>{totalAeronaves}</b> Aeronaves • <b>{viaturasCount}</b> VTRs
                • <b>{fluvialCount}</b> Fluvial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE COMANDO EXECUTIVA ENXUTA */}
      <div className="header-actions">
        <button
          className="btn-command btn-command-gold"
          onClick={onOpenEfetivo}
          title="Abrir Painel Completo de Efetivo e Detalhamento da Operação"
        >
          <Users size={14} />
          <span>Efetivo</span>
        </button>

        <button
          className="btn-command btn-command-emerald"
          onClick={onOpenEditEfetivo}
          title="Modificar e Atualizar Efetivo no Banco de Dados"
        >
          <Edit3 size={14} />
          <span>Editar</span>
        </button>

        <button
          className="btn-command btn-command-navy"
          onClick={onOpenRelatorio}
          title="Visualizar Relatório Operacional Oficial CBMAM"
        >
          <FileText size={14} />
          <span>Relatório</span>
        </button>

        {/* POPOVER COMPACTO DE CAMADAS & TEMA DO MAPA */}
        <div className="dropdown-container" ref={layersRef}>
          <button
            className={`btn-command btn-command-outline ${isLayersOpen ? 'open' : ''}`}
            onClick={() => {
              setIsLayersOpen(!isLayersOpen);
              setIsMenuOpen(false);
            }}
            title="Alternar tema do mapa (Político / Tático C2 / CRBM) e camadas visíveis"
          >
            <Layers size={14} color="#38bdf8" />
            <span>Camadas</span>
            <ChevronDown
              size={12}
              className={`dropdown-chevron ${isLayersOpen ? 'open' : ''}`}
            />
          </button>

          {isLayersOpen && (
            <div className="mission-dropdown-menu layers-popover">
              <div className="dropdown-header">
                <MapIcon size={11} style={{ marginRight: 5 }} />
                ESTILO DO MAPA
              </div>
              <div className="theme-segmented-control">
                <button
                  type="button"
                  className={`theme-seg-btn ${mapTheme === 'politico' ? 'active' : ''}`}
                  onClick={() => onChangeMapTheme('politico')}
                  title="Mapa político colorido por região (Padrão)"
                >
                  Político
                </button>
                <button
                  type="button"
                  className={`theme-seg-btn ${mapTheme === 'tatico' ? 'active' : ''}`}
                  onClick={() => onChangeMapTheme('tatico')}
                  title="Mapa Tático C2 escuro com destaque térmico nos municípios ativos"
                >
                  Tático C2
                </button>
                <button
                  type="button"
                  className={`theme-seg-btn ${mapTheme === 'crbm' ? 'active' : ''}`}
                  onClick={() => onChangeMapTheme('crbm')}
                  title="Colorização por Comando Regional (1º ao 4º CRBM)"
                >
                  CRBM
                </button>
              </div>

              <div className="dropdown-divider" />
              <div className="dropdown-header">CAMADAS VISÍVEIS</div>

              <button
                className="dropdown-item layer-toggle-item"
                onClick={onToggleShowEfetivo}
              >
                <Shield size={14} color={showEfetivo ? '#ef4444' : '#64748b'} />
                <div style={{ flex: 1 }}>
                  <div className="item-title">
                    Pins de Efetivo ({totalEfetivo})
                  </div>
                  <div className="item-desc">
                    Capital, Polos e Bases Temporárias
                  </div>
                </div>
                <span className={`layer-pill ${showEfetivo ? 'on' : 'off'}`}>
                  {showEfetivo ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                className="dropdown-item layer-toggle-item"
                onClick={onToggleShowViaturas}
              >
                <Truck size={14} color={showViaturas ? '#38bdf8' : '#64748b'} />
                <div style={{ flex: 1 }}>
                  <div className="item-title">Viaturas ({viaturasCount})</div>
                  <div className="item-desc">Meios terrestres posicionados</div>
                </div>
                <span className={`layer-pill ${showViaturas ? 'on' : 'off'}`}>
                  {showViaturas ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                className="dropdown-item layer-toggle-item"
                onClick={onToggleArcoDoFogo}
              >
                <Flame
                  size={14}
                  color={showArcoDoFogo ? '#f97316' : '#64748b'}
                />
                <div style={{ flex: 1 }}>
                  <div className="item-title">Corredor Arco do Fogo</div>
                  <div className="item-desc">
                    Faixa tática de monitoramento Sul-AM
                  </div>
                </div>
                <span className={`layer-pill ${showArcoDoFogo ? 'on' : 'off'}`}>
                  {showArcoDoFogo ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                className="dropdown-item layer-toggle-item"
                onClick={onToggleLabels}
              >
                <Tag size={14} color={showLabels ? '#eab308' : '#64748b'} />
                <div style={{ flex: 1 }}>
                  <div className="item-title">Nomes dos Municípios</div>
                  <div className="item-desc">Rótulos dos 62 municípios</div>
                </div>
                <span className={`layer-pill ${showLabels ? 'on' : 'off'}`}>
                  {showLabels ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                className="dropdown-item layer-toggle-item"
                onClick={onToggleSidebar}
              >
                {isSidebarOpen ? (
                  <ChevronLeft size={14} color="#38bdf8" />
                ) : (
                  <ChevronRight size={14} color="#64748b" />
                )}
                <div style={{ flex: 1 }}>
                  <div className="item-title">Painel Lateral / Filtros</div>
                  <div className="item-desc">
                    {isSidebarOpen ? 'Recolher lateral' : 'Expandir lateral'}
                  </div>
                </div>
                <span className={`layer-pill ${isSidebarOpen ? 'on' : 'off'}`}>
                  {isSidebarOpen ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* BOTÃO MODO SALA DE SITUAÇÃO / TELÃO */}
        <button
          className="btn-command btn-command-blue"
          onClick={onEnterBriefingMode}
          title="Modo Sala de Situação / Telão (apresentação limpa em tela cheia com relógio e legenda executiva)"
        >
          <Monitor size={14} />
          <span>Telão</span>
        </button>

        {/* MENU DROPDOWN: AÇÕES & EXPORTAÇÃO */}
        <div className="dropdown-container" ref={menuRef}>
          <button
            className={`btn-icon-minimal ${isMenuOpen ? 'active' : ''}`}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLayersOpen(false);
            }}
            title="Ferramentas, Exportação 4K e Backup da Missão"
          >
            <Settings size={15} />
          </button>

          {isMenuOpen && (
            <div className="mission-dropdown-menu">
              <div className="dropdown-header">OPERAÇÕES & EXPORTAÇÃO</div>

              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenAeronaves();
                  setIsMenuOpen(false);
                }}
              >
                <Plane size={14} color="#38bdf8" />
                <div>
                  <div className="item-title">
                    Onde estão as Aeronaves ({totalAeronaves})
                  </div>
                  <div className="item-desc">
                    Localização detalhada de asas fixas e Harpia
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onExportImage();
                  setIsMenuOpen(false);
                }}
              >
                <Camera size={14} color="#facc15" />
                <div>
                  <div className="item-title">Exportar PNG Executivo (4K)</div>
                  <div className="item-desc">
                    Imagem com brasão CBMAM, KPIs e legenda para slide
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  handleShareClick();
                  setIsMenuOpen(false);
                }}
              >
                {copiedLink ? (
                  <Check size={14} color="#4ade80" />
                ) : (
                  <Share2 size={14} color="#38bdf8" />
                )}
                <div>
                  <div className="item-title">
                    {copiedLink ? 'Link Copiado!' : 'Copiar Link da Missão'}
                  </div>
                  <div className="item-desc">
                    Compartilhar cenário e recursos via URL
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onLoadRealScenario();
                  setIsMenuOpen(false);
                }}
              >
                <Sparkles size={14} color="#f59e0b" />
                <div>
                  <div className="item-title">Restaurar Cenário Oficial</div>
                  <div className="item-desc">
                    Recarregar efetivo padrão da Operação Amazonas
                  </div>
                </div>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => {
                  onSaveMission();
                  setIsMenuOpen(false);
                }}
              >
                <Download size={14} color="#38bdf8" />
                <div>
                  <div className="item-title">Salvar Backup JSON</div>
                  <div className="item-desc">
                    Baixar estado completo para o computador
                  </div>
                </div>
              </button>

              <label className="dropdown-item dropdown-file-label">
                <Upload size={14} color="#818cf8" />
                <div>
                  <div className="item-title">Carregar Backup JSON</div>
                  <div className="item-desc">
                    Restaurar missão salva anteriormente
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  className="dropdown-file-input"
                  onChange={(e) => {
                    onLoadMission(e);
                    setIsMenuOpen(false);
                  }}
                />
              </label>

              <button
                className="dropdown-item"
                onClick={() => {
                  onToggleFullscreen();
                  setIsMenuOpen(false);
                }}
              >
                <Maximize size={14} color="#94a3b8" />
                <div>
                  <div className="item-title">Tela Cheia (F11)</div>
                  <div className="item-desc">Expandir janela do navegador</div>
                </div>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item danger"
                onClick={() => {
                  onClearMap();
                  setIsMenuOpen(false);
                }}
              >
                <Trash2 size={14} color="#ef4444" />
                <div>
                  <div className="item-title" style={{ color: '#ef4444' }}>
                    Limpar Recursos do Mapa
                  </div>
                  <div className="item-desc">
                    Remover todos os marcadores operacionais
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
