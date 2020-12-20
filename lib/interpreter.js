/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

8b        d8  8b        d8  8b        d8
 Y8,    ,8P    Y8,    ,8P    Y8,    ,8P
  `8b  d8'      `8b  d8'      `8b  d8'
    Y88P          Y88P          Y88P
    d88b          d88b          d88b
  ,8P  Y8,      ,8P  Y8,      ,8P  Y8,
 d8'    `8b    d8'    `8b    d8'    `8b
8P        Y8  8P        Y8  8P        Y8

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

This monkey patches vm.runInThisContext with our own interpreter.
*/
const origVmRunInThisContext = global.vm.runInThisContext;
function vmMonkeyPatch() {
    global.vm.runInThisContext = function ijavascriptexMonkeyPatch(code, ... args) {
        // if we are re-loading the kernel, we may be executing code before initialization
        if (global.__ijavascriptexInternal.initialized) {
            try {
                let ret = magicInterpreter(code);
                saveOutput(ret);
                return ret;
            } catch (err) {
                // TODO: have a different Error class for internal errors, and don't print out it's stack when thrown
                console.error(err);
                return undefined;
            }
        }

        return origVmRunInThisContext(code, ... args);
    };

    // private variables
    Object.defineProperty(global, "__ijavascriptexInternal", {
        value: global.__ijavascriptexInternal || {},
        writable: true,
        configurable: true,
        enumerable: false,
    });
    global.__ijavascriptexInternal.$$ = global.$$;
    global.__ijavascriptexInternal.addMagic = addMagic;
    global.__ijavascriptexInternal.initialized = true;
    global.__ijavascriptexInternal.kernelDir = __dirname;
    global.__ijavascriptexInternal.origVmRunInThisContext = origVmRunInThisContext;
}
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* global $$ */

// our list of commands
let cmdMap = new Map();
global.$$.addMagic = addMagic;

// add our built-ins
const {exec} = require("./builtin");
$$.addMagic("%addmagic", {fn: addMagic});

// Note: history not implemented in protocol
// https://github.com/n-riesco/jp-kernel/blob/0bc2665470bfd2350ef8d0450b4a4c48f865904c/lib/handlers_v5.js#L340
// That's okay, I think we can implement it here just fine
let history = [];

// config
let config = {
    requireMagic: false,
};

// Magic Interpreter
function magicInterpreter(code) {
    // Split string into lines
    let lines = code.split("\n");
    let codeLines = [];
    let ret;

    // save the command to history
    history.push(code.trimEnd());

    // the $$ global gets rebuilt on every 'execute' call, so we have to reassign it
    // see also: https://github.com/n-riesco/nel/blob/ea42faf8170813b89eadbf00d4696cdd8adbc51b/lib/server/context.js#L322
    global.$$.addMagic = addMagic;

    // See if any line is a magic or command
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let found = false;

        // split the line into arguments
        let args = line.trim().replace(/\s+/g, " ").split(" ");

        // See if string matches a magic command
        for (let cmdObj of cmdMap.values()) {
            let {hasMatch, showDoc, showCode} = tryMatch(cmdObj, line);
            if (hasMatch) {
                found = true;

                // if there is any code that hasn't been executed, run it now
                ret = runCode(codeLines, ret);

                // build the 'this' context
                let ctx = {
                    exec: exec.bind("(ijavascriptex exec)", "!"),
                    cmdMap: cmdMap,
                    interpreter: magicInterpreter,
                    history: history,
                    args: args,
                    code: code,
                    line: line,
                    showDoc: showDoc,
                    showCode: showCode,
                };
                // copy over cmdObj.ctx properties to ctx (overwriting where properties exist)
                Object.keys(cmdObj.ctx).forEach((key) => ctx[key] = cmdObj.ctx[key]);

                // run the magic
                ret = runMagic(cmdObj, ctx, ret);
            }
        }

        // looks like a cell magic but wasn't found
        if (/^%%/.test(args[0]) && !found) {
            throw new TypeError(`UsageError: Cell magic '${args[0]}' not found.`);
        }

        // looks like a line magic but wasn't found
        if (/^%/.test(args[0]) && !found) {
            throw new TypeError(`UsageError: Line magic function '${args[0]}' not found.`);
        }

        // if it's not a magic, it must be code...
        if (!found) {
            codeLines.push(line);
        }
    }

    // if there is still code that hasn't been run, run it now
    ret = runCode(codeLines, ret);

    // Reassemble string and return new code
    return ret;
}

