/* global $$ */

function ls(cmd, ... args) {
    return this.exec("ls", args);
}
let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    ls,
    __filename,
    "Runs `ls` in the shell with the specified arguments.",
    ["name", "%ls"],
);
delete ls.argsParser;

$$.addMagic("%ls", ls);
