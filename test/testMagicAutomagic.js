const {runCode, testMagic} = require("./helpers/magicpatch");

describe("automagic", function() {
    it("toggles with no arg", async function() {
        await runCode("%automagic on");
        await runCode("%automagic");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token 'this'$/gm],
        );
        await runCode("%automagic");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
    });

    it("turns on for 'on'", async function() {
        await runCode("%automagic on");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
    });

    it("turns on for '1'", async function() {
        await runCode("%automagic 1");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
    });

    it("turns on for 'true'", async function() {
        await runCode("%automagic true");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
    });

    it("turns off for 'off'", async function() {
        await runCode("%automagic off");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token 'this'$/gm],
        );
    });

    it("turns off for '0'", async function() {
        await runCode("%automagic 0");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token 'this'$/gm],
        );
    });

    it("turns off for 'false'", async function() {
        await runCode("%automagic false");
        await testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token 'this'$/gm],
        );
    });

    it("works without args", async function() {
        await runCode("%automagic false");
        await testMagic(
            // magic command
            "%echo",
            // return value
            undefined,
            // stdout
            ["\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^ReferenceError: echo is not defined$/gm],
        );
        await runCode("%automagic true");
        await testMagic(
            // magic command
            "%echo",
            // return value
            undefined,
            // stdout
            ["\n"],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo",
            // return value
            undefined,
            // stdout
            ["\n"],
            // stderr
            [],
        );
    });

    it("works with doc before", async function() {
        await runCode("%automagic false");
        await testMagic(
            // magic command
            "?%echo",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "?echo",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token '\?'$/gm],
        );
        await runCode("%automagic true");
        await testMagic(
            // magic command
            "?%echo",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "?echo",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
    });

    it("works with doc after", async function() {
        await runCode("%automagic false");
        await testMagic(
            // magic command
            "%echo?",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo?",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected end of input$/gm],
        );
        await runCode("%automagic true");
        await testMagic(
            // magic command
            "%echo?",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        await testMagic(
            // magic command
            "echo?",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
    });

    it("errors on unknown state", async function() {
        await testMagic(
            // magic command
            "%automagic floogle",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["Unknown %automagic value: 'floogle'. Expected one of (1, true, on) or (0, false, off)"],
            // show output
            // true,
        );
    });

    it("prints automagic status", async function() {
        await testMagic(
            // magic command
            "%automagic on",
            // return value
            true,
            // stdout
            ["Automagic is ON, % prefix IS NOT needed for line magics."],
            // stderr
            [],
            // show output
            // true,
        );
        await testMagic(
            // magic command
            "%automagic off",
            // return value
            false,
            // stdout
            ["Automagic is OFF, % prefix IS needed for line magics."],
            // stderr
            [],
            // show output
            false,
        );
        await testMagic(
            // magic command
            "%automagic",
            // return value
            true,
            // stdout
            ["Automagic is ON, % prefix IS NOT needed for line magics."],
            // stderr
            [],
            // show output
            // true,
        );
    });
});
