import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TacticalSidebar } from './components/TacticalSidebar';
import { OperationalMap } from './components/OperationalMap';
import { MunicipalityDrawer } from './components/MunicipalityDrawer';
import { TokenEditModal } from './components/TokenEditModal';
import { AMAZONAS_DATA } from './data/amazonasData';
import { INITIAL_REAL_SCENARIO } from './data/tacticalAssets';
import { exportSvgToPng } from './utils/exportMap';

const STORAGE_KEY_TOKENS = 'cbmam_operational_tokens_v2';
const STORAGE_KEY_STATUSES = 'cbmam_muni_statuses_v2';
const STORAGE_KEY_NOTES = 'cbmam_muni_notes_v2';

export default function App() {
  // Estado dos recursos posicionados no mapa
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOKENS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erro ao ler localStorage', e);
    }
    return INITIAL_REAL_SCENARIO;
  });

  // Status de cada município
  const [muniStatuses, setMuniStatuses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'Manaus': 'normal',
      'Presidente Figueiredo': 'normal',
      'Itacoatiara': 'normal',
      'Parintins': 'normal',
      'Humaitá': 'arco_fogo',
      'Lábrea': 'arco_fogo',
      'Boca do Acre': 'arco_fogo',
      'Apuí': 'arco_fogo'
    };
  });

  // Notas operacionais de cada município
  const [muniNotes, setMuniNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Município atualmente selecionado
  const [selectedMuniName, setSelectedMuniName] = useState(null);

  // Token sendo editado no modal
  const [editingToken, setEditingToken] = useState(null);

  // Camadas táticas ativas
  const [showArcoDoFogo, setShowArcoDoFogo] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // NOVO: Controle de visibilidade de todos os ícones no mapa
  const [showAllTokens, setShowAllTokens] = useState(true);

  // Persistência automática no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(tokens));
    } catch (e) {}
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(muniStatuses));
    } catch (e) {}
  }, [muniStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(muniNotes));
    } catch (e) {}
  }, [muniNotes]);

  // Município selecionado objeto
  const selectedMuni = useMemo(() => {
    if (!selectedMuniName) return null;
    return AMAZONAS_DATA.municipalities.find(m => m.name === selectedMuniName) || null;
  }, [selectedMuniName]);

  // Tokens do município selecionado
  const selectedMuniTokens = useMemo(() => {
    if (!selectedMuniName) return [];
    return tokens.filter(t => t.muni === selectedMuniName);
  }, [tokens, selectedMuniName]);

  // Lista de municípios com recursos para a barra lateral
  const deployedMunis = useMemo(() => {
    const map = new Map();
    tokens.forEach(tk => {
      const mName = tk.muni || 'Outros';
      if (!map.has(mName)) {
        const muniObj = AMAZONAS_DATA.municipalities.find(m => m.name === mName);
        map.set(mName, {
          name: mName,
          count: 0,
          inArco: muniObj ? muniObj.in_arco_fogo : false
        });
      }
      map.get(mName).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [tokens]);

  // Estatísticas e KPIs em tempo real por categoria (Militares, Brigadistas, Prevfogo)
  const stats = useMemo(() => {
    let militares = 0;
    let brigadistas = 0;
    let prevfogo = 0;
    let asaFixa = 0;
    let rotativa = 0;
    let viaturas = 0;
    let fluvial = 0;
    let arcoFogo = 0;

    tokens.forEach(t => {
      const muniObj = AMAZONAS_DATA.municipalities.find(m => m.name === t.muni);
      const isArco = muniObj?.in_arco_fogo;

      if (t.type === 'efetivo_militar' || t.type === 'efetivo') {
        const c = t.count || 10;
        militares += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_brigadista') {
        const c = t.count || 10;
        brigadistas += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_prevfogo') {
        const c = t.count || 10;
        prevfogo += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'air_tractor' || t.type === 'kc390') {
        asaFixa += 1;
        if (isArco) arcoFogo += 1;
      } else if (t.type === 'helicoptero') {
        rotativa += 1;
        if (isArco) arcoFogo += 1;
      } else if (t.type === 'vtr_abt' || t.type === 'vtr_florestal' || t.type === 'vtr_ur') {
        viaturas += 1;
        if (isArco) arcoFogo += 1;
      } else if (t.type === 'embarcacao') {
        fluvial += 1;
        if (isArco) arcoFogo += 1;
      }
    });

    return { 
      militares, 
      brigadistas, 
      prevfogo, 
      totalEfetivo: militares + brigadistas + prevfogo,
      asaFixa, 
      rotativa, 
      viaturas, 
      fluvial, 
      arcoFogo 
    };
  }, [tokens]);

  // Início do Drag a partir da Barra Lateral
  const handleDragStartToken = (e, tokenInfo) => {
    e.dataTransfer.setData('application/json', JSON.stringify(tokenInfo));
  };

  // Drop no Mapa
  const handleDropToken = (dropData) => {
    const newToken = {
      id: `tk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: dropData.type,
      muni: dropData.muni,
      x: dropData.x,
      y: dropData.y,
      count: dropData.count,
      label: dropData.label || dropData.type
    };
    setTokens(prev => [...prev, newToken]);
  };

  // Mover Token já posicionado
  const handleMoveToken = (id, newX, newY) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x: newX, y: newY } : t));
  };

  // Excluir Token
  const handleDeleteToken = (id) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };

  // Duplicar Token
  const handleDuplicateToken = (token) => {
    const duplicated = {
      ...token,
      id: `tk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: token.x + 25,
      y: token.y + 25
    };
    setTokens(prev => [...prev, duplicated]);
  };

  // Salvar alterações de Token (via modal)
  const handleSaveTokenChanges = (updated) => {
    setTokens(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  // Adicionar Token via Drawer do Município
  const handleAddTokenToMuni = (muni, tokenInfo) => {
    const countInMuni = tokens.filter(t => t.muni === muni.name).length;
    const offsetX = (countInMuni % 4) * 35 - 35;
    const offsetY = Math.floor(countInMuni / 4) * 35;

    const newToken = {
      id: `tk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: tokenInfo.type,
      muni: muni.name,
      x: Math.round(muni.cx + offsetX),
      y: Math.round(muni.cy + offsetY),
      count: tokenInfo.count,
      label: tokenInfo.label || tokenInfo.type
    };
    setTokens(prev => [...prev, newToken]);
  };

  // Atualizar Status do Município
  const handleUpdateMuniStatus = (muniName, status) => {
    setMuniStatuses(prev => ({ ...prev, [muniName]: status }));
  };

  // Atualizar Notas do Município
  const handleUpdateMuniNotes = (muniName, notes) => {
    setMuniNotes(prev => ({ ...prev, [muniName]: notes }));
  };

  // Ação: Carregar Cenário Real (Foto)
  const handleLoadRealScenario = () => {
    if (window.confirm('Deseja carregar a disposição oficial com Militares, Brigadistas e Prevfogo?')) {
      setTokens(INITIAL_REAL_SCENARIO);
    }
  };

  // Ação: Exportar Imagem HD
  const handleExportImage = () => {
    exportSvgToPng();
  };

  // Ação: Salvar Missão (Download JSON)
  const handleSaveMission = () => {
    const missionData = {
      title: 'Missão CBMAM Interior',
      date: new Date().toISOString(),
      tokens,
      muniStatuses,
      muniNotes
    };
    const blob = new Blob([JSON.stringify(missionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CBMAM_Missao_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Ação: Carregar Missão (Upload JSON)
  const handleLoadMission = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.tokens && Array.isArray(parsed.tokens)) {
          setTokens(parsed.tokens);
          if (parsed.muniStatuses) setMuniStatuses(parsed.muniStatuses);
          if (parsed.muniNotes) setMuniNotes(parsed.muniNotes);
          alert('Missão carregada com sucesso!');
        } else {
          alert('Arquivo de missão inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Ação: Limpar Mapa
  const handleClearMap = () => {
    if (window.confirm('Tem certeza de que deseja remover todas as viaturas e efetivo do mapa?')) {
      setTokens([]);
    }
  };

  // Ação: Modo Tela Cheia
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="app-container">
      {/* Cabeçalho Oficial com KPIs de Militares, Brigadistas e Prevfogo */}
      <Header 
        stats={stats}
        showAllTokens={showAllTokens}
        onToggleShowAllTokens={() => setShowAllTokens(!showAllTokens)}
        onLoadRealScenario={handleLoadRealScenario}
        onExportImage={handleExportImage}
        onSaveMission={handleSaveMission}
        onLoadMission={handleLoadMission}
        onClearMap={handleClearMap}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Espaço de Trabalho Tático */}
      <div className="app-workspace">
        {/* Barra Lateral: Hangar e Seletor de Efetivo */}
        <TacticalSidebar 
          onDragStartToken={handleDragStartToken}
          selectedMuni={selectedMuni}
          onAddTokenToMuni={handleAddTokenToMuni}
          deployedMunis={deployedMunis}
          onSelectMuni={setSelectedMuniName}
        />

        {/* Mapa Operacional Central com controle de visibilidade */}
        <OperationalMap 
          placedTokens={tokens}
          selectedMuniName={selectedMuniName}
          onSelectMuni={setSelectedMuniName}
          onDropToken={handleDropToken}
          onMoveToken={handleMoveToken}
          onDeleteToken={handleDeleteToken}
          onEditToken={setEditingToken}
          showArcoDoFogo={showArcoDoFogo}
          setShowArcoDoFogo={setShowArcoDoFogo}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showAllTokens={showAllTokens}
          setShowAllTokens={setShowAllTokens}
        />

        {/* Gaveta Lateral com todas as informações detalhadas ao clicar no município */}
        {selectedMuni && (
          <MunicipalityDrawer 
            muni={selectedMuni}
            muniTokens={selectedMuniTokens}
            muniStatus={muniStatuses[selectedMuni.name] || 'normal'}
            onUpdateMuniStatus={handleUpdateMuniStatus}
            muniNotes={muniNotes[selectedMuni.name] || ''}
            onUpdateMuniNotes={handleUpdateMuniNotes}
            onAddToken={handleAddTokenToMuni}
            onRemoveToken={handleDeleteToken}
            onClose={() => setSelectedMuniName(null)}
          />
        )}
      </div>

      {/* Modal de Edição de Token */}
      {editingToken && (
        <TokenEditModal 
          token={editingToken}
          onSave={handleSaveTokenChanges}
          onDelete={handleDeleteToken}
          onDuplicate={handleDuplicateToken}
          onClose={() => setEditingToken(null)}
        />
      )}
    </div>
  );
}
