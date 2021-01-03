/* global $$ */

function sx(cmd, ... args) {
    let prog = args.shift();
    return this.exec(prog, args, {captureOutput: true});
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    sx,
    __filename,
    "Shell execute - run shell command and capture output.",
    ["name", "%sx"],
    ["arguments", "<command> [commandArgs...]"],
    [
        "description",
        "Executes 'command' in the underlying shell with the specified args",
        {
            command: "The program to run in the shell, e.g. 'ls'",
            commandArgs: "The arguments to pass to the shell program",
        },
    ],
);
delete sx.argsParser;

$$.addMagic("%sx", sx);
$$.addMagic("%system", sx);
