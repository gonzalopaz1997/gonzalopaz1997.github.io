document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent) && !/iPad|Tablet/i.test(navigator.userAgent);

  if (isMobile) {
    // Escalar el contenedor principal
    const courtContainer = document.getElementById("court-container");
    if (courtContainer) {
      courtContainer.style.transform = "scale(0.6)";
      courtContainer.style.transformOrigin = "top left";
      courtContainer.style.position = "relative";
      courtContainer.style.width = "fit-content";

      // Escalar todos los elementos hijos por dimensiones y posición
      const scaleFactor = 0.6;
      const elements = courtContainer.querySelectorAll("[style*='top'], [style*='left']");

      elements.forEach(el => {
        const style = window.getComputedStyle(el);

        // Escalar ancho y alto si están definidos
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        if (!isNaN(width)) el.style.width = `${width * scaleFactor}px`;
        if (!isNaN(height)) el.style.height = `${height * scaleFactor}px`;

        // Escalar posición top y left si están en pixeles
        const top = el.style.top ? parseFloat(el.style.top) : null;
        const left = el.style.left ? parseFloat(el.style.left) : null;
        if (!isNaN(top)) el.style.top = `${top * scaleFactor}px`;
        if (!isNaN(left)) el.style.left = `${left * scaleFactor}px`;
      });
    }

    // Ocultar <header> y <footer> por etiqueta
    const headerTag = document.querySelector("header");
    const footerTag = document.querySelector("footer");
    if (headerTag) headerTag.style.display = "none";
    if (footerTag) footerTag.style.display = "none";
  }
});
