import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Flame,
  Tag,
  Search,
  X,
  Truck,
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
  setShowLabels,
  showViaturas = false,
  setShowViaturas,
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
  const [, setHoveredMuni] = useState(null);
  const [dragOverMuniName, setDragOverMuniName] = useState(null);

  // Busca de Município
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Mapa de recursos agrupados por município
  const muniResourcesSummary = useMemo(() => {
    const map = new Map();
    placedTokens.forEach((tk) => {
      const mName = tk.muni;
      if (!mName) return;
      if (!map.has(mName)) {
        map.set(mName, {
          muni: mName,
          totalItems: 0,
          militares: 0,
          seg: 0,
          brigadistas: 0,
          brigadistasSema: 0,
          prevfogo: 0,
          aeronaves: 0,
          viaturas: 0,
          fluvial: 0,
          tokens: [],
        });
      }
      const entry = map.get(mName);
      entry.totalItems += 1;
      entry.tokens.push(tk);

      if (
        tk.type === 'efetivo_militar' ||
        tk.type === 'efetivo' ||
        tk.type === 'serv_ord'
      ) {
        entry.militares += tk.count || 10;
      } else if (tk.type === 'efetivo_seg' || tk.type === 'seg') {
        entry.seg += tk.count || 6;
      } else if (tk.type === 'efetivo_brigadista' || tk.type === 'brigadista') {
        entry.brigadistas += tk.count || 10;
      } else if (tk.type === 'efetivo_prevfogo' || tk.type === 'prevfogo') {
        entry.prevfogo += tk.count || 10;
        entry.brigadistas += tk.count || 10;
      } else if (
        tk.type === 'efetivo_brigadista_sema' ||
        tk.type === 'brigadista_sema'
      ) {
        entry.brigadistasSema += tk.count || 10;
      } else if (
        tk.type === 'air_tractor' ||
        tk.type === 'kc390' ||
        tk.type === 'helicoptero'
      ) {
        entry.aeronaves += 1;
      } else if (tk.type && tk.type.startsWith('vtr_')) {
        entry.viaturas += 1;
      } else if (tk.type === 'embarcacao') {
        entry.fluvial += 1;
      }
    });
    return map;
  }, [placedTokens]);

  // Filtragem de busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = AMAZONAS_DATA.municipalities.filter((m) =>
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
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.25, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.8, 0.4));
  const handleResetZoom = () => {
    setZoom(0.85);
    setPan({ x: -100, y: -80 });
  };

  // Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 3.5);

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
    if (
      e.target.closest('.placed-token-group') ||
      e.target.closest('.map-floating-controls') ||
      e.target.closest('.map-search-bar')
    ) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }

    if (draggingPlacedTokenId && svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        const svgX = (e.clientX - CTM.e) / CTM.a;
        const svgY = (e.clientY - CTM.f) / CTM.d;
        onMoveToken(
          draggingPlacedTokenId,
          Math.round(svgX - dragTokenOffset.x),
          Math.round(svgY - dragTokenOffset.y)
        );
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

  const handleDragLeave = () => {
    setDragOverMuniName(null);
  };

  const handleDrop = (e, muni) => {
    e.preventDefault();
    setDragOverMuniName(null);

    const tokenDataStr = e.dataTransfer.getData('application/json');
    if (!tokenDataStr) return;

    try {
      const tokenData = JSON.parse(tokenDataStr);
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
        y: dropY,
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
        y: svgY - token.y,
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
            className="btn-icon-minimal"
            onClick={() => setSearchQuery('')}
          >
            <X size={14} />
          </button>
        )}

        {showSearchDropdown && (
          <div className="search-results-dropdown">
            {searchResults.map((m) => (
              <div
                key={m.id}
                className="search-result-item"
                onClick={() => focusOnMuni(m)}
              >
                <span>{m.name}</span>
                <span className="region-tag">{m.region_info?.macro}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controles Flutuantes do Mapa */}
      <div className="map-floating-controls">
        <div className="control-pill-group">
          <button
            className="ctrl-btn"
            onClick={handleZoomIn}
            title="Aproximar Mapa (+)"
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="ctrl-btn"
            onClick={handleZoomOut}
            title="Afastar Mapa (-)"
          >
            <ZoomOut size={18} />
          </button>
          <button
            className="ctrl-btn"
            onClick={handleResetZoom}
            title="Redefinir Visão Geral"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* CONTROLE DE EXIBIÇÃO / OCULTAÇÃO DE VIATURAS E CAMADAS */}
        <div className="control-pill-group">
          {/* NOVO ÍCONE DE VIATURA: CLICADO MOSTRA OU SOME SOMENTE ELAS */}
          <button
            className={`ctrl-btn viatura-ctrl-btn ${showViaturas ? 'active viaturas-active' : ''}`}
            onClick={() => setShowViaturas(!showViaturas)}
            title={
              showViaturas
                ? 'Ocultar Viaturas no Mapa (Clique para sumir somente elas)'
                : 'Exibir Viaturas no Mapa (Clique para mostrar as viaturas)'
            }
          >
            <Truck size={17} />
            <span className="ctrl-btn-tag">VTR</span>
          </button>

          <button
            className={`ctrl-btn ${showArcoDoFogo ? 'active' : ''}`}
            onClick={() => setShowArcoDoFogo(!showArcoDoFogo)}
            title="Exibir/Ocultar Camada Tática do Arco do Fogo"
          >
            <Flame size={17} />
          </button>

          <button
            className={`ctrl-btn ${showLabels ? 'active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Exibir/Ocultar Nomes dos Municípios"
          >
            <Tag size={17} />
          </button>
        </div>
      </div>

      {/* Legenda Tática Inferior */}
      <div className="map-bottom-legend">
        <div className="legend-item">
          <div className="legend-swatch legend-capital" />
          <span>Capital / Solimões</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-medio" />
          <span>Médio Amazonas / Rio Negro</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-alto" />
          <span>Alto Solimões / Juruá</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-sul" />
          <span>Sul do AM / Arco do Fogo</span>
        </div>
        {showArcoDoFogo && (
          <div className="legend-item legend-arco">
            <Flame size={14} />
            <span>Operação Arco do Fogo</span>
          </div>
        )}
      </div>

      {/* CANVAS SVG DO MAPA */}
      <svg
        id="tactical-svg"
        ref={svgRef}
        viewBox="0 0 2200 1400"
        className="tactical-map-svg"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <filter id="muni-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor="#38bdf8"
              floodOpacity="0.7"
            />
          </filter>

          <filter
            id="cbmam-pin-shadow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="3.5"
              stdDeviation="3.5"
              floodColor="#000000"
              floodOpacity="0.75"
            />
          </filter>

          <filter
            id="cbmam-pin-glow-gold"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="7"
              floodColor="#facc15"
              floodOpacity="0.9"
            />
          </filter>

          <linearGradient id="arco-fire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          <marker
            id="fire-arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="8"
            refY="6"
            orient="auto"
          >
            <polygon points="0 0, 12 6, 0 12, 4 6" fill="#ea580c" />
          </marker>
        </defs>

        {/* ------------------------------------------------------------------
            EFEITO 3D ISOMÉTRICO INFERIOR (BORDA DE RELEVO DA PLACA FÍSICA)
            ------------------------------------------------------------------ */}
        <g id="isometric-relief-block" opacity="0.85">
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
          {AMAZONAS_DATA.municipalities.map((muni) => {
            const isSelected = selectedMuniName === muni.name;
            const isDragOver = dragOverMuniName === muni.name;
            const summary = muniResourcesSummary.get(muni.name);
            const hasResources = summary && summary.totalItems > 0;

            return (
              <path
                key={muni.id}
                d={muni.path}
                fill={muni.color}
                className={`municipality-polygon ${isSelected ? 'selected' : ''} ${isDragOver ? 'dragover' : ''} ${hasResources ? 'has-resources' : ''}`}
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
                <title>{`${muni.name} - ${muni.region_info?.macro} ${hasResources ? `(${summary.totalItems} recursos alocados)` : ''}`}</title>
              </path>
            );
          })}
        </g>

        {/* ------------------------------------------------------------------
            NOMES DE TODOS OS 62 MUNICÍPIOS DO AMAZONAS
            ------------------------------------------------------------------ */}
        {showLabels && (
          <g id="labels-layer">
            {AMAZONAS_DATA.municipalities.map((m) => (
              <text
                key={`label-${m.id}`}
                x={m.cx}
                y={m.cy + 38}
                className="muni-label"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMuni(m.name);
                }}
              >
                {m.name}
              </text>
            ))}
          </g>
        )}

        {/* ------------------------------------------------------------------
            CAMADA TÁTICA: ARCO DO FOGO
            ------------------------------------------------------------------ */}
        {showArcoDoFogo && (
          <g id="arco-do-fogo-layer" className="arco-fogo-group">
            <path
              d="M 1820 1140 Q 1580 1090 1390 1090 Q 980 1200 680 1260"
              className="arco-arrow-body"
              markerEnd="url(#fire-arrowhead)"
            />
            <path
              d="M 1820 1140 Q 1580 1090 1390 1090 Q 980 1200 680 1260"
              className="arco-arrow-core"
            />
            <g transform="translate(1000, 1200) rotate(8)">
              <text className="arco-text-label">ARCO DO FOGO</text>
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------------
            ÍCONES OFICIAIS CBMAM E QUANTIDADE DO EFETIVO DIÁRIO
            (Estilo Militar Profissional, Ultra-Visível, 100% Estável)
            ------------------------------------------------------------------ */}
        <g id="cbmam-muni-pins">
          {AMAZONAS_DATA.municipalities.map((muni) => {
            const summary = muniResourcesSummary.get(muni.name);
            if (!summary) return null;

            const totalEfetivoDiario =
              (summary.militares || 0) +
              (summary.seg || 0) +
              (summary.brigadistas || 0) +
              (summary.brigadistasSema || 0);

            if (totalEfetivoDiario <= 0) return null;

            const isSelected = selectedMuniName === muni.name;
            const badgeWidth =
              totalEfetivoDiario >= 100
                ? 56
                : totalEfetivoDiario >= 10
                  ? 44
                  : 36;

            return (
              <g
                key={`cbmam-pin-${muni.id}`}
                className={`cbmam-pin-marker ${isSelected ? 'selected' : ''}`}
                transform={`translate(${muni.cx}, ${muni.cy - 6})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMuni(muni.name);
                }}
              >
                <title>{`${muni.name}\nEfetivo Diário: ${totalEfetivoDiario} operacionais\n• Militares CBMAM: ${(summary.militares || 0) + (summary.seg || 0)}\n• Brigadistas: ${(summary.brigadistas || 0) + (summary.brigadistasSema || 0)}\n${summary.viaturas > 0 ? `• Viaturas: ${summary.viaturas}\n` : ''}${summary.aeronaves > 0 ? `• Aeronaves: ${summary.aeronaves}\n` : ''}Clique para abrir a ficha completa do município`}</title>

                {/* Halo Dourado Estático no município selecionado (SEM animação que cause dança/vibração) */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="-14"
                    r="32"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    opacity="0.95"
                  />
                )}

                {/* 1. Base Circular Branca com Borda Vermelha Oficial (Estilo CBMAM) */}
                <circle
                  cx="0"
                  cy="-14"
                  r="24"
                  fill="#ffffff"
                  stroke={isSelected ? '#facc15' : '#dc2626'}
                  strokeWidth={isSelected ? '3.5' : '2.8'}
                  className="cbmam-pin-disc"
                  filter={
                    isSelected
                      ? 'url(#cbmam-pin-glow-gold)'
                      : 'url(#cbmam-pin-shadow)'
                  }
                />

                {/* 2. Brasão Oficial do CBMAM perfeitamente nítido e destacado */}
                <image
                  href="/brasao-cbmam.png"
                  x="-19"
                  y="-33"
                  width="38"
                  height="38"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none' }}
                />

                {/* 3. Pílula com o Efetivo Diário (Vermelho CBMAM com Borda Branca - NUNCA PRETO) */}
                <rect
                  x={-badgeWidth / 2}
                  y="10"
                  width={badgeWidth}
                  height="22"
                  rx="11"
                  fill="#dc2626"
                  stroke={isSelected ? '#facc15' : '#ffffff'}
                  strokeWidth="2.2"
                  className="cbmam-pin-pill"
                  filter="url(#cbmam-pin-shadow)"
                />

                {/* 4. Número do Efetivo Diário (Branco Brilhante em Negrito de Alto Impacto) */}
                <text
                  x="0"
                  y="25.5"
                  fontSize="12.5"
                  fontWeight="900"
                  fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                  fill="#ffffff"
                  textAnchor="middle"
                  letterSpacing="0.3"
                  style={{ pointerEvents: 'none' }}
                >
                  {totalEfetivoDiario}
                </text>
              </g>
            );
          })}
        </g>

        {/* ------------------------------------------------------------------
            CAMADA DE VIATURAS: SOMENTE APARECEM QUANDO O BOTÃO É CLICADO
            (Ao desativar o botão, apenas as viaturas somem do mapa)
            ------------------------------------------------------------------ */}
        {showViaturas && (
          <g id="viaturas-layer">
            {placedTokens
              .filter((tk) => tk.type && tk.type.startsWith('vtr_'))
              .map((token) => (
                <g
                  key={token.id}
                  className="placed-token-group viatura-token-marker"
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
                  <title>{`Viatura: ${token.label || token.type} em ${token.muni || 'Amazonas'} (Clique para editar, Botão direito para remover)`}</title>
                  <TokenSvg type={token.type} count={token.count} />
                </g>
              ))}
          </g>
        )}
      </svg>
    </div>
  );
}
