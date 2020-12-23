require("./helpers/magicpatch");
const {runMagic, testMagic} = require("./helpers/helpers");

describe("automagic", function() {
    it("toggles with no arg", function() {
        runMagic("%automagic on");
        runMagic("%automagic");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
            // magic command
            "echo this is a test",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token 'this'$/gm],
        );
        runMagic("%automagic");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns on for 'on'", function() {
        runMagic("%automagic on");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns on for '1'", function() {
        runMagic("%automagic 1");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns on for 'true'", function() {
        runMagic("%automagic true");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns off for 'off'", function() {
        runMagic("%automagic off");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns off for '0'", function() {
        runMagic("%automagic 0");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("turns off for 'false'", function() {
        runMagic("%automagic false");
        testMagic(
            // magic command
            "%echo this is a test",
            // return value
            undefined,
            // stdout
            ["this is a test\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("works without args", function() {
        runMagic("%automagic false");
        testMagic(
            // magic command
            "%echo",
            // return value
            undefined,
            // stdout
            ["\n"],
            // stderr
            [],
        );
        testMagic(
            // magic command
            "echo",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^ReferenceError: echo is not defined$/gm],
        );
        runMagic("%automagic true");
        testMagic(
            // magic command
            "%echo",
            // return value
            undefined,
            // stdout
            ["\n"],
            // stderr
            [],
        );
        testMagic(
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

    it("works with doc before", function() {
        runMagic("%automagic false");
        testMagic(
            // magic command
            "?%echo",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        testMagic(
            // magic command
            "?echo",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected token '\?'$/gm],
        );
        runMagic("%automagic true");
        testMagic(
            // magic command
            "?%echo",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        testMagic(
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

    it("works with doc after", function() {
        runMagic("%automagic false");
        testMagic(
            // magic command
            "%echo?",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        testMagic(
            // magic command
            "echo?",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/^SyntaxError: Unexpected end of input$/gm],
        );
        runMagic("%automagic true");
        testMagic(
            // magic command
            "%echo?",
            // return value
            undefined,
            // stdout
            [/Usage: %echo &lt;string&gt;/gm],
            // stderr
            [],
        );
        testMagic(
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
