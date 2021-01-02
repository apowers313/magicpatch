/* global $$ */
const {setHiddenGlobal} = $$.addMagic.utils;
const path = require("path");

// initially _dh is the starting directory
setHiddenGlobal("_dh", [process.cwd()]);

function cd() {
    let {bookmark, last, number: histNum, quiet, args: dirs} = this.args;
    // console.log("bookmark:", bookmark, "last:", last, "histNum:", histNum, "quiet:", quiet, "dirs:", dirs);

    // setup directory history in case user broke it
    if (!Array.isArray(global._dh)) {
        setHiddenGlobal("_dh", [process.cwd()]);
    }

    let dirHist = global._dh;

    // calculate the target directory
    let dir;
    if (last) {
        if (dirHist.length < 2) {
            throw new TypeError("%cd can't change to last dir: you haven't changed directories yet");
        }

        dir = dirHist[dirHist.length - 2];
    } else if (typeof histNum === "number") {
        dir = dirHist[histNum];
    } else if (dirs.length > 1) {
        throw new TypeError("%cd: only one directory allowed");
    } else if (dirs.length === 0) {
        // no directory specified, use $HOME
        dir = process.env.HOME;
    } else {
        // use specified directory
        dir = dirs[0];
    }

    dir = path.resolve(process.cwd(), dir);

    // push on to directory history if it's different than our current dir
    if (dir !== process.cwd()) {
        global._dh.push(dir);
    }

    // print the directory
    if (!quiet) {
        console.log(dir);
    }

    process.chdir(dir);
}

let {decorateMagic, strToMarkdown} = $$.addMagic.utils;
decorateMagic(
    cd,
    __filename,
    "Change the current working directory",
    ["name", "%cd"],
    ["arguments", "[directory]"],
    [
        "description",
        "Unlike other shell commands like 'ls', this doesn't execute in the underlying shell and uses `process.chdir()` instead. " +
        "This command automatically maintains an internal list of directories you visit during your session in the global variable _dh. " +
        "The command %dhist shows this history nicely formatted.",
        {
            directory: "The target directory to change into.",
        },
    ],
    ["option", "-b,--bookmark <bookmark>", "Jump to a bookmark set by %bookmark. Note: cd <bookmark_name> is enough if there is no directory <bookmark_name>, but a bookmark with the name exists."],
    ["option", "-l,--last", "Changes to the last visited directory"],
    ["option", "-n,--number <histNum>", "Changes to the n-th directory in the directory history", numParser],
    ["option", "-q,--quiet", "Do not print the working directory after the cd command is executed. By default the %cd magic does print this directory, since the default prompts do not display path information."],
    // https://www.npmjs.com/package/commander
);

function numParser(val) {
    let ret = parseInt(val);
    // eslint-disable-next-line eqeqeq
    if (ret != val) {
        throw new TypeError(`%cd expected number argument but got ${val}`);
    }

    return ret;
}

// TODO: custom argsParser and docs because of the weird argument format that IPython uses
// cd.file = __filename;
// cd.brief = "Change the current working directory";
// cd.doc = strToMarkdown(
//     `Usage: %cd [options] [directory]

// Unlike other shell commands like 'ls', this doesn't execute in the underlying shell and uses \`process.chdir()\` instead. This command automatically maintains an internal list of directories you visit during your session in the global variable _dh. The command %dhist shows this history nicely formatted.

// Options:
//   -b,--bookmark <bookmark>  Jump to a bookmark set by %bookmark. Note: cd <bookmark_name> is enough if there is no directory <bookmark_name>, but a bookmark with the name exists.
//   -<n>                      Changes to the last visited directory
//   -<n>                      Changes to the n-th directory in the directory history
//   // NOTE: -<name> doesn't actually seem to work in IPython, despite what their documentation says
//   -<name>                   Change to directory that matches ‘foo’ in history
// `);

// cd.argsParser = function(cmd, ... args) {
//     console.log("got args", args);
//     return args;
// };

$$.addMagic("%cd", cd);
