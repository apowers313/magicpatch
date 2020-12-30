require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

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
                "%addmagic %asyncval %automagic %echo %lsmagic %require\n",
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
