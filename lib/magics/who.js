/* global $$ */
const {getGlobalVars} = $$.addMagic.utils;

function who() {
    let vars = getGlobalVars();
    console.log(vars.join("\t "));
}
$$.addMagic("%who", who);
