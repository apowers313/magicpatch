/* global $$ */

const path = require("path");
const utils = require("./utilities");
const {decorateMagic, exec, scriptExec, parserRegExps} = utils;
const {
    startOfString,
    optionalWhitespace,
    optionalAssignmentStmt,
    docComparatorFront,
    matchNamedMagicSymbol,
    matchNamedMagicString,
    docComparatorBack,
    anyMagicSymbol,
    anyMagic,
    anyWord,
} = parserRegExps;

let magicMap = new Map();

// expects a args like: "%addmagic", "%magic", "functionName"
// or: "%magic", {fn: Function, [matcher: RegExp], [help: String]}
function addMagic(... args) {
    if (args.length === 3 && args[0] === "%addmagic") {
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
        throw new TypeError(`addmagic: a command named '${cmdName}' already exists`);
    }

    // create the object that describes this command
    let magicObj = {};
    if (typeof args[1] === "string") {
        // TODO: should check that 'fn' exists in the context, otherwise trying to call it later will fail
        magicObj.fn = eval(args[1]);
    } else if (typeof args[1] === "object") {
        magicObj = args[1];
    } else {
        throw new TypeError("addmagic expected first argument to be string or object");
    }

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
            matchNamedMagicSymbol(magicObj.magicSymbol) +
            // match magic name, store as "cmdName"
            matchNamedMagicString(magicObj.cmdString) +
            // ? or ?? for doc or code at end
            docComparatorBack;

    // if a matcher doesn't already exist create one from cmdName
    if (typeof magicObj.matcher !== "object" || !(magicObj.matcher instanceof RegExp)) {
        magicObj.matcher = new RegExp(defaultMatcherString);
    }

    // copy all values from function to magicObj
    for (let fnKey of Object.keys(magicObj.fn)) {
        magicObj[fnKey] = magicObj.fn[fnKey];
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
addMagic("%addmagic", {fn: addMagic});

// prints anything passed to it
function echo(cmd) {
    console.log(this.varSubst(this.line.substring(this.startArgs)));
}
decorateMagic(
    echo,
    __filename,
    "Write arguments to the standard output.",
    ["name", "%echo"],
    ["arguments", "<string>"],
);
// register the echo magic
addMagic("%echo", {fn: echo});

// prints anything passed to it
function req(cmd, file) {
    // TODO: should always use basepath of notebook?
    let reqPath = path.resolve(process.cwd(), file);
    console.log(`[ loading ${reqPath} ]`);
    return require(reqPath);
}
decorateMagic(
    req,
    __filename,
    "Used to import modules, JSON, and local files.",
    ["name", "%require"],
    ["arguments", "<filename>"],
);
// register the require magic
addMagic("%require", {fn: req});

function execMagic(cmd, ... args) {
    if (/^!$/.test(cmd)) {
        // cmd was "! foo bar", drop the first "!"
        cmd = args.shift();
    } else {
        // strip leading "!"
        cmd = cmd.substring(1);
    }

    return exec(cmd, ... args);
}

function autoMagic(cmd, state) {
    console.log("cmd", cmd);
    console.log("state", state);
    switch (state) {
    case "on":
    case "true":
    case "1":
        // turn on automagic
        this.config.requireMagic = false;
        return true;
    case "off":
    case "false":
    case "0":
        // turn off automagic
        this.config.requireMagic = true;
        return false;
    case undefined:
        // no arg, toggle
        this.config.requireMagic = !this.config.requireMagic;
        return !this.config.requireMagic;
    default:
        throw new TypeError(`unknown automatic value: ${state}`);
    }
}
decorateMagic(
    autoMagic,
    __filename,
    "Make magic functions callable without having to type the initial %.",
    ["name", "%automagic"],
    ["arguments", "[state]"],
    [
        "description",
        "Make magic functions callable without having to type the initial %. " +
        "Takes an optional argument `state` which can be one of `on`, `1`, `true` to turn on automagic, or " +
        "`off`, `0`, or `false` to turn it off. If no argument is specified it toggles automagic to be the " +
        "opposite of its previous state.",
    ],
);
addMagic("%automagic", {fn: autoMagic});

function scriptMagic(cmd, ... args) {
    let {code} = this;

    // remove first line of code
    code = code.split("\n");
    code.shift();
    code = code.join("\n");

    let prog = args.shift();
    return scriptExec(prog, args, code);
}
decorateMagic(
    scriptMagic,
    __filename,
    "Run a cell via a shell command.",
    ["name", "%automagic"],
    [
        "description",
        "The `%%script` line is like the #! line of script, specifying a program (bash, perl, ruby, etc.) with which to run.\n\n" +
        "The rest of the cell is run by that program.",
    ],
);
scriptMagic.cellMagic = true;
addMagic("%%script", {fn: scriptMagic});

// register the exec magic
addMagic("!cmd", {
    fn: execMagic,
    matcher: new RegExp(`${startOfString}!${optionalWhitespace}${anyWord}`),
    magicSymbol: "!",
    cmdString: "cmd",
});

module.exports = {
    magicMap,
    addMagic,
    echo,
    req,
    execMagic,
};
