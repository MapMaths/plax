/**
 * @file savsetup.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Setting up environment for JSON files.
 */

/**
 * @function setup - Setting up a basic SAV file automatically.
 * @param {int} type: 0 = Electricity, 1 = Graphical electricity, 3 = Universe, 4 = Electromagnetic
 */
function setup(type, language, category) {
    var json = {
        "Type": type,
        "Experiment": {
            "ID": null,
            "Type": type
        },
        "ID": null,
        "Summary": {
            "Type": 0,
            "Editor": null,
            "Coauthors": [],
            "Description": [],
            "LocalizedDescription": null,
            "Tags": [],
            "ModelID": null,
            "ModelName": null,
            "ModelTags": [],
            "Version": 2303,
            "Language": language,
            "Category": category,
            "Subject": "(申精)七段十进制DAC",
            "LocalizedSubject": null,
        }
    };
}