/* global $$ */

function cat(cmd, ... args) {
    return this.exec("cat", args);
}
$$.addMagic("%cat", cat);
