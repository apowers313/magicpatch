require("./helpers/magicpatch");
const {runCode} = require("./helpers/helpers");
const {assert} = require("chai");

describe("%dirs", function() {
    it("returns history dirs", async function() {
        let res = await runCode("%dirs");
        assert.strictEqual(global._dh, res.val);
        assert.strictEqual(res.stdout.length, 0);
        assert.strictEqual(res.stderr.length, 0);
    });
});
