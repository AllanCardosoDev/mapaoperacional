import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Flame,
  Tag,
  Search,
  X,
  Truck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { AMAZONAS_DATA } from '../data/amazonasData';
import { TokenSvg } from './TokenSvg';

// Delimitação para que o mapa NUNCA fique muito pequeno nem se perca no escuro
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 3.5;
const DEFAULT_ZOOM = 0.85;
const DEFAULT_PAN = { x: -100, y: -80 };

// Micro-afastamento para evitar sobreposição total na região metropolitana densa (Manaus e vizinhos)
// quando o mapa está em visão estadual afastada (zoom < 1.15).
// Conforme o operador aproxima o zoom, este offset decresce suavemente até 0.
const METRO_CLUSTER_OFFSETS = {
  Manaus: { x: 0, y: -20 },
  Iranduba: { x: -24, y: 2 },
  'Careiro da Várzea': { x: 26, y: -6 },
  'Careiro Castanho': { x: 6, y: 26 },
  Careiro: { x: 6, y: 26 },
  Manaquiri: { x: -26, y: 24 },
  Autazes: { x: 30, y: 24 },
  Manacapuru: { x: -24, y: -16 },
  'Rio Preto da Eva': { x: 18, y: -18 },
  'Presidente Figueiredo': { x: 0, y: -20 },
  Itacoatiara: { x: 18, y: 12 },
  Caapiranga: { x: -16, y: 8 },
  Anamã: { x: -14, y: 20 },
  Anori: { x: -8, y: 22 },
  Beruri: { x: 8, y: 24 },
};

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
  const hTrackRef = useRef(null);
  const vTrackRef = useRef(null);
  const isDraggingHScroll = useRef(false);
  const isDraggingVScroll = useRef(false);
  const dragScrollStart = useRef({ mouse: 0, initialPan: 0 });

  // Estados de Zoom e Pan
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pan, setPan] = useState(DEFAULT_PAN);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Dimensões dinâmicas do container do mapa (atualizado com ResizeObserver)
  const [viewportDims, setViewportDims] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth - 290 : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight - 70 : 800,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setViewportDims({
          width: containerRef.current.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200),
          height: containerRef.current.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800),
        });
      }
    };
    updateSize();
    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateSize);
      observer.observe(containerRef.current);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
    }
    return () => {
      if (observer) observer.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateSize);
      }
    };
  }, []);

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
      let mName = tk.muni;
      if (!mName) return;
      if (mName === 'Careiro') mName = 'Careiro Castanho';
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

  // Função para limitar o pan garantindo que o mapa nunca se perca nem fique fora de visão
  const clampPan = useCallback((p, currentZoom = zoom) => {
    const W = containerRef.current?.clientWidth || viewportDims.width || 1200;
    const H = containerRef.current?.clientHeight || viewportDims.height || 800;
    const mapW = 1400 * currentZoom;
    const mapH = 950 * currentZoom;

    // Delimitações para que pelo menos uma boa parte do mapa continue sempre visível
    const minX = Math.min(0, W - mapW - 60);
    const maxX = Math.max(0, 60);
    const minY = Math.min(0, H - mapH - 60);
    const maxY = Math.max(0, 60);

    return {
      x: Math.min(Math.max(p.x, minX), maxX),
      y: Math.min(Math.max(p.y, minY), maxY),
    };
  }, [zoom, viewportDims]);

  const getBounds = useCallback((currentZoom = zoom) => {
    const W = containerRef.current?.clientWidth || viewportDims.width || 1200;
    const H = containerRef.current?.clientHeight || viewportDims.height || 800;
    const mapW = 1400 * currentZoom;
    const mapH = 950 * currentZoom;

    const minX = Math.min(0, W - mapW - 60);
    const maxX = Math.max(0, 60);
    const minY = Math.min(0, H - mapH - 60);
    const maxY = Math.max(0, 60);

    return { minX, maxX, minY, maxY, W, H, mapW, mapH };
  }, [zoom, viewportDims]);

  // Cálculos das dimensões e posições das barras de rolagem
  const bounds = getBounds(zoom);
  const totalRangeX = bounds.maxX - bounds.minX;
  const totalRangeY = bounds.maxY - bounds.minY;

  // Tamanho proporcional da thumb (quanto maior o mapa em relação à tela, menor a thumb, com limites confortáveis)
  const thumbWidthPercent = totalRangeX > 0 
    ? Math.max(14, Math.min(80, (bounds.W / (bounds.mapW + 120)) * 100))
    : 100;

  const thumbHeightPercent = totalRangeY > 0 
    ? Math.max(14, Math.min(80, (bounds.H / (bounds.mapH + 120)) * 100))
    : 100;

  // Progresso do scroll (0 = extremo esquerdo/topo, 1 = extremo direito/fundo)
  const progressX = totalRangeX > 0 
    ? Math.min(1, Math.max(0, (bounds.maxX - pan.x) / totalRangeX))
    : 0;

  const progressY = totalRangeY > 0 
    ? Math.min(1, Math.max(0, (bounds.maxY - pan.y) / totalRangeY))
    : 0;

  const thumbLeftPercent = progressX * (100 - thumbWidthPercent);
  const thumbTopPercent = progressY * (100 - thumbHeightPercent);

  // Nudge em X ou Y através dos botões de seta da barra
  const handleNudgeX = (direction) => {
    const step = 90;
    setPan(prev => clampPan({ ...prev, x: prev.x + (direction === 'left' ? step : -step) }));
  };

  const handleNudgeY = (direction) => {
    const step = 90;
    setPan(prev => clampPan({ ...prev, y: prev.y + (direction === 'up' ? step : -step) }));
  };

  // Clique no track horizontal
  const handleHTrackClick = (e) => {
    if (e.target.closest('.map-scroll-thumb-h') || !hTrackRef.current) return;
    const rect = hTrackRef.current.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newX = bounds.maxX - clickRatio * totalRangeX;
    setPan(prev => clampPan({ ...prev, x: newX }));
  };

  // Clique no track vertical
  const handleVTrackClick = (e) => {
    if (e.target.closest('.map-scroll-thumb-v') || !vTrackRef.current) return;
    const rect = vTrackRef.current.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newY = bounds.maxY - clickRatio * totalRangeY;
    setPan(prev => clampPan({ ...prev, y: newY }));
  };

  // Início do arrasto da thumb horizontal
  const handleHThumbMouseDown = (e) => {
    e.stopPropagation();
    isDraggingHScroll.current = true;
    dragScrollStart.current = {
      mouse: e.clientX,
      initialPan: pan.x
    };
  };

  // Início do arrasto da thumb vertical
  const handleVThumbMouseDown = (e) => {
    e.stopPropagation();
    isDraggingVScroll.current = true;
    dragScrollStart.current = {
      mouse: e.clientY,
      initialPan: pan.y
    };
  };

  // Listener global para arrastar os botões das barras de rolagem fluidamente
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingHScroll.current && hTrackRef.current) {
        const deltaMouse = e.clientX - dragScrollStart.current.mouse;
        const trackW = hTrackRef.current.clientWidth;
        const availablePx = trackW * (1 - thumbWidthPercent / 100);
        if (availablePx > 0 && totalRangeX > 0) {
          const deltaPan = (deltaMouse / availablePx) * totalRangeX;
          const targetPanX = dragScrollStart.current.initialPan - deltaPan;
          setPan(prev => clampPan({ ...prev, x: targetPanX }));
        }
      } else if (isDraggingVScroll.current && vTrackRef.current) {
        const deltaMouse = e.clientY - dragScrollStart.current.mouse;
        const trackH = vTrackRef.current.clientHeight;
        const availablePx = trackH * (1 - thumbHeightPercent / 100);
        if (availablePx > 0 && totalRangeY > 0) {
          const deltaPan = (deltaMouse / availablePx) * totalRangeY;
          const targetPanY = dragScrollStart.current.initialPan - deltaPan;
          setPan(prev => clampPan({ ...prev, y: targetPanY }));
        }
      }
    };

    const handleGlobalMouseUp = () => {
      isDraggingHScroll.current = false;
      isDraggingVScroll.current = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [thumbWidthPercent, thumbHeightPercent, totalRangeX, totalRangeY, clampPan]);

  // Função para centralizar no município selecionado
  const focusOnMuni = (muni) => {
    if (!muni) return;
    const targetZoom = 1.35;
    const viewportWidth = containerRef.current?.clientWidth || 1000;
    const viewportHeight = containerRef.current?.clientHeight || 700;

    const newX = viewportWidth / 2 - muni.cx * targetZoom;
    const newY = viewportHeight / 2 - muni.cy * targetZoom;

    setZoom(targetZoom);
    setPan(clampPan({ x: newX, y: newY }, targetZoom));
    onSelectMuni(muni.name);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  // Zoom controls delimitados para que NUNCA fique muito pequeno nem se perca
  const handleZoomIn = () => {
    setZoom((prev) => {
      const nextZoom = Math.min(prev * 1.25, MAX_ZOOM);
      setPan((p) => clampPan(p, nextZoom));
      return nextZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const nextZoom = Math.max(prev * 0.8, MIN_ZOOM);
      setPan((p) => clampPan(p, nextZoom));
      return nextZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(DEFAULT_ZOOM);
    setPan(clampPan(DEFAULT_PAN, DEFAULT_ZOOM));
  };

  // Wheel Zoom delimitado
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.shiftKey) {
      setPan((prev) => clampPan({ ...prev, x: prev.x - e.deltaY * 0.8 }));
      return;
    }
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, MIN_ZOOM), MAX_ZOOM);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan(clampPan({ x: newX, y: newY }, newZoom));
  };

  // Pan do mapa com o mouse
  const handleMouseDown = (e) => {
    if (
      e.target.closest('.placed-token-group') ||
      e.target.closest('.map-floating-controls') ||
      e.target.closest('.map-search-bar') ||
      e.target.closest('.map-scrollbar-horizontal') ||
      e.target.closest('.map-scrollbar-vertical') ||
      e.target.closest('.map-bottom-legend') ||
      e.target.closest('.tactical-hud-pill')
    ) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan(
        clampPan({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        })
      );
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

  // Escala adaptativa dinâmica: mantém os pins visíveis com tamanho agradável na tela (~32px a 40px).
  // Conforme o operador aproxima o zoom, o mapa expande por baixo enquanto os pins diminuem proporcionalmente no SVG,
  // permitindo que os municípios se separem fluidamente na tela (estilo SIGDP / Google Maps).
  const pinScale = Math.min(1.0, Math.max(0.36, 0.76 / Math.pow(zoom, 0.78)));

  // Fator de dispersão para o aglomerado metropolitano de Manaus:
  // Em visão estadual distante (zoom < 1.15), aplica suave micro-afastamento para evitar sobreposição total.
  // Conforme o zoom aproxima (zoom >= 1.2), os pins convergem com precisão aos centróides geográficos.
  const clusterSpread = Math.max(0, Math.min(1, (1.2 - zoom) / 0.35));

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
        className={`tactical-map-svg ${isPanning ? 'is-dragging' : ''}`}
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
            GRID GEODÉSICO TÁTICO & COORDENADAS CARTOGRÁFICAS (SALA DE SITUAÇÃO)
            ------------------------------------------------------------------ */}
        <g id="geodetic-grid" opacity="0.38" pointerEvents="none">
          {/* Paralelos (Latitude) */}
          <line x1="60" y1="160" x2="2140" y2="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="80" y="152" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">02° 00' N</text>

          <line x1="60" y1="385" x2="2140" y2="385" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="8 4" />
          <text x="80" y="377" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="900">00° 00' EQUADOR</text>

          <line x1="60" y1="610" x2="2140" y2="610" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="80" y="602" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">02° 00' S</text>

          <line x1="60" y1="835" x2="2140" y2="835" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="80" y="827" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">04° 00' S</text>

          <line x1="60" y1="1060" x2="2140" y2="1060" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="80" y="1052" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">06° 00' S</text>

          <line x1="60" y1="1285" x2="2140" y2="1285" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="80" y="1277" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">08° 00' S</text>

          {/* Meridianos (Longitude) */}
          <line x1="210" y1="80" x2="210" y2="1340" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="215" y="1335" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">72° 00' W</text>

          <line x1="705" y1="80" x2="705" y2="1340" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="710" y="1335" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">68° 00' W</text>

          <line x1="1200" y1="80" x2="1200" y2="1340" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="1205" y="1335" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">64° 00' W</text>

          <line x1="1695" y1="80" x2="1695" y2="1340" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="8 4" />
          <text x="1700" y="1335" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="900">60° 00' W (MANAUS)</text>

          <line x1="2140" y1="80" x2="2140" y2="1340" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" />
          <text x="2070" y="1335" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">56° 00' W</text>
        </g>

        {/* Rosa dos Ventos Tática */}
        <g id="tactical-compass" transform="translate(140, 200)" pointerEvents="none" opacity="0.8">
          <circle cx="0" cy="0" r="42" fill="none" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1.5" strokeDasharray="3 3"/>
          <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1"/>
          {/* Pontas da Estrela */}
          <polygon points="0,-46 7,-12 0,-8" fill="#ef4444"/>
          <polygon points="0,-46 -7,-12 0,-8" fill="#b91c1c"/>
          <polygon points="0,46 7,12 0,8" fill="#38bdf8"/>
          <polygon points="0,46 -7,12 0,8" fill="#0284c7"/>
          <polygon points="46,0 12,7 8,0" fill="#38bdf8"/>
          <polygon points="46,0 12,-7 8,0" fill="#0284c7"/>
          <polygon points="-46,0 -12,7 -8,0" fill="#38bdf8"/>
          <polygon points="-46,0 -12,-7 -8,0" fill="#0284c7"/>
          {/* Rótulos de Orientação */}
          <text x="0" y="-52" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="900" fontFamily="sans-serif">N</text>
          <text x="56" y="4" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">L</text>
          <text x="0" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">S</text>
          <text x="-56" y="4" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">O</text>
          <circle cx="0" cy="0" r="3" fill="#ffffff"/>
        </g>

        {/* Régua de Escala Cartográfica */}
        <g id="cartographic-scale" transform="translate(80, 1345)" pointerEvents="none" opacity="0.85">
          <rect x="0" y="0" width="180" height="6" fill="#1b2e48" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1"/>
          <rect x="0" y="0" width="45" height="6" fill="#38bdf8"/>
          <rect x="90" y="0" width="45" height="6" fill="#38bdf8"/>
          <line x1="0" y1="-3" x2="0" y2="9" stroke="#38bdf8" strokeWidth="1.5"/>
          <line x1="90" y1="-3" x2="90" y2="9" stroke="#38bdf8" strokeWidth="1.5"/>
          <line x1="180" y1="-3" x2="180" y2="9" stroke="#38bdf8" strokeWidth="1.5"/>
          <text x="0" y="-6" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold">0</text>
          <text x="90" y="-6" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold">100 km</text>
          <text x="180" y="-6" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold">200 km</text>
          <text x="90" y="20" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="1">ESCALA CARTOGRÁFICA</text>
        </g>

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
            {AMAZONAS_DATA.municipalities.map((m) => {
              const summary = muniResourcesSummary.get(m.name);
              const totalEfetivoDiario = summary
                ? (summary.militares || 0) +
                  (summary.seg || 0) +
                  (summary.brigadistas || 0) +
                  (summary.brigadistasSema || 0)
                : 0;
              const hasPin = totalEfetivoDiario > 0;

              const offset = METRO_CLUSTER_OFFSETS[m.name] || { x: 0, y: 0 };
              const labelX = m.cx + (hasPin ? offset.x * clusterSpread : 0);
              const labelY = hasPin
                ? m.cy - 6 + offset.y * clusterSpread + (22 * pinScale + 12)
                : m.cy + 4;

              const labelFontSize = Math.max(
                8.5,
                Math.min(12, 10.5 / Math.pow(zoom, 0.35))
              );

              return (
                <text
                  key={`label-${m.id}`}
                  x={labelX}
                  y={labelY}
                  style={{ fontSize: `${labelFontSize}px` }}
                  className={`muni-label ${hasPin ? 'with-pin' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMuni(m.name);
                  }}
                >
                  {m.name}
                </text>
              );
            })}
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
                ? 54
                : totalEfetivoDiario >= 10
                  ? 42
                  : 34;

            const offset = METRO_CLUSTER_OFFSETS[muni.name] || { x: 0, y: 0 };
            const pinX = muni.cx + offset.x * clusterSpread;
            const pinY = muni.cy - 6 + offset.y * clusterSpread;

            return (
              <g
                key={`cbmam-pin-${muni.id}`}
                className={`cbmam-pin-marker ${isSelected ? 'selected' : ''}`}
                transform={`translate(${pinX}, ${pinY}) scale(${pinScale})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMuni(muni.name);
                }}
              >
                <title>{`${muni.name}\nEfetivo Diário: ${totalEfetivoDiario} operacionais\n• Militares CBMAM: ${(summary.militares || 0) + (summary.seg || 0)}\n• Brigadistas: ${(summary.brigadistas || 0) + (summary.brigadistasSema || 0)}\n${summary.viaturas > 0 ? `• Viaturas: ${summary.viaturas}\n` : ''}${summary.aeronaves > 0 ? `• Aeronaves: ${summary.aeronaves}\n` : ''}Clique para abrir a ficha completa do município`}</title>

                {/* Halo Dourado Estático no município selecionado */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="-14"
                    r="30"
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
                  r="22"
                  fill="#ffffff"
                  stroke={isSelected ? '#facc15' : '#dc2626'}
                  strokeWidth={isSelected ? '3.5' : '2.5'}
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
                  x="-17"
                  y="-31"
                  width="34"
                  height="34"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none' }}
                />

                {/* 3. Pílula com o Efetivo Diário (Vermelho CBMAM com Borda Branca) */}
                <rect
                  x={-badgeWidth / 2}
                  y="7"
                  width={badgeWidth}
                  height="20"
                  rx="10"
                  fill="#dc2626"
                  stroke={isSelected ? '#facc15' : '#ffffff'}
                  strokeWidth="2"
                  className="cbmam-pin-pill"
                  filter="url(#cbmam-pin-shadow)"
                />

                {/* 4. Número do Efetivo Diário (Branco Brilhante em Negrito de Alto Impacto) */}
                <text
                  x="0"
                  y="21"
                  fontSize="12"
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

      {/* BARRA DE ROLAGEM HORIZONTAL DO MAPA */}
      <div className="map-scrollbar-horizontal" title="Barra de rolagem horizontal do mapa">
        <button 
          type="button"
          className="map-scroll-nudge-btn" 
          onClick={() => handleNudgeX('left')} 
          title="Mover mapa para a direita"
        >
          <ChevronLeft size={13} />
        </button>
        <div 
          className="map-scroll-track-h" 
          ref={hTrackRef} 
          onClick={handleHTrackClick}
          title="Clique na barra para navegar horizontalmente"
        >
          <div 
            className="map-scroll-thumb-h" 
            style={{ 
              width: `${thumbWidthPercent}%`, 
              left: `${thumbLeftPercent}%` 
            }}
            onMouseDown={handleHThumbMouseDown}
            title="Arraste para rolar o mapa horizontalmente"
          />
        </div>
        <button 
          type="button"
          className="map-scroll-nudge-btn" 
          onClick={() => handleNudgeX('right')} 
          title="Mover mapa para a esquerda"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* BARRA DE ROLAGEM VERTICAL DO MAPA */}
      <div className="map-scrollbar-vertical" title="Barra de rolagem vertical do mapa">
        <button 
          type="button"
          className="map-scroll-nudge-btn" 
          onClick={() => handleNudgeY('up')} 
          title="Mover mapa para baixo"
        >
          <ChevronUp size={13} />
        </button>
        <div 
          className="map-scroll-track-v" 
          ref={vTrackRef} 
          onClick={handleVTrackClick}
          title="Clique na barra para navegar verticalmente"
        >
          <div 
            className="map-scroll-thumb-v" 
            style={{ 
              height: `${thumbHeightPercent}%`, 
              top: `${thumbTopPercent}%` 
            }}
            onMouseDown={handleVThumbMouseDown}
            title="Arraste para rolar o mapa verticalmente"
          />
        </div>
        <button 
          type="button"
          className="map-scroll-nudge-btn" 
          onClick={() => handleNudgeY('down')} 
          title="Mover mapa para cima"
        >
          <ChevronDown size={13} />
        </button>
      </div>
    </div>
  );
}
