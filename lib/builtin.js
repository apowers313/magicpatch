/* global $$ */

const {spawn} = require("child_process");
const path = require("path");

// prints anything passed to it
function echo(cmd) {
    console.log(this.line.substring(cmd.length + 1));
}
echo.brief = "Write arguments to the standard output";
echo.doc = "Write arguments to the standard output";
echo.file = __filename;

// register the echo magic
$$.addMagic("%echo", {fn: echo});

// prints anything passed to it
function req(cmd, file) {
    // TODO: should always use basepath of notebook?
    let reqPath = path.join(process.cwd(), file);
    console.log(`[ loading ${reqPath} ]`);
    return require(reqPath);
}

// register the require magic
$$.addMagic("%require", {fn: req});

function exec(cmd, ... args) {
    if (/^!$/.test(cmd)) {
        // cmd was "! foo bar", drop the first "!"
        cmd = args.shift();
    } else {
        // strip leading "!"
        cmd = cmd.substring(1);
    }

    return new Promise((resolve, reject) => {
        let opts = {
            shell: true,
            argv0: "(ijavascriptex exec)",
            // stdio: "inherit",
            // timeout: 60000,
        };

        let proc = spawn(cmd, args, opts);

        proc.stdout.on("data", (data) => {
            console.log(`${data}`);
        });

        proc.stderr.on("data", (data) => {
            console.error(`${data}`);
        });

        proc.on("close", (code) => {
            console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            resolve(code);
        });

        proc.on("error", (err) => {
            console.error(err.message);
            reject(err);
        });
    });
}

// register the exec magic
$$.addMagic("!cmd", {
    fn: exec,
    matcher: /^!/,
});

module.exports = {
    echo,
    req,
    exec,
};
