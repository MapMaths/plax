/**
 * @file apps/edit.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description A short app to read and write a PLC local file.
 */

var plcx = require("../savedit.js");
const filename = "C:\\Users\\Administrator\\Desktop\\test.sav";

console.log(filename);
console.log(plcx.read(filename));