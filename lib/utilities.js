const {Command} = require("commander");

function strToMarkdown(str) {
    // TODO: use a library like: https://www.npmjs.com/package/html-entities
    return str
        // replace & with &amp;
        .replace(/&/gm, "&amp;")
        // preserve spacing at start of string
        // TODO: this is kinda ugly, it'd be nice if a unicode character worked here
        .replace(/^ +/gm, (match) => `${match.replace(/ /g, "&nbsp;")}`)
        // replace < with &lt;
        .replace(/</gm, "&lt;")
        // replace > with &gt;
        .replace(/>/gm, "&gt;")
        // replace newline with HTML <br>
        .replace(/\n/g, "<br>\n");
}

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
    fn.ctx.argsParser = (cmd, ... args) => program.parse(args, {from: "user"});
}

module.exports = {
    decorateMagic,
};
