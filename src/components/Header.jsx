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
  Eye,
  EyeOff,
  Share2,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Settings,
  Shield,
} from 'lucide-react';

export function Header({
  stats,
  showAllTokens,
  onToggleShowAllTokens,
  showEfetivo = true,
  onToggleShowEfetivo,
  showViaturas = false,
  onToggleShowViaturas,
  onOpenRelatorio,
  onShareLink,
  onLoadRealScenario,
  onExportImage,
  onSaveMission,
  onLoadMission,
  onClearMap,
  onToggleFullscreen,
  isSidebarOpen,
  onToggleSidebar,
  onOpenEfetivo,
  onOpenAeronaves,
  isHeaderOpen = true,
  onToggleHeader,
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleShareClick = () => {
    onShareLink();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Fechar menu de ferramentas se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Se a barra de cima estiver recolhida para o mapa ser visto na totalidade
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

  // Cálculos consolidados para os pods executivos
  const totalEfetivo = stats.totalEfetivo || 886;
  const militares = stats.militares || 443;
  const svOrd = stats.militares ? 211 : 211;
  const opamExtra = stats.militares ? 232 : 232;
  const brigMun = stats.brigadistas || 78;
  const brigSema = stats.brigadistasSema || 83;
  const totalBrig = stats.totalBrigadistas || 161;
  const prevfogo = stats.prevfogo || 247;
  const fn = stats.fn || 35;
  const forcasParceiras = prevfogo + fn + totalBrig; // 247 + 35 + 161 = 443
  const capital = stats.capital || 233;
  const interior = stats.interior || 653;
  const totalAeronaves = (stats.asaFixa || 7) + (stats.rotativa || 3);
  const totalMeios =
    totalAeronaves + (stats.viaturas || 4) + (stats.fluvial || 1);

  return (
    <header className="app-header">
      {/* Aba na borda inferior da barra de cima para subir/recolher com 1 clique */}
      <button
        className="header-edge-tab"
        onClick={onToggleHeader}
        title="Clique para subir a barra superior e ver o mapa na totalidade"
      >
        <ChevronUp size={16} color="#38bdf8" />
      </button>

      {/* 1. LADO ESQUERDO: IDENTIDADE OFICIAL & STATUS OPERACIONAL */}
      <div className="header-left">
        <div className="brand-emblems">
          {/* Brasão Oficial CBMAM */}
          <div
            className="emblem-badge"
            title="Corpo de Bombeiros Militar do Amazonas - Desde 1876"
          >
            <svg viewBox="0 0 100 100" width="36" height="36">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="#1e3a8a"
                stroke="#eab308"
                strokeWidth="3"
              />
              <circle cx="50" cy="50" r="38" fill="#b91c1c" />
              <polygon
                points="50,22 55,38 72,38 58,48 64,64 50,54 36,64 42,48 28,38 45,38"
                fill="#facc15"
              />
              <line
                x1="30"
                y1="30"
                x2="70"
                y2="70"
                stroke="#ffffff"
                strokeWidth="4"
              />
              <line
                x1="70"
                y1="30"
                x2="30"
                y2="70"
                stroke="#ffffff"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="8"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Brasão CBI */}
          <div
            className="emblem-badge"
            title="Comando de Bombeiros do Interior (CBI)"
          >
            <svg viewBox="0 0 100 100" width="36" height="36">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="#047857"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <circle cx="50" cy="36" r="36" fill="#f8fafc" />
              <path d="M 35 48 L 46 34 L 66 34 L 55 48 Z" fill="#facc15" />
              <circle cx="50" cy="46" r="10" fill="#dc2626" />
              <text
                x="50"
                y="74"
                fontSize="12"
                fontWeight="900"
                fill="#0f172a"
                textAnchor="middle"
              >
                CBI
              </text>
            </svg>
          </div>
        </div>

        <div className="header-title-box">
          <div className="header-title-row">
            <h1 className="header-main-title">
              MAPA OPERACIONAL <span className="status-separator">•</span>{' '}
              INTERIOR
            </h1>
            <span className="op-status-badge">
              <span className="op-status-dot"></span>
              OPERAÇÃO AMAZONAS
            </span>
          </div>
          <div className="header-subtitle">
            CBMAM • COMANDO DE BOMBEIROS DO INTERIOR (CBI)
          </div>
        </div>
      </div>

      {/* 2. CENTRO: PODS EXECUTIVOS CONSOLIDADOS (LIMPOS, ELEGANTES E PROFISSIONAIS) */}
      <div className="header-stats-hub">
        {/* POD 1: TOTAL GERAL EMPREGADO (DESTAQUE OURO / RUBRO) */}
        <div
          className="exec-kpi-pod pod-gold"
          onClick={onOpenEfetivo}
          title="Clique para abrir o Painel Completo de Efetivo e Combates Ativos (886 Operacionais: 233 Capital / 653 Interior)"
        >
          <div className="pod-icon-wrap">
            <Users size={16} color="#facc15" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">TOTAL GERAL EMPREGADO</span>
              <span className="pod-badge">OFICIAL 886</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{totalEfetivo}</span>
              <span className="pod-subdetail">
                <b>{militares}</b> Militares ({svOrd} SV ORD • {opamExtra} OPAM)
                • <b>{capital}</b> Cap / <b>{interior}</b> Int
              </span>
            </div>
          </div>
        </div>

        {/* POD 2: FORÇAS PARCEIRAS & BRIGADAS */}
        <div
          className="exec-kpi-pod pod-forest"
          onClick={onOpenEfetivo}
          title="Clique para ver detalhes do Prevfogo IBAMA (247), Força Nacional (35) e Brigadistas (161: 78 Mun + 83 SEMA)"
        >
          <div className="pod-icon-wrap">
            <Leaf size={16} color="#4ade80" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">PARCEIROS & BRIGADAS</span>
              <span className="pod-badge green">443 FORÇAS</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{forcasParceiras}</span>
              <span className="pod-subdetail">
                <b>{prevfogo}</b> Prevfogo • <b>{fn}</b> FN • <b>{totalBrig}</b>{' '}
                Brig. ({brigMun}M / {brigSema}S)
              </span>
            </div>
          </div>
        </div>

        {/* POD 3: MEIOS OPERACIONAIS (AZUL TÁTICO / AERONAVES & VTRS) */}
        <div
          className="exec-kpi-pod pod-blue"
          onClick={onOpenAeronaves}
          title="Clique para ver onde estão as 10 Aeronaves, 4 Viaturas e 1 Fluvial"
        >
          <div className="pod-icon-wrap">
            <Plane size={16} color="#38bdf8" />
          </div>
          <div className="pod-body">
            <div className="pod-top-row">
              <span className="pod-label">MEIOS OPERACIONAIS</span>
              <span className="pod-badge blue">10 AÉREOS</span>
            </div>
            <div className="pod-value-row">
              <span className="pod-hero-number">{totalMeios}</span>
              <span className="pod-subdetail">
                <b>{totalAeronaves}</b> Aeronaves (7 Fixa | 3 Harpia) •{' '}
                <b>{stats.viaturas || 4}</b> VTRs • <b>{stats.fluvial || 1}</b>{' '}
                Fluvial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LADO DIREITO: BARRA DE COMANDO ORGANIZADA & MENU DROPDOWN */}
      <div className="header-actions">
        {/* BOTÃO PRINCIPAL 1: PAINEL DE EFETIVO */}
        <button
          className="btn-command btn-command-gold"
          onClick={onOpenEfetivo}
          title="Abrir Painel Completo de Efetivo (886) e Recursos da Operação"
        >
          <Users size={14} />
          <span>Painel Efetivo</span>
        </button>

        {/* BOTÃO PRINCIPAL 2: AERONAVES */}
        <button
          className="btn-command btn-command-blue"
          onClick={onOpenAeronaves}
          title="Ver localização das 10 Aeronaves no mapa"
        >
          <Plane size={14} />
          <span>Aeronaves (10)</span>
        </button>

        {/* BOTÃO PRINCIPAL: EFETIVO (DESATIVAR/ATIVAR PONTOS NO MAPA) */}
        <button
          className={`btn-command ${showEfetivo ? 'btn-command-efetivo-on' : 'btn-command-efetivo-off'}`}
          onClick={onToggleShowEfetivo}
          title={
            showEfetivo
              ? 'Pontos de efetivo CBMAM ativos no mapa. Clique para desativar/ocultar.'
              : 'Pontos de efetivo CBMAM desativados. Clique para ativar e exibir no mapa.'
          }
        >
          <Shield size={14} />
          <span>Efetivo ({totalEfetivo})</span>
          <span
            className={`viatura-status-tag ${showEfetivo ? 'tag-on' : 'tag-off'}`}
          >
            {showEfetivo ? 'Ativo' : 'Oculto'}
          </span>
        </button>

        {/* BOTÃO PRINCIPAL: VIATURAS (NOVO ÍCONE DE VIATURAS) */}
        <button
          className={`btn-command ${showViaturas ? 'btn-command-viatura-on' : 'btn-command-viatura-off'}`}
          onClick={onToggleShowViaturas}
          title={
            showViaturas
              ? 'Viaturas visíveis no mapa. Clique para sumir somente elas.'
              : 'Viaturas ocultas no mapa. Clique para mostrar as viaturas.'
          }
        >
          <Truck size={14} />
          <span>Viaturas ({stats.viaturas || 4})</span>
          <span
            className={`viatura-status-tag ${showViaturas ? 'tag-on' : 'tag-off'}`}
          >
            {showViaturas ? 'Visíveis' : 'Ocultas'}
          </span>
        </button>

        {/* BOTÃO PRINCIPAL 3: RELATÓRIO OFICIAL */}
        <button
          className="btn-command btn-command-navy"
          onClick={onOpenRelatorio}
          title="Visualizar Tabela Oficial CBMAM e Relatório Operacional"
        >
          <FileText size={14} />
          <span>Relatório</span>
        </button>

        {/* DIVISOR VERTICAL */}
        <div className="header-divider" />

        {/* CONTROLES DE VISUALIZAÇÃO: ÍCONES E PAINEL LATERAL */}
        <div className="btn-group-toggle">
          <button
            className={`btn-toggle ${!showAllTokens ? 'active' : ''}`}
            onClick={onToggleShowAllTokens}
            title={
              showAllTokens
                ? 'Ocultar todos os ícones do mapa para foco visual'
                : 'Exibir todos os ícones espalhados no mapa'
            }
          >
            {showAllTokens ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showAllTokens ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
          </button>

          <button
            className={`btn-toggle ${!isSidebarOpen ? 'active' : ''}`}
            onClick={onToggleSidebar}
            title={
              isSidebarOpen
                ? 'Recolher barra lateral para visualizar o mapa na totalidade'
                : 'Abrir barra lateral com hangar'
            }
          >
            {isSidebarOpen ? (
              <ChevronLeft size={13} />
            ) : (
              <ChevronRight size={13} />
            )}
            <span>{isSidebarOpen ? 'Recolher Lateral' : 'Ver Lateral'}</span>
          </button>
        </div>

        {/* DIVISOR VERTICAL */}
        <div className="header-divider" />

        {/* MENU DROPDOWN: MISSÃO & FERRAMENTAS */}
        <div className="dropdown-container" ref={menuRef}>
          <button
            className={`btn-command btn-command-outline ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu de Ferramentas, Compartilhamento e Ações da Missão"
          >
            <Settings size={14} />
            <span>Missão & Ações</span>
            <ChevronDown
              size={12}
              className={`dropdown-chevron ${isMenuOpen ? 'open' : ''}`}
            />
          </button>

          {isMenuOpen && (
            <div className="mission-dropdown-menu">
              <div className="dropdown-header">GESTÃO OPERACIONAL</div>

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
                  onExportImage();
                  setIsMenuOpen(false);
                }}
              >
                <Camera size={14} color="#facc15" />
                <div>
                  <div className="item-title">Exportar Mapa em HD</div>
                  <div className="item-desc">
                    Salvar imagem PNG para briefing ou impressão
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
                  <div className="item-title">
                    Restaurar Cenário Oficial (886 Op.)
                  </div>
                  <div className="item-desc">
                    Recarregar os 886 operacionais do briefing oficial e 10
                    aeronaves
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
                  <div className="item-title">Salvar Arquivo JSON</div>
                  <div className="item-desc">
                    Baixar backup de dados para o computador
                  </div>
                </div>
              </button>

              <label className="dropdown-item dropdown-file-label">
                <Upload size={14} color="#818cf8" />
                <div>
                  <div className="item-title">Carregar Arquivo JSON</div>
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

        {/* BOTÃO TELA CHEIA */}
        <button
          className="btn-icon-minimal"
          onClick={onToggleFullscreen}
          title="Alternar Tela Cheia (F11)"
        >
          <Maximize size={15} />
        </button>
      </div>
    </header>
  );
}
