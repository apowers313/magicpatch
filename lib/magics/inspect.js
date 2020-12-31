/* global $$ */
let {inspect} = require("util");
let {decorateMagic} = $$.addMagic.utils;

function insp() {
    let opts = this.args;
    // console.log("opts.depth", opts.depth);
    // console.log("opts.args", opts.args);

    let inspectOpts = {
        depth: opts.depth || null,
        compact: false,
    };
    // console.log("inspectOpts", inspectOpts);

    let inspectList = opts.args;

    if (inspectList.length < 1) {
        throw new TypeError("%inspect expected an object name");
    }

    inspectList = inspectList.map((v) => {
        if (typeof v === "string") {
            return {
                name: v,
                value: eval(v),
            };
        } else if (typeof v === "object") {
            return {
                name: "Object",
                value: v,
            };
        }

        throw new TypeError(`%inspect expected a string or an object but got: ${v}`);
    });

    inspectList.forEach((desc) => {
        console.log(`${desc.name} value:\n`);
        console.log(inspect(desc.value, inspectOpts));
    });
}
decorateMagic(
    insp,
    __filename,
    "Prints out the properties of an object",
    ["name", "%inspect"],
    ["arguments", "<objectName>"],
    ["option", "-d,--depth <number>", "Number of levels of the object to print out"],
);
$$.addMagic("%inspect", insp);
