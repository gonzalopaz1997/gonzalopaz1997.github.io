document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent);
  const isTablet = /iPad|Tablet/i.test(navigator.userAgent);

  const isPortrait = () => window.innerHeight > window.innerWidth;

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

  // Mostrar modal si es teléfono
  if (isMobile && !isTablet) {
    showModal("This application is not available on mobile devices.");
    return;
  }

  // Mostrar modal si es tablet pero está en vertical
  if (isTablet && isPortrait()) {
    showModal("Please rotate your device. This application is only available in landscape mode.");
  }

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
