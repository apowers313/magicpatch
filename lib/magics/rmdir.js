/* global $$ */

function rmdir(cmd, ... args) {
    return this.exec("rmdir", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    rmdir,
    __filename,
    "Runs `rmdir` in the shell with the specified arguments.",
    ["name", "%rmdir"],
);
delete rmdir.argsParser;

$$.addMagic("%rmdir", rmdir);
