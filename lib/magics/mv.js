/* global $$ */

function mv(cmd, ... args) {
    return this.exec("mv", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    mv,
    __filename,
    "Runs `mv` in the shell with the specified arguments.",
    ["name", "%mv"],
);
delete mv.argsParser;

$$.addMagic("%mv", mv);
