/* global $$ */

const {setHiddenGlobal} = $$.addMagic.utils;
const {promisify} = require("util");
const fs = require("fs");
const fsStat = promisify(fs.stat);
setHiddenGlobal("_dirStack", []);

async function pushd() {
    let opts = this.args;
    // setup directory history in case user broke it
    if (!Array.isArray(global._dirStack)) {
        setHiddenGlobal("_dirStack", []);
    }

    let dir;
    if (opts.args[0]) {
        dir = opts.args[0];
    } else {
        dir = process.cwd();
    }

    // save dir
    await pushDir(dir);

    // return stack
    return global._dirStack;
}

async function pushDir(dir) {
    let dirStat;
    try {
        dirStat = await fsStat(dir);
    } catch (err) {
        console.error(err.message);
        return;
    }

    if (!dirStat.isDirectory()) {
        console.error(`Not a directory: ${dir}`);
        return;
    }

    global._dirStack.unshift(dir);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    pushd,
    __filename,
    "Place the current dir on stack and change directory.",
    ["name", "%pushd"],
    ["arguments", "[dirname]"],
    // TODO: description of dirname
    // https://www.npmjs.com/package/commander
);

$$.addMagic("%pushd", pushd);
