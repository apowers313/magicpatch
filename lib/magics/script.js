/* global $$ */
const {decorateMagic, scriptExec} = $$.addMagic.utils;

function scriptMagic(cmd, ... args) {
    let {code} = this;

    // remove first line of code
    code = code.split("\n");
    code.shift();
    code = code.join("\n");

    let prog = args.shift();
    return scriptExec(prog, args, code);
}
decorateMagic(
    scriptMagic,
    __filename,
    "Run a cell via a shell command.",
    ["name", "%automagic"],
    [
        "description",
        "The `%%script` line is like the #! line of script, specifying a program (bash, perl, ruby, etc.) with which to run.\n\n" +
        "The rest of the cell is run by that program.",
    ],
);
scriptMagic.cellMagic = true;
$$.addMagic("%%script", {fn: scriptMagic});

module.exports = {
    scriptMagic,
};
