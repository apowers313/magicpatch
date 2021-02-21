const {testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");
const stdMocks = require("std-mocks");
let {exec} = global.$$.addMagic.utils;

describe("exec", function() {
    it("is global util", function() {
        // assert.isObject(global.$$);
        // assert.isFunction(global.$$.addMagic);
        // assert.isObject(global.$$.addMagic.utils);
        assert.isFunction(exec);
    });

    it("ls", async function() {
        await testMagic(
            // magic command
            "!ls",
            // return value
            0,
            // stdout
            [
                "THIS IS MOCKED OUTPUT\n" +
                "README.md\n" +
                "bin\n" +
                "examples\n" +
                "index.js\n" +
                "lib\n" +
                "node_modules\n" +
                "package-lock.json\n" +
                "package.json\n" +
                "test",
                "[ process 'ls' exited with code 0 ]",
            ],
            // stderr
            [],
        );
    });

    it("ls -laF", async function() {
        await testMagic(
            // magic command
            "!ls -laF",
            // return value
            0,
            // stdout
            [
                "total 208\n" +
                "drwxr-xr-x   14 ampower  staff    448 Dec 23 15:20 ./\n" +
                "drwxr-xr-x   34 ampower  staff   1088 Dec 20 10:29 ../\n" +
                "-rw-r--r--@   1 ampower  staff    130 Dec 20 10:29 .eslintrc.js\n" +
                "drwxr-xr-x   12 ampower  staff    384 Dec 23 15:30 .git/\n" +
                "-rw-r--r--    1 ampower  staff    123 Dec 20 14:18 .gitignore\n" +
                "-rw-r--r--    1 ampower  staff   1548 Dec 23 14:02 README.md\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 13:19 bin/\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 14:19 examples/\n" +
                "-rw-r--r--    1 ampower  staff    673 Dec 20 14:16 index.js\n" +
                "drwxr-xr-x    5 ampower  staff    160 Dec 20 21:06 lib/\n" +
                "drwxr-xr-x  220 ampower  staff   7040 Dec 23 15:20 node_modules/\n" +
                "-rw-r--r--    1 ampower  staff  85173 Dec 23 15:20 package-lock.json\n" +
                "-rw-r--r--    1 ampower  staff   1132 Dec 23 15:20 package.json\n" +
                "drwxr-xr-x   13 ampower  staff    416 Dec 23 13:58 test/",
                "[ process 'ls -laF' exited with code 0 ]",
            ],
            // stderr
            [],
        );
    });

    it("allows space after !", async function() {
        await testMagic(
            // magic command
            "! ls",
            // return value
            0,
            // stdout
            [
                "THIS IS MOCKED OUTPUT\n" +
                "README.md\n" +
                "bin\n" +
                "examples\n" +
                "index.js\n" +
                "lib\n" +
                "node_modules\n" +
                "package-lock.json\n" +
                "package.json\n" +
                "test",
                "[ process 'ls' exited with code 0 ]",
            ],
            // stderr
            [],
        );
    });

    it("captures stdout", async function() {
        stdMocks.use();

        let ret = await exec("fourlines", [], {captureStdout: true});
        stdMocks.restore();
        let output = stdMocks.flush();

        assert.isArray(ret);
        assert.strictEqual(ret.length, 3);
        assert.strictEqual(ret[0], "stdout one");
        assert.strictEqual(ret[1], "stdout two");
        assert.strictEqual(ret[2], "");

        assert.strictEqual(output.stdout.length, 1);
        assert.strictEqual(output.stdout[0], "[ process 'fourlines' exited with code 0 ]\n");
        assert.strictEqual(output.stderr.length, 1);
        assert.strictEqual(output.stderr[0], "stderr one\nstderr two\n");
    });

    it("captures stderr", async function() {
        stdMocks.use();

        let ret = await exec("fourlines", [], {captureStderr: true});
        stdMocks.restore();
        let output = stdMocks.flush();

        assert.isArray(ret);
        assert.strictEqual(ret.length, 3);
        assert.strictEqual(ret[0], "stderr one");
        assert.strictEqual(ret[1], "stderr two");
        assert.strictEqual(ret[2], "");

        assert.strictEqual(output.stdout.length, 2);
        assert.strictEqual(output.stdout[0], "stdout one\nstdout two\n");
        assert.strictEqual(output.stdout[1], "[ process 'fourlines' exited with code 0 ]\n");
        assert.strictEqual(output.stderr.length, 0);
    });

    it("captures all output", async function() {
        stdMocks.use();

        let ret = await exec("fourlines", [], {captureOutput: true});
        stdMocks.restore();
        let output = stdMocks.flush();

        assert.isArray(ret);
        assert.strictEqual(ret.length, 5);
        assert.strictEqual(ret[0], "stdout one");
        assert.strictEqual(ret[1], "stdout two");
        assert.strictEqual(ret[2], "stderr one");
        assert.strictEqual(ret[3], "stderr two");
        assert.strictEqual(ret[4], "");

        assert.strictEqual(output.stdout.length, 1);
        assert.strictEqual(output.stdout[0], "[ process 'fourlines' exited with code 0 ]\n");
        assert.strictEqual(output.stderr.length, 0);
    });
});
