require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

describe("echo", function() {
    it("prints line", async function() {
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
    });
});
