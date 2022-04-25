/**
 * @file convert.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Convert codes to PLC local files.
 */

const plcx = require("./savedit.js");

class Converter {
    constructor() {
        this.var = {};
        this.needs = new Array();
    }
    findNeeds(json) {
    }
    addVar(name, val) {
        this.needs.push("");
        this.var[name] = val;
    }
}

exports.Converter = Converter;