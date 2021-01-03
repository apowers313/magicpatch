/* global $$ */

function cat(cmd, ... args) {
    return this.exec("cat", args);
}
let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    cat,
    __filename,
    "Runs the `cat` command in the shell with the specified arguments.",
    ["name", "%cat"],
);
delete cat.argsParser;
$$.addMagic("%cat", cat);
