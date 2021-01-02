require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");
const {assert} = require("chai");
const path = require("path");

let startDir = process.cwd();

describe("%popd", function() {
    afterEach(function() {
        process.chdir(startDir);
        global._dirStack.length = 0;
    });

    it("pops a directory", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%pushd\n" +
            "%cd -q ..\n",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 1);
        assert.strictEqual(global._dirStack[0], startDir);
        assert.strictEqual(process.cwd(), destPath);
        await testMagic(
            // magic command
            "%popd\n",
            // return value
            undefined,
            // stdout
            [
                startDir,
                `popd -> ${startDir}`,
            ],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 0);
        assert.strictEqual(process.cwd(), startDir);
    });
});
