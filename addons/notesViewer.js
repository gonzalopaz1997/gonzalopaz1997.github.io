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
          contentDiv.innerHTML += `
            <br><br>
            <iframe width="100%" height="200" 
              src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          `;
          btn.remove(); // Quitar el botón una vez insertado el video
        }
      });
    }
  };

  // Extrae el ID del video de YouTube desde la URL
  function getYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
