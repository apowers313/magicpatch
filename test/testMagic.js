const {testMagic} = require("./helpers/magicpatch");

describe("%magic", function() {
    it("errors on unknown line magic", async function() {
        await testMagic(
            // magic command
            "%blah",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["UsageError: Line magic function '%blah' not found."],
            // print output
            // true,
        );
    });

    it("errors on unknown cell magic", async function() {
        await testMagic(
            // magic command
            "%%bar",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["UsageError: Cell magic '%%bar' not found."],
            // print output
            // true,
        );
    });

    it("errors on unknown line magic with assignment", async function() {
        await testMagic(
            // magic command
            "y = %blah asdf",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["UsageError: Line magic function '%blah' not found."],
            // print output
            // true,
        );
    });

    it("errors on unknown cell magic with assignment", async function() {
        await testMagic(
            // magic command
            "x = %%bar asdf",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["UsageError: Cell magic '%%bar' not found."],
            // print output
            // true,
        );
    });

    it("errors on cell magic after code", async function() {
        await testMagic(
            // magic command
            "%echo hi there\n" +
            "%%script bash\n" +
            "ls -laF",
            // return value
            undefined,
            // stdout
            ["hi there"],
            // stderr
            ["cell magic '%%script' is only valid on first line of cell"],
            // print output
            // true,
        );
    });

    it("errors on cell magic after line magic", async function() {
        await testMagic(
            // magic command
            "console.log('hi')\n" +
            "%%script bash\n" +
            "ls -laF",
            // return value
            undefined,
            // stdout
            ["hi"],
            // stderr
            ["cell magic '%%script' is only valid on first line of cell"],
            // print output
            // true,
        );
    });
});
