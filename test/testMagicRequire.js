const {testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");
const path = require("path");

const cwd = process.cwd();

describe("require", function() {
    afterEach(function() {
        process.chdir(cwd);
    });

    it("loads module", async function() {
        await testMagic(
            // magic command
            "%require ./test/helpers/testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("throws if filename not specified", async function() {
        await testMagic(
            // magic command
            "%require",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["require: no file specified"],
            // show output
            // true,
        );
    });

    it("clears cache", async function() {
        await testMagic(
            // magic command
            "%require -c ./test/helpers/testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
        let reqCacheList = Object.keys(require.cache);
        assert.strictEqual(reqCacheList.length, 1);
        assert.strictEqual(reqCacheList[0], path.resolve(process.cwd(), "./test/helpers/testModule.js"));
    });

    it("loads from package.json directory", async function() {
        process.chdir("./test");
        await testMagic(
            // magic command
            "%require -r ./test/helpers/testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("loads from node_modules directory", async function() {
        process.chdir("./test");
        await testMagic(
            // magic command
            "%require -n mocha",
            // return value
            require("mocha"),
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("loads from initial directory", async function() {
        process.chdir("../..");
        await testMagic(
            // magic command
            "%require -i ./test/helpers/testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("loads from cwd if not otherwise specified", async function() {
        process.chdir("./test/helpers");
        await testMagic(
            // magic command
            "%require testModule.js",
            // return value
            {source: "helpers/testModule.js", worked: true},
            // stdout
            [/\[ loading \//],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("loads multiple files", async function() {
        process.chdir("./test/helpers");
        await testMagic(
            // magic command
            "%require testModule.js testModule2.js",
            // return value
            [
                {source: "helpers/testModule.js", worked: true},
                {source: "I am module number two"},
            ],
            // stdout
            [
                /\[ loading \/.*testModule\.js ]\n$/,
                /\[ loading \/.*testModule2\.js ]\n$/,
            ],
            // stderr
            [],
            // show output
            // true,
        );
    });

    it("throws error if multiple directory options are specified", async function() {
        await testMagic(
            // magic command
            "%require -i -r -n testModule.js",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["require: only one of '--root-dir', '--node-dir', and '--initial-dir' may be specified\n"],
            // show output
            // true,
        );
    });
});
