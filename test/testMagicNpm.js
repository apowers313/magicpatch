require("./helpers/magicpatch");
const {runCode, testMagic} = require("./helpers/helpers");
const {assert} = require("chai");

describe("%npm", function() {
    it("executes npm", async function() {
        await testMagic(
            // magic command
            "%npm audit",
            // return value
            0,
            // stdout
            [
                "\n" +
                "                       === npm audit security report ===\n" +
                "\n" +
                "found 0 vulnerabilities\n" +
                " in 362 scanned packages\n",
                "[ process 'npm audit' exited with code 0 ]",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
