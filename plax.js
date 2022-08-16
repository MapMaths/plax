/**
 * @file plax.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plax
 * @description Edit present JSON files.
 */

const fs = require("fs");             // Import File System.
const base = require("./tool/base.js");

const consts = {
    DEFAULT_PATH_WINDOWS: process.env.USERPROFILE + "\\AppData\\LocalLow\\CIVITAS\\Quantum Physics\\Circuit"
}

class Editor {
    constructor(filename, syntax="utf8") {
        this.filename = filename;
        this.JSON_ORIGIN = JSON.parse(fs.readFileSync(filename, syntax));
        this.SIMPLIFIED = this.JSON_ORIGIN.Experiment ? false : true;
        this.json = this.SIMPLIFIED ? this.JSON_ORIGIN : this.JSON_ORIGIN.Experiment;
    }

    /**
     * @method Write a PLC local file from a variable.
     * @param {string} filename The full absolute directory of the file.
     */
    write(filename=this.filename) {
        if (this.SIMPLIFIED) this.JSON_ORIGIN = this.json;
        else this.JSON_ORIGIN.Experiment = this.json;
        fs.writeFileSync(filename, JSON.stringify(this.JSON_ORIGIN, null, 2));
    }

    /**
     * @method Modify camera settings.
     * @param {int} mode 0 = Electricity, 1 = Graphical electricity, 3 = Universe, 4 = Electromagnetic field.
     * @param {digital} dist The distance of the camera to the sight center.
     * @param {[float, float, float]} pos The position of the camera, at an index of [x, y, z].
     * @param {[float, float, float]} dir The direction of the camera, at an index of [xy, xz, yz].
     */
    setCamera(mode=null, dist=null, pos=null, dir=null) {
        let camera = this.status;
        if (mode != null) camera.Mode = mode;
        if (dist != null) camera.Distance = dist;
        if (pos != null) camera.VisionCenter = `${pos[0]},${pos[2]},${pos[1]}`;
        if (dir != null) camera.TargetRotation = `${dir[0]},${dir[2]},${dir[1]}`;
        this.json.CameraSave = JSON.stringify(camera);
        return this.json;
    }

    /**
     * @method Copy all elements and move them by a specific steps.
     * @warning This function might be deprecated anytime since the developer of PLC's gonna add this to the software program.
     * @param {[float, float, float]} steps The steps with an index of [x, y, z]
     */
    copyAllElementsAndMove(steps) {
        let status = this.status;
        let copy = status.Elements;
        for (let i = 0; i < copy.length; i++) {
            let pos = copy[i].Position.split(",").map(Number);
            copy[i].Identifier = base.generateNewElementID(this.json);
            copy[i].Position = `${pos[0] + steps[0]},${pos[1] + steps[2]},${pos[2] + steps[1]}`;
        }
        copy = this.status.Elements.concat(copy); // It seems two vars `copy` & `status.Elements` are binded together, but not completely
        status.Elements = copy;
        this.json.StatusSave = JSON.stringify(status);
        this.json.Components += copy.length;
        return this.json;
    }

    wire(SourceElement, sourcePin, TargetElement, targetPin, color='蓝色导线') {
        let status = this.status;
        status.Wires.concat({
            Source: SourceElement.id,
            SourcePin: sourcePin,
            Target: TargetElement.id,
            TargetPin: targetPin,
            ColorName: color
        });
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }

    insert(Element, n=null, last=1) {
        let status = this.status;
        status.Elements.splice(n == null ? status.Elements.length-last+1 : n-1, 0, Element.json);
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }

    replace(Element, id=Element.id, n=null, last=null) {
        let status = this.status;
        if (n==null && last==null) {
            let x = status.Elements.findIndex(x => x.Identifier == id);
            x == -1 && base.elementError();
            status.Elements.splice(x, 1, Element.json);
        } else {
            let x = status.Elements.splice(n == null ? -last : n-1, 1, Element.json);
            x[0] == undefined && base.elementError();
        }
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }
    
    get status() {
        return JSON.parse(this.json.StatusSave)
    }
}

class Element {
    constructor(Editor, id=null, type=null, n=null) {
        let json = Editor.json ? Editor.json : Editor;
        let elements = JSON.parse(json.StatusSave).Elements;

        if (id != null) {
            if (type != null || n != null) throw SyntaxError("Unexpected arguments 'type' and 'n'.");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Identifier == id) {
                    this.json = elements[i];
                    this.num = i; break;
                }
            }
            base.elementError();
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
            base.elementError();
        } else if (n != null) {
            this.json = elements[n-1] || base.elementError();
            this.num = n - 1;
        } else {
            throw SyntaxError("At least one argument should have value.");
        }
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
    
    newID(Editor) {
        let json = Editor.json ? Editor.json : Editor;
        this.json.Identifier = base.generateNewElementID(json);
    }
    
    get id() {
        return this.json.Identifier;
    }
}

// Export the functions.
exports.consts = consts;
exports.Editor = Editor;
exports.Elements = Elements;
