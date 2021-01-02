require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

describe("%cp", function() {
    it("executes cp", async function() {
        await testMagic(
            // magic command
            "%cp",
            // return value
            0,
            // stdout
            [
                "MOCKED CP OUTPUT",
                "[ process 'cp' exited with code 0 ]",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
