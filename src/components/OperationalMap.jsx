import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Flame, 
  Tag, 
  Search, 
  X,
  Eye,
  EyeOff,
  Layers,
  MapPin,
  Users,
  Truck,
  Plane,
  Shield,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AMAZONAS_DATA } from '../data/amazonasData';
import { TokenSvg } from './TokenSvg';

// Delimitação para que o mapa NUNCA fique muito pequeno nem se perca no escuro
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 3.5;
const DEFAULT_ZOOM = 0.85;
const DEFAULT_PAN = { x: -100, y: -80 };

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
  showAllTokens = true,
  setShowAllTokens
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const hTrackRef = useRef(null);
  const vTrackRef = useRef(null);
  const isDraggingHScroll = useRef(false);
  const isDraggingVScroll = useRef(false);
  const dragScrollStart = useRef({ mouse: 0, initialPan: 0 });

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

  // Mapa de recursos agrupados por município
  const muniResourcesSummary = useMemo(() => {
    const map = new Map();
    placedTokens.forEach(tk => {
      const mName = tk.muni;
      if (!mName) return;
      if (!map.has(mName)) {
        map.set(mName, {
          muni: mName,
          totalItems: 0,
          militares: 0,
          brigadistas: 0,
          prevfogo: 0,
          aeronaves: 0,
          viaturas: 0,
          fluvial: 0,
          tokens: []
        });
      }
      const entry = map.get(mName);
      entry.totalItems += 1;
      entry.tokens.push(tk);

      if (tk.type === 'efetivo_militar' || tk.type === 'efetivo') {
        entry.militares += (tk.count || 10);
      } else if (tk.type === 'efetivo_brigadista') {
        entry.brigadistas += (tk.count || 10);
      } else if (tk.type === 'efetivo_prevfogo') {
        entry.prevfogo += (tk.count || 10);
      } else if (tk.type === 'air_tractor' || tk.type === 'kc390' || tk.type === 'helicoptero') {
        entry.aeronaves += 1;
      } else if (tk.type.startsWith('vtr_')) {
        entry.viaturas += 1;
      } else if (tk.type === 'embarcacao') {
        entry.fluvial += 1;
      }
    });
    return map;
  }, [placedTokens]);

  // Nível de zoom tático: quando zoom >= 1.12, considera-se "aproximado" (visão tática detalhada)
  const isDetailedZoom = zoom >= 1.12;

  // Decide se exibe os ícones detalhados ou o resumo compacto de visão geral
  // Mostra detalhado quando: o usuário aproximou (zoom >= 1.12) ou selecionou um município, desde que showAllTokens esteja ativo
  const shouldShowDetailedTokens = showAllTokens && (isDetailedZoom || selectedMuniName);

  // Tokens visíveis (todos ou apenas os do município selecionado)
  const visibleTokens = useMemo(() => {
    if (!showAllTokens) return [];
    if (selectedMuniName && !isDetailedZoom) {
      return placedTokens.filter(t => t.muni === selectedMuniName);
    }
    return placedTokens;
  }, [placedTokens, showAllTokens, selectedMuniName, isDetailedZoom]);

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

  // Função para limitar o pan garantindo que o mapa nunca se perca nem fique fora de visão
  const clampPan = useCallback((p, currentZoom = zoom) => {
    const W = containerRef.current?.clientWidth || 1200;
    const H = containerRef.current?.clientHeight || 800;
    const mapW = 1400 * currentZoom;
    const mapH = 950 * currentZoom;

    // Delimitações para que pelo menos uma boa parte do mapa continue sempre visível
    const minX = Math.min(0, W - mapW - 60);
    const maxX = Math.max(0, 60);
    const minY = Math.min(0, H - mapH - 60);
    const maxY = Math.max(0, 60);

    return {
      x: Math.min(Math.max(p.x, minX), maxX),
      y: Math.min(Math.max(p.y, minY), maxY)
    };
  }, [zoom]);

  const getBounds = useCallback((currentZoom = zoom) => {
    const W = containerRef.current?.clientWidth || 1200;
    const H = containerRef.current?.clientHeight || 800;
    const mapW = 1400 * currentZoom;
    const mapH = 950 * currentZoom;

    const minX = Math.min(0, W - mapW - 60);
    const maxX = Math.max(0, 60);
    const minY = Math.min(0, H - mapH - 60);
    const maxY = Math.max(0, 60);

    return { minX, maxX, minY, maxY, W, H, mapW, mapH };
  }, [zoom]);

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
    setZoom(prev => {
      const nextZoom = Math.min(prev * 1.25, MAX_ZOOM);
      setPan(p => clampPan(p, nextZoom));
      return nextZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const nextZoom = Math.max(prev * 0.8, MIN_ZOOM);
      setPan(p => clampPan(p, nextZoom));
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
      setPan(prev => clampPan({ ...prev, x: prev.x - e.deltaY * 0.8 }));
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
      const rawX = e.clientX - startPan.x;
      const rawY = e.clientY - startPan.y;
      setPan(clampPan({ x: rawX, y: rawY }));
    }

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

      {/* HUD Indicador de Nível Tático / Zoom Automático */}
      <div 
        className="map-zoom-hud"
        onClick={() => {
          if (isDetailedZoom) {
            handleResetZoom();
          } else {
            handleZoomIn();
          }
        }}
        title={isDetailedZoom ? "Clique para voltar à Visão Geral do Amazonas" : "Clique ou use a rodinha do mouse (scroll) para aproximar"}
      >
        {isDetailedZoom ? (
          <>
            <div className="hud-pulse-dot active" />
            <span className="hud-title">MODO TÁTICO DETALHADO</span>
            <span className="hud-detail">({Math.round(zoom * 100)}% zoom • Ícones ativos)</span>
            <span className="hud-action">Afastar</span>
          </>
        ) : (
          <>
            <div className="hud-pulse-dot overview" />
            <span className="hud-title">VISÃO GERAL DO ESTADO</span>
            <span className="hud-detail">(Nomes visíveis • Aproxime para ver ícones)</span>
            <span className="hud-action">Aproximar</span>
          </>
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

        {/* CONTROLE DE EXIBIÇÃO / OCULTAÇÃO DE ÍCONES */}
        <div className="control-pill-group">
          <button 
            className={`ctrl-btn ${!showAllTokens ? 'active' : ''}`}
            onClick={() => setShowAllTokens(!showAllTokens)}
            title={showAllTokens ? "Ocultar todos os ícones (Modo Limpo / Ver detalhes ao clicar)" : "Exibir todos os ícones no mapa"}
            style={{ color: !showAllTokens ? '#38bdf8' : 'currentColor' }}
          >
            {showAllTokens ? <Eye size={18} /> : <EyeOff size={18} color="#38bdf8" />}
          </button>

          <button 
            className={`ctrl-btn ${showArcoDoFogo ? 'active' : ''}`}
            onClick={() => setShowArcoDoFogo(!showArcoDoFogo)}
            title="Exibir/Ocultar Camada Tática do Arco do Fogo"
          >
            <Shield size={17} color={showArcoDoFogo ? '#ea580c' : 'currentColor'} />
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

      {/* Notificação / Banner quando os ícones estão ocultos */}
      {!showAllTokens && (
        <div style={{
          position: 'absolute',
          top: 64,
          left: 14,
          zIndex: 40,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #0284c7',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <EyeOff size={14} color="#38bdf8" />
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>
            Modo Ícones Ocultos ativo: Clique em qualquer município para ver suas viaturas e efetivo.
          </span>
          <button 
            className="btn-tactical btn-accent"
            style={{ padding: '2px 8px', fontSize: 10 }}
            onClick={() => setShowAllTokens(true)}
          >
            Exibir Todos
          </button>
        </div>
      )}

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
            <span>Operação Arco do Fogo</span>
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
          <filter id="muni-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.7"/>
          </filter>

          <linearGradient id="arco-fire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="50%" stopColor="#ea580c"/>
            <stop offset="100%" stopColor="#dc2626"/>
          </linearGradient>

          <marker id="fire-arrowhead" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto">
            <polygon points="0 0, 12 6, 0 12, 4 6" fill="#ea580c"/>
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
        <g id="isometric-relief-block" opacity="0.95">
          <path 
            d="M 680 1250 L 760 1290 L 1000 1260 L 1400 1180 L 1750 1220 L 1950 1080 L 1950 1140 L 1750 1280 L 1400 1240 L 1000 1320 L 760 1350 L 680 1310 Z"
            fill="#162944" 
            stroke="#2563eb" 
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
            const summary = muniResourcesSummary.get(muni.name);
            const hasResources = summary && summary.totalItems > 0;

            return (
              <path
                key={muni.id}
                d={muni.path}
                fill={muni.color}
                className={`municipality-polygon ${isSelected ? 'selected' : ''} ${isDragOver ? 'dragover' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMuni(muni.name);
                  if (zoom < 1.12) {
                    focusOnMuni(muni);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  focusOnMuni(muni);
                }}
                onDragOver={(e) => handleDragOver(e, muni.name)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, muni)}
                onMouseEnter={() => setHoveredMuni(muni)}
                onMouseLeave={() => setHoveredMuni(null)}
                style={{
                  cursor: 'pointer',
                  stroke: isSelected ? '#ef4444' : (hasResources ? (muni.in_arco_fogo ? '#ea580c' : '#0284c7') : '#253d5e'),
                  strokeWidth: isSelected ? '3.5px' : (hasResources ? '2.2px' : '1.3px')
                }}
              >
                <title>{`${muni.name} - ${muni.region_info?.macro} ${hasResources ? `(${summary.totalItems} recursos alocados)` : ''}`}</title>
              </path>
            );
          })}
        </g>

        {/* ------------------------------------------------------------------
            INDICADORES E CHIPS TÁTICOS (QUANDO OS ÍCONES GLOBAIS ESTÃO OCULTOS)
            ------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------
            CAMADA TÁTICA: ARCO DO FOGO
            ------------------------------------------------------------------ */}
        {showArcoDoFogo && (
          <g id="arco-do-fogo-layer" className="arco-fogo-group">
            <path
              d="M 680 1260 Q 980 1200 1390 1090 Q 1580 1090 1820 1140"
              className="arco-arrow-body"
              markerEnd="url(#fire-arrowhead)"
            />
            <path
              d="M 680 1260 Q 980 1200 1390 1090 Q 1580 1090 1820 1140"
              className="arco-arrow-core"
            />
            <g transform="translate(1330, 1180) rotate(-7)">
              <text className="arco-text-label">
                ARCO DO FOGO
              </text>
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------------
            RECURSOS E TOKENS TÁTICOS DETALHADOS (VISÍVEIS AO APROXIMAR O ZOOM)
            ------------------------------------------------------------------ */}
        {shouldShowDetailedTokens && (
          <g id="tokens-layer">
            {visibleTokens.map(token => {
              // Escala proporcional profissional (reduz de 105px para ~55-60px para visual limpo sem poluir)
              const tokenScale = 0.60;

              return (
                <g
                  key={token.id}
                  className="placed-token-group"
                  transform={`translate(${token.x}, ${token.y}) scale(${tokenScale})`}
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
              );
            })}
          </g>
        )}

        {/* ------------------------------------------------------------------
            CHIPS TÁTICOS COMPACTOS (VISÃO GERAL AFASTADA - LIMPO E ELEGANTE)
            ------------------------------------------------------------------ */}
        {!shouldShowDetailedTokens && showAllTokens && (
          <g id="muni-resource-indicators">
            {AMAZONAS_DATA.municipalities.map(muni => {
              const summary = muniResourcesSummary.get(muni.name);
              if (!summary || summary.totalItems === 0) return null;
              const isSelected = selectedMuniName === muni.name;
              const totalOp = summary.militares + summary.brigadistas + summary.prevfogo;
              const hasAero = summary.aeronaves > 0;
              const chipWidth = hasAero ? 68 : 48;

              let dotColor = '#ef4444';
              if (summary.militares === 0 && summary.brigadistas > 0) dotColor = '#f97316';
              else if (summary.militares === 0 && summary.prevfogo > 0) dotColor = '#10b981';

              return (
                <g 
                  key={`ind-${muni.id}`}
                  transform={`translate(${muni.cx}, ${muni.cy + 17})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusOnMuni(muni);
                  }}
                  style={{ cursor: 'pointer' }}
                  className="tactical-overview-chip"
                >
                  <title>{`${muni.name}: ${totalOp > 0 ? `${totalOp} operacionais` : `${summary.totalItems} recursos`} ${hasAero ? `• ${summary.aeronaves} aeronaves` : ''} (Clique para aproximar o mapa)`}</title>
                  
                  {/* Pílula de fundo com efeito vidro tático */}
                  <rect
                    x={-chipWidth / 2}
                    y="-10"
                    width={chipWidth}
                    height="20"
                    rx="10"
                    fill={isSelected ? '#ef4444' : 'rgba(15, 23, 42, 0.94)'}
                    stroke={isSelected ? '#ffffff' : (muni.in_arco_fogo ? '#f97316' : '#38bdf8')}
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.5))"
                  />

                  {/* Ponto de status LED */}
                  <circle cx={-chipWidth / 2 + 8} cy="0" r="3.5" fill={isSelected ? '#ffffff' : dotColor} />
                  
                  {/* Contador numérico de efetivo */}
                  <text
                    x={hasAero ? -chipWidth / 2 + 25 : 4}
                    y="3.5"
                    fontSize="10"
                    fontWeight="900"
                    fontFamily="'Inter', system-ui, sans-serif"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {totalOp > 0 ? `${totalOp}` : `${summary.totalItems}`}
                  </text>

                  {/* Se tiver aeronave, ícone de avião */}
                  {hasAero && (
                    <text
                      x={chipWidth / 2 - 13}
                      y="3.5"
                      fontSize="9"
                      fontWeight="900"
                      fontFamily="'Inter', system-ui, sans-serif"
                      fill="#facc15"
                      textAnchor="middle"
                    >
                      ✈{summary.aeronaves}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ------------------------------------------------------------------
            NOMES DE TODOS OS 62 MUNICÍPIOS DO AMAZONAS
            (Sempre visíveis automaticamente com máxima legibilidade e halo)
            ------------------------------------------------------------------ */}
        {showLabels && (
          <g id="labels-layer">
            {AMAZONAS_DATA.municipalities.map(m => {
              const isSelected = selectedMuniName === m.name;
              const summary = muniResourcesSummary.get(m.name);
              const hasResources = summary && summary.totalItems > 0;
              // Na visão geral, desloca levemente para cima se tiver chip de recursos abaixo
              const textY = (!shouldShowDetailedTokens && hasResources) ? m.cy - 5 : m.cy;

              return (
                <text
                  key={`label-${m.id}`}
                  x={m.cx}
                  y={textY}
                  className={`muni-label ${isSelected ? 'selected' : ''} ${hasResources ? 'has-deployed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMuni(m.name);
                    if (zoom < 1.12) {
                      focusOnMuni(m);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {m.name}
                </text>
              );
            })}
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
