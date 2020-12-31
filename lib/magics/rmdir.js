/* global $$ */

function rmdir(cmd, ... args) {
    return this.exec("rmdir", args);
}
$$.addMagic("%rmdir", rmdir);
