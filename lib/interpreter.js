/*
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

                 uuuuuuu
             uu$$$$$$$$$$$uu
          uu$$$$$$$$$$$$$$$$$uu
         u$$$$$$$$$$$$$$$$$$$$$u
        u$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$"   "$$$"   "$$$$$$u
       "$$$$"      u$u       $$$$"
        $$$u       u$u       u$$$
        $$$u      u$$$u      u$$$
         "$$$$uu$$$   $$$uu$$$$"
          "$$$$$$$"   "$$$$$$$"
            u$$$$$$$u$$$$$$$u
             u$"$"$"$"$"$"$u
  uuu        $$u$ $ $ $ $u$$       uuu
 u$$$$        $$$$$u$u$u$$$       u$$$$
  $$$$$uu      "$$$$$$$$$"     uu$$$$$$
u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
$$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
 """      ""$$$$$$$$$$$uu ""$"""
           uuuu ""$$$$$$$$$$uuu
  u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$
  $$$$$$$$$$""""           ""$$$$$$$$$$$"
   "$$$$$"                      ""$$$$""
     $$$"                         $$$$"

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
const utils = require("./utilities");
const {exec, varSubst, setHiddenGlobal} = utils;

const origVmRunInThisContext = global.vm.runInThisContext;
function vmMonkeyPatch() {
    global.vm.runInThisContext = ijavascriptMonkeyPatch;

    // private variables
    setHiddenGlobal("__magicpatchInternal", global.__magicpatchInternal || {});
    global.__magicpatchInternal.$$ = global.$$;
    global.__magicpatchInternal.addMagic = addMagic;
    global.__magicpatchInternal.initialized = true;
    global.__magicpatchInternal.kernelDir = __dirname;
    global.__magicpatchInternal.origVmRunInThisContext = origVmRunInThisContext;
}

function ijavascriptMonkeyPatch(code, ... args) {
    // if we are re-loading the kernel, we may be executing code before initialization
    if (global.__magicpatchInternal.initialized) {
        try {
            return magicInterpreter(code)
                .then((ret) => {
                    saveOutput(ret);
                    return ret;
                })
                .catch((err) => {
                    printError(err);
                });
        } catch (err) {
            printError(err);
            return undefined;
        }
    }

    return origVmRunInThisContext(code, ... args);
}

function printError(err) {
    if (err instanceof TypeError) {
        console.log(err.message);
    } else {
        console.error(err);
    }
}
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* global $$ */

