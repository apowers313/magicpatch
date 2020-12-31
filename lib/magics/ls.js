/* global $$ */

function ls(cmd, ... args) {
    return this.exec("ls", args);
}
$$.addMagic("%ls", ls);
