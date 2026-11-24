import React, { useState, useEffect } from 'react';
import { X, Clock, Camera } from 'lucide-react';

function formatManausClock(date) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Manaus',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleTimeString('pt-BR');
  }
}

function formatManausDate(date) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Manaus',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('pt-BR');
  }
}

export function BriefingOverlay({
  stats,
  selectedDate,
  mapTheme,
  onChangeMapTheme,
  onExportImage,
  onExit,
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearInterval(id);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onExit]);

  const totalEfetivo = stats?.totalEfetivo ?? 0;
  const svOrd = stats?.svOrd ?? 818;
  const prevfogo = stats?.prevfogo ?? 0;
  const fn = stats?.fn ?? 0;
  const totalBrig = stats?.totalBrigadistas ?? 0;
  const parceiros = prevfogo + fn + totalBrig;
  const aeronaves = (stats?.asaFixa ?? 7) + (stats?.rotativa ?? 3);

  const refFormatted = selectedDate
    ? selectedDate.split('-').reverse().join('/')
    : formatManausDate(now);

  return (
    <>
      {/* FAIXA SUPERIOR EXECUTIVA (SALA DE SITUAÇÃO) */}
      <div className="briefing-topbar">
        <div className="briefing-brand">
          <img
            src="/brasao-cbmam.png"
            alt="CBMAM"
            className="briefing-emblem"
          />
          <div>
            <div className="briefing-title">
              SALA DE SITUAÇÃO • OPERAÇÃO AMAZONAS
            </div>
            <div className="briefing-sub">
              CORPO DE BOMBEIROS MILITAR DO AMAZONAS (CBMAM / CBI) • REF.{' '}
              {refFormatted}
            </div>
          </div>
        </div>

        <div className="briefing-kpis">
          <div className="briefing-kpi gold">
            <span className="bk-label">EM ATUAÇÃO</span>
            <span className="bk-val">{totalEfetivo}</span>
          </div>
          <div className="briefing-kpi red">
            <span className="bk-label">CBMAM POLOS</span>
            <span className="bk-val">{svOrd}</span>
          </div>
          <div className="briefing-kpi green">
            <span className="bk-label">PARCEIROS & BRIG.</span>
            <span className="bk-val">{parceiros}</span>
          </div>
          <div className="briefing-kpi blue">
            <span className="bk-label">AERONAVES</span>
            <span className="bk-val">{aeronaves}</span>
          </div>
        </div>

        <div className="briefing-right">
          <div
            className="briefing-clock"
            title="Horário oficial de Manaus (AMT / UTC-4)"
          >
            <Clock size={14} color="#38bdf8" />
            <span className="clock-time">{formatManausClock(now)}</span>
            <span className="clock-tz">AMT</span>
          </div>

          <div className="briefing-theme-switch">
            {[
              { id: 'politico', label: 'Político' },
              { id: 'tatico', label: 'Tático' },
              { id: 'crbm', label: 'CRBM' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`bt-btn ${mapTheme === t.id ? 'active' : ''}`}
                onClick={() => onChangeMapTheme(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="briefing-action-btn"
            onClick={onExportImage}
            title="Exportar PNG 4K Executivo"
          >
            <Camera size={14} />
          </button>

          <button
            type="button"
            className="briefing-exit-btn"
            onClick={onExit}
            title="Sair do Modo Sala de Situação (ESC)"
          >
            <X size={14} />
            <span>Sair (ESC)</span>
          </button>
        </div>
      </div>
    </>
  );
}
