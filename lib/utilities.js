const {spawn} = require("child_process");
const fs = require("fs");
const tmp = require("tmp");
const {Command} = require("commander");

// delete temp files if we forget
tmp.setGracefulCleanup();

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

function exec(cmd, ... args) {
    return new Promise((resolve, reject) => {
        let opts = {
            shell: true,
            argv0: "(ijavascriptex exec)",
        // stdio: "inherit",
        // timeout: 60000,
        };

        let proc = spawn(cmd, args, opts);

        proc.stdout.on("data", (data) => {
            process.stdout.write(`${data}`);
        });

        proc.stderr.on("data", (data) => {
            process.stderr.write(`${data}`);
        });

        proc.on("exit", (code) => {
            console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            resolve(code);
        });

        proc.on("error", (err) => {
            console.error(err.message);
            reject(err);
        });
    });
}

function varSubst(str) {
    let ret;
    let varOnlyRegExp = /^{(?<varName>[^{}])}$/; // looks like "{var}"
    let varOnly = str.match(varOnlyRegExp);
    if (varOnly) {
        // console.log("varOnly", varOnly);
        ret = eval(varOnly.groups.varName);
    } else {
        let varMatch = /{[^{}]}/g; // looks like "something{var1}something{var2}{var3}something..."
        ret = str.replace(varMatch, (v) => {
            return `${eval(v)}`;
        });
    }

    return ret;
}

async function scriptExec(scriptProg, scriptProgArgs, code) {
    // create a temporary file
    let tmpFile = tmp.fileSync();

    // write code to temporary file
    try {
        fs.writeFileSync(tmpFile.name, code, {encoding: "utf8"});
    } catch (e) {
        console.error("ERROR", e);
    }

    // run the code with the specified program
    return exec(scriptProg, ... scriptProgArgs, tmpFile.name);
}

module.exports = {
    decorateMagic,
    exec,
    varSubst,
    scriptExec,
};
