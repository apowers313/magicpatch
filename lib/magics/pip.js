/* global $$ */

function pip() {
    throw new TypeError("%pip... hahaha... that's funny. This is node.js, use %npm. :)");
}
$$.addMagic("%pip", pip);
