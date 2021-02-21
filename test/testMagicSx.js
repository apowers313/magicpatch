const {testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");

describe("%sx", function() {
    it("executes shell command", async function() {
        await testMagic(
            // magic command
            "%sx ls",
            // return value
            [
                "THIS IS MOCKED OUTPUT",
                "README.md",
                "bin",
                "examples",
                "index.js",
                "lib",
                "node_modules",
                "package-lock.json",
                "package.json",
                "test",
                "",
            ],
            // stdout
            ["[ process 'ls' exited with code 0 ]"],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("assigns output", async function() {
        await testMagic(
            // magic command
            "sxOutput = %sx ls",
            // return value
            [
                "THIS IS MOCKED OUTPUT",
                "README.md",
                "bin",
                "examples",
                "index.js",
                "lib",
                "node_modules",
                "package-lock.json",
                "package.json",
                "test",
                "",
            ],
            // stdout
            ["[ process 'ls' exited with code 0 ]"],
            // stderr
            [],
            // print output
            // true,
        );
        assert.deepEqual(global.sxOutput, [
            "THIS IS MOCKED OUTPUT",
            "README.md",
            "bin",
            "examples",
            "index.js",
            "lib",
            "node_modules",
            "package-lock.json",
            "package.json",
            "test",
            "",
        ]);
    });
});
