/**
 * @file element.js
 * @copyright Copyright (c) 2022 MapMaths
 * @license MIT
 * @author MapMaths
 * @repo https://GitHub.com/MapMaths/plax
 * @description Provide element editing functions.
 */

const base = require("./tool/base.js");

class Element {
    constructor(Editor, id=null, type=null, n=null) {
        let json = Editor.json ? Editor.json : Editor;
        let elements = JSON.parse(json.StatusSave).Elements;
        let found = false;

        if (id != null) {
            if (type != null || n != null) throw SyntaxError("Unexpected arguments 'type' and 'n'.");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].Identifier == id) {
                    this.json = elements[i];
                    this.index = i;
                    found = true;
                    break;
                }
            }
            found || base.elementError();
        } else if (type != null) {
            let num = -1;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].ModelID == type) {
                    if (n != null) {
                        num++;
                        if(num < n) continue;
                    }
                    this.json = elements[i];
                    this.index = i;
                    found = true;
                    break;
                }
            }
            found || base.elementError();
        } else if (n != null) {
            this.json = elements[n] || base.elementError();
            this.index = n;
        } else {
            throw SyntaxError("Too few arguments.");
        }
    }

    setPos(pos) {
        this.json.Position = `${pos[0] != null ? pos[0] : this.pos[0]},${pos[2] != null ? pos[2] : this.pos[1]},${pos[1] != null ? pos[1] : this.pos[2]}`;
    }

    setRot(rot) {
        this.json.Rotation = `${rot[0]},${rot[2]},${rot[1]}`;
    }

    move(steps) {
        this.json.Position = `${this.pos[0] + steps[0]},${this.pos[2] + steps[2]},${this.pos[1] + steps[1]}`
    }

    lock() {
        this.json.Properties.锁定 = 1;
    }

    unlock() {
        delete this.json.Properties.锁定;
    }

    break() {
        this.json.IsBroken = true;
    }

    fix() {
        this.json.IsBroken = false;
    }
    
    newID(Editor) {
        let json = Editor.json ? Editor.json : Editor;
        this.json.Identifier = base.generateNewElementID(json);
    }
    
    get id() {
        return this.json.Identifier;
    }

    get pos() {
        let p = this.json.Position.split(",").map(Number);
        return [p[0], p[2], p[1]];
    }
}

// Export the functions
exports.Element = Element;