const {testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");
const path = require("path");

let startDir = process.cwd();

describe("%pushd", function() {
    afterEach(function() {
        process.chdir(startDir);
        global._dirStack.length = 0;
    });

    it("pushes a directory", async function() {
        await testMagic(
            // magic command
            "%pushd",
            // return value
            [startDir],
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 1);
        assert.strictEqual(global._dirStack[0], startDir);
    });

    it("pushes multiple directories", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%pushd\n" +
            "%cd -q ..\n" +
            "%pushd\n",
            // return value
            [destPath, startDir],
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 2);
        assert.strictEqual(global._dirStack[0], destPath);
        assert.strictEqual(global._dirStack[1], startDir);
    });

    it("pushes named directory", async function() {
        let tgtPath; let tmpPath;
        if (process.platform === "win32") {
            tmpPath = path.resolve("C:\\");
            tgtPath = "C:\\";
        } else {
            tmpPath = path.resolve("/tmp");
            tgtPath = "/tmp";
        }

        await testMagic(
            // magic command
            `%pushd ${tgtPath}\n`,
            // return value
            [tmpPath],
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 1);
        assert.strictEqual(global._dirStack[0], tmpPath);
    });

    it("errors if named directory does not exist", async function() {
        await testMagic(
            // magic command
            "%pushd\n" +
            "%pushd /foo\n",
            // return value
            [startDir],
            // stdout
            [],
            // stderr
            ["ENOENT: no such file or directory, stat"],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 1);
        assert.strictEqual(global._dirStack[0], startDir);
    });

    it("errors if named directory is file", async function() {
        let filePath = path.resolve(startDir, "./index.js");
        await testMagic(
            // magic command
            "%pushd\n" +
            `%pushd ${filePath}\n`,
            // return value
            [startDir],
            // stdout
            [],
            // stderr
            [`Not a directory: ${filePath}`],
            // print output
            // true,
        );
        assert.strictEqual(global._dirStack.length, 1);
        assert.strictEqual(global._dirStack[0], startDir);
    });
});
