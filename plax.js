/**
 * @file plax.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plax
 * @description Edit present JSON files.
 */

const fs = require("fs"); // Import File System.

const consts = {
    DEFAULT_PATH_WINDOWS: "C:\\Users\\Administrator\\AppData\\LocalLow\\CIVITAS\\Quantum Physics\\Circuit"
}

class Editor {
    constructor(filename, syntax="utf8") {
        this.filename = filename;
        this.json = JSON.parse(fs.readFileSync(filename, syntax));
    }

    /**
     * @method Write a PLC local file from a variable.
     * @param {string} filename The full absolute directory of the file.
     */
    write(filename=this.filename) {
        fs.writeFileSync(filename, JSON.stringify(this.json, null, 2));
    }

    /**
     * @method Modify camera settings.
     * @param {int} mode 0 = Electricity, 1 = Graphical electricity, 3 = Universe, 4 = Electromagnetic field.
     * @param {digital} dist The distance of the camera to the sight center.
     * @param {[float, float, float]} pos The position of the camera, at an index of [x, y, z].
     * @param {[float, float, float]} dir The direction of the camera, at an index of [xy, xz, yz].
     */
    setCamera(mode=null, dist=null, pos=null, dir=null) {
        let origin = this.json;
        let modify = JSON.parse(origin.Experiment.CameraSave);
        if (mode != null) modify.Mode = mode;
        if (dist != null) modify.Distance = dist;
        if (pos != null) modify.VisionCenter = `${pos[0]},${pos[2]},${pos[1]}`;
        if (dir != null) modify.TargetRotation = `${dir[0]},${dir[2]},${dir[1]}`;
        origin.Experiment.CameraSave = JSON.stringify(modify);
        this.json = origin;
        return origin;
    }

    /**
     * @method Copy all elements and move them by a specific steps.
     * @warning This function might be deprecated anytime since the developer of PLC's gonna add this to the software program.
     * @param {[float, float, float]} steps The steps with an index of [x, y, z]
     */
    copyAllElementsAndMove(steps) {
        let origin = this.json;
        let status = JSON.parse(origin.Experiment.StatusSave);
        let copy = status.Elements;
        for (let i = 0; i < copy.length; i++) {
            let pos = copy[i].Position.split(",").map(Number);
            copy[i].Identifier = generateNewElementID(json);
            copy[i].Position = `${pos[0] + steps[0]},${pos[1] + steps[2]},${pos[2] + steps[1]}`;
        }
        copy = JSON.parse(origin.Experiment.StatusSave).Elements.concat(copy); // It seems two vars `copy` & `status.Elements` are binded together, but not completely
        status.Elements = copy;
        origin.Experiment.StatusSave = JSON.stringify(status);
        origin.Components += copy.length;
        this.json = origin;
        return origin;
    }

    generateNewElementID() {
        let elements = JSON.parse(json.Experiment.StatusSave).Elements;
        let repeated = true;
        let id = '';
        while (repeated) {
            repeated = false;
            id = randomID(32);
            // Is it a repeated ID?
            for (let i = 0; i < elements.length; i++) {
                if (!repeated) repeated = false;
                if (elements[i].Identifier == id) repeated = true;
            }
        }
        return id;
    }

    randomID(length) {
        // Generate a random HEX ID, by the given length.
        let id = "";
        for (let i = 0; i < length; i++) {
            let rand = Math.floor(Math.random() * 16);
            let n = rand < 10 ? 48 : 87;
            id += String.fromCharCode(n + rand);
        }
        return id;
    }

    line(SourceElement, TargetElement, sourcePin, targetPin) {
        let origin = json;
        let status = JSON.parse(origin.Experiment.StatusSave);
        status.Wires.concat();
    }

    insert(Element, id=Element.id, n=Element.num) {
        
    }

    replace(Element, id=Element.id, n=Element.num) {}
}

class Element {
    constructor(Editor, id=null, type=null, n=null) {
        let json = Editor.json ? Editor.json : Editor;
        let elements = JSON.parse(json.Experiment.StatusSave).Elements;
        
        function cantFind() {throw SyntaxError("Can't find the element you are looking for.");}
        if (id != null) {
            if (type != null || n != null) throw SyntaxError("Unexpected arguments 'type' and 'n'.");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Identifier == id) {
                    this.json = elements[i];
                    this.num = i; break;
                }
            }
            cantFind();
        } else if (type != null) {
            for (let i = 0; i < elements.length; i++) {
                let num = 0;
                if (elements[i].Identifier == type) {
                    if (n != null) {
                        num++; if(num < n) continue;
                    }
                    this.json = elements[i];
                    this.num = i; break;
                }
            }
            cantFind();
        } else if (n != null) {
            this.json = elements[n-1] || cantFind();
            this.num = n;
        } else {cantFind();}
        this.id = this.json.Identifier;
    }

    setPos(pos) {
        this.json.Position = `${pos[0]},${pos[2]},${pos[1]}`;
    }

    setRot(rot) {
        this.json.Rotation = `${rot[0]},${rot[2]},${rot[1]}`;
    }

    lock() {
        this.json.IsLocked = true;
    }

    unlock() {
        this.json.IsLocked = false;
    }

    break() {
        this.json.IsBroken = true;
    }

    fix() {
        this.json.IsBroken = false;
    }

    insert(json) {
        let origin = json;
        let status = JSON.parse(origin.Experiment.StatusSave);
        status.Elements[this.num] = this.json;
        origin.Experiment.StatusSave = JSON.stringify(status)
        return origin;
    }
}

// Export the functions.
exports.consts = consts;
exports.Editor = Editor;
exports.Elements = Elements;
