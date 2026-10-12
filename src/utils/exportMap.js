// Utilitário de Exportação do Mapa Operacional em Alta Definição (PNG)
export async function exportSvgToPng() {
  const svgElement = document.getElementById('tactical-svg');
  if (!svgElement) {
    alert('Elemento do mapa não encontrado!');
    return;
  }

  try {
    // Clona o SVG para aplicar estilo estático sem pan/zoom do usuário no momento
    const clone = svgElement.cloneNode(true);
    clone.setAttribute('width', '2200');
    clone.setAttribute('height', '1400');
    clone.style.transform = 'none';

    // Injeta cabeçalho e título tático na imagem gerada
    const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    headerGroup.innerHTML = `
      <rect x="30" y="25" width="650" height="95" rx="8" fill="#0b111e" stroke="#1e293b" stroke-width="2"/>
      <text x="50" y="65" font-family="'Barlow Condensed', 'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="2">MAPA OPERACIONAL • INTERIOR</text>
      <text x="50" y="95" font-family="Arial, sans-serif" font-size="14" font-weight="800" fill="#38bdf8" letter-spacing="2">CORPO DE BOMBEIROS MILITAR DO AMAZONAS (CBMAM - CBI)</text>
    `;
    clone.prepend(headerGroup);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clone);

    // Converte em Blob e Image
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(blob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2200;
      canvas.height = 1400;
      const context = canvas.getContext('2d');

      // Fundo tático escuro
      context.fillStyle = '#0b111e';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, 0, 0);

      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadLink.download = `CBMAM_Mapa_Operacional_Interior_${dateStr}.png`;
      downloadLink.href = pngURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(blobURL);
    };

    image.src = blobURL;
  } catch (error) {
    console.error('Erro na exportação:', error);
    alert('Erro ao exportar imagem. Tente novamente.');
  }
}
