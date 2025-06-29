document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent) && !/iPad|Tablet/i.test(navigator.userAgent);

  if (isMobile) {
    // Escalar el court-container
    const courtContainer = document.getElementById("court-container");
    if (courtContainer) {
      courtContainer.style.transform = "scale(0.6)";
      courtContainer.style.transformOrigin = "top left";
      courtContainer.style.position = "relative";
      courtContainer.style.width = "fit-content";
    }

    // Ocultar header y footer
    const siteHeader = document.querySelector(".site-header");
    const siteFooter = document.querySelector(".site-footer");

    if (siteHeader) siteHeader.style.display = "none";
    if (siteFooter) siteFooter.style.display = "none";
  }
});
