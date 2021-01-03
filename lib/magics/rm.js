/* global $$ */

function rm(cmd, ... args) {
    return this.exec("rm", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    rm,
    __filename,
    "Runs `rm` in the shell with the specified arguments.",
    ["name", "%rm"],
);
delete rm.argsParser;

$$.addMagic("%rm", rm);
