require("./helpers/magicpatch");
const {runMagic} = require("./helpers/helpers");
const {assert} = require("chai");

function testOutputCache(last, lastLast, lastX3) {
    assert.strictEqual(global._, last);
    assert.strictEqual(global.__, lastLast);
    assert.strictEqual(global.___, lastX3);
}

describe("output cache", function() {
    beforeEach(function() {
        global._ = global.__ = global.___ = undefined;
    });

    it("rotates values", async function() {
        testOutputCache(undefined, undefined, undefined);
        await runMagic("42");
        testOutputCache(42, undefined, undefined);
        await runMagic("'bob'");
        testOutputCache("bob", 42, undefined);
        await runMagic("true");
        testOutputCache(true, "bob", 42);
        await runMagic("747");
        testOutputCache(747, true, "bob");
    });

    it("resolves promises", async function() {
        testOutputCache(undefined, undefined, undefined);
        await runMagic("%asyncval 3.14159");
        testOutputCache("3.14159", undefined, undefined);
        await runMagic("%asyncval sally");
        testOutputCache("sally", "3.14159", undefined);
        await runMagic("%asyncval true");
        testOutputCache("true", "sally", "3.14159");
        await runMagic("%asyncval minecraft");
        testOutputCache("minecraft", "true", "sally");
    });
});
