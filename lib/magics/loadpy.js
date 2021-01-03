/* global $$ */

function loadpy() {
    throw new TypeError("This is node.js, use %loadjs. :)");
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    loadpy,
    __filename,
    "Does nothing. Use %load, %require, or %loadjs instead.",
    ["name", "%loadpy"],
);

$$.addMagic("%loadpy", loadpy);
