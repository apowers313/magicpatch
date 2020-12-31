const utils = require("../utilities");
const {decorateMagic, copyProps, parserRegExps} = utils;
const {
    startOfString,
    optionalAssignmentStmt,
    docComparatorFront,
    optionalMatchNamedMagicSymbol,
    matchNamedMagicString,
    docComparatorBack,
    anyMagicSymbol,
    anyMagic,
} = parserRegExps;

let magicMap = new Map();

// expects a args like: "%addmagic", "%magic", "functionName"
// or: "%magic", {fn: Function, [matcher: RegExp], [help: String]}
function addMagic(... args) {
    if (args[0] === "%addmagic") {
        args.shift();
    }

    if (args.length !== 2) {
        throw new TypeError(`addmagic expected exactly two arguments but got: '${args}'`);
    }

    let cmdName = args[0];
    if (!(/^\W/.test(cmdName))) {
        throw new TypeError(`addmagic expected new command to start with a symbol like '%' or '.' but got '${cmdName}'`);
    }

    if (magicMap.has(cmdName)) {
        throw new TypeError(`addmagic: a magic named '${cmdName}' already exists`);
    }

    // create the object that describes this command
    let magicObj = {};
    if (typeof args[1] === "string") {
        magicObj.fn = eval(args[1]);
    } else if (typeof args[1] === "object") {
        magicObj = args[1];
    } else if (typeof args[1] === "function") {
        magicObj.fn = args[1];
    } else {
        throw new TypeError("addmagic expected second argument to be string or object");
    }

    copyProps(magicObj.fn, magicObj);

    // // check object properties
    if (typeof magicObj.name !== "string") {
        magicObj.name = cmdName;
    }

    // split apart '%word' into 'magicSymbol: %' and 'cmdString: word'
    if (!magicObj.cmdString || !magicObj.magicSymbol) {
        let getParts = new RegExp(startOfString + anyMagicSymbol + anyMagic);
        let cmdParts = cmdName.match(getParts).groups;
        magicObj.cmdString = cmdParts.cmdName;
        magicObj.magicSymbol = cmdParts.magicSymbol;
    }

    if (typeof magicObj.fn !== "function") {
        throw new TypeError(`addmagic expected object '${magicObj.name}' to have 'fn' property`);
    }

    const defaultMatcherString =
            // start of string
            startOfString +
            // string like "let x = "
            optionalAssignmentStmt +
            // ? or ?? for doc or code at start
            docComparatorFront +
            // optional magic symbol, store as "magicSymbol"
            optionalMatchNamedMagicSymbol(magicObj.magicSymbol) +
            // match magic name, store as "cmdName"
            matchNamedMagicString(magicObj.cmdString) +
            // ? or ?? for doc or code at end
            docComparatorBack;

    // if a matcher doesn't already exist create one from cmdName
    if (typeof magicObj.matcher !== "object" || !(magicObj.matcher instanceof RegExp)) {
        magicObj.matcher = new RegExp(defaultMatcherString);
    }

    // set default values
    magicObj.doc = magicObj.doc || "No documentation available.";
    magicObj.brief = magicObj.brief || "No brief available.";
    magicObj.file = magicObj.file || "No file specified.";
    magicObj.ctx = magicObj.ctx || {};

    // save the magic
    magicMap.set(cmdName, magicObj);

    console.log(`[ added magic: '${args[0]}' which will call function '${magicObj.fn.name}' ]`);
}
decorateMagic(
    addMagic,
    __filename,
    "Adds a new `function` as a magic named `name`.",
    ["name", "%addmagic"],
    ["arguments", "<name> <function|object>"],
    ["description", "Adds a new `function` or `object` as a magic named `name`. Object must have a function `fn`."],
);
addMagic.utils = utils;
addMagic.magicMap = magicMap;
global.$$.addMagic = addMagic;
addMagic("%addmagic", "%addmagic", {fn: addMagic}); // XXX: note that "%%addmagic" is specified twice, first one will get stripped off

module.exports = {
    addMagic,
    magicMap,
};
