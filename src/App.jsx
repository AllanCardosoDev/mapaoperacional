import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { TacticalSidebar } from './components/TacticalSidebar';
import { OperationalMap } from './components/OperationalMap';
import { MunicipalityDrawer } from './components/MunicipalityDrawer';
import { TokenEditModal } from './components/TokenEditModal';
import { RelatorioOficialModal } from './components/RelatorioOficialModal';
import { EfetivoModal } from './components/EfetivoModal';
import { AeronavesModal } from './components/AeronavesModal';
import { AMAZONAS_DATA } from './data/amazonasData';
import { INITIAL_REAL_SCENARIO } from './data/tacticalAssets';
import { exportSvgToPng } from './utils/exportMap';
import { generateShareableUrl, parseShareableUrl } from './utils/shareLink';
import {
  fetchRemoteMapState,
  saveRemoteMapState,
  fetchAvailableDates,
} from './services/mapSyncService';
import { supabase } from './services/supabaseClient';
import {
  parseSpreadsheetBuffer,
  parseEfetivoJson,
} from './utils/spreadsheetParser';
import { efetivoDB } from './services/efetivoDatabase';

const STORAGE_KEY_TOKENS = 'cbmam_operational_tokens_v9_04112026_891';
const STORAGE_KEY_STATUSES = 'cbmam_muni_statuses_v8';
const STORAGE_KEY_NOTES = 'cbmam_muni_notes_v8';

