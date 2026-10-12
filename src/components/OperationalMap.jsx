import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Flame, 
  Tag, 
  Grid, 
  Search, 
  X,
  Compass
} from 'lucide-react';
import { AMAZONAS_DATA } from '../data/amazonasData';
import { TokenSvg } from './TokenSvg';

export function OperationalMap({
  placedTokens = [],
  selectedMuniName,
  onSelectMuni,
  onDropToken,
  onMoveToken,
  onDeleteToken,
  onEditToken,
  showArcoDoFogo = true,
  setShowArcoDoFogo,
  showLabels = true,
  setShowLabels
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Estados de Zoom e Pan
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: -100, y: -80 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Estados de Drag & Drop de Tokens já colocados no mapa
  const [draggingPlacedTokenId, setDraggingPlacedTokenId] = useState(null);
  const [dragTokenOffset, setDragTokenOffset] = useState({ x: 0, y: 0 });

  // Drag over de município
  const [hoveredMuni, setHoveredMuni] = useState(null);
  const [dragOverMuniName, setDragOverMuniName] = useState(null);

  // Busca de Município
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Tooltip
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

  // Filtragem de busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = AMAZONAS_DATA.municipalities.filter(m => 
      m.name.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
    setShowSearchDropdown(filtered.length > 0);
  }, [searchQuery]);

  // Função para centralizar no município selecionado
  const focusOnMuni = (muni) => {
    if (!muni) return;
    const targetZoom = 1.35;
    const viewportWidth = containerRef.current?.clientWidth || 1000;
    const viewportHeight = containerRef.current?.clientHeight || 700;

    const newX = viewportWidth / 2 - muni.cx * targetZoom;
    const newY = viewportHeight / 2 - muni.cy * targetZoom;

    setZoom(targetZoom);
    setPan({ x: newX, y: newY });
    onSelectMuni(muni.name);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.25, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev * 0.8, 0.4));
  const handleResetZoom = () => {
    setZoom(0.85);
    setPan({ x: -100, y: -80 });
  };

  // Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 3.5);

    // Ajusta o pan para dar zoom em direção ao cursor do mouse
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newX, y: newY });
  };

  // Pan do mapa com o mouse
  const handleMouseDown = (e) => {
    if (e.target.closest('.placed-token-group') || e.target.closest('.map-floating-controls') || e.target.closest('.map-search-bar')) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }

    // Se estiver reposicionando um token colocado
    if (draggingPlacedTokenId && svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        const svgX = (e.clientX - CTM.e) / CTM.a;
        const svgY = (e.clientY - CTM.f) / CTM.d;
        onMoveToken(draggingPlacedTokenId, Math.round(svgX - dragTokenOffset.x), Math.round(svgY - dragTokenOffset.y));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingPlacedTokenId(null);
  };

  // Drag & drop vindo da barra lateral
  const handleDragOver = (e, muniName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverMuniName !== muniName) {
      setDragOverMuniName(muniName);
    }
  };

  const handleDragLeave = (e) => {
    setDragOverMuniName(null);
  };

  const handleDrop = (e, muni) => {
    e.preventDefault();
    setDragOverMuniName(null);

    const tokenDataStr = e.dataTransfer.getData('application/json');
    if (!tokenDataStr) return;

    try {
      const tokenData = JSON.parse(tokenDataStr);
      // Converter coordenadas da tela para coordenadas do SVG
      const CTM = svgRef.current.getScreenCTM();
      let dropX = muni.cx;
      let dropY = muni.cy;

      if (CTM) {
        dropX = Math.round((e.clientX - CTM.e) / CTM.a);
        dropY = Math.round((e.clientY - CTM.f) / CTM.d);
      }

      onDropToken({
        ...tokenData,
        muni: muni.name,
        x: dropX,
        y: dropY
      });
    } catch (err) {
      console.error('Erro ao processar drop de token:', err);
    }
  };

  // Início de arrasto de token já colocado
  const handleStartMovePlacedToken = (e, token) => {
    e.stopPropagation();
    setDraggingPlacedTokenId(token.id);

    const CTM = svgRef.current.getScreenCTM();
    if (CTM) {
      const svgX = (e.clientX - CTM.e) / CTM.a;
      const svgY = (e.clientY - CTM.f) / CTM.d;
      setDragTokenOffset({
        x: svgX - token.x,
        y: svgY - token.y
      });
    }
  };

  return (
    <div 
      className={`map-viewport ${isPanning ? 'panning' : ''}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Padrão Tecnológico de Fundo */}
      <div className="tactical-grid-bg" />

      {/* Barra de Busca Rápida de Municípios */}
      <div className="map-search-bar">
        <Search size={15} color="#38bdf8" />
        <input 
          type="text"
          className="search-input-field"
          placeholder="Localizar município (ex: Manaus, Tefé, Apuí)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={() => setSearchQuery('')}
          >
            <X size={14} />
          </button>
        )}

        {showSearchDropdown && (
          <div className="search-results-dropdown" style={{ display: 'flex' }}>
            {searchResults.map(m => (
              <div 
                key={m.id} 
                className="search-result-item"
                onClick={() => focusOnMuni(m)}
              >
                <span>{m.name}</span>
                <span style={{ color: '#38bdf8', fontSize: 10 }}>{m.region_info?.macro}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controles Flutuantes do Mapa */}
      <div className="map-floating-controls">
        <div className="control-pill-group">
          <button className="ctrl-btn" onClick={handleZoomIn} title="Aproximar Mapa (+)">
            <ZoomIn size={18} />
          </button>
          <button className="ctrl-btn" onClick={handleZoomOut} title="Afastar Mapa (-)">
            <ZoomOut size={18} />
          </button>
          <button className="ctrl-btn" onClick={handleResetZoom} title="Redefinir Visão Geral">
            <Maximize2 size={16} />
          </button>
        </div>

        <div className="control-pill-group">
          <button 
            className={`ctrl-btn ${showArcoDoFogo ? 'active' : ''}`}
            onClick={() => setShowArcoDoFogo(!showArcoDoFogo)}
            title="Exibir/Ocultar Camada Tática do Arco do Fogo"
          >
            <Flame size={18} color={showArcoDoFogo ? '#ea580c' : 'currentColor'} />
          </button>

          <button 
            className={`ctrl-btn ${showLabels ? 'active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Exibir/Ocultar Nomes dos Municípios e Indicadores"
          >
            <Tag size={17} />
          </button>
        </div>
      </div>

      {/* Legenda Tática Inferior */}
      <div className="map-bottom-legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#fef08a' }} />
          <span>Capital / Solimões</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#bbf7d0' }} />
          <span>Médio Amazonas / Rio Negro</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#ddd6fe' }} />
          <span>Alto Solimões / Juruá</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#fed7aa' }} />
          <span>Sul do AM / Arco do Fogo</span>
        </div>
        {showArcoDoFogo && (
          <div className="legend-item" style={{ color: '#ea580c', fontWeight: 'bold' }}>
            <Flame size={14} />
            <span>Operação Arco do Fogo Ativa</span>
          </div>
        )}
      </div>

      {/* CANVAS SVG DO MAPA */}
      <svg 
        id="tactical-svg"
        ref={svgRef}
        viewBox="0 0 2200 1400"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <defs>
          {/* Filtros de Sombra e Brilho Tático */}
          <filter id="muni-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.7"/>
          </filter>

          <linearGradient id="arco-fire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="50%" stopColor="#ea580c"/>
            <stop offset="100%" stopColor="#dc2626"/>
          </linearGradient>

          {/* Seta do Arco do Fogo */}
          <marker id="fire-arrowhead" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto">
            <polygon points="0 0, 12 6, 0 12, 4 6" fill="#ea580c"/>
          </marker>
        </defs>

        {/* ------------------------------------------------------------------
            EFEITO 3D ISOMÉTRICO INFERIOR (BORDA DE RELEVO DA PLACA FÍSICA)
            ------------------------------------------------------------------ */}
        <g id="isometric-relief-block" opacity="0.85">
          {/* Bloco 3D que dá profundidade e volume ao sul do estado */}
          <path 
            d="M 680 1250 L 760 1290 L 1000 1260 L 1400 1180 L 1750 1220 L 1950 1080 L 1950 1140 L 1750 1280 L 1400 1240 L 1000 1320 L 760 1350 L 680 1310 Z"
            fill="#090e17" 
            stroke="#1e293b" 
            strokeWidth="2"
          />
        </g>

        {/* ------------------------------------------------------------------
            POLÍGONOS DOS 62 MUNICÍPIOS DO AMAZONAS (IBGE OFICIAL)
            ------------------------------------------------------------------ */}
        <g id="municipalities-layer">
          {AMAZONAS_DATA.municipalities.map(muni => {
            const isSelected = selectedMuniName === muni.name;
            const isDragOver = dragOverMuniName === muni.name;

            return (
              <path
                key={muni.id}
                d={muni.path}
                fill={muni.color}
                className={`municipality-polygon ${isSelected ? 'selected' : ''} ${isDragOver ? 'dragover' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMuni(muni.name);
                }}
                onDragOver={(e) => handleDragOver(e, muni.name)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, muni)}
                onMouseEnter={() => setHoveredMuni(muni)}
                onMouseLeave={() => setHoveredMuni(null)}
              >
                <title>{`${muni.name} - ${muni.region_info?.macro}`}</title>
              </path>
            );
          })}
        </g>

        {/* ------------------------------------------------------------------
            LINHAS INDICADORAS E CALLOUTS (ÁREA METROPOLITANA / DENSA)
            ------------------------------------------------------------------ */}
        {showLabels && (
          <g id="callouts-layer">
            {AMAZONAS_DATA.municipalities
              .filter(m => m.has_callout)
              .map(m => (
                <g key={`callout-${m.id}`} onClick={() => onSelectMuni(m.name)}>
                  {/* Linha indicadora amarela */}
                  <line 
                    x1={m.cx} 
                    y1={m.cy} 
                    x2={m.callout_x} 
                    y2={m.callout_y} 
                    className="callout-line"
                  />
                  {/* Ponto de fixação no município */}
                  <circle cx={m.cx} cy={m.cy} r={3.5} className="callout-dot" />
                  {/* Rótulo do município com traço externo para legibilidade máxima */}
                  <text 
                    x={m.callout_x + 6} 
                    y={m.callout_y + 4} 
                    className="callout-label"
                  >
                    {m.name}
                  </text>
                </g>
              ))}
          </g>
        )}

        {/* ------------------------------------------------------------------
            NOMES DOS MUNICÍPIOS NO CENTRO DO POLÍGONO
            ------------------------------------------------------------------ */}
        {showLabels && (
          <g id="labels-layer">
            {AMAZONAS_DATA.municipalities
              .filter(m => !m.has_callout)
              .map(m => (
                <text
                  key={`label-${m.id}`}
                  x={m.cx}
                  y={m.cy}
                  className="muni-label"
                >
                  {m.name}
                </text>
              ))}
          </g>
        )}

        {/* ------------------------------------------------------------------
            CAMADA TÁTICA: ARCO DO FOGO (SETA CURVA GLOWING OFICIAL)
            ------------------------------------------------------------------ */}
        {showArcoDoFogo && (
          <g id="arco-do-fogo-layer" className="arco-fogo-group">
            {/* Seta curva de grande porte atravessando Boca do Acre, Lábrea, Humaitá e Apuí */}
            <path
              d="M 680 1260 Q 980 1200 1390 1090 Q 1580 1090 1820 1140"
              className="arco-arrow-body"
              markerEnd="url(#fire-arrowhead)"
            />
            <path
              d="M 680 1260 Q 980 1200 1390 1090 Q 1580 1090 1820 1140"
              className="arco-arrow-core"
            />

            {/* Texto em relevo estilizado exatamente como nas fotos */}
            <g transform="translate(1330, 1180) rotate(-7)">
              <text className="arco-text-label">
                ARCO DO FOGO
              </text>
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------------
            RECURSOS E TOKENS TÁTICOS ALOCADOS (AVIÕES, HELIS, EFETIVO, BRASÕES)
            ------------------------------------------------------------------ */}
        <g id="tokens-layer">
          {placedTokens.map(token => (
            <g
              key={token.id}
              className="placed-token-group"
              transform={`translate(${token.x}, ${token.y})`}
              onMouseDown={(e) => handleStartMovePlacedToken(e, token)}
              onClick={(e) => {
                e.stopPropagation();
                onEditToken(token);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                onDeleteToken(token.id);
              }}
            >
              <title>{`${token.label || token.type} em ${token.muni || 'Amazonas'} (Clique para editar, Botão direito para remover)`}</title>
              <TokenSvg type={token.type} count={token.count} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
