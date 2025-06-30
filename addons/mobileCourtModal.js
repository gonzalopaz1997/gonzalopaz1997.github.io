document.addEventListener("DOMContentLoaded", () => {
  // Detectar si el dispositivo es móvil o tablet
  const isMobileOrTablet = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
  const isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent);
  const isTablet = /iPad|Tablet/i.test(navigator.userAgent);

  if (!isMobileOrTablet) return;
  const isPortrait = () => window.innerHeight > window.innerWidth;

  // Ocultar las secciones
  const elementsToHide = [
    document.getElementById("command-area"),
    document.getElementById("court-container"),
    document.getElementById("command-previous-next-area"),
    document.querySelector(".site-header"),
    document.querySelector(".site-footer")
  ];
  function showModal(message) {
    const elementsToHide = [
      document.getElementById("command-area"),
      document.getElementById("court-container"),
      document.getElementById("command-previous-next-area"),
      document.querySelector(".site-header"),
      document.querySelector(".site-footer")
    ];
  
    elementsToHide.forEach(el => {
      if (el) el.style.display = "none";
    });
  
    const modal = document.createElement("div");
    Object.assign(modal.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      textAlign: "center",
      zIndex: "9999",
      padding: "20px"
    });
    modal.innerText = message;
    document.body.appendChild(modal);
  }

  elementsToHide.forEach(el => {
    if (el) el.style.display = "none";
  });

  // Crear modal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
    flexDirection: "column",
    color: "white",
    textAlign: "center",
    padding: "20px",
    fontFamily: "sans-serif"
  });
  // Mostrar modal si es teléfono
  if (isMobile && !isTablet) {
    showModal("This application is not available on mobile devices.");
    return;
  }

  const warningIcon = document.createElement("div");
  warningIcon.innerText = "⚠️";
  warningIcon.style.fontSize = "64px";
  warningIcon.style.marginBottom = "20px";
  // Mostrar modal si es tablet pero está en vertical
  if (isTablet && isPortrait()) {
    showModal("Please rotate your device. This application is only available in landscape mode.");
  }

  const message = document.createElement("div");
  message.innerText = "This tool is currently available only on desktop devices.";
  message.style.fontSize = "1.5rem";
  message.style.maxWidth = "400px";

  modal.appendChild(warningIcon);
  modal.appendChild(message);
  document.body.appendChild(modal);
  // Escuchar cambios de orientación
  window.addEventListener("resize", () => {
    const existingModal = document.querySelector("body > div[style*='z-index: 9999']");
    if (isTablet && isPortrait()) {
      if (!existingModal) {
        showModal("Please rotate your device. This application is only available in landscape mode.");
      }
    } else if (existingModal) {
      // Si se rota al horizontal, recargo para mostrar el sitio
      location.reload();
    }
  });
});
