// addons/listingPositions.js

import SavedPositions from './SavedPositions.js';

document.addEventListener("DOMContentLoaded", () => {
  const savedBtn = document.getElementById("saved-btn");

  // Modal creation
  const modal = document.createElement("div");
  modal.id = "positions-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modal.style.display = "none";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "30px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  window.currentFrameIndex = 0;
  window.currentDiagram = null;

  function applyFrame(frame) {
    Object.entries(frame).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.top = pos.top;
        el.style.left = pos.left;
        el.style.position = "absolute";
      }
    });
  }

  function showDiagram(diagram) {
    window.currentDiagram = diagram;
    window.currentFrameIndex = 0;
    applyFrame(diagram.frames[0]);
    window.updateNotesBox?.(); // ✅ actualiza nota al seleccionar diagrama
    modal.style.display = "none";
  }
  

  savedBtn.addEventListener("click", () => {
    modalContent.innerHTML = "<h2>Select one of the following recorded diagrams:</h2>";
    SavedPositions.forEach((diagram, index) => {
      const btn = document.createElement("button");
      btn.innerText = diagram.title;
      btn.className = "command-btn";
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      btn.style.margin = "10px";
      btn.onclick = () => showDiagram(diagram);
      modalContent.appendChild(btn);
    });

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.className = "close-btn";
    closeBtn.style.backgroundColor = "black";
    closeBtn.style.color = "white";
    closeBtn.style.marginTop = "20px";
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    const emptyLine = document.createElement("br");

    modalContent.appendChild(emptyLine);
    modalContent.appendChild(closeBtn);
    modal.style.display = "flex";
  });

  // Previous/Next buttons
  const previousBtn = document.createElement("button");
  previousBtn.innerText = "⬅ Previous";
  previousBtn.className = "command-btn";
  previousBtn.style.width = "200px";
  previousBtn.style.height = "50px";
  previousBtn.style.backgroundColor = "green";
  previousBtn.style.marginRight = "10px";

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next ➡";
  nextBtn.className = "command-btn";
  nextBtn.style.width = "200px";
  nextBtn.style.height = "50px";
  nextBtn.style.backgroundColor = "green";


  previousBtn.onclick = () => {
    if (window.currentDiagram && window.currentFrameIndex > 0) {
      window.currentFrameIndex--;
      applyFrame(window.currentDiagram.frames[window.currentFrameIndex]);
      window.updateNotesBox?.(); // ✅ actualiza nota si está visible
    }
  };
  
  nextBtn.onclick = () => {
    if (window.currentDiagram && window.currentFrameIndex < window.currentDiagram.frames.length - 1) {
      window.currentFrameIndex++;
      applyFrame(window.currentDiagram.frames[window.currentFrameIndex]);
      window.updateNotesBox?.(); // ✅ actualiza nota si está visible
    }
  };
  

  document.getElementById("command-previous-next-area").appendChild(previousBtn);
  document.getElementById("command-previous-next-area").appendChild(nextBtn);
});
