/* global $$ */
const {decorateMagic} = $$.addMagic.utils;

// command history
function history() {
    let opts = this.args;

    let h = this.history;
    let outputStr = "";
    for (let i = 0; i < h.length; i++) {
        if (opts.number) {
            let multiLine = /\n/.test(h[i]);
            outputStr += `    ${i}: ${multiLine ? "\n" : ""}`;
        }

        outputStr += `${h[i]}\n`;
    }

    console.log(outputStr);
}
decorateMagic(
    history,
    __filename,
    "Print input history with most recent last.",
    ["name", "%history"],
    ["option", "-n, --number", "print line numbers for each input. This feature is only available if numbered prompts are in use."],
    // ["option", "-o, --output", "also print outputs for each input."],
    // ["option", "-p, --prompt", "print classic ‘>>>’ python prompts before each input. This is useful for making documentation, and in conjunction with -o, for producing doctest-ready output."],
    // ["option", "-t, --translate", "print the ‘translated’ history, as IPython understands it. IPython filters your input and converts it all into valid Python source before executing it (things like magics or aliases are turned into function calls, for example). With this option, you’ll see the native history instead of the user-entered version: ‘%cd /’ will be seen as ‘get_ipython().run_line_magic(“cd”, “/”)’ instead of ‘%cd /’."],
    // ["option", "-f <filename>", "filename: instead of printing the output to the screen, redirect it to the given file. The file is always overwritten, though when it can, IPython asks for confirmation first. In particular, running the command ‘history -f filename from the IPython Notebook interface will replace FILENAME even if it already exists without confirmation."],
    // ["option", "-l [limit]", "get the last n lines from all sessions. Specify n as a single arg, or the default is the last 10 lines."],
    // ["option", "-u, --unique", "when searching history using -g, show only unique history."],
);
$$.addMagic("%history", history);
$$.addMagic("%hist", history);
