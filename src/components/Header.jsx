import React, { useState } from 'react';
import { 
  Flame, 
  Plane, 
  Shield, 
  Truck, 
  Anchor, 
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
  ChevronDown
} from 'lucide-react';

export function Header({
  stats,
  showAllTokens,
  onToggleShowAllTokens,
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
  onToggleHeader
}) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareClick = () => {
    onShareLink();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

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

      {/* Lado Esquerdo: Brasões e Título Oficial */}
      <div className="header-left">
        <div className="brand-emblems">
          {/* Brasão Oficial CBMAM */}
          <div className="emblem-badge" title="Corpo de Bombeiros Militar do Amazonas - Desde 1876">
            <svg viewBox="0 0 100 100" width="38" height="38">
              <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#eab308" strokeWidth="3"/>
              <circle cx="50" cy="50" r="38" fill="#b91c1c"/>
              <polygon points="50,22 55,38 72,38 58,48 64,64 50,54 36,64 42,48 28,38 45,38" fill="#facc15"/>
              <line x1="30" y1="30" x2="70" y2="70" stroke="#ffffff" strokeWidth="4"/>
              <line x1="70" y1="30" x2="30" y2="70" stroke="#ffffff" strokeWidth="4"/>
              <circle cx="50" cy="50" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2"/>
            </svg>
          </div>

          {/* Brasão CBI */}
          <div className="emblem-badge" title="Comando de Bombeiros do Interior (CBI)">
            <svg viewBox="0 0 100 100" width="38" height="38">
              <circle cx="50" cy="50" r="46" fill="#047857" stroke="#38bdf8" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="36" fill="#f8fafc"/>
              <path d="M 35 48 L 46 34 L 66 34 L 55 48 Z" fill="#facc15"/>
              <circle cx="50" cy="46" r="10" fill="#dc2626"/>
              <text x="50" y="74" fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">CBI</text>
            </svg>
          </div>
        </div>

        <div className="header-title-box">
          <h1 className="header-main-title">
            MAPA OPERACIONAL <span style={{ color: '#ef4444' }}>•</span> INTERIOR
          </h1>
          <div className="header-subtitle">
            CBMAM • COMANDO DE BOMBEIROS DO INTERIOR (CBI)
          </div>
        </div>
      </div>

      {/* Centro: Indicadores Numéricos de Prontidão (KPIs) Oficiais da OPERAÇÃO AMAZONAS */}
      <div className="header-stats">
        {/* SOMA TOTAL DE TUDO */}
        <div 
          className="kpi-chip highlight-gold" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer', border: '1.5px solid #eab308', background: 'rgba(234, 179, 8, 0.18)' }}
          title="Clique para ver a Soma Total de Tudo (623 operacionais) e a tabela detalhada"
        >
          <Users size={14} color="#facc15" />
          <span className="kpi-label" style={{ color: '#fef08a' }}>TOTAL EFETIVO:</span>
          <span className="kpi-value" style={{ color: '#ffffff', fontWeight: 900 }}>{stats.totalEfetivo || 623}</span>
        </div>

        <div 
          className="kpi-chip highlight-red" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer' }}
          title="Militares CBMAM - Serviço Ordinário (117 Capital + 150 Interior = 267 Total)"
        >
          <Users size={14} color="#ef4444" />
          <span className="kpi-label">SV ORD:</span>
          <span className="kpi-value">{stats.militares}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer', borderColor: 'rgba(234, 179, 8, 0.5)', background: 'rgba(234, 179, 8, 0.12)' }} 
          title="Militares CBMAM - Serviço Extraordinário Gratificado (SEG)"
        >
          <Users size={14} color="#facc15" />
          <span className="kpi-label" style={{ color: '#fde047' }}>SEG:</span>
          <span className="kpi-value" style={{ color: '#fde047' }}>{stats.seg || 0}</span>
        </div>

        <div 
          className="kpi-chip highlight-amber" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer' }}
          title="Brigadistas Florestais Municipais / Geral (Total: 197 • Inclui 134 Prevfogo/IBAMA)"
        >
          <Users size={14} color="#f97316" />
          <span className="kpi-label">Brig. Gerais:</span>
          <span className="kpi-value">{stats.brigadistas}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer', borderColor: 'rgba(34, 197, 94, 0.6)', background: 'rgba(34, 197, 94, 0.15)' }} 
          title="Prevfogo / IBAMA: 134 Brigadistas em 7 municípios (Autazes 38, Barreirinha 21, Borba 20, Careiro Várzea 18, Nova Olinda 15, Maués 14, Parintins 8)"
        >
          <Shield size={14} color="#4ade80" />
          <span className="kpi-label" style={{ color: '#86efac' }}>Prevfogo:</span>
          <span className="kpi-value" style={{ color: '#bbf7d0', fontWeight: 800 }}>{stats.prevfogo || 134}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer', borderColor: 'rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.12)' }} 
          title="Brigadistas da Secretaria de Estado do Meio Ambiente (109 Municípios + 44 Bases = 153 Total)"
        >
          <Leaf size={14} color="#10b981" />
          <span className="kpi-label" style={{ color: '#86efac' }}>Brig. SEMA:</span>
          <span className="kpi-value" style={{ color: '#86efac' }}>{stats.brigadistasSema || 0}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenEfetivo}
          style={{ cursor: 'pointer', borderColor: 'rgba(56, 189, 248, 0.5)', background: 'rgba(56, 189, 248, 0.12)' }} 
          title="Total de Brigadistas da Operação (197 Gerais + 153 SEMA = 350 Total)"
        >
          <Users size={14} color="#38bdf8" />
          <span className="kpi-label" style={{ color: '#7dd3fc' }}>Total Brig.:</span>
          <span className="kpi-value" style={{ color: '#e0f2fe', fontWeight: 800 }}>{stats.totalBrigadistas || 350}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenAeronaves}
          style={{ cursor: 'pointer', borderColor: 'rgba(2, 132, 199, 0.6)', background: 'rgba(2, 132, 199, 0.15)' }}
          title="Clique para ver a localização das 7 Aeronaves de Asa Fixa (4 Flores, 1 P. Fig, 1 Itacoatiara, 1 Parintins)"
        >
          <Plane size={14} color="#38bdf8" />
          <span className="kpi-label" style={{ color: '#7dd3fc' }}>Asa Fixa:</span>
          <span className="kpi-value" style={{ color: '#ffffff' }}>{stats.asaFixa}</span>
        </div>

        <div 
          className="kpi-chip" 
          onClick={onOpenAeronaves}
          style={{ cursor: 'pointer', borderColor: 'rgba(16, 185, 129, 0.6)', background: 'rgba(16, 185, 129, 0.15)' }}
          title="Clique para ver a localização dos 3 Helicópteros Harpia (2 Manaus, 1 Novo Airão)"
        >
          <Shield size={14} color="#34d399" />
          <span className="kpi-label" style={{ color: '#a7f3d0' }}>Rotativa:</span>
          <span className="kpi-value" style={{ color: '#ffffff' }}>{stats.rotativa}</span>
        </div>

        <div className="kpi-chip" title="Viaturas Terrestres Operacionais (ABT + 4x4 + UR)">
          <Truck size={14} color="#f87171" />
          <span className="kpi-label">Viaturas:</span>
          <span className="kpi-value">{stats.viaturas}</span>
        </div>

        <div className="kpi-chip" title="Embarcações Rápidas Fluviais">
          <Anchor size={14} color="#38bdf8" />
          <span className="kpi-label">Fluvial:</span>
          <span className="kpi-value">{stats.fluvial}</span>
        </div>

        <div className="kpi-chip highlight-amber" title="Força-tarefa total mobilizada na região do Arco do Fogo">
          <Flame size={14} color="#ea580c" />
          <span className="kpi-label">Arco Fogo:</span>
          <span className="kpi-value">{stats.arcoFogo}</span>
        </div>
      </div>

      {/* Lado Direito: Ações de Comando e Gestão */}
      <div className="header-actions">
        {/* BOTÃO SOMA TOTAL DE TUDO (EFETIVO 623) */}
        <button
          className="btn-tactical"
          onClick={onOpenEfetivo}
          title="Clique para ver a soma total de tudo e as informações referentes ao efetivo (623 operacionais)"
          style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)', borderColor: '#ef4444', color: '#ffffff', fontWeight: 800 }}
        >
          <Users size={14} color="#ffffff" />
          Soma Total (623)
        </button>

        {/* BOTÃO ONDE ESTÃO AS AERONAVES (10 AERONAVES) */}
        <button
          className="btn-tactical"
          onClick={onOpenAeronaves}
          title="Clique para ver onde estão as 10 aeronaves empregadas (7 Asa Fixa e 3 Helicópteros)"
          style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)', borderColor: '#38bdf8', color: '#ffffff', fontWeight: 800 }}
        >
          <Plane size={14} color="#facc15" />
          Aeronaves (10)
        </button>

        {/* RECOLHER / EXPANDIR BARRA LATERAL (MAPA NA TOTALIDADE) */}
        <button
          className={`btn-tactical ${!isSidebarOpen ? 'btn-accent' : ''}`}
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Recolher barra lateral para visualizar o mapa na totalidade" : "Abrir barra lateral com hangar de viaturas e contingente"}
          style={!isSidebarOpen ? { background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderColor: '#38bdf8' } : {}}
        >
          {isSidebarOpen ? (
            <>
              <ChevronLeft size={14} color="#38bdf8" />
              Recolher Lateral
            </>
          ) : (
            <>
              <ChevronRight size={14} color="#38bdf8" />
              Ver Lateral
            </>
          )}
        </button>

        {/* BOTÃO PARA ABRIR O RELATÓRIO OFICIAL DE EFETIVO */}
        <button
          className="btn-tactical btn-accent"
          onClick={onOpenRelatorio}
          title="Abrir o Relatório Oficial de Efetivo e Combates Ativos (Tabela Completa da Operação)"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', borderColor: '#3b82f6', color: '#ffffff' }}
        >
          <FileText size={14} />
          Relatório Oficial
        </button>

        {/* BOTÃO PARA OCULTAR OU EXIBIR TODOS OS ÍCONES */}
        <button
          className={`btn-tactical ${!showAllTokens ? 'btn-primary' : ''}`}
          onClick={onToggleShowAllTokens}
          title={showAllTokens ? "Ocultar todos os ícones do mapa (Clique no município para ver viaturas e efetivo)" : "Exibir todos os ícones espalhados no mapa"}
        >
          {showAllTokens ? (
            <>
              <EyeOff size={14} />
              Ocultar Ícones
            </>
          ) : (
            <>
              <Eye size={14} />
              Exibir Ícones
            </>
          )}
        </button>

        {/* COMPARTILHAR MISSÃO DIRETO PELO LINK */}
        <button
          className="btn-tactical btn-accent"
          onClick={handleShareClick}
          title="Copiar link com todas as viaturas e tropas atuais para abrir em outro PC"
        >
          {copiedLink ? (
            <>
              <Check size={14} color="#86efac" />
              Link Copiado!
            </>
          ) : (
            <>
              <Share2 size={14} />
              Copiar Link
            </>
          )}
        </button>

        <button 
          className="btn-tactical"
          onClick={onLoadRealScenario}
          title="Carregar exatamente o cenário das fotos do quadro operacional"
        >
          <Sparkles size={14} color="#facc15" />
          Cenário Real
        </button>

        <button 
          className="btn-tactical btn-accent"
          onClick={onExportImage}
          title="Exportar imagem do mapa em alta definição (PNG) para impressão ou briefing"
        >
          <Camera size={14} />
          Exportar HD
        </button>

        <button 
          className="btn-tactical"
          onClick={onSaveMission}
          title="Baixar arquivo JSON com os recursos do mapa para backup ou envio"
        >
          <Download size={14} />
          Salvar
        </button>

        <label 
          className="btn-tactical"
          style={{ margin: 0, cursor: 'pointer' }}
          title="Carregar arquivo JSON com cenário de missão previamente salvo"
        >
          <Upload size={14} />
          Carregar
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={onLoadMission}
          />
        </label>

        <button 
          className="btn-tactical btn-icon-only"
          onClick={onClearMap}
          title="Limpar todos os recursos do mapa"
        >
          <Trash2 size={15} color="#ef4444" />
        </button>

        <button 
          className="btn-tactical btn-icon-only"
          onClick={onToggleFullscreen}
          title="Modo Tela Cheia (Apresentação / Sala de Situação)"
        >
          <Maximize size={15} />
        </button>

        {/* BOTÃO PARA SUBIR A BARRA SUPERIOR (VER O MAPA NA TOTALIDADE) */}
        <button
          className="btn-tactical"
          onClick={onToggleHeader}
          title="Subir barra superior para ver o mapa na totalidade"
          style={{ background: '#090d16', borderColor: '#334155', color: '#94a3b8' }}
        >
          <ChevronUp size={14} color="#38bdf8" />
          <span>Subir Barra</span>
        </button>
      </div>
    </header>
  );
}
