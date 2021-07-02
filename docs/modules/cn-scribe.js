import Scribe from "./scribe.js";
import HanziWriter from "https://cdn.jsdelivr.net/npm/hanzi-writer/dist/index.esm.js";

class CNScribe extends Scribe {
    constructor(element) {
        super(element);
        this.code = "cn";
    }

    async loadCharacterData(character) {
        const charData = await HanziWriter.loadCharacterData(character);
        return { viewBox: "0 0 1024 1024", strokes: charData.strokes };
    }

    createSVG(viewBox, strokes) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttributeNS(null, "viewBox", viewBox);

        const [minx, miny, width, height] = viewBox.split(" ").map(value => parseInt(value));
        svg.appendChild(this.createLine(width / 2, 0, width / 2, height, "#DDD"));
        svg.appendChild(this.createLine(0, height / 2, width, height / 2, "#DDD"));

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const transformData = HanziWriter.getScalingTransform(width, height);
        group.setAttributeNS(null, "transform", transformData.transform);
        svg.appendChild(group);

        strokes.forEach(strokePath => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttributeNS(null, "d", strokePath);
            path.style.fill = "#000";
            group.appendChild(path);
        });

        return svg;
    }
}

export default CNScribe;