/**
 * @file savedit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Edit present JSON files.
 */

"use strict";

const fs = require("fs");

/**
 * @function Load a PLC local file to a variable.
 * @param {string} filename The absolute directory of the file(include .sav).
 */
function read(filename) {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
}

/**
 * @function Write a PLC local file from a variable.
 * @param {string} filename The absolute directory of the file(include .sav).
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
 * @param {array[float]} pos The position of the camera, at an index of [x, y, z].
 * @param {array[float]} rot The rotation of the camera, at an index of [xy, xz, yz].
 */
function setCamera(json, mode, dist, pos, rot) {
    let origin = json;
    let modify = JSON.parse(origin.Experiment.CameraSave)
    if (mode != null) modify.Mode = mode;
    if (dist != null) modify.Distance = dist;
    if (pos != null) modify.VisionCenter = `${pos[0]},${pos[2]},${pos[1]}`;
    if (rot != null) modify.TargetRotation = `${rot[0]},${rot[2]},${rot[1]}`;
    origin.Experiment.CameraSave = JSON.stringify(modify);
    return origin;
}

// Export the functions.
exports.read = read;
exports.write = write;
exports.setCamera = setCamera;