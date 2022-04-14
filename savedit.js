/**
 * @file savedit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Edit present JSON files.
 */

"use strict";

//import { readFile, writeFile } from 'fs';
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

// Export the functions.
exports.read = read;
exports.write = write;