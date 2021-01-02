require("./spawnMock");

// REPL comes with modules already loaded at the global level
if (typeof global.vm !== "object") {
    global.vm = require("vm");
}

// NEL creates a global.$$ object
if (typeof global.$$ !== "object") {
    global.$$ = {};
    global.$$.mime = (obj) => console.log(obj["text/markdown"]);
    global.$$.html = (... args) => console.log(... args);
}

// no color output
const {Console} = require("console");
global.console = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: false,
});

// now that we've setup appropriately, export the magicpatch main module
module.exports = require("../..");
