const {Command} = require("commander");
const {strToMarkdown} = require("./strToMarkdown");

function decorateMagic(fn, file, briefString, ... opts) {
    if (typeof fn !== "function") {
        throw new TypeError("createOptions expected 'fn' to be string");
    }

    if (typeof briefString !== "string") {
        throw new TypeError("createOptions expected 'brief' to be string");
    }

    // default description, overridden if another is provided
    opts.unshift(["description", briefString]);

    // convert commander help to doc string
    fn.doc = getHelpStr(opts);
    fn.brief = briefString;
    fn.file = file;
    fn.argsParser = runParser.bind(null, opts);
}

function getHelpStr(opts) {
    let program = buildParser(opts);

    return strToMarkdown(program.helpInformation());
}

function runParser(opts, cmd, ... args) {
    let program = buildParser(opts);

    // parse args
    try {
        program.parse(args, {from: "user"});
    } catch (err) {
        if (err.constructor && err.constructor.name === "CommanderError") {
            // Commander already printed the error (and there's not really any easy way to prevent that)
            throw new TypeError("");
        } else {
            throw err;
        }
    }

    // return object with parsed options
    let ret = program.opts();
    ret.args = program.args;

    return ret;
}

function buildParser(opts) {
    // commander keeps state and doesn't expect to be run multiple times,
    // so we have to create a new one each time
    let program = new Command();

    // don't exit on error
    program.exitOverride();

    // don't store on the Command object, call .opts() instead
    program.storeOptionsAsProperties(false);

    // don't include --help
    program.helpOption(false);

    // run commander functions
    opts.forEach((o) => {
        if (!Array.isArray(o)) {
            throw new TypeError("createOptions expected 'option' to be an Array");
        }

        let {0: cmd, ... cmdArgs} = o;
        cmdArgs = Object.values(cmdArgs);
        program[cmd](... cmdArgs);
    });

    return program;
}

module.exports = {
    decorateMagic,
};
