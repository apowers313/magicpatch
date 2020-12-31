/* global $$ */

function mkdir(cmd, ... args) {
    return this.exec("mkdir", args);
}
$$.addMagic("%mkdir", mkdir);