export default function App() {
  // Inicializa a partir de link compartilhado (URL hash) se existir, ou do localStorage, ou do cenário padrão
  const sharedMission = useMemo(() => parseShareableUrl(), []);

  // Limpa hash de missão da URL após leitura inicial para não resetar nem sobrescrever dados ao dar F5
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash &&
      window.location.hash.startsWith('#missao=')
    ) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  // Estado dos recursos posicionados no mapa (Persistência Blindada)
  const [tokens, setTokens] = useState(() => {
    // 1. Prioridade: dados salvos no localStorage pelo usuário
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOKENS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage', e);
    }

    // 2. Link compartilhado novo recebido na URL
    if (
      sharedMission &&
      Array.isArray(sharedMission.tokens) &&
      sharedMission.tokens.length > 0
    ) {
      return sharedMission.tokens;
    }

    // 3. Fallback Oficial Permanente (886 Operacionais do Briefing)
    return INITIAL_REAL_SCENARIO;
  });

  // Status de cada município
  const [muniStatuses, setMuniStatuses] = useState(() => {
    if (sharedMission && sharedMission.muniStatuses)
      return sharedMission.muniStatuses;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore parse errors
    }
    return {
      Manaus: 'normal',
      'Presidente Figueiredo': 'normal',
      Itacoatiara: 'normal',
      Parintins: 'normal',
      Humaitá: 'arco_fogo',
      Lábrea: 'arco_fogo',
      'Boca do Acre': 'arco_fogo',
      Apuí: 'arco_fogo',
    };
  });

  // Notas operacionais de cada município
  const [muniNotes, setMuniNotes] = useState(() => {
    if (sharedMission && sharedMission.muniNotes)
      return sharedMission.muniNotes;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore parse errors
    }
    return {};
  });

  // Município atualmente selecionado
  const [selectedMuniName, setSelectedMuniName] = useState(null);

  // Token sendo editado no modal
  const [editingToken, setEditingToken] = useState(null);

  // Camadas táticas ativas
  const [showArcoDoFogo, setShowArcoDoFogo] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Controle de visibilidade de todos os ícones no mapa
  const [showAllTokens, setShowAllTokens] = useState(true);

  // Controle de visibilidade dos pontos de efetivo CBMAM no mapa
  const [showEfetivo, setShowEfetivo] = useState(true);

  // Controle de visibilidade das viaturas (toggle dedicado)
  const [showViaturas, setShowViaturas] = useState(false);

  // Controle de expansão/recolhimento da barra lateral para ver o mapa na totalidade
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Controle de expansão/subida da barra superior para ver o mapa na totalidade
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);

  // Modais de Efetivo e Aeronaves
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [showEfetivoModal, setShowEfetivoModal] = useState(false);
  const [showAeronavesModal, setShowAeronavesModal] = useState(false);

  // Status de sincronização com o banco de dados Supabase
  const [cloudStatus, setCloudStatus] = useState('idle'); // 'synced' | 'saving' | 'offline' | 'idle'
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-11-04');
  const [availableDates, setAvailableDates] = useState([]);
  const isInitialMount = useRef(true);

  // 1. CARGA INICIAL DO SUPABASE: Garante persistência remota absoluta e lista de datas
  useEffect(() => {
    let active = true;
    async function loadCloudState() {
      try {
        setCloudStatus('saving');

        // Carrega datas disponíveis gravadas no Supabase
        const dates = await fetchAvailableDates();
        if (active && dates && dates.length > 0) {
          setAvailableDates(dates);
        }

        const remote = await fetchRemoteMapState(selectedDate);
        if (!active) return;

        if (remote.ok) {
          if (Array.isArray(remote.tokens) && remote.tokens.length > 0) {
            setTokens(remote.tokens);
            try {
              localStorage.setItem(
                STORAGE_KEY_TOKENS,
                JSON.stringify(remote.tokens)
              );
            } catch {
              // ignore
            }
          }
          if (remote.muniStatuses && typeof remote.muniStatuses === 'object') {
            setMuniStatuses(remote.muniStatuses);
            try {
              localStorage.setItem(
                STORAGE_KEY_STATUSES,
                JSON.stringify(remote.muniStatuses)
              );
            } catch {
              // ignore
            }
          }
          if (remote.muniNotes && typeof remote.muniNotes === 'object') {
            setMuniNotes(remote.muniNotes);
            try {
              localStorage.setItem(
                STORAGE_KEY_NOTES,
                JSON.stringify(remote.muniNotes)
              );
            } catch {
              // ignore
            }
          }
          setCloudStatus('synced');
          setLastSyncTime(new Date(remote.updatedAt || Date.now()));
        } else {
          // Se o relatório para esta data ainda não tinha map_state salvo, grava o cenário oficial
          await saveRemoteMapState({
            targetDate: selectedDate,
            tokens,
            muniStatuses,
            muniNotes,
          });
          if (active) {
            setCloudStatus('synced');
            setLastSyncTime(new Date());
          }
        }
      } catch (err) {
        console.warn('[App] Erro na sincronização inicial com Supabase:', err);
        if (active) setCloudStatus('offline');
      }
    }

    loadCloudState();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. SINCRONIZAÇÃO EM TEMPO REAL NO SUPABASE (Debounced 1.2s após modificações no mapa)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setCloudStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const res = await saveRemoteMapState({
          targetDate: selectedDate,
          tokens,
          muniStatuses,
          muniNotes,
        });
        if (res.ok) {
          setCloudStatus('synced');
          setLastSyncTime(new Date());
        } else {
          setCloudStatus('offline');
        }
      } catch {
        setCloudStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [tokens, muniStatuses, muniNotes, selectedDate]);

  // 3. SINCRONIZAÇÃO EM TEMPO REAL: Escuta alterações feitas no sistema de Relatórios
  useEffect(() => {
    const channel = supabase
      .channel('daily_reports_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_reports' },
        async (payload) => {
          const changedDate = payload.new?.report_date;
          if (changedDate === selectedDate) {
            const remote = await fetchRemoteMapState(selectedDate);
            if (remote.ok) {
              if (Array.isArray(remote.tokens) && remote.tokens.length > 0) {
                setTokens(remote.tokens);
              }
              if (remote.muniStatuses) setMuniStatuses(remote.muniStatuses);
              if (remote.muniNotes) setMuniNotes(remote.muniNotes);
              setCloudStatus('synced');
              setLastSyncTime(new Date(remote.updatedAt || Date.now()));
            }
          }
          const dates = await fetchAvailableDates();
          if (dates && dates.length > 0) setAvailableDates(dates);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  // Persistência local imediata no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(tokens));
    } catch (e) {
      // Ignore parse errors
    }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(muniStatuses));
    } catch (e) {
      // Ignore parse errors
    }
  }, [muniStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(muniNotes));
    } catch (e) {
      // Ignore parse errors
    }
  }, [muniNotes]);

  // Município selecionado objeto
  const selectedMuni = useMemo(() => {
    if (!selectedMuniName) return null;
    return (
      AMAZONAS_DATA.municipalities.find((m) => m.name === selectedMuniName) ||
      null
    );
  }, [selectedMuniName]);

  // Tokens do município selecionado
  const selectedMuniTokens = useMemo(() => {
    if (!selectedMuniName) return [];
    return tokens.filter((t) => {
      const m = t.muni === 'Careiro' ? 'Careiro Castanho' : t.muni;
      return m === selectedMuniName || t.muni === selectedMuniName;
    });
  }, [tokens, selectedMuniName]);

  // Lista de municípios com recursos para a barra lateral
  const deployedMunis = useMemo(() => {
    const map = new Map();
    tokens.forEach((tk) => {
      let mName = tk.muni || 'Outros';
      if (mName === 'Careiro') mName = 'Careiro Castanho';
      if (!map.has(mName)) {
        const muniObj = AMAZONAS_DATA.municipalities.find(
          (m) => m.name === mName
        );
        map.set(mName, {
          name: mName,
          count: 0,
          inArco: muniObj ? muniObj.in_arco_fogo : false,
        });
      }
      map.get(mName).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [tokens]);

  // Estatísticas e KPIs em tempo real por categoria (Militares CBMAM, Força Nacional, Prevfogo, Brigadistas)
  const stats = useMemo(() => {
    let militares = 0;
    let seg = 0;
    let brigadistas = 0;
    let brigadistasSema = 0;
    let prevfogo = 0;
    let fn = 0;
    let capital = 0;
    let interior = 0;
    let asaFixa = 0;
    let rotativa = 0;
    let viaturas = 0;
    let fluvial = 0;
    let arcoFogo = 0;

    tokens.forEach((t) => {
      const targetMuni = t.muni === 'Careiro' ? 'Careiro Castanho' : t.muni;
      const muniObj = AMAZONAS_DATA.municipalities.find(
        (m) => m.name === targetMuni
      );
      const isArco = muniObj?.in_arco_fogo;

      if (
        t.type === 'serv_ord' ||
        t.type === 'efetivo_militar' ||
        t.type === 'efetivo' ||
        t.type === 'efetivo_opam'
      ) {
        const c = t.count || 10;
        militares += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_seg' || t.type === 'seg') {
        const c = t.count || 6;
        seg += c;
        militares += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_brigadista' || t.type === 'brigadista') {
        const c = t.count || 10;
        brigadistas += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_prevfogo' || t.type === 'prevfogo') {
        const c = t.count || 10;
        prevfogo += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'efetivo_fn' || t.type === 'fn') {
        const c = t.count || 6;
        fn += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (
        t.type === 'efetivo_brigadista_sema' ||
        t.type === 'brigadista_sema' ||
        t.type === 'brigadista_semais'
      ) {
        const c = t.count || 10;
        brigadistasSema += c;
        if (targetMuni === 'Manaus') capital += c;
        else interior += c;
        if (isArco) arcoFogo += c;
      } else if (t.type === 'air_tractor' || t.type === 'kc390') {
        asaFixa += 1;
        if (isArco) arcoFogo += 1;
      } else if (t.type === 'helicoptero') {
        rotativa += 1;
        if (isArco) arcoFogo += 1;
      } else if (
        t.type === 'vtr_abt' ||
        t.type === 'vtr_florestal' ||
        t.type === 'vtr_ur'
      ) {
        viaturas += 1;
        if (isArco) arcoFogo += 1;
      } else if (t.type === 'embarcacao') {
        fluvial += 1;
        if (isArco) arcoFogo += 1;
      }
    });

    const totalBrigadistas = brigadistas + brigadistasSema; // 78 + 83 = 161
    const totalEfetivo = militares + prevfogo + fn + totalBrigadistas; // 443 + 247 + 35 + 161 = 886

    return {
      militares, // 443 Militares CBMAM
      seg,
      brigadistas, // 78 Brigadistas Municipais
      brigadistasGerais: brigadistas,
      prevfogo, // 247 Prevfogo IBAMA
      fn, // 35 Força Nacional
      brigadistasSema, // 83 Brigadistas SEMA
      totalBrigadistas, // 161 Total Brigadistas (Mun + SEMA)
      totalEfetivo, // 886 Total Geral Empregado
      capital, // 233
      interior, // 653
      focosCombate: 14,
      asaFixa,
      rotativa,
      viaturas,
      fluvial,
      arcoFogo,
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
      label: dropData.label || dropData.type,
    };
    setTokens((prev) => [...prev, newToken]);
  };

  // Mover Token já posicionado
  const handleMoveToken = (id, newX, newY) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t))
    );
  };

  // Excluir Token
  const handleDeleteToken = (id) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  // Duplicar Token
  const handleDuplicateToken = (token) => {
    const duplicated = {
      ...token,
      id: `tk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: token.x + 25,
      y: token.y + 25,
    };
    setTokens((prev) => [...prev, duplicated]);
  };

  // Salvar alterações de Token (via modal)
  const handleSaveTokenChanges = (updated) => {
    setTokens((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Adicionar Token via Drawer do Município
  const handleAddTokenToMuni = (muni, tokenInfo) => {
    const countInMuni = tokens.filter((t) => t.muni === muni.name).length;
    const offsetX = (countInMuni % 4) * 35 - 35;
    const offsetY = Math.floor(countInMuni / 4) * 35;

    const newToken = {
      id: `tk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: tokenInfo.type,
      muni: muni.name,
      x: Math.round(muni.cx + offsetX),
      y: Math.round(muni.cy + offsetY),
      count: tokenInfo.count,
      label: tokenInfo.label || tokenInfo.type,
    };
    setTokens((prev) => [...prev, newToken]);
  };

  // Atualizar Status do Município
  const handleUpdateMuniStatus = (muniName, status) => {
    setMuniStatuses((prev) => ({ ...prev, [muniName]: status }));
  };

  // Atualizar Notas do Município
  const handleUpdateMuniNotes = (muniName, notes) => {
    setMuniNotes((prev) => ({ ...prev, [muniName]: notes }));
  };

  // NOVO: Gerar e Copiar Link com todo o Cenário Atual
  const handleShareLink = () => {
    const url = generateShareableUrl(tokens, muniStatuses, muniNotes);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          window.history.replaceState(null, '', url);
        })
        .catch(() => {
          prompt('Copie o link abaixo para enviar para outro PC:', url);
        });
    } else {
      prompt('Copie o link abaixo para enviar para outro PC:', url);
    }
  };

  // Ação: Carregar Cenário Real (Foto)
  const handleLoadRealScenario = () => {
    if (
      window.confirm(
        'Deseja carregar a disposição oficial com Militares, Brigadistas e Prevfogo?'
      )
    ) {
      setTokens(INITIAL_REAL_SCENARIO);
      saveRemoteMapState({
        targetDate: selectedDate,
        tokens: INITIAL_REAL_SCENARIO,
        muniStatuses,
        muniNotes,
      }).then((res) => {
        if (res.ok) {
          setCloudStatus('synced');
          setLastSyncTime(new Date());
        }
      });
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
      muniNotes,
    };
    const blob = new Blob([JSON.stringify(missionData, null, 2)], {
      type: 'application/json',
    });
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
          const nextStatuses = parsed.muniStatuses || muniStatuses;
          const nextNotes = parsed.muniNotes || muniNotes;

          if (parsed.muniStatuses) {
            setMuniStatuses(parsed.muniStatuses);
          }
          if (parsed.muniNotes) {
            setMuniNotes(parsed.muniNotes);
          }

          try {
            localStorage.setItem(
              STORAGE_KEY_TOKENS,
              JSON.stringify(parsed.tokens)
            );
            localStorage.setItem(
              STORAGE_KEY_STATUSES,
              JSON.stringify(nextStatuses)
            );
            localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(nextNotes));
          } catch (storageErr) {
            console.warn('Erro ao salvar no localStorage:', storageErr);
          }

          // Grava imediatamente no Supabase
          setCloudStatus('saving');
          saveRemoteMapState({
            tokens: parsed.tokens,
            muniStatuses: nextStatuses,
            muniNotes: nextNotes,
          }).then((res) => {
            if (res.ok) {
              setCloudStatus('synced');
              setLastSyncTime(new Date());
            } else {
              setCloudStatus('offline');
            }
          });

          alert(
            'Missão carregada e salva permanentemente no Supabase e no dispositivo!'
          );
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

  // Ação: Selecionar data da operação (histórico ou atual)
  const handleSelectDate = async (newDate) => {
    if (!newDate || newDate === selectedDate) return;
    setSelectedDate(newDate);
    setCloudStatus('saving');
    try {
      const remote = await fetchRemoteMapState(newDate);
      if (remote.ok) {
        if (Array.isArray(remote.tokens) && remote.tokens.length > 0) {
          setTokens(remote.tokens);
          try {
            localStorage.setItem(
              STORAGE_KEY_TOKENS,
              JSON.stringify(remote.tokens)
            );
          } catch {
            // ignore
          }
        }
        if (remote.muniStatuses) setMuniStatuses(remote.muniStatuses);
        if (remote.muniNotes) setMuniNotes(remote.muniNotes);
        setCloudStatus('synced');
        setLastSyncTime(new Date(remote.updatedAt || Date.now()));
      } else {
        setCloudStatus('offline');
      }
    } catch (err) {
      console.error('[App] Erro ao carregar data:', err);
      setCloudStatus('offline');
    }
  };

  // Ação: Subir e processar planilha oficial (.xlsx ou .json) e salvar permanentemente no Supabase
  const handleUploadSpreadsheet = async (file) => {
    if (!file) return;
    setCloudStatus('saving');

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);

        // Caso 1: Arquivo de Efetivo exportado do sistema de Relatórios (ou matriz de efetivo CBMAM)
        if (
          parsed.type === 'cbmam_efetivo_mapas' ||
          parsed.municipios ||
          parsed.bases ||
          (parsed.data && (parsed.data.municipios || parsed.data.bases))
        ) {
          efetivoDB.importJSON(parsed);
          const result = parseEfetivoJson(parsed, file.name);

          setTokens(result.tokens);
          setMuniStatuses(result.muniStatuses);
          setMuniNotes(result.muniNotes);
          setSelectedDate(result.reportDate);

          const saveRes = await saveRemoteMapState({
            targetDate: result.reportDate,
            tokens: result.tokens,
            muniStatuses: result.muniStatuses,
            muniNotes: result.muniNotes,
            supabaseEfetivo: result.supabaseEfetivo,
            supabaseRecursos: result.supabaseRecursos,
            shift: result.shift,
          });

          if (saveRes.ok) {
            setCloudStatus(saveRes.offline ? 'offline' : 'synced');
            setLastSyncTime(new Date());

            const dates = await fetchAvailableDates();
            if (dates && dates.length > 0) setAvailableDates(dates);

            alert(
              `Efetivo oficial de ${result.reportDate} importado e atualizado no mapa com sucesso!\n\n` +
                `• Total Geral Empregado: ${result.totalEmpregado} operacionais\n` +
                `• Viaturas e Meios: ${result.totalRecursos} recursos\n` +
                `• Municípios com tropa: ${result.municipios.length}\n` +
                `• Bases Temporárias: ${result.bases.length}\n` +
                `• Tokens táticos no mapa: ${result.tokens.length}\n\n` +
                (saveRes.offline
                  ? `Os dados foram atualizados no mapa e salvos em segurança no seu dispositivo!`
                  : `Os dados foram atualizados no mapa e sincronizados com o Supabase!`)
            );
          } else {
            setCloudStatus('offline');
            alert(
              `Efetivo de ${result.reportDate} carregado no mapa e salvo localmente com sucesso!\n\n` +
                `• Total Geral Empregado: ${result.totalEmpregado} operacionais\n` +
                `• Tokens táticos: ${result.tokens.length}\n\n` +
                `Nota: Os dados estão preservados no seu dispositivo.`
            );
          }
          return;
        }

        // Caso 2: Arquivo JSON de missão tática padrão com tokens
        if (parsed.tokens && Array.isArray(parsed.tokens)) {
          setTokens(parsed.tokens);
          const nextStatuses = parsed.muniStatuses || muniStatuses;
          const nextNotes = parsed.muniNotes || muniNotes;
          const date = parsed.date ? parsed.date.slice(0, 10) : selectedDate;

          setMuniStatuses(nextStatuses);
          setMuniNotes(nextNotes);
          setSelectedDate(date);

          await saveRemoteMapState({
            targetDate: date,
            tokens: parsed.tokens,
            muniStatuses: nextStatuses,
            muniNotes: nextNotes,
          });

          setCloudStatus('synced');
          setLastSyncTime(new Date());
          alert(
            `Missão JSON de ${date} importada e salva permanentemente no Supabase!`
          );
        }
        return;
      }

      // Arquivo de planilha Excel (.xlsx / .xls)
      const buffer = await file.arrayBuffer();
      const parsed = parseSpreadsheetBuffer(buffer, file.name);

      setTokens(parsed.tokens);
      setMuniStatuses(parsed.muniStatuses);
      setMuniNotes(parsed.muniNotes);
      setSelectedDate(parsed.reportDate);

      // Salva permanentemente no banco Supabase
      const saveRes = await saveRemoteMapState({
        targetDate: parsed.reportDate,
        tokens: parsed.tokens,
        muniStatuses: parsed.muniStatuses,
        muniNotes: parsed.muniNotes,
        supabaseEfetivo: parsed.supabaseEfetivo,
        supabaseRecursos: parsed.supabaseRecursos,
        shift: parsed.shift,
      });

      if (saveRes.ok) {
        setCloudStatus(saveRes.offline ? 'offline' : 'synced');
        setLastSyncTime(new Date());

        // Atualiza lista de datas disponíveis no Supabase
        const dates = await fetchAvailableDates();
        if (dates && dates.length > 0) setAvailableDates(dates);

        alert(
          `Planilha oficial de ${parsed.reportDate} processada com sucesso!\n\n` +
            `• Total Geral Empregado: ${parsed.totalEmpregado} operacionais\n` +
            `• Viaturas e Meios Operacionais: ${parsed.totalRecursos || 160} recursos\n` +
            `• Municípios com efetivo: ${parsed.municipios.length}\n` +
            `• Bases Temporárias: ${parsed.bases.length}\n` +
            `• Recursos e Viaturas no mapa: ${parsed.tokens.length}\n\n` +
            (saveRes.offline
              ? `Os dados foram atualizados no mapa e salvos em segurança no seu dispositivo!`
              : `Os dados foram atualizados no mapa e sincronizados com o Supabase!`)
        );
      } else {
        setCloudStatus('offline');
        alert(
          `Planilha oficial de ${parsed.reportDate} processada com sucesso!\n\n` +
            `• Total Geral Empregado: ${parsed.totalEmpregado} operacionais\n` +
            `• Recursos e Viaturas no mapa: ${parsed.tokens.length}\n\n` +
            `Os dados foram atualizados no mapa e salvos em segurança no seu dispositivo!`
        );
      }
    } catch (err) {
      console.error('[App] Erro ao processar planilha:', err);
      setCloudStatus('offline');
      alert(`Erro ao ler planilha: ${err.message}`);
    }
  };

  // Ação: Sincronização Manual Forçada com Supabase
  const handleForceSync = async () => {
    setCloudStatus('saving');
    try {
      const res = await saveRemoteMapState({
        targetDate: selectedDate,
        tokens,
        muniStatuses,
        muniNotes,
      });
      if (res.ok) {
        setCloudStatus(res.offline ? 'offline' : 'synced');
        setLastSyncTime(new Date());
        alert(
          res.offline
            ? 'Mapa operacional salvo no dispositivo! (Aguardando conexão com o servidor na nuvem)'
            : 'Mapa operacional 100% sincronizado e gravado no Supabase com sucesso!'
        );
      } else {
        setCloudStatus('offline');
        alert(
          `Aviso: Não foi possível sincronizar com o Supabase (${res.error || 'Erro de conexão'}). Os dados continuam salvos no navegador.`
        );
      }
    } catch (err) {
      setCloudStatus('offline');
      alert('Erro ao conectar ao Supabase.');
    }
  };

  // Ação: Limpar Mapa
  const handleClearMap = () => {
    if (
      window.confirm(
        'Tem certeza de que deseja remover todas as viaturas e efetivo do mapa?'
      )
    ) {
      setTokens([]);
      saveRemoteMapState({
        tokens: [],
        muniStatuses,
        muniNotes,
      }).then((res) => {
        if (res.ok) {
          setCloudStatus('synced');
          setLastSyncTime(new Date());
        }
      });
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
      {/* Cabeçalho Oficial com KPIs e Compartilhamento de Link */}
      <Header
        stats={stats}
        showAllTokens={showAllTokens}
        onToggleShowAllTokens={() => setShowAllTokens(!showAllTokens)}
        showEfetivo={showEfetivo}
        onToggleShowEfetivo={() => setShowEfetivo(!showEfetivo)}
        showViaturas={showViaturas}
        onToggleShowViaturas={() => setShowViaturas(!showViaturas)}
        onOpenRelatorio={() => setShowRelatorioModal(true)}
        onShareLink={handleShareLink}
        onLoadRealScenario={handleLoadRealScenario}
        onExportImage={handleExportImage}
        onSaveMission={handleSaveMission}
        onLoadMission={handleLoadMission}
        onClearMap={handleClearMap}
        onToggleFullscreen={handleToggleFullscreen}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenEfetivo={() => setShowEfetivoModal(true)}
        onOpenAeronaves={() => setShowAeronavesModal(true)}
        isHeaderOpen={isHeaderOpen}
        onToggleHeader={() => setIsHeaderOpen(!isHeaderOpen)}
        cloudStatus={cloudStatus}
        lastSyncTime={lastSyncTime}
        onForceSync={handleForceSync}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onSelectDate={handleSelectDate}
        onUploadSpreadsheet={handleUploadSpreadsheet}
      />

      {/* Espaço de Trabalho Tático */}
      <div className="app-workspace">
        {/* Barra Lateral: Hangar e Seletor de Efetivo */}
        <TacticalSidebar
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onDragStartToken={handleDragStartToken}
          selectedMuni={selectedMuni}
          onAddTokenToMuni={handleAddTokenToMuni}
          deployedMunis={deployedMunis}
          onSelectMuni={setSelectedMuniName}
          onOpenEfetivo={() => setShowEfetivoModal(true)}
          onOpenAeronaves={() => setShowAeronavesModal(true)}
        />

        {/* Mapa Operacional Central */}
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
          showEfetivo={showEfetivo}
          setShowEfetivo={setShowEfetivo}
          showViaturas={showViaturas}
          setShowViaturas={setShowViaturas}
        />

        {/* Gaveta Lateral de Detalhes do Município Selecionado */}
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

      {/* Modal do Relatório Oficial de Efetivo e Combates Ativos */}
      {showRelatorioModal && (
        <RelatorioOficialModal
          tokens={tokens}
          muniStatuses={muniStatuses}
          muniNotes={muniNotes}
          onClose={() => setShowRelatorioModal(false)}
          onSelectMuni={(name) => {
            setSelectedMuniName(name);
            setShowRelatorioModal(false);
          }}
        />
      )}

      {/* Modal da Soma Total de Tudo & Detalhamento do Efetivo (623 Operacionais) */}
      {showEfetivoModal && (
        <EfetivoModal
          onClose={() => setShowEfetivoModal(false)}
          onUploadSpreadsheet={handleUploadSpreadsheet}
          onSelectMuni={(name) => {
            setSelectedMuniName(name);
            setShowEfetivoModal(false);
          }}
          onSyncOfficialTokens={() => {
            setTokens(INITIAL_REAL_SCENARIO);
            localStorage.setItem(
              STORAGE_KEY_TOKENS,
              JSON.stringify(INITIAL_REAL_SCENARIO)
            );
          }}
        />
      )}

      {/* Modal de Localização das Aeronaves (Onde estão as Aeronaves) */}
      {showAeronavesModal && (
        <AeronavesModal
          onClose={() => setShowAeronavesModal(false)}
          onSelectMuni={(name) => {
            setSelectedMuniName(name);
            setShowAeronavesModal(false);
          }}
        />
      )}
    </div>
  );
}
