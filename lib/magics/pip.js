/* global $$ */

function pip() {
    throw new TypeError("%pip... hahaha... that's funny. This is node.js, use %npm. :)");
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    pip,
    __filename,
    "Does nothing. Use %npm instead.",
    ["name", "%pip"],
);

$$.addMagic("%pip", pip);
