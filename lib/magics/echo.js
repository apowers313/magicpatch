/* global $$ */
const {decorateMagic} = $$.addMagic.utils;

// prints anything passed to it
function echo() {
    console.log(this.varSubst(this.line.substring(this.startArgs)));
}
decorateMagic(
    echo,
    __filename,
    "Write arguments to the standard output.",
    ["name", "%echo"],
    ["arguments", "<string>"],
);
// register the echo magic
$$.addMagic("%echo", {fn: echo});

module.exports = {
    echo,
};
