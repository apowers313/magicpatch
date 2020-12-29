const path = require("path");
const {execSync} = require("child_process");

// XXX: this may look absurd, but it's actually necessary
// this index.js file gets used as a 'startupScript' for IJavascript
// when loaded by the IJavascript session server it has lost track of
// the module path and attempts to resolve this module using the
// process.cwd()... which isn't where these files are
let magicpatch;
try {
    magicpatch = require("./lib/interpreter");
} catch (e) /* istanbul ignore next */ {
    let magicpatchPath = path.dirname(execSync("magicpatch-location", {encoding: "utf8"}));
    magicpatch = require(path.join(magicpatchPath, "./lib/interpreter"));
}

module.exports = magicpatch;
