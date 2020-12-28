require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");
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
            true,
        );
    });

    it.only("works with asynchronous", async function() {
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
            true,
        );
    });

    it("works with multiple assignments in a single block");
    it("allows const");
    it("allows let");
    it("allows var");
    it("allows random spacing");
    it("allows underscore in var name");
    it("allows number in var name");
});
