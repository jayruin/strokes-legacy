import { zhSVG } from "https://cdn.jsdelivr.net/gh/jayruin/animated-svg-strokes/strokes.js";
import JPScribe from "./modules/jp-scribe.js";

const jpScribe = new JPScribe(document.getElementById("target-jp"));

const shouldSaveCheckbox = document.getElementById("should-save");

const cnTarget = document.getElementById("target-cn");

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function render(svg, target) {
    const div = document.createElement("div");
    div.classList.add("stroke");
    div.appendChild(svg);
    target.appendChild(div);
}

function save(svg, filename) {
    const data = new Blob([new XMLSerializer().serializeToString(svg)]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(data);
    a.download = filename;
    a.click();
}

document.getElementById("generate-button-cn").addEventListener("click", async function () {
    const character = document.getElementById("character-input").value;
    const svg = await zhSVG(character);
    clear(cnTarget);
    render(svg, cnTarget);
    if (shouldSaveCheckbox.checked) {
        save(svg, `${character}-cn.svg`)
    }
});

document.getElementById("generate-button-jp").addEventListener("click", function () {
    const character = document.getElementById("character-input").value;
    jpScribe.renderFanningStrokes(character, shouldSaveCheckbox.checked);
});
