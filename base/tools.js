/**
 * @file tools.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Setting up environment for JSON files.
 */

randomID(length) {
  // Generate a random HEX ID, by the given length.
  let id = "";
  for (let i = 0; i < length; i++) {
    let rand = Math.floor(Math.random() * 16);
    let n = rand < 10 ? 48 : 87;
    id += String.fromCharCode(n + rand);
  }
  return id;
}

generateNewElementID(json) {
  let elements = JSON.parse(json.StatusSave).Elements;
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

function elementError() {
  let e = new Error("Can't find the element you are looking for.");
  e.name = 'ElementError';
  throw e;
}

// Export the functions.
exports.randomID = randomID;
exports.generateNewElementID = generateNewElementID;
exports.elementError = elementError;
