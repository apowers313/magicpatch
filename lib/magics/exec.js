/* global $$ */
const {exec, parserRegExps} = $$.addMagic.utils;
const {
    startOfString,
    optionalWhitespace,
    matchNamedMagicSymbol,
    anyWord,
} = parserRegExps;

function execMagic(cmd, ... args) {
    if (/^\s*!\s*$/.test(cmd)) {
        // cmd was "! foo bar", drop the first "!"
        cmd = args.shift();
    } else {
        // strip leading "!"
        cmd = cmd.substring(1);
    }

    return exec(cmd, args);
}
$$.addMagic("!cmd", {
    fn: execMagic,
    matcher: new RegExp(`${startOfString}${matchNamedMagicSymbol("!")}${optionalWhitespace}${anyWord}`),
    magicSymbol: "!",
    cmdString: "cmd",
});

module.exports = {
    execMagic,
};
