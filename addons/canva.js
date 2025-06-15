
// canva.js - addon to enable freehand drawing inside #court-container
// Gonza 2025-06-15

(function () {
  // Wait until DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
  } else {
    initCanvas();
  }

  function initCanvas() {
    const court = document.getElementById("court-container");
    if (!court) {
      console.error("canva.js: #court-container not found");
      return;
    }

    // Ensure court is positioned
    const courtStyle = getComputedStyle(court);
    if (courtStyle.position === "static") {
      court.style.position = "relative";
    }

    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.id = "drawingCanvas";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 5;  // above draggable elements but below modals/tooltips
    canvas.style.pointerEvents = "none";  // disabled until a color is chosen
    court.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let currentColor = null;
    let drawing = false;

    function resizeCanvas() {
      canvas.width = court.clientWidth;
      canvas.height = court.clientHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Public API
    window.enableDrawing = (color) => {
      currentColor = color;
      canvas.style.pointerEvents = "auto";
      drawing = false;
      ctx.beginPath(); // reset path so color applies immediately
    };

    window.clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    };

    // Helpers
    function getPos(evt) {
      const rect = canvas.getBoundingClientRect();
      if (evt.touches && evt.touches[0]) {
        return {
          x: evt.touches[0].clientX - rect.left,
          y: evt.touches[0].clientY - rect.top,
        };
      }
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }

    function start(evt) {
      if (!currentColor) return;
      drawing = true;
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      const { x, y } = getPos(evt);
      ctx.beginPath();
      ctx.moveTo(x, y);
      evt.preventDefault();
    }

    function move(evt) {
      if (!drawing) return;
      const { x, y } = getPos(evt);
      ctx.lineTo(x, y);
      ctx.stroke();
      evt.preventDefault();
    }

    function end() {
      drawing = false;
    }

    // Mouse events
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);

    // Touch events
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    canvas.addEventListener("touchcancel", end);
  }
})();
