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
            <button id="get-instructions-btn" class="command-btn">Get Instructions ❓</button><br><br>
            <button id="record-frame-btn" class="command-btn">➕ Record Current Frame</button>
            <button id="export-json-btn" class="command-btn">✅ Finish & Export</button>
            <button id="cancel-export-btn" class="command-btn">❌ Cancel</button>
            <p id="frame-count" style="margin-top: 10px;">Frames recorded: 0</p>
            <textarea id="export-output" style="width: 100%; height: 200px; margin-top: 15px; display: none;"></textarea>
        `;

        modal.style.display = "flex";

        const getInstructionsBtn = document.getElementById("get-instructions-btn");
        if (getInstructionsBtn) {
            getInstructionsBtn.onclick = () => {
                const link = document.createElement("a");
                link.href = "ExportingInstructions.pdf";
                link.download = "ExportingInstructions.pdf";
                link.click();
            };
        } else {
            console.error("Get Instructions button (#get-instructions-btn) not found!");
        }

        const recordFrameBtn = document.getElementById("record-frame-btn");
        if (recordFrameBtn) {
            recordFrameBtn.onclick = () => {
                const frame = {};
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        frame[id] = { top: el.style.top, left: el.style.left };
                    }
                });

                const comment = document.getElementById("frame-comment").value.trim();
                if (comment) frame.comment = comment;

                recordedFrames.push(frame);
                document.getElementById("frame-count").textContent = `Frames recorded: ${recordedFrames.length}`;
                document.getElementById("frame-comment").value = "";
                modal.style.display = "none";
                createFloatingBtn();
            };
        } else {
            console.error("Record Frame button (#record-frame-btn) not found!");
        }

        const exportJsonBtn = document.getElementById("export-json-btn");
        if (exportJsonBtn) {
            exportJsonBtn.onclick = () => {
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

                // Debugging log
                console.log("Export Data:", exportData);

                const oneLinerExport = `// START - ${title}\n${JSON.stringify(exportData).replace(/\n/g, '')}\n// END - ${title}`;

                const output = document.getElementById("export-output");
                output.value = oneLinerExport;
                output.style.display = "block";

                let downloadBtn = document.getElementById("download-json-btn");
                if (!downloadBtn) {
                    downloadBtn = document.createElement("button");
                    downloadBtn.id = "download-json-btn";
                    downloadBtn.innerText = "📥 Download One-Liner Export";
                    downloadBtn.className = "command-btn";
                    downloadBtn.style.marginTop = "10px";
                    modalContent.appendChild(downloadBtn);
                }

                downloadBtn.onclick = () => {
                    const blob = new Blob([oneLinerExport], { type: "text/plain" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `PLAY - ${title.replace(/\s+/g, '_')}.txt`;
                    link.click();
                };

                if (floatingBtn) floatingBtn.remove();
                floatingBtn = null;
            };
        } else {
            console.error("Export JSON button (#export-json-btn) not found!");
        }

        const cancelExportBtn = document.getElementById("cancel-export-btn");
        if (cancelExportBtn) {
            cancelExportBtn.onclick = () => {
                modal.style.display = "none";
                if (floatingBtn) floatingBtn.remove();
                floatingBtn = null;
            };
        } else {
            console.error("Cancel Export button (#cancel-export-btn) not found!");
        }
    });
});
