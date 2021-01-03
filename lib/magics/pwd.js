/* global $$ */

function pwd(cmd, ... args) {
    return this.exec("pwd", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    pwd,
    __filename,
    "Runs `pwd` in the shell with the specified arguments.",
    ["name", "%pwd"],
);
delete pwd.argsParser;

$$.addMagic("%pwd", pwd);
