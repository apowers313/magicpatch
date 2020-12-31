/* global $$ */

function pwd(cmd, ... args) {
    return this.exec("pwd", args);
}
$$.addMagic("%pwd", pwd);
