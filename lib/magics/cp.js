/* global $$ */

function cp(cmd, ... args) {
    return this.exec("cp", args);
}
$$.addMagic("%cp", cp);
