const {spawn} = require("child_process");

function exec(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        let spawnOpts = {
            shell: opts.shell !== false,
            argv0: opts.argv0 || "(magicpatch exec)",
        // stdio: "inherit",
        // timeout: 60000,
        };

        // setup output capturing, if requested
        let output = [];
        let {captureStdout} = opts;
        let {captureStderr} = opts;
        if (opts.captureOutput) {
            captureStdout = captureStderr = true;
        }

        // run the command
        let proc = spawn(cmd, args, spawnOpts);

        // handle stdout event
        proc.stdout.on("data", (data) => {
            if (captureStdout) {
                output.push(data);
            } else {
                process.stdout.write(`${data}`);
            }
        });

        // handle stderr event
        proc.stderr.on("data", (data) => {
            if (captureStderr) {
                output.push(data);
            } else {
                process.stderr.write(`${data}`);
            }
        });

        // handle exit event
        proc.on("exit", (code) => {
            console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            if (captureStdout || captureStderr) {
                // TODO: new Line class extends Array
                resolve(output.join("").split("\n"));
            } else {
                resolve(code);
            }
        });

        // handle error event
        proc.on("error", (err) => {
            console.error(err.message);
            reject(err);
        });
    });
}

module.exports = {
    exec,
};
