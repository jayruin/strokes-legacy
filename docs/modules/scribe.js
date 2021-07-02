import save from"./save.js";

class Scribe {
    constructor(element) {
        this.element = element;
        this.code = "";
    }

    clear() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.lastChild);
        }
    }

    createLine(x1, y1, x2, y2, stroke) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttributeNS(null, "x1", x1);
        line.setAttributeNS(null, "y1", y1);
        line.setAttributeNS(null, "x2", x2);
        line.setAttributeNS(null, "y2", y2);
        line.setAttributeNS(null, "stroke", stroke);
        line.setAttributeNS(null, "stroke-width", "1%");
        return line;
    }

    async loadCharacterData(character) {
        throw "Not Implemented";
    }

    createSVG(viewBox, strokes) {
        throw "Not Implemented";
    }

    async createSVGs(character) {
        const svgs = [];
        const charData = await this.loadCharacterData(character);
        for (let i = 0; i < charData.strokes.length; i++) {
            const strokesPortion = charData.strokes.slice(0, i + 1);
            svgs.push(this.createSVG(charData.viewBox, strokesPortion));
        }
        return svgs;
    }

    async renderFanningStrokes(character, shouldSave) {
        this.clear();
        const svgs = await this.createSVGs(character);
        for (let i = 0; i < svgs.length; i++) {
            const svg = svgs[i];
            const div = document.createElement("div");
            div.classList.add("stroke");
            div.appendChild(svg);
            this.element.appendChild(div);
        }
        if (shouldSave) {
            await save(character, svgs, this.code);
        }
    }
}

export default Scribe;