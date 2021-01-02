/* global $$ */

const {magicMap} = $$.addMagic;
const {setHiddenGlobal} = $$.addMagic.utils;

function popd() {
    // setup directory history in case user broke it
    if (!Array.isArray(global._dirStack)) {
        setHiddenGlobal("_dirStack", []);
    }

    // get the directory from the stack
    let dir = global._dirStack.shift();

    // XXX: backdoor access to the %cd function
    let cd = magicMap.get("%cd").fn;
    cd.call({
        args: {
            args: [dir],
        },
    });
    console.log(`popd -> ${dir}`);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    popd,
    __filename,
    "Change to directory popped off the top of the stack.",
    ["name", "%popd"],
    // https://www.npmjs.com/package/commander
);

$$.addMagic("%popd", popd);
