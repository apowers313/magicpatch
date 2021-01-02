/* global $$ */

function cp(cmd, ... args) {
    return this.exec("cp", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    cp,
    __filename,
    "Copy files.",
    ["name", "%cp"],
    ["description", "Executes 'cp' in the underlying shell with the specified args."],
);

$$.addMagic("%cp", cp);
