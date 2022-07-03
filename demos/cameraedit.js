/**
 * @file apps/cameraedit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description A short app to read and write a PLC local file.
 */

const plcx = require("../savedit.js"),
    filename = "../test.sav";
var json = plcx.read(filename);

json = plcx.setCamera(json, null, null, [0, 4, 0], null);
console.log(json);
plcx.write(filename, json)