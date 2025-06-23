document.addEventListener("DOMContentLoaded", () => {
    const exportBtn = document.getElementById("export-btn");
    if (!exportBtn) {
        console.error("Export button (#export-btn) not found!");
        return;
    }

    let recordedFrames = [];
    let floatingBtn;

    const ids = ["A1", "A2", "A3", "B1", "B2", "B3", "lead", "trail", "ball"];

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

    function createFloatingBtn() {
        if (floatingBtn) return;
        floatingBtn = document.createElement("button");
        floatingBtn.innerText = "🧰 Back to RECORDER";
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
        console.log("Export button clicked");  // Debugging log
        recordedFrames = [];

        modalContent.innerHTML = `
            <h2>Record New Diagram</h2>
            <input type="text" id="diagram-title" placeholder="Type a title for this new mechanics diagram." style="width: 80%; padding: 5px;"><br><br>
            <input type="url" id="youtube-link" placeholder="Link to a YouTube video (optional)" style="width: 80%; padding: 5px;"/><br><br>
            <textarea id="frame-comment" placeholder="Write your comment for the current frame." style="width: 80%; height: 100px; padding: 5px; margin-top: 10px;"></textarea><br><br>
            <button id="record-frame-btn" class="command-btn">➕ Record Current Frame</button>
            <button id="export-json-btn" class="command-btn">✅ Finish & Export</button>
            <button id="cancel-export-btn" class="command-btn">❌ Cancel</button>
            <p id="frame-count" style="margin-top: 10px;">Frames recorded: 0</p>
            <textarea id="export-output" style="width: 100%; height: 200px; margin-top: 15px; display: none;"></textarea>
        `;

        modal.style.display = "flex";

        // Acción para el botón de "Record Current Frame"
        document.getElementById("record-frame-btn").onclick = () => {
            const frame = {};
            ids.forEach(id => {
                const el = document.getElementById(id);
                frame[id] = {
                    top: el.style.top,
                    left: el.style.left
                };
            });

            // Tomamos el comentario desde el textarea
            const comment = document.getElementById("frame-comment").value.trim();
            if (comment) frame.comment = comment;

            recordedFrames.push(frame);
            document.getElementById("frame-count").textContent = `Frames recorded: ${recordedFrames.length}`;
            document.getElementById("frame-comment").value = "";  // Limpiar el textarea para el siguiente frame
            modal.style.display = "none";
            createFloatingBtn();
        };

        // Acción para el botón de "Finish & Export"
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

            // JSON.stringify con el espacio de indentación a null para evitar saltos de línea
            output.value = JSON.stringify(exportData).replace(/\n/g, '').replace(/\s+/g, ' ');

            output.style.display = "block";

            // Botón de descarga JSON
            let downloadBtn = document.getElementById("download-json-btn");
            if (!downloadBtn) {
                downloadBtn = document.createElement("button");
                downloadBtn.id = "download-json-btn";
                downloadBtn.innerText = "📥 Download JSON";
                downloadBtn.className = "command-btn";
                downloadBtn.style.marginTop = "10px";
                modalContent.appendChild(downloadBtn);
            }

            downloadBtn.onclick = () => {
                const blob = new Blob([JSON.stringify(exportData)], { type: "application/json" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                // Cambiar el nombre del archivo: "RECORDED FRAMES - [Título].json"
                link.download = `RECORDED FRAMES - ${title.replace(/\s+/g, '_')}.txt`; 
                link.click();
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
