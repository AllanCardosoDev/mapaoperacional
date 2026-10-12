// Utilitário para gerar e carregar cenários diretamente através do Link (URL Hash)
export function generateShareableUrl(tokens, muniStatuses, muniNotes) {
  try {
    const compact = {
      t: tokens.map(t => [t.type, t.muni, t.x, t.y, t.count || 0, t.label || '']),
      s: muniStatuses,
      n: muniNotes
    };
    const jsonStr = JSON.stringify(compact);
    // Codificação segura para URI e Base64
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
    return `${window.location.origin}${window.location.pathname}#missao=${base64}`;
  } catch (err) {
    console.error('Erro ao gerar URL compartilhável:', err);
    return window.location.href;
  }
}

export function parseShareableUrl() {
  if (!window.location.hash || !window.location.hash.startsWith('#missao=')) return null;
  try {
    const base64 = window.location.hash.slice(8);
    const decodedStr = decodeURIComponent(Array.prototype.map.call(atob(base64), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const compact = JSON.parse(decodedStr);
    const tokens = (compact.t || []).map((arr, idx) => ({
      id: `tk-shared-${idx}-${Date.now()}`,
      type: arr[0],
      muni: arr[1],
      x: arr[2],
      y: arr[3],
      count: arr[4] > 0 ? arr[4] : undefined,
      label: arr[5] || arr[0]
    }));

    return {
      tokens,
      muniStatuses: compact.s || {},
      muniNotes: compact.n || {}
    };
  } catch (err) {
    console.error('Erro ao interpretar link de missão:', err);
    return null;
  }
}
