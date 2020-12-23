if (typeof global.vm !== "object") {
    global.vm = require("vm");
}

if (typeof global.$$ !== "object") {
    global.$$ = {};
    global.$$.mime = (... args) => console.log(... args);
    global.$$.html = (... args) => console.log(... args);
}

module.exports = require("../..");
