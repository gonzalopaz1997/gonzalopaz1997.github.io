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

    // Here we create the one-liner export format for the SavedPositions.js
    const oneLinerExport = `// START - ${title}\n${JSON.stringify(exportData).replace(/\n/g, '')}\n// END - ${title}`;

    const output = document.getElementById("export-output");
    output.value = oneLinerExport;
    output.style.display = "block";

    // Button to download the export as .txt (for easy copy-pasting into the SavedPositions.js)
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
        // Save the file with a custom name based on the title
        link.download = `PLAY - ${title.replace(/\s+/g, '_')}.txt`;
        link.click();
    };

    if (floatingBtn) floatingBtn.remove();
    floatingBtn = null;
};
