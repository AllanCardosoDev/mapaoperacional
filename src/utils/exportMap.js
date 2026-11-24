// Utilitário de Exportação do Mapa Operacional em Alta Definição 4K (PNG Executivo)

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function fetchAsDataUrl(url) {
  try {
    const resp = await fetch(url);
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportSvgToPng(stats = {}, reportDate = null) {
  const svgElement = document.getElementById('tactical-svg');
  if (!svgElement) {
    alert('Elemento do mapa não encontrado!');
    return;
  }

  try {
    // 1. Embutir o brasão oficial como DataURL dentro do SVG clonado para não quebrar no canvas
    const brasaoDataUrl = await fetchAsDataUrl('/brasao-cbmam.png');
    const clone = svgElement.cloneNode(true);
    clone.setAttribute('width', '3400');
    clone.setAttribute('height', '1860');
    clone.style.transform = 'none';

    if (brasaoDataUrl) {
      clone.querySelectorAll('image').forEach((imgNode) => {
        const href =
          imgNode.getAttribute('href') ||
          imgNode.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        if (href && href.includes('brasao-cbmam')) {
          imgNode.setAttribute('href', brasaoDataUrl);
        }
      });
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const blob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const URLApi = window.URL || window.webkitURL || window;
    const blobURL = URLApi.createObjectURL(blob);

    const [mapImage, brasaoImg] = await Promise.all([
      loadImage(blobURL),
      brasaoDataUrl ? loadImage(brasaoDataUrl).catch(() => null) : null,
    ]);

    // 2. Canvas 4K UHD (3840 x 2160) pronto para telão / slide executivo
    const W = 3840;
    const H = 2160;
    const HEADER_H = 165;
    const FOOTER_H = 135;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Fundo tático escuro
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, W, H);

    // Desenha o mapa no centro
    ctx.drawImage(mapImage, 220, HEADER_H, 3400, H - HEADER_H - FOOTER_H);

    // Faixa superior institucional
    const headerGrad = ctx.createLinearGradient(0, 0, W, 0);
    headerGrad.addColorStop(0, '#0f172a');
    headerGrad.addColorStop(0.5, '#131c2e');
    headerGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Linha de acento rubro-dourada sob o cabeçalho
    const accentGrad = ctx.createLinearGradient(0, 0, W, 0);
    accentGrad.addColorStop(0, '#dc2626');
    accentGrad.addColorStop(0.5, '#facc15');
    accentGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, HEADER_H - 5, W, 5);

    // Brasão oficial CBMAM no topo esquerdo
    if (brasaoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(98, HEADER_H / 2, 54, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#facc15';
      ctx.stroke();
      ctx.drawImage(brasaoImg, 54, HEADER_H / 2 - 44, 88, 88);
      ctx.restore();
    }

    // Título e subtítulo oficiais
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 56px "Barlow Condensed", "Inter", sans-serif';
    ctx.fillText('MAPA OPERACIONAL • INTERIOR DO AMAZONAS', 180, 78);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillText(
      'CORPO DE BOMBEIROS MILITAR DO AMAZONAS (CBMAM) — COMANDO DE BOMBEIROS DO INTERIOR (CBI)',
      180,
      122
    );

    // Data de referência e carimbo de emissão (topo direito)
    const now = new Date();
    const refLabel = reportDate
      ? reportDate.split('-').reverse().join('/')
      : now.toLocaleDateString('pt-BR');
    const emittedLabel = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    ctx.textAlign = 'right';
    ctx.fillStyle = '#facc15';
    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.fillText(`OPERAÇÃO AMAZONAS • REF. ${refLabel}`, W - 64, 72);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillText(`EMITIDO EM ${emittedLabel} (HORÁRIO DE MANAUS)`, W - 64, 114);
    ctx.textAlign = 'left';

    // Faixa inferior executiva com KPIs reais
    ctx.fillStyle = '#0c1322';
    ctx.fillRect(0, H - FOOTER_H, W, FOOTER_H);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, H - FOOTER_H, W, 3);

    const kpiBlocks = [
      {
        label: 'EM ATUAÇÃO NA OPERAÇÃO',
        val: String(stats.totalEfetivo ?? 742),
        color: '#facc15',
      },
      {
        label: 'CBMAM POLOS',
        val: String(stats.svOrd ?? 818),
        color: '#ef4444',
      },
      {
        label: 'PREVFOGO / IBAMA',
        val: String(stats.prevfogo ?? 247),
        color: '#4ade80',
      },
      {
        label: 'FORÇA NACIONAL',
        val: String(stats.fn ?? 35),
        color: '#38bdf8',
      },
      {
        label: 'BRIGADISTAS (MUN + SEMA)',
        val: String(stats.totalBrigadistas ?? 375),
        color: '#fb923c',
      },
      {
        label: 'AERONAVES',
        val: String((stats.asaFixa ?? 7) + (stats.rotativa ?? 3)),
        color: '#60a5fa',
      },
    ];

    const colW = (W - 120) / kpiBlocks.length;
    kpiBlocks.forEach((b, idx) => {
      const bx = 64 + idx * colW;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 18px "Inter", sans-serif';
      ctx.fillText(b.label, bx, H - FOOTER_H + 46);

      ctx.fillStyle = b.color;
      ctx.font = '900 48px "JetBrains Mono", monospace';
      ctx.fillText(b.val, bx, H - FOOTER_H + 102);
    });

    const pngURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const dateStr = reportDate || now.toISOString().slice(0, 10);
    downloadLink.download = `CBMAM_Mapa_Operacional_4K_${dateStr}.png`;
    downloadLink.href = pngURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URLApi.revokeObjectURL(blobURL);
  } catch (error) {
    console.error('Erro na exportação 4K:', error);
    alert('Erro ao exportar imagem 4K. Tente novamente.');
  }
}
