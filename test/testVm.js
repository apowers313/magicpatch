const {ijavascriptMonkeyPatch} = require("./helpers/magicpatch");
const {assert} = require("chai");

describe("vm", function() {
    it("installed interpreter", function() {
        assert.strictEqual(global.vm.runInThisContext, ijavascriptMonkeyPatch);
    });
});
