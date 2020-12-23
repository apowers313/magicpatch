if (typeof global.vm !== "object") {
    global.vm = require("vm");
}

if (typeof global.$$ !== "object") {
    global.$$ = {};
    global.$$.mime = (obj) => console.log(obj["text/markdown"]);
    global.$$.html = (... args) => console.log(... args);
}

module.exports = require("../..");
