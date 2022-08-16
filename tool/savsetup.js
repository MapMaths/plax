/**
 * @file savsetup.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plcx
 * @description Setting up environment for JSON files.
 */

/**
 * @function Setting up a basic SAV file automatically.
 * @param {int} type 0 = Electricity, 1 = Graphical electricity, 3 = Universe, 4 = Electromagnetic.
 * @param {string} language "Chinese", "English", "Polish".
 * @param {string} category "Experiment", "Discussion".
 * @param {string} subject The name of your project.
 */
function setup(type, language, category, subject) {
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
            "Subject": subject,
            "LocalizedSubject": null,
        }
    };
    return json;
}

// Export the functions
export { setup };
