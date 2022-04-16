/**
 * @file apps/edit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description A short app to read and write a PLC local file.
 */

const plcx = require("..\\savedit.js"),
    filename = "C:\\Users\\Administrator\\AppData\\LocalLow\\CIVITAS\\Quantum Physics\\Circuit\\307e56b8-2f9a-4d11-bb29-f227b32e2eee.sav";
var json = plcx.read(filename);

json = plcx.setCamera(json, null, null, [0, 4, 0], null);
console.log(json);
plcx.write(filename, json)