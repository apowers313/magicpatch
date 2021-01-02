/* global $$ */

require("./helpers/magicpatch");
const {runCode, testMagic} = require("./helpers/helpers");
const {assert} = require("chai");
const path = require("path");

let startDir = process.cwd();

describe("%cd", function() {
    afterEach(function() {
        process.chdir(startDir);
        $$.addMagic.utils.setHiddenGlobal("_dh", [process.cwd()]);
    });

    it("starts with cwd in history", function() {
        assert.isArray(global._dh);
        assert.strictEqual(global._dh[0], startDir);
    });

    it("changes dirs", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%cd ..",
            // return value
            undefined,
            // stdout
            [destPath],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), destPath);
        assert.strictEqual(global._dh.length, 2);
        assert.strictEqual(global._dh[0], startDir);
        assert.strictEqual(global._dh[1], destPath);
    });

    it("goes home with no args", async function() {
        await testMagic(
            // magic command
            "%cd",
            // return value
            undefined,
            // stdout
            [process.env.HOME],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), process.env.HOME);
    });

    it("last", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%cd ..\n" +
            "%cd -l\n",
            // return value
            undefined,
            // stdout
            [destPath, startDir],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), startDir);
        assert.strictEqual(global._dh.length, 3);
        assert.strictEqual(global._dh[0], startDir);
        assert.strictEqual(global._dh[1], destPath);
        assert.strictEqual(global._dh[2], startDir);
    });

    it("last errors on only one history dir", async function() {
        await testMagic(
            // magic command
            "%cd -l",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["%cd can't change to last dir: you haven't changed directories yet"],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), startDir);
        assert.strictEqual(global._dh.length, 1);
        assert.strictEqual(global._dh[0], startDir);
    });

    it("quiet", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%cd -q ..",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), destPath);
    });

    it("history number", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%cd ..\n" +
            "%cd -n 0\n",
            // return value
            undefined,
            // stdout
            [destPath, startDir],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), startDir);
        assert.strictEqual(global._dh.length, 3);
        assert.strictEqual(global._dh[0], startDir);
        assert.strictEqual(global._dh[1], destPath);
        assert.strictEqual(global._dh[2], startDir);
    });

    it("errors on non-number history arg", async function() {
        let destPath = path.resolve(startDir, "..");
        await testMagic(
            // magic command
            "%cd -n 0a",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["%cd expected number argument but got 0a"],
            // print output
            // true,
        );
        assert.strictEqual(process.cwd(), startDir);
    });

    it("bookmark");
});
