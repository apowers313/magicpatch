/* global $$ */

function dhist() {
    let opts = this.args;

    // setup directory history in case user broke it
    if (!Array.isArray(global._dh)) {
        setHiddenGlobal("_dh", [process.cwd()]);
    }

    let startEntry = 0;
    let endEntry = global._dh.length;

    console.log("Directory history (kept in _dh");
    for (let i = startEntry; i < endEntry; i++) {
        console.log(`${i}: ${global._dh[i]}`);
    }
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    dhist,
    __filename,
    "Print your history of visited directories.",
    ["name", "%dhist"],
    ["description", "This history is automatically maintained by the %cd command, and always available as the global list variable _dh. You can use %cd -<n> to go to directory number <n>."],
    // NOTE: IPython's docs say:
    // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-dhist
    // %dhist -> print full history%dhist n -> print last n entries only%dhist n1 n2 -> print entries between n1 and n2 (n2 not included)
    // But that's not true...
);

$$.addMagic("%dhist", dhist);
