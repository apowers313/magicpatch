/* global $$ */

const {spawn} = require("child_process");
const path = require("path");
const utils = require("./utilities");
const {decorateMagic} = utils;

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
    let cmdObj = {};
    if (typeof args[1] === "string") {
        // TODO: should check that 'fn' exists in the context, otherwise trying to call it later will fail
        cmdObj.fn = eval(args[1]);
    } else if (typeof args[1] === "object") {
        cmdObj = args[1];
    } else {
        throw new TypeError("addmagic expected first argument to be string or object");
    }

    // // check object properties
    if (typeof cmdObj.name !== "string") {
        cmdObj.name = cmdName;
    }

    // split apart '%word' into 'magicSymbol: %' and 'cmdString: word'
    if (!cmdObj.cmdString || !cmdObj.magicSymbol) {
        let cmdParts = cmdName.match(/^(?<magicSymbol>[\W]+)(?<cmdString>\w+)\b/).groups;
        cmdObj.cmdString = cmdParts.cmdString;
        cmdObj.magicSymbol = cmdParts.magicSymbol;
    }

    if (typeof cmdObj.fn !== "function") {
        throw new TypeError(`addmagic expected object '${cmdObj.name}' to have 'fn' property`);
    }

    // if a matcher doesn't already exist create one from cmdName
    if (typeof cmdObj.matcher !== "object" || !(cmdObj.matcher instanceof RegExp)) {
        // WARNING: big ugly regexp
        // - getDocFront for commands like '?%magic' or '??%magic'
        // - getDocBack for commands like '%magic?' or '%magic??'
        // - magicSymbol catches things like '%' or '%%'
        // - cmdName is the 'magic' part of '%magic'
        // - and the whole thing ends in a space (like '%magic arg1') or a newline (like '%magic')
        cmdObj.matcher = new RegExp(`^(?<getDocFront>\\?{1,2})?(?<magicSymbol>${cmdObj.magicSymbol})?(?<cmdName>${cmdObj.cmdString})(?<getDocBack>\\?{1,2})?( |\\n|$)`);
    }

    cmdObj.doc = cmdObj.doc || cmdObj.fn.doc || "No documentation available.";
    cmdObj.brief = cmdObj.brief || cmdObj.fn.brief || "No brief available.";
    cmdObj.file = cmdObj.file || cmdObj.fn.file || "No file specified.";
    cmdObj.ctx = cmdObj.ctx || cmdObj.fn.ctx || {};

    // save the magic
    magicMap.set(cmdName, cmdObj);

    console.log(`[ added magic: '${args[0]}' which will call function '${args[1]}' ]`);
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
    console.log(this.line.substring(cmd.length + 1));
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
    let reqPath = path.join(process.cwd(), file);
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

function exec(cmd, ... args) {
    if (/^!$/.test(cmd)) {
        // cmd was "! foo bar", drop the first "!"
        cmd = args.shift();
    } else {
        // strip leading "!"
        cmd = cmd.substring(1);
    }

    return new Promise((resolve, reject) => {
        let opts = {
            shell: true,
            argv0: "(ijavascriptex exec)",
            // stdio: "inherit",
            // timeout: 60000,
        };

        let proc = spawn(cmd, args, opts);

        proc.stdout.on("data", (data) => {
            console.log(`${data}`);
        });

        proc.stderr.on("data", (data) => {
            console.error(`${data}`);
        });

        proc.on("close", (code) => {
            console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            resolve(code);
        });

        proc.on("error", (err) => {
            console.error(err.message);
            reject(err);
        });
    });
}

function autoMagic(cmd, state) {
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

// register the exec magic
addMagic("!cmd", {
    fn: exec,
    matcher: /^!/,
});

module.exports = {
    magicMap,
    addMagic,
    echo,
    req,
    exec,
};
