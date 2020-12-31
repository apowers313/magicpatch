/* global $$ */

function rm(cmd, ... args) {
    return this.exec("rm", args);
}
$$.addMagic("%rm", rm);
