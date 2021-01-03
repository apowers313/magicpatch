require("./helpers/magicpatch");
const {runCode, testMagic} = require("./helpers/helpers");
const {assert} = require("chai");

// TODO: setup mocks for the dozens of different binaries that this runs
// skip until mocks are in place
describe.skip("%report", function() {
    it("shows report", async function() {
        this.timeout(10000);
        this.slow(10000);
        let ret = await runCode("%report", true);
        assert.isAbove(ret.stdout.length, 0);
        assert.strictEqual(ret.stderr.length, 0);
    });

    it("skips npm ls", async function() {
        this.timeout(10000);
        this.slow(10000);
        let ret = await runCode("%report --no-npm-ls", true);
        assert.isAbove(ret.stdout.length, 0);
        assert.strictEqual(ret.stderr.length, 0);
    });

    it("reports without git dir");
    it("reports without Jupyter");
});
