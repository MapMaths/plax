/**
 * @file savedit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Edit present JSON files.
 */

const fs = require("fs"); // Import File System.

/**
 * @function Load a PLC local file to a variable.
 * @param {string} filename The full absolute directory of the file.
 */
function read(filename) {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
}

/**
 * @function Write a PLC local file from a variable.
 * @param {string} filename The full absolute directory of the file.
 * @param {string} json The JSON string.
 */
function write(filename, json) {
    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}

/**
 * @function Modify camera settings.
 * @param {string} json The JSON string to be modified.
 * @param {int} mode 0 = Electricity, 1 = Graphical electricity, 3 = Universe, 4 = Electromagnetic field.
 * @param {digital} dist The distance of the camera to the sight center.
 * @param {[float, float, float]} pos The position of the camera, at an index of [x, y, z].
 * @param {[float, float, float]} dir The direction of the camera, at an index of [xy, xz, yz].
 */
function setCamera(json, mode, dist, pos, dir) {
    let origin = json;
    let modify = JSON.parse(origin.Experiment.CameraSave);
    if (mode != null) modify.Mode = mode;
    if (dist != null) modify.Distance = dist;
    if (pos != null) modify.VisionCenter = `${pos[0]},${pos[2]},${pos[1]}`;
    if (dir != null) modify.TargetRotation = `${dir[0]},${dir[2]},${dir[1]}`;
    origin.Experiment.CameraSave = JSON.stringify(modify);
    return origin;
}

/* working
function line(Element, Element) {

}
*/

/**
 * @function Copy all elements and move them by a specific steps.
 * @warning This function might be deprecated anytime since the developer of PLC's gonna add this to the software program.
 * @param {[float, float, float]} steps The steps with an index of [x, y, z]
 */
function copyAllElementsAndMove(json, steps) {
    let origin = json;
    let status = JSON.parse(origin.Experiment.StatusSave);
    let elements = status.Elements;
    let copy = elements;
    for(let i = 0; i < copy.length; i++) {
        console.log(i);
        let pos = copy[i].Position.split(",").map(Number);
        copy[i].Identifier = generateNewElementID(json)
        console.log("done");
        copy[i].Position = `${pos[0] + steps[0]},${pos[1] + steps[2]},${pos[2] + steps[1]}`;
    }
    elements = elements.concat(copy);
    status.Elements = elements;
    origin.Experiment.StatusSave = JSON.stringify(status);
    return origin;
}

function generateNewElementID(json) {
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

function randomID(length) {
    // Generate a random HEX ID, by the given length.
    let id = "";
    for (let i = 0; i < length; i++) {
        let rand = Math.floor(Math.random() * 16);
        let n = 48;
        if (rand >= 10) n = 87; // a bit lazy LOL
        id += String.fromCharCode(n + rand);
    }
    return id;
}

class Element {
    constructor(json, element) {
        let elements = JSON.parse(json.Experiment.StatusSave).Elements;
        if (element[0] != null) { // id
            // if (element[1] != null || element[2] != null) console.log('\033[33m\033[7m Warning \033[0m\033[33m Only the first argument will be read since others should be \033[4mnull\033[0m');
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Identifier == element[0]) {
                    this.json = elements[i];
                    this.num = i;
                    break;
                }
            }
        } else if (element[1] != null) { // number
            this.json = elements[element[1]];
            this.num = element[1];
        } else { // element name
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Identifier == element[2]) {
                    this.json = elements[i];
                    this.num = i;
                    break;
                }
            }
        }
        this.id = this.json.Identifier;
        this.pos = this.json.Position;
        this.rot = this.json.Rotation;
    }
    setPos(pos) {
        this.json.Position = `${pos[0]},${pos[2]},${pos[1]}`;
        this.pos.x = pos[0];
        this.pos.y = pos[1];
        this.pos.z = pos[2];
    }
    setRot(rot) {
        this.json.Rotation = `${rot[0]},${rot[2]},${rot[1]}`;
        this.rot.xy = rot[0];
        this.rot.xz = rot[1];
        this.rot.yz = rot[2];
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
exports.read = read;
exports.write = write;
exports.setCamera = setCamera;
exports.copyAllElementsAndMove = copyAllElementsAndMove;
exports.generateNewElementID = generateNewElementID;
exports.Element = Element;