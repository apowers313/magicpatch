/* global $$ */

function npm(cmd, ... args) {
    return this.exec("npm", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    npm,
    __filename,
    "Run the node package manager (npm) within the current kernel.",
    ["name", "%npm"],
);
delete npm.argsParser;

$$.addMagic("%npm", npm);
