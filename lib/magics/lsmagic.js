/* global $$ */
const {printAutomagicStatus} = $$.addMagic.utils;

function lsmagic() {
    let cmds = [... this.magicMap.entries()];
    cmds = cmds
        // filter out stubs
        .filter((ent) => !ent[1].stub)
        // just use the names
        .map((ent) => ent[0])
        // sort alphabetically
        .sort();
    let lineMagics = cmds.filter((str) => str[0] === "%" && str[1] !== "%").join(" ");
    let cellMagics = cmds.filter((str) => str[0] === "%" && str[1] === "%").join(" ");
    console.log(`Available line magics:\n${lineMagics}`);
    console.log("");
    console.log(`Available cell magics:\n${cellMagics}`);
    console.log("");
    printAutomagicStatus(this.requireMagic);
}
lsmagic.standard = true;
$$.addMagic("%lsmagic", lsmagic);

module.exports = {
    lsmagic,
};
