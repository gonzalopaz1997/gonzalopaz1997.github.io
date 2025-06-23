// addons/exportCourtPNG.js  (módulo ES)
document.addEventListener('DOMContentLoaded', () => {
  /* 1️⃣ Botón “Download PNG” */
  const exportBtn = document.createElement('button');
  exportBtn.id = 'export-png-btn';
  exportBtn.textContent = 'Download PNG';
  exportBtn.className = 'command-btn';  // usa tu estilo de botones
  // Ajusta dónde insertarlo:
  document.querySelector('.command-previous-next-area')?.appendChild(exportBtn);

  /* 2️⃣ Lógica de captura */
  exportBtn.addEventListener('click', async () => {
    const court = document.getElementById('court-container');
    if (!court) return;

    // ➡️ Captura. 'scale:3' = 3× más resolución
    const canvas = await html2canvas(court, {
      backgroundColor: null,   // PNG transparente
      scale: 3
    });

    // ➡️ Desencadena la descarga
    const link = document.createElement('a');
    link.download = 'court-diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});
