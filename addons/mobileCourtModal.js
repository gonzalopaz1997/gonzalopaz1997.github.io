document.addEventListener("DOMContentLoaded", () => {
  // Detectar si el dispositivo es móvil o tablet
  const isMobileOrTablet = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);

  if (!isMobileOrTablet) return;

  // Ocultar las secciones
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

  const warningIcon = document.createElement("div");
  warningIcon.innerText = "⚠️";
  warningIcon.style.fontSize = "64px";
  warningIcon.style.marginBottom = "20px";

  const message = document.createElement("div");
  message.innerText = "This tool is currently available only on desktop devices.";
  message.style.fontSize = "1.5rem";
  message.style.maxWidth = "400px";

  modal.appendChild(warningIcon);
  modal.appendChild(message);
  document.body.appendChild(modal);
});
