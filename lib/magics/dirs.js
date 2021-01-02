/* global $$ */
const {setHiddenGlobal} = $$.addMagic.utils;

function dirs() {
    // setup directory history in case user broke it
    if (!Array.isArray(global._dh)) {
        setHiddenGlobal("_dh", [process.cwd()]);
    }

    return global._dh;
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    dirs,
    __filename,
    "Return the current directory stack.",
    ["name", "%dirs"],
);

$$.addMagic("%dirs", dirs);
