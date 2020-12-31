/* global $$ */
const {strToMarkdown} = $$.addMagic.utils;

function quickref() {
    // TODO:
    // console.log("Example magic function calls:");
    // System commands:
    // History:
    let output = "";

    output += "# IJavascript + magicpatch\n";
    output += "An enhanced Interactive JavaScript - Quick Reference Card\n";
    output += "================================================================\n";
    output += "\n";
    output += "%magic?, %magic??      : Get help, or more help for object (also works as ?%magic, %??magic).\n";
    output += "\n";
    output +=
        "Magic functions are prefixed by % or %%, and typically take their arguments" +
        "without parentheses, quotes or even commas for convenience.  Line magics take a" +
        "single % and cell magics are prefixed with two %%.\n";
    output += "\n";
    output += "The following magic functions are currently available:\n";
    output += "\n";

    let cmds = [... this.magicMap.entries()];

    function compareMagicObj(o1, o2) {
        let o1Name = o1.name.toLowerCase();
        let o2Name = o2.name.toLowerCase();

        if (o1Name < o2Name) {
            return -1;
        }

        if (o1Name > o2Name) {
            return 1;
        }

        return 0;
    }

    cmds = cmds
        // filter out stubs
        .filter((ent) => !ent[1].stub)
        // just use the objects
        .map((ent) => ent[1])
        // only magics that start with %
        .filter((ent) => ent.name[0] === "%")
        // sort alphabetically
        .sort(compareMagicObj);
    cmds.forEach((c) => {
        output += `${c.name}:\n`;
        output += `    ${c.brief}\n`;
    });

    $$.mime({"text/markdown": strToMarkdown(output)});
}
quickref.standard = true;
$$.addMagic("%quickref", quickref);

module.exports = {
    quickref,
};
