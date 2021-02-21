const {runCode, testMagic} = require("./helpers/magicpatch");

describe("variable substitution", function() {
    it("replaces simple variable", async function() {
        await runCode("x = 42");
        await testMagic(
            // magic command
            "%echo {x}",
            // return value
            undefined,
            // stdout
            ["42"],
            // stderr
            [],
        );
    });

    it("replaces object", async function() {
        await runCode("let o = {foo: 'bar'}");
        await testMagic(
            // magic command
            "%echo {o}",
            // return value
            undefined,
            // stdout
            ["{ foo: 'bar' }"],
            // stderr
            [],
        );
    });

    it("replaces mid-string", async function() {
        await runCode("x = 42");
        await testMagic(
            // magic command
            "%echo hi{x}there",
            // return value
            undefined,
            // stdout
            ["hi42there"],
            // stderr
            [],
        );
    });

    it("complex string replacement", async function() {
        await runCode("x = 42");
        await runCode("let o = {foo: 'bar'}");
        await testMagic(
            // magic command
            "%echo hi{x}there{o}bob",
            // return value
            undefined,
            // stdout
            ["hi42there[object Object]bob"],
            // stderr
            [],
        );
    });

    it("beginning of string replacement", async function() {
        await testMagic(
            // magic command
            "helperDir = './test/helpers'\n" +
            "%require {helperDir}/testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("throws on missing var", async function() {
        await testMagic(
            // magic command
            "%echo {thisvariablehopefullydoesntexist}",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["ReferenceError: thisvariablehopefullydoesntexist is not defined"],
        );
    });
});
