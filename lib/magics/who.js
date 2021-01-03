/* global $$ */
const {getGlobalVars} = $$.addMagic.utils;

function who() {
    let vars = getGlobalVars();
    console.log(vars.join("\t "));
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    who,
    __filename,
    "Print all interactive variables, with some minimal formatting.",
    ["name", "%who"],
);

$$.addMagic("%who", who);
