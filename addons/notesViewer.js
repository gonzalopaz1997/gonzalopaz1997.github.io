document.addEventListener("DOMContentLoaded", () => {
  const notesBtn = document.getElementById("notes-btn");

  if (!notesBtn) return;

  let notesBox = null;

  notesBtn.addEventListener("click", () => {
    if (notesBox) {
      notesBox.remove();
      notesBox = null;
      return;
    }

    notesBox = document.createElement("div");
    notesBox.id = "notes-box";
    Object.assign(notesBox.style, {
      position: "absolute",
      bottom: "80px",
      right: "20px",
      backgroundColor: "#fff8b0",
      padding: "20px",
      border: "1px solid #e2c044",
      borderRadius: "10px",
      maxWidth: "320px",
      fontFamily: "sans-serif",
      fontSize: "1.1rem",
      color: "black",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: 1500,
      whiteSpace: "pre-wrap",
      cursor: "move",
    });

    // Cerrar con X
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "&times;";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "5px",
      right: "10px",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "bold",
    });
    closeBtn.addEventListener("click", () => {
      notesBox.remove();
      notesBox = null;
    });
    notesBox.appendChild(closeBtn);

    // Contenido interno
    const contentDiv = document.createElement("div");
    contentDiv.id = "notes-content";
    notesBox.appendChild(contentDiv);

    document.body.appendChild(notesBox);
    window.updateNotesBox();

    makeDraggable(notesBox);
  });

  // Actualiza el contenido del cuadro de notas
  window.updateNotesBox = function () {
    const notesBox = document.getElementById("notes-box");
    if (!notesBox) return;

    const contentDiv = document.getElementById("notes-content");
    if (!contentDiv) return;

    const diagram = window.currentDiagram;
    const frameIndex = window.currentFrameIndex;

    if (!diagram || frameIndex == null) {
      contentDiv.innerHTML =
        "<b>FIBA 3x3 NOTES:</b><br>No comments available for this specific diagram.";
      return;
    }

    const frame = diagram.frames[frameIndex];
    const comment =
      frame && frame.comment
        ? frame.comment
        : "No comments available for this specific diagram.";

    let html = `<b>FIBA 3x3 NOTES:</b><br><br>${comment}`;

    // Agrega botón "Watch clip" si hay youtubeLink y aún no se mostró el reproductor
    console.log(diagram.youtubeLink)
    if (diagram.youtubeLink && getYouTubeVideoId(diagram.youtubeLink)) {
      html += `
        <br><br>
        <button id="watch-clip-btn" style="
          background-color: white;
          color: black;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: medium;
          font-weight: bold;
          cursor: pointer;
        ">🔴Watch clip ▶️</button>
      `;
    }

    contentDiv.innerHTML = html;

    // Agregar funcionalidad al botón
    const btn = document.getElementById("watch-clip-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        const videoId = getYouTubeVideoId(diagram.youtubeLink);

        if (videoId) {
          // Verificar si es un YouTube Clip o un video normal
          if (isYouTubeClip(diagram.youtubeLink)) {
            // Si es un YouTube Clip, redirigir al usuario al enlace del clip
            contentDiv.innerHTML += `
              <br><br>
              <p>This is a youtube clip, cannot be played here. <a href="${diagram.youtubeLink}" target="_blank">Just click here to go to the video.</a></p>
            `;
          } else {
            // Si es un video normal, insertar el iframe
            contentDiv.innerHTML += `
              <br><br>
              <iframe width="100%" height="200" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            `;
          }
          btn.remove(); // Quitar el botón una vez insertado el video o redirigido al clip
        }
      });
    }
  };

  // Extrae el ID del video de YouTube desde la URL
  function getYouTubeVideoId(url) {
    const clipRegex = /(?:youtube\.com\/clip\/)([a-zA-Z0-9_-]+)/;
    const regularRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    
    // Intentamos primero con el formato de clip
    let match = url.match(clipRegex);
    if (match) {
      return match[1];  // Si es un clip, devuelve el ID del clip
    }
    
    // Si no es un clip, intentamos con el formato normal
    match = url.match(regularRegex);
    return match ? match[1] : null;  // Devuelve el ID del video, o null si no lo encuentra
  }

  // Función para verificar si es un YouTube Clip
  function isYouTubeClip(url) {
    const clipRegex = /(?:youtube\.com\/clip\/)/;
    return clipRegex.test(url);
  }

  // Hace el cuadro movible
  function makeDraggable(element) {
    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    element.addEventListener("mousedown", (e) => {
      if (e.target.id === "watch-clip-btn" || e.target.tagName === "IFRAME" || e.target.innerHTML === "&times;") return;
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      element.style.cursor = "move";
    });
  }
});
