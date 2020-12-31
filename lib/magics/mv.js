/* global $$ */

function mv(cmd, ... args) {
    return this.exec("mv", args);
}
$$.addMagic("%mv", mv);
