import { strokes } from "https://cdn.jsdelivr.net/gh/jayruin/animated-svg-strokes/strokes.js";
import JPScribe from "./modules/jp-scribe.js";

const jpScribe = new JPScribe(document.getElementById("target-jp"));

const shouldSaveCheckbox = document.getElementById("should-save");

const cnTarget = document.getElementById("target-cn");
const jpTarget = document.getElementById("target-jp");

const cnGetSVG = strokes("zh", "svg", {totalStrokeDuration: 0.5});
const jpGetSVG = strokes("ja", "svg", {totalStrokeDuration: 0.5});

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function render(svg, target) {
    const img = document.createElement("img");
    img.classList.add("stroke");
    img.src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], {type: "image/svg+xml"}));
    target.appendChild(img);
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
    const svg = await cnGetSVG(character);
    clear(cnTarget);
    render(svg, cnTarget);
    if (shouldSaveCheckbox.checked) {
        save(svg, `${character}-cn.svg`)
    }
});

document.getElementById("generate-button-jp").addEventListener("click", async function () {
    const character = document.getElementById("character-input").value;
    const svg = await jpGetSVG(character);
    clear(jpTarget);
    render(svg, jpTarget);
    if (shouldSaveCheckbox.checked) {
        save(svg, `${character}-jp.svg`)
    }
});
