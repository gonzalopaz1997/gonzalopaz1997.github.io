// canva.js – dibujo libre dentro de #court-container con undo, clear y toggle
// Gonza – 15 jun 2025

(function () {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCanvas);
    } else {
      initCanvas();
    }
  
    function initCanvas() {
      const court = document.getElementById("court-container");
      if (!court) return console.error("canva.js: #court-container no encontrado");
  
      /*─ 1. Canvas superpuesto ─*/
      if (getComputedStyle(court).position === "static") court.style.position = "relative";
  
      const canvas = document.createElement("canvas");
      canvas.id = "drawingCanvas";
      Object.assign(canvas.style, {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 5,
        pointerEvents: "none",     // deshabilitado hasta elegir color
      });
      court.prepend(canvas);
  
      const ctx = canvas.getContext("2d");
  
      /*─ 2. Estados ─*/
      let currentColor = null;      // color activo o null
      let drawing = false;          // ¿ratón/touch presionado?
      const paths = [];             // pila de trazos {color, points}
      let currentPath = [];         // puntos del trazo en curso
  
      /*─ 3. Reajuste al redimensionar ─*/
      function resizeCanvas() {
        canvas.width  = court.clientWidth;
        canvas.height = court.clientHeight;
        redrawAll();
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
  
      /*─ 4. Dibujo y redibujado ─*/
      function redrawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const path of paths) drawPath(path);
      }
      function drawPath(path) {
        ctx.strokeStyle = path.color;
        ctx.lineWidth   = 3;
        ctx.lineCap     = "round";
        ctx.beginPath();
        path.points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.stroke();
      }
  
      /*─ 5. Toggle de colores ─*/
      window.toggleDrawing = (color, btn) => {
        const isSelected = btn.classList.contains("selected-color");
      
        // Siempre limpiar todos los botones de color
        document.querySelectorAll(".command-canva-btn.selected-color")
                .forEach(b => b.classList.remove("selected-color"));
      
        if (isSelected) {
          // 🔴 Caso: tocás el mismo color → se desactiva el modo dibujo
          currentColor = null;
          canvas.style.pointerEvents = "none";
        } else {
          // 🔵 Caso: tocás otro color → cambia color y activa dibujo
          currentColor = color;
          canvas.style.pointerEvents = "auto";
          btn.classList.add("selected-color");
        }
      
        drawing = false;
        ctx.beginPath(); // corta cualquier línea abierta
      };
      
  
      /*─ 6. Borrar todo y deshacer último ─*/
      window.clearCanvas = () => { paths.length = 0; redrawAll(); };
      window.undoLast    = () => { paths.pop();    redrawAll(); };
  
      /*─ 7. Helpers de posición ─*/
      const pos = (e) => {
        const r = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
        return { x, y };
      };
  
      /*─ 8. Eventos ratón / touch ─*/
      const start = (e) => {
        if (!currentColor) return;
        drawing = true;
        currentPath = [pos(e)];
        e.preventDefault();
      };
      const move = (e) => {
        if (!drawing) return;
        currentPath.push(pos(e));
        redrawAll();
        drawPath({ color: currentColor, points: currentPath });
        e.preventDefault();
      };
      const end = () => {
        if (drawing && currentPath.length) paths.push({ color: currentColor, points: currentPath });
        drawing = false;
      };
  
      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      canvas.addEventListener("mouseup", end);
      canvas.addEventListener("mouseleave", end);
  
      canvas.addEventListener("touchstart", start,   { passive: false });
      canvas.addEventListener("touchmove",  move,    { passive: false });
      canvas.addEventListener("touchend",   end);
      canvas.addEventListener("touchcancel", end);
    }
  })();
  