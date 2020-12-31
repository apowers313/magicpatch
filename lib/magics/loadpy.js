/* global $$ */

function loadpy() {
    throw new TypeError("This is node.js, use %loadjs. :)");
}
$$.addMagic("%loadpy", loadpy);
