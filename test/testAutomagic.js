require("./helpers/magicpatch");
const {runMagic, testMagic} = require("./helpers/helpers");

describe("automagic", function() {
    it("toggles with no arg", async function() {
        await runMagic("%automagic on");
        await runMagic("%automagic");
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
        await runMagic("%automagic");
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
        await runMagic("%automagic on");
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
        await runMagic("%automagic 1");
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
        await runMagic("%automagic true");
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
        await runMagic("%automagic off");
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
        await runMagic("%automagic 0");
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
        await runMagic("%automagic false");
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
        await runMagic("%automagic false");
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
        await runMagic("%automagic true");
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
        await runMagic("%automagic false");
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
        await runMagic("%automagic true");
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
        await runMagic("%automagic false");
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
        await runMagic("%automagic true");
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
});
