import Scribe from "./scribe.js";

class JPScribe extends Scribe {
    constructor(element) {
        super(element);
        this.code = "jp";
    }

    async loadCharacterData(character) {
        const rootURL = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";
        const characterFile = `${character.codePointAt(0).toString(16).padStart(5, "0")}.svg`;
        return fetch(`${rootURL}/${characterFile}`, { method: "GET" })
            .then(response => response.blob())
            .then(blob => blob.text())
            .then(text => new DOMParser().parseFromString(text, "image/svg+xml"))
            .then(xmlDocument => {
                const viewBox = xmlDocument.querySelector("svg").getAttribute("viewBox");
                const strokes = Array.from(xmlDocument.querySelectorAll("path"))
                    .sort((firstEl, secondEl) => {
                        const [firstNum, secondNum] = [firstEl, secondEl].map(el => parseInt(el.getAttribute("id").substring(el.getAttribute("id").indexOf("-s"))));
                        return firstNum - secondNum;
                    })
                    .map(element => element.getAttribute("d"));
                return { viewBox, strokes };
            });
    }

    createSVG(viewBox, strokes) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttributeNS(null, "viewBox", viewBox);

        const [minx, miny, width, height] = viewBox.split(" ").map(value => parseInt(value));
        svg.appendChild(this.createLine(width / 2, 0, width / 2, height, "#DDD"));
        svg.appendChild(this.createLine(0, height / 2, width, height / 2, "#DDD"));

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.style = "fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;";
        svg.appendChild(group);

        strokes.forEach(strokePath => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttributeNS(null, "d", strokePath);
            group.appendChild(path);
        });

        return svg;
    }
}

export default JPScribe;