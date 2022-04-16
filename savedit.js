/**
 * @file savedit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Edit present JSON files.
 */

"use strict";

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
    let modify = JSON.parse(origin.Experiment.CameraSave)
    if (mode != null) modify.Mode = mode;
    if (dist != null) modify.Distance = dist;
    if (pos != null) modify.VisionCenter = `${pos[0]},${pos[2]},${pos[1]}`;
    if (dir != null) modify.TargetRotation = `${dir[0]},${dir[2]},${dir[1]}`;
    origin.Experiment.CameraSave = JSON.stringify(modify);
    return origin;
}

class Element {
    constructor(json, id) {
        let elements = JSON.parse(json.Experiment.StatusSave).Elements;
        for(let i = 0; i < elements.length; i++) {
            if (elements[i].Identifier == id) {
                this.json = elements[i];
                this.num = i;
                break;
            }
        }
        this.id = id;
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
        JSON.parse(origin.Experiment.StatusSave).Elements[this.num] = this.json;
        return origin;
    }
}

// Export the functions.
exports.read = read;
exports.write = write;
exports.setCamera = setCamera;
exports.Element = Element;