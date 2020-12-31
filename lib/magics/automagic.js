/* global $$ */
const {decorateMagic, printAutomagicStatus} = $$.addMagic.utils;

function autoMagic(cmd, state) {
    switch (state) {
    case "on":
    case "true":
    case "1":
        // turn on automagic
        this.config.requireMagic = false;
        printAutomagicStatus(this.config.requireMagic);
        return true;
    case "off":
    case "false":
    case "0":
        // turn off automagic
        this.config.requireMagic = true;
        printAutomagicStatus(this.config.requireMagic);
        return false;
    case undefined:
        // no arg, toggle
        this.config.requireMagic = !this.config.requireMagic;
        printAutomagicStatus(this.config.requireMagic);
        return !this.config.requireMagic;
    default:
        throw new TypeError(`Unknown %automagic value: '${state}'. Expected one of (1, true, on) or (0, false, off)`);
    }
}
decorateMagic(
    autoMagic,
    __filename,
    "Make magic functions callable without having to type the initial %.",
    ["name", "%automagic"],
    ["arguments", "[state]"],
    [
        "description",
        "Make magic functions callable without having to type the initial %. " +
        "Takes an optional argument `state` which can be one of `on`, `1`, `true` to turn on automagic, or " +
        "`off`, `0`, or `false` to turn it off. If no argument is specified it toggles automagic to be the " +
        "opposite of its previous state.",
    ],
);
$$.addMagic("%automagic", {fn: autoMagic});

module.exports = {
    autoMagic,
};
