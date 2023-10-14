/**
 * @file plax.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plax
 * @description Edit PLA JSON files.
 */

const fs = require("fs");             // Import File System.
const base = require("./tool/base.js");
const ElementClass = require("./element.js").Element;

const consts = {
    DEFAULT_PATH_WINDOWS: process.env.USERPROFILE + "\\AppData\\LocalLow\\CIVITAS\\Quantum Physics\\Circuit",
    wire: {
        black: "黑色导线",
        blue: "蓝色导线",
        red: "红色导线",
        green: "绿色导线",
        yellow: "黄色导线"
    }
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

    /*
    setAttrToAll(attr, val) {

    }
    */

    /**
     * @method Copy all elements and move them by a specific steps.
     * @warning This function might be deprecated anytime since the developer of PLC is adding this function to the software program.
     * @param {[float, float, float]} steps The steps with an index of [x, y, z].
     */
    copyAllElementsAndMove(steps) {
        let status = this.status;
        let copy = status.Elements;
        for (let i = 0; i < copy.length; i++) {
            let pos = copy[i].Position.split(",").map(Number);
            copy[i].Identifier = base.generateNewElementID(this.json);
            copy[i].Position = `${pos[0] + steps[0]},${pos[1] + steps[2]},${pos[2] + steps[1]}`;
        }
        copy = this.status.Elements.concat(copy); // It seems two vars `copy` & `status.Elements` are bound together, but not completely
        status.Elements = copy;
        this.json.StatusSave = JSON.stringify(status);
        this.json.Components += copy.length;
        return this.json;
    }

    wire(SourceElement, sourcePin, TargetElement, targetPin, color='蓝色导线') {
        let status = this.status;
        status.Wires.push({
            Source: SourceElement.id,
            SourcePin: sourcePin,
            Target: TargetElement.id,
            TargetPin: targetPin,
            ColorName: color
        });
        this.json.StatusSave = JSON.stringify(status);
        return status.Wires;
    }

    /**
     * @method Copy all elements and wires and move them by a specific steps.
     * @warning This function might be deprecated anytime since the developer of PLC is adding this function to the software program.
     * @param {[float, float, float]} steps The steps with an index of [x, y, z].
     */
    copyAllAndMove(steps) {
        this.copyAllElementsAndMove(steps);
        let status = this.status;
        let l = status.Elements.length/2;
        for (let i = 0; i < status.Wires.length; i++) {
            let wire = status.Wires[i],
                es = new ElementClass(this.json, wire.Source),                  // Find the original elements
                et = new ElementClass(this.json, wire.Target),                  // Via ID
                nes = new ElementClass(this.json, null, null, es.index + l),    // Find the moved elements
                net = new ElementClass(this.json, null, null, et.index + l);    // Via index
            this.wire(nes, wire.SourcePin, net, wire.TargetPin, wire.ColorName);
        }
        return this.json;
    }

    /*
    fillWires() {

    }
    */

    /**
     * @method Insert an element into JSON.
     * @param {Element} Element The element that is to be inserted.
     * @param {int} n The index.
     * @param {last} last The index in reversed order. (Default: last one)
     */
    insert(Element, n=null, last=1) {
        let status = this.status;
        status.Elements.splice(n == null ? status.Elements.length-last+1 : n-1, 0, Element.json);
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }
    
    /**
     * @method Replace an element in JSON with another
     * @param {Element} Element The element that is to replace the one in JSON.
     * @param {string} id The ID of the element which is to be replaced. (Default: The one which share the same ID with the Element)
     * @param {int} n The index.
     * @param {last} last The index in reversed order.
     */
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

    /**
     * @method Replace all the elements with an ElementSet
     * @param {ElementSet} ElementSet The ElementSet that is to replace the one in JSON.
     */
    change(ElementSet) {
        let elements = [];
        for(let i = 0; i < ElementSet.card; i++) {
            elements.push(ElementSet.json(i));
        }
        let status = this.status;
        status.Elements = elements;
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }

    /**
     * @method Push all the elements in an ElementSet into JSON. (Run `ElementSet.refreshID(Editor)` first)
     * @param {ElementSet} ElementSet The ElementSet that is to be appended.
     */
    append(ElementSet) {
        let elements = [];
        for(let i = 0; i < ElementSet.card; i++) {
            elements.push(ElementSet.json(i));
        }
        let status = this.status;
        status.Elements.concat(elements);
        this.json.StatusSave = JSON.stringify(status);
        return this.json;
    }

    /*
    refresh(ElementSet) {

    }
    */
    
    get status() {
        return JSON.parse(this.json.StatusSave)
    }
}

class ElementSet {
    constructor(Editor=null, Element=null, type=null, from=null, to=null) {
        let json = Editor.json ? Editor.json : Editor;
        let elements = JSON.parse(json.StatusSave).Elements;
        this.elements = [];
        if (Editor != null) {
            if (Element != null) throw SyntaxError("Unexpected argument 'Element'.");
            if (type != null) {
                for (let i = 0; i < elements.length; i++) {

                }
            } else {
                let e;
                for (let i = 0; i < elements.length; i++) {
                    e = new ElementClass(Editor, null, null, i)
                    this.elements.push(e);
                }
            }
        } else if (Element != null) {
            this.elements[0] = Element;
        } else if (type != null) {
            throw SyntaxError("No 'Editor' is found.");
        }
    }
    
    index(n) {
        return this.elements[n].index;
    }

    json(n) {
        return this.elements[n].json;
    }

    lockAll() {
        for (let i = 0; i < this.card; i++) this.elements[i].lock();
        return this.elements;
    }

    unlockAll() {
        for (let i = 0; i < this.card; i++) this.elements[i].unlock();
        return this.elements;
    }

    breakAll() {
        for (let i = 0; i < this.card; i++) this.elements[i].break();
        return this.elements;
    }

    fixAll() {
        for (let i = 0; i < this.card; i++) this.elements[i].fix();
        return this.elements;
    }

    moveAll(steps) {
        for (let i = 0; i < this.card; i++) this.elements[i].move(steps);
        return this.elements;
    }

    gather(pos) {
        for (let i = 0; i < this.card; i++) this.elements[i].setPos(pos);
        return this.elements;
    }

    /*
    push(Element) {

    }

    delete(n=null, id=null) {

    }
    */

    refreshID(Editor) {
        for (let i = 0; i < this.card; i++) this.elements[i].newID(Editor);
        return this.elements;
    }

    get card() {
        return this.elements.length;
    }
}

// Export the functions.
exports.consts = consts;
exports.Editor = Editor;
exports.ElementSet = ElementSet;
exports.Element = ElementClass;
