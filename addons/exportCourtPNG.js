// addons/exportCourtPNG.js
document.addEventListener('DOMContentLoaded', () => {
  /* 1️⃣ Obtenemos el botón existente en el HTML */
  const exportBtn = document.getElementById('downloadPNG-btn');
  if (!exportBtn) return;

  /* 2️⃣ Cuando se hace clic, capturamos el div #court-container como imagen */
  exportBtn.addEventListener('click', async () => {
    const court = document.getElementById('court-container');
    if (!court) return;

    const canvas = await html2canvas(court, {
      backgroundColor: null, // Fondo transparente
      scale: 3               // Exportar en alta resolución
    });

    /* 3️⃣ Convertimos el canvas a PNG y preparamos la descarga */
    const link = document.createElement('a');
    link.download = 'court-diagram.png';
    link.href = canvas.toDataURL('image/png');

    /* 4️⃣ Disparamos la descarga automáticamente */
    link.click();
  });
});
