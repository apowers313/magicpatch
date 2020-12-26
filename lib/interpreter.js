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
    global.vm.runInThisContext = ijavascriptMonkeyPatch;

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

function ijavascriptMonkeyPatch(code, ... args) {
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
}
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* global $$ */

// add our built-ins
const {addMagic, magicMap} = require("./builtin");
const utils = require("./utilities");
const {exec, varSubst} = utils;

// our list of commands
global.$$.addMagic = addMagic;

// Note: history not implemented in protocol
// https://github.com/n-riesco/jp-kernel/blob/0bc2665470bfd2350ef8d0450b4a4c48f865904c/lib/handlers_v5.js#L340
// That's okay, I think we can implement it here just fine
let history = [];

// config
let config = {
    requireMagic: true,
};

// Magic Interpreter
function magicInterpreter(code) {
    // Split string into lines
    code = code.trim();
    let lines = code.split("\n");
    let codeLines = [];
    let ret;

    // save the command to history
    saveInput(code);

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
        for (let cmdObj of magicMap.values()) {
            let {hasMatch, showDoc, showCode} = tryMatchMagic(cmdObj, line);
            if (hasMatch) {
                found = true;

                // if there is any code that hasn't been executed, run it now
                ret = runCode(codeLines, ret);

                // build the 'this' context
                let ctx = {
                    exec: exec.bind("(ijavascriptex exec)", "!"),
                    varSubst: varSubst,
                    magicMap: magicMap,
                    interpreter: magicInterpreter,
                    history: history,
                    config: config,
                    args: args,
                    code: code,
                    line: line,
                    lineNo: i,
                    showDoc: showDoc,
                    showCode: showCode,
                };
                // copy over cmdObj.ctx properties to ctx (overwriting where properties exist)
                Object.keys(cmdObj.ctx).forEach((key) => ctx[key] = cmdObj.ctx[key]);

                // run the magic
                ret = runMagic(cmdObj, ctx, ret);

                // if this was a cell magic on the first line, we're done
                if (i === 0 && cmdObj.cellMagic) {
                    return ret;
                }
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

function tryMatchMagic(cmdObj, line) {
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

    if (cmdObj.cellMagic && ctx.lineNo !== 0) {
        throw new TypeError(`cell magic '${cmdObj.name}' is only valid on first line of cell`);
    }

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

function saveOutput(val) {
    // NOTE: the docs say that output is also cached in _<n> and Out[n]
    // https://ipython.readthedocs.io/en/stable/interactive/reference.html#output-caching-system
    // This doesn't appear to be on by default, presumably due to the "heavy memory demands"
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

function saveInput(val) {
    Object.defineProperty(global, "_iii", {
        value: global._ii,
        writable: true,
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(global, "_ii", {
        value: global._i,
        writable: true,
        configurable: true,
        enumerable: false,
    });
    Object.defineProperty(global, "_i", {
        value: val,
        writable: true,
        configurable: true,
        enumerable: false,
    });

    if (!Array.isArray(global.In)) {
        Object.defineProperty(global, "In", {
            value: [],
            writable: true,
            configurable: true,
            enumerable: false,
        });
    }

    if (!Array.isArray(global._ih)) {
        Object.defineProperty(global, "_ih", {
            value: [],
            writable: true,
            configurable: true,
            enumerable: false,
        });
    }

    let newValName = `_i${global.In.length}`;
    Object.defineProperty(global, newValName, {
        value: val,
        writable: true,
        configurable: true,
        enumerable: false,
    });

    global.In.push(val);
    global._ih.push(val);
}

vmMonkeyPatch();

module.exports = {
    vmMonkeyPatch,
    magicInterpreter,
    ijavascriptMonkeyPatch,
    utils: utils,
    builtin: require("./builtin"),
};