function tryMatch(cmdObj, line) {
    let res = line.match(cmdObj.matcher);

    // if res is null, there's no match
    let hasMatch = !!res;

    res = res || {};
    let parts = res.groups || {};
    if (config.requireMagic && !parts.magicSymbol) {
        hasMatch = false;
    }

    let getDoc = parts.getDocFront || parts.getDocBack;
    let showDoc = getDoc === "?";
    let showCode = getDoc === "??";

    return {
        hasMatch,
        showDoc,
        showCode,
    };
}

function runMagic(cmdObj, ctx, ret) {
    let args = ctx.args.map(varSubst);

    if (ctx.showDoc) {
        let output = `__${cmdObj.name} Documentation:__\n\n`;
        output += `${cmdObj.doc}\n\n`;
        output += `__File:__ ${cmdObj.file}`;
        $$.mime({"text/markdown": output});
        return ret;
    }

    if (ctx.showCode) {
        let output = `__${cmdObj.name} Source:__\n\n`;
        output += "``` js\n";
        output += `${cmdObj.fn.toString()}\n`;
        output += "```\n\n";
        output += `__File:__ ${cmdObj.file}`;
        $$.mime({"text/markdown": output});
        return ret;
    }

    if (typeof ctx.argsParser === "function") {
        ctx.args = ctx.argsParser(... args);
    }

    // if the return value is a Promise, finish the Promise then run this magic
    if (ret instanceof Promise) {
        return ret.then(() => {
            return cmdObj.fn.call(ctx, ... args);
        });
    }

    // run the magic!
    return cmdObj.fn.call(ctx, ... args);
}

function runCode(codeLines, ret) {
    // make sure there is code to run
    if (!codeLines.length) {
        return ret;
    }

    // re-assemble the array of code lines into a code string
    let code = codeLines.join("\n");

    // clear out / consume the code lines
    codeLines.length = 0;

    // if the return value is a Promise, finish the Promise then run this code
    if (ret instanceof Promise) {
        return ret.then(() => {
            return origVmRunInThisContext(code);
        });
    }

    // run the code!
    return origVmRunInThisContext(code);
}

function varSubst(str) {
    let ret;
    let varOnlyRegExp = /^{(?<varName>[^{}])}$/; // looks like "{var}"
    let varOnly = str.match(varOnlyRegExp);
    if (varOnly) {
        // console.log("varOnly", varOnly);
        ret = eval(`${varOnly.groups.varName}`);
    } else {
        let varMatch = /{[^{}]}/g; // looks like "something{var1}something{var2}{var3}something..."
        ret = str.replace(varMatch, (v) => {
            return `${eval(v)}`;
        });
    }

    return ret;
}

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

    if (cmdMap.has(cmdName)) {
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
        cmdObj.matcher = new RegExp(`^(?<getDocFront>\\?{1,2})?(?<magicSymbol>${cmdObj.magicSymbol})(?<cmdName>${cmdObj.cmdString})(?<getDocBack>\\?{1,2})?( |\\n|$)`);
    }

    cmdObj.doc = cmdObj.doc || cmdObj.fn.doc || "No documentation available.";
    cmdObj.brief = cmdObj.brief || cmdObj.fn.brief || "No brief available.";
    cmdObj.file = cmdObj.file || cmdObj.fn.file || "No file specified.";
    cmdObj.ctx = cmdObj.ctx || cmdObj.fn.ctx || {};

    // save the magic
    cmdMap.set(cmdName, cmdObj);

    console.log(`[ added magic: '${args[0]}' which will call function '${args[1]}' ]`);
}

function saveOutput(val) {
    Object.defineProperty(global, "___", {
        value: global.__,
        writable: true,
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(global, "__", {
        value: global._,
        writable: true,
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(global, "_", {
        value: val,
        writable: true,
        configurable: true,
        enumerable: false,
    });
}

vmMonkeyPatch();
