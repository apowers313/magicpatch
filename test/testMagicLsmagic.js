const {testMagic} = require("./helpers/magicpatch");

describe("lsmagic", function() {
    it("lists magics", async function() {
        await testMagic(
            // magic command
            "%lsmagic",
            // return value
            undefined,
            // stdout
            [
                "Available line magics:\n" +
                "%addmagic %asyncval %automagic ",
                "\n",
                "Available cell magics:\n" +
                "%%script\n",
                "\n",
                "Automagic is ON, % prefix IS NOT needed for line magics.\n",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
