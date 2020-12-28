require("./helpers/magicpatch");
const {runMagic, testMagic} = require("./helpers/helpers");

describe("variable substitution", function() {
    it("replaces simple variable", async function() {
        await runMagic("x = 42");
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
        await runMagic("let o = {foo: 'bar'}");
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
        await runMagic("x = 42");
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
        await runMagic("x = 42");
        await runMagic("let o = {foo: 'bar'}");
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
