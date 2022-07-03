/**
 * @file demos/copy.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Copy all elements.
 */

const plcx = require("../savedit.js"),
    filename = "../test.sav";
var json = plcx.read(filename);

json = plcx.copyAllElementsAndMove(json, [0.5, 0, 0]);
console.log(json);
plcx.write(filename, json);