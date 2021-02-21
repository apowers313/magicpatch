const {testMagic} = require("./helpers/magicpatch");
const path = require("path");
const testModulePath = path.join(__dirname, "./helpers/testModule.js");

describe("variable assignment", function() {
    it("works with synchronous", async function() {
        await testMagic(
            // magic command
            `mod = %require ${testModulePath}\n` +
            "%echo {mod}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("works with asynchronous", async function() {
        await testMagic(
            // magic command
            "val = %asyncval mytestvalueis3.14159\n" +
            "%echo {val}",
            // return value
            undefined,
            // stdout
            [
                "mytestvalueis3.14159",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("works with multiple assignments in a single block", async function() {
        await testMagic(
            // magic command
            "blah = %asyncval blaaaahhhh\n" +
            "%echo {blah}\n" +
            "bar = %asyncval fun!\n" +
            "%echo {bar}\n",
            // return value
            undefined,
            // stdout
            [
                "blaaaahhhh",
                "fun!",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows const", async function() {
        await testMagic(
            // magic command
            `const cmod = %require ${testModulePath}\n` +
            "%echo {cmod}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows let", async function() {
        await testMagic(
            // magic command
            `let lmod = %require ${testModulePath}\n` +
            "%echo {lmod}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows var", async function() {
        await testMagic(
            // magic command
            `var vmod = %require ${testModulePath}\n` +
            "%echo {mod}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows random spacing", async function() {
        await testMagic(
            // magic command
            `   var   smod=%require ${testModulePath}\n` +
            "%echo {smod}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows underscore in var name", async function() {
        await testMagic(
            // magic command
            `_some_var = %require ${testModulePath}\n` +
            "%echo {_some_var}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("allows number in var name", async function() {
        await testMagic(
            // magic command
            `let _test8x = %require ${testModulePath}\n` +
            "%echo {_test8x}",
            // return value
            undefined,
            // stdout
            [
                /^\[ loading \//,
                "{ source: 'helpers/testModule.js', worked: true }",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
