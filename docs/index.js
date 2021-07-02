import CNScribe from "./modules/cn-scribe.js";
import JPScribe from "./modules/jp-scribe.js";

const cnScribe = new CNScribe(document.getElementById("target-cn"));
const jpScribe = new JPScribe(document.getElementById("target-jp"));

const shouldSaveCheckbox = document.getElementById("should-save");

document.getElementById("generate-button-jp").addEventListener("click", function () {
    const character = document.getElementById("character-input").value;
    jpScribe.renderFanningStrokes(character, shouldSaveCheckbox.checked);
});

document.getElementById("generate-button-cn").addEventListener("click", function () {
    const character = document.getElementById("character-input").value;
    cnScribe.renderFanningStrokes(character, shouldSaveCheckbox.checked);
});