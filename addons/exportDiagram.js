// addons/exportDiagram.js

document.addEventListener("DOMContentLoaded", () => {
    const exportBtn = document.getElementById("export-btn");
  
    let recordedFrames = [];
    let floatingBtn;
  
    const ids = [
      "A1", "A2", "A3",
      "B1", "B2", "B3",
      "lead", "trail", "ball"
    ];
  
    // Crear modal principal
    const modal = document.createElement("div");
    modal.id = "export-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    });
  
    const modalContent = document.createElement("div");
    Object.assign(modalContent.style, {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      textAlign: "center",
      width: "60%",
      maxHeight: "80%",
      overflowY: "auto"
    });
  
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  
    // Crear botón flotante para volver al grabador
    function createFloatingBtn() {
      if (floatingBtn) return;
      floatingBtn = document.createElement("button");
      floatingBtn.innerText = "🧰 Volver al grabador";
      Object.assign(floatingBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 3000,
        padding: "10px 15px",
        backgroundColor: "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
      });
      floatingBtn.onclick = () => {
        modal.style.display = "flex";
        floatingBtn.remove();
        floatingBtn = null;
      };
      document.body.appendChild(floatingBtn);
    }
  
    exportBtn.addEventListener("click", () => {
      recordedFrames = [];
  
      modalContent.innerHTML = `
        <h2>Record New Diagram</h2>
        <input type="text" id="diagram-title" placeholder="Type a title for this new mechanics diagram." style="width: 80%; padding: 5px;"><br><br>
        <input type="url" id="youtube-link" placeholder="Link to a YouTube video(optional)" style="width: 80%; padding: 5px;"/><br><br>
        <button id="record-frame-btn" class="command-btn">➕ Record Current Frame</button>
        <button id="export-json-btn" class="command-btn">✅ Finish & Export</button>
        <button id="cancel-export-btn" class="command-btn">❌ Cancel</button>
        <p id="frame-count" style="margin-top: 10px;">Frames recorded: 0</p>
        <textarea id="export-output" style="width: 100%; height: 200px; margin-top: 15px; display: none;"></textarea>
      `;
  
      modal.style.display = "flex";
  
      document.getElementById("record-frame-btn").onclick = () => {
        const frame = {};
        ids.forEach(id => {
          const el = document.getElementById(id);
          frame[id] = {
            top: el.style.top,
            left: el.style.left
          };
        });
        const comment = prompt("Comentario para este frame:");
        if (comment) frame.comment = comment;
  
        recordedFrames.push(frame);
        document.getElementById("frame-count").textContent = `Frames recorded: ${recordedFrames.length}`;
        modal.style.display = "none";
        createFloatingBtn();
      };
  
      document.getElementById("export-json-btn").onclick = () => {
        const youtubeLink = document.getElementById('youtube-link').value;
        const title = document.getElementById("diagram-title").value.trim();
        if (!title || recordedFrames.length === 0) {
          alert("Please provide a title and at least one frame.");
          return;
        }
        const exportData = {
          title,
          youtubeLink,
          frames: recordedFrames
        };
        const output = document.getElementById("export-output");
        output.value = JSON.stringify(exportData, null, 2);
        output.style.display = "block";
        
        // Botón de copiar
        let copyBtn = document.getElementById("copy-json-btn");
        if (!copyBtn) {
          copyBtn = document.createElement("button");
          copyBtn.id = "copy-json-btn";
          copyBtn.innerText = "📋 Copiar JSON";
          copyBtn.className = "command-btn";
          copyBtn.style.marginTop = "10px";
          modalContent.appendChild(copyBtn);
        }
        
        copyBtn.onclick = () => {
          output.select();
          document.execCommand("copy");
        
          copyBtn.innerText = "✅ Copiado";
          setTimeout(() => {
            copyBtn.innerText = "📋 Copiar JSON";
          }, 2000);
        };
        
        if (floatingBtn) floatingBtn.remove();
        floatingBtn = null;
      };
  
      document.getElementById("cancel-export-btn").onclick = () => {
        modal.style.display = "none";
        if (floatingBtn) floatingBtn.remove();
        floatingBtn = null;
      };
    });
  });