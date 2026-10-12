import React from 'react';
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
  RotateCcw,
  Sparkles,
  Leaf,
  Eye,
  EyeOff
} from 'lucide-react';

export function Header({
  stats,
  showAllTokens,
  onToggleShowAllTokens,
  onLoadRealScenario,
  onExportImage,
  onSaveMission,
  onLoadMission,
  onClearMap,
  onToggleFullscreen
}) {
  return (
    <header className="app-header">
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

      {/* Centro: Indicadores Numéricos de Prontidão (KPIs) com Militares, Brigadistas e Prevfogo */}
      <div className="header-stats">
        <div className="kpi-chip highlight-red" title="Efetivo de Bombeiros Militares CBMAM">
          <Users size={14} color="#ef4444" />
          <span className="kpi-label">Militares:</span>
          <span className="kpi-value">{stats.militares}</span>
        </div>

        <div className="kpi-chip highlight-amber" title="Brigadistas Florestais Municipais e Voluntários">
          <Users size={14} color="#f97316" />
          <span className="kpi-label">Brigadistas:</span>
          <span className="kpi-value">{stats.brigadistas}</span>
        </div>

        <div className="kpi-chip" style={{ borderColor: 'rgba(34, 197, 94, 0.5)', background: 'rgba(34, 197, 94, 0.12)' }} title="Brigadas Federais Prevfogo / IBAMA">
          <Leaf size={14} color="#22c55e" />
          <span className="kpi-label" style={{ color: '#86efac' }}>Prevfogo:</span>
          <span className="kpi-value" style={{ color: '#86efac' }}>{stats.prevfogo}</span>
        </div>

        <div className="kpi-chip" title="Aeronaves de Asa Fixa (Air Tractor + KC-390)">
          <Plane size={14} color="#facc15" />
          <span className="kpi-label">Asa Fixa:</span>
          <span className="kpi-value">{stats.asaFixa}</span>
        </div>

        <div className="kpi-chip" title="Helicópteros de Resgate e Combate (Harpia)">
          <Shield size={14} color="#a3e635" />
          <span className="kpi-label">Rotativa:</span>
          <span className="kpi-value">{stats.rotativa}</span>
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
      </div>
    </header>
  );
}