// add our built-ins
const {addMagic, magicMap} = require("./builtin");

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
async function magicInterpreter(code) {
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

        // See if string matches a magic command
        for (let magicObj of magicMap.values()) {
            let {hasMatch, hasAssignment, showDoc, showCode, matchParts} = tryMatchMagic(magicObj, line);
            if (hasMatch) {
                found = true;

                // if there is any code that hasn't been executed, run it now
                ret = runCode(codeLines, ret);

                // build the 'this' context
                let ctx = {
                    interpreter: magicInterpreter,
                    lineNo: i,
                    magicObj,
                    exec,
                    varSubst,
                    magicMap,
                    history,
                    config,
                    code,
                    line,
                    showDoc,
                    showCode,
                    hasAssignment,
                    matchParts,
                };
                // copy over magicObj.ctx properties to ctx (overwriting where properties exist)
                Object.keys(magicObj.ctx).forEach((key) => ctx[key] = magicObj.ctx[key]);

                // run the magic
                ret = runMagic(magicObj, ctx, ret);

                // if this was a cell magic on the first line, we're done
                if (i === 0 && magicObj.cellMagic) {
                    return ret;
                }
            }
        }

        // looks like a cell magic but wasn't found
        if (/^%%/.test(line) && !found) {
            // TODO: fix argument
            throw new TypeError(`UsageError: Cell magic '${args[0]}' not found.`);
        }

        // TODO: allow var assignment in unknown magic test
        // looks like a line magic but wasn't found
        if (/^%/.test(line) && !found) {
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

function tryMatchMagic(magicObj, line) {
    let res = line.match(magicObj.matcher);
    // console.log("line", line);
    // console.log("magicObj.name", magicObj.name);
    // console.log("matcher", magicObj.matcher);
    // console.log("match", res);

    // if res is null, there's no match
    let hasMatch = !!res;
    res = res || {};
    let parts = res.groups || {};
    // console.log("parts", parts);

    // automagic
    if (config.requireMagic && !parts.magicSymbol) {
        hasMatch = false;
    }

    // save doc bits
    let getDoc = parts.getDocFront || parts.getDocBack;
    let showDoc = getDoc === "?";
    let showCode = getDoc === "??";

    // has assignment
    let hasAssignment = !!parts.assignmentStmt;

    return {
        hasMatch,
        hasAssignment,
        showDoc,
        showCode,
        matchParts: parts,
    };
}

function runMagic(magicObj, ctx, ret) {
    let args = buildArgs(ctx);

    // don't allow cell magic after line 0
    if (magicObj.cellMagic && ctx.lineNo !== 0) {
        throw new TypeError(`cell magic '${magicObj.name}' is only valid on first line of cell`);
    }

    // show documentation and return
    if (ctx.showDoc) {
        let output = `__${magicObj.name} Documentation:__\n\n`;
        output += `${magicObj.doc}\n\n`;
        output += `__File:__ ${magicObj.file}`;
        $$.mime({"text/markdown": output});
        return ret;
    }

    // show code and return
    if (ctx.showCode) {
        let output = `__${magicObj.name} Source:__\n\n`;
        output += "``` js\n";
        output += `${magicObj.fn.toString()}\n`;
        output += "```\n\n";
        output += `__File:__ ${magicObj.file}`;
        $$.mime({"text/markdown": output});
        return ret;
    }

    // if the return value is a Promise, finish the Promise then run this magic
    if (ret instanceof Promise) {
        ret = ret.then(() => {
            // wait for promise to resolve, then run the magic!
            return magicObj.fn.call(ctx, ... args);
        });
    } else {
        // run the magic!
        ret = magicObj.fn.call(ctx, ... args);
    }

    // do variable assignment
    if (ctx.hasAssignment) {
        global.__magicpatchInternal.intermediateValue = ret;
        ret = runCode([`${ctx.matchParts.assignmentStmt}global.__magicpatchInternal.intermediateValue;`], ret);
    }

    return ret;
}

function buildArgs(ctx) {
    let {line, matchParts} = ctx;
    let magicSymbol = matchParts.magicSymbol || "";
    let cmdName = matchParts.cmdName || "";
    ctx.startArgs = magicSymbol.length + cmdName.length + 1;

    // strip the variable assignment off the front of the line
    if (ctx.hasAssignment) {
        ctx.startArgs += ctx.matchParts.assignmentStmt.length;
        line = line.substr(ctx.matchParts.assignmentStmt.length);
    }

    // split the line into arguments and do variable substitution
    let args = line.trim().replace(/\s+/g, " ").split(" ").map(varSubst);

    // run the parser if there is one
    if (typeof ctx.argsParser === "function") {
        ctx.args = ctx.argsParser(... args);
    }

    // console.log("line", line);
    // console.log("args", args);
    return args;
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
            // console.log("running ASYNC code:", code);
            return origVmRunInThisContext(code);
        });
    }

    // run the code!
    // console.log("running code:", code);
    return origVmRunInThisContext(code);
}

function saveOutput(scriptResult) {
    Promise.resolve(scriptResult).then((val) => {
        // NOTE: the docs say that output is also cached in _<n> and Out[n]
        // https://ipython.readthedocs.io/en/stable/interactive/reference.html#output-caching-system
        // This doesn't appear to be on by default, presumably due to the "heavy memory demands"
        setHiddenGlobal("___", global.__);
        setHiddenGlobal("__", global._);
        setHiddenGlobal("_", val);
    });
}

function saveInput(val) {
    setHiddenGlobal("_iii", global._ii);
    setHiddenGlobal("_ii", global._i);
    setHiddenGlobal("_i", val);

    if (!Array.isArray(global.In)) {
        setHiddenGlobal("In", []);
    }

    if (!Array.isArray(global._ih)) {
        setHiddenGlobal("_ih", []);
    }

    let newValName = `_i${global.In.length}`;
    setHiddenGlobal(newValName, val);

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
