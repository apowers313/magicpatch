/* global $$ */

function npm(cmd, ... args) {
    return this.exec("npm", args);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    npm,
    __filename,
    "brief description",
    ["name", "%npm"],
    // ["arguments", "<myArg>"],
    // ["description", "Long description"]
    // ["option", "-o,--option <requiredArg>", "Executes 'npm' in the underlying shell with the specified args."],
    // https://www.npmjs.com/package/commander
);

$$.addMagic("%npm", npm);
