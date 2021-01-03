/* global $$ */

function mkdir(cmd, ... args) {
    return this.exec("mkdir", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    mkdir,
    __filename,
    "Runs `mkdir` in the shell with the specified arguments.",
    ["name", "%mkdir"],
);
delete mkdir.argsParser;

$$.addMagic("%mkdir", mkdir);
