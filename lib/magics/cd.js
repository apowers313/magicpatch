/* global $$ */

function cd(cmd, ... args) {
    // TODO: push onto dirHistory
    return this.exec("cd", args);
}
$$.addMagic("%cd", cd);
