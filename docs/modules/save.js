const isElectron = "electron" in window;

if (!isElectron) {
    await import("https://cdn.jsdelivr.net/gh/Stuk/jszip/dist/jszip.min.js");
}

function getHTMLAggregate(character, length, code) {
    const digits = Math.floor(Math.log10(length)) + 1;
    const doc = document.implementation.createHTMLDocument();
    const div = doc.createElement("div");
    div.classList.add("strokes");
    for (let i = 1; i < length + 1; i++) {
        const img = doc.createElement("img");
        img.src = `${character}-${code}-${i.toString().padStart(digits, "0")}.svg`;
        div.appendChild(img);
    }
    doc.body.appendChild(div);
    const styleText = ".strokes > img { width: 100px; height: 100px; border: 1px solid black; margin: 0em; }";
    const style = doc.createElement("style");
    style.appendChild(doc.createTextNode(styleText));
    doc.head.appendChild(style);
    const filename = `${character}-${code}.html`;
    const doctype = new XMLSerializer().serializeToString(doc.doctype);
    const html = doc.documentElement.outerHTML.replaceAll("><", ">\n<");
    const text = `${doctype}\n${html}`;
    return { filename, text };
}

async function save(character, svgs, code) {
    const files = [];
    const digits = Math.floor(Math.log10(svgs.length)) + 1;
    svgs.forEach((svg, index) => {
        const filename = `${character}-${code}-${(index + 1).toString().padStart(digits, "0")}.svg`;
        const text = svg.outerHTML;
        files.push({ filename, text });
    });
    files.push(getHTMLAggregate(character, svgs.length, code));
    if (isElectron) {
        files.forEach(file => window.electron.saveTextFile(file.filename, file.text));
    } else {
        const zip = new JSZip();
        files.forEach(file => zip.file(file.filename, file.text));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = `${character}-${code}.zip`;
        a.click();
    }
}

export default save;