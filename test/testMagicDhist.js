/* global $$ */

const {testMagic} = require("./helpers/magicpatch");
const path = require("path");

let startDir = process.cwd();

describe("%dhist", function() {
    afterEach(function() {
        process.chdir(startDir);
        $$.addMagic.utils.setHiddenGlobal("_dh", [process.cwd()]);
    });

    it("shows history", async function() {
        let destPath = path.resolve(startDir, "..");

        await testMagic(
            // magic command
            "%cd -q ..\n" +
            "%dhist",
            // return value
            undefined,
            // stdout
            [
                "Directory history (kept in _dh",
                `0: ${startDir}`,
                `1: ${destPath}`,
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
