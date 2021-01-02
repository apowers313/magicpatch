require("./helpers/magicpatch");
const {runCode, testMagic} = require("./helpers/helpers");
const {assert} = require("chai");

describe("quickref", function() {
    it("shows quick reference", async function() {
        let ret = await runCode("%quickref");
        assert.isUndefined(ret.val);
        assert.strictEqual(ret.stderr.length, 0);
        assert.startsWith(ret.stdout[0],
            "# IJavascript + magicpatch<br>\n" +
            "An enhanced Interactive JavaScript - Quick Reference Card<br>\n" +
            "================================================================<br>\n" +
            "<br>\n");
    });
});
