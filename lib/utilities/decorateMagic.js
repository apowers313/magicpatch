const {Command} = require("commander");
const {strToMarkdown} = require("./strToMarkdown");

function decorateMagic(fn, file, briefString, ... opts) {
    if (typeof fn !== "function") {
        throw new TypeError("createOptions expected 'fn' to be string");
    }

    if (typeof briefString !== "string") {
        throw new TypeError("createOptions expected 'brief' to be string");
    }

    let program = new Command();
    program.description(briefString);
    opts.forEach((o) => {
        if (!Array.isArray(o)) {
            throw new TypeError("createOptions expected 'option' to be an Array");
        }

        let cmd = o.shift();

        program[cmd](... o);
    });
    program.helpOption(false);

    fn.doc = strToMarkdown(program.helpInformation());
    fn.brief = briefString;
    fn.file = file;
    fn.ctx = {};
    fn.argsParser = (cmd, ... args) => program.parse(args, {from: "user"});
}

module.exports = {
    decorateMagic,
};
