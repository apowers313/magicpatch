const {runCode, testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");

function testOutputCache(last, lastLast, lastX3) {
    if (typeof last !== "function") {
        assert.strictEqual(global._, last);
    } else {
        last(global._);
    }

    if (typeof lastLast !== "function") {
        assert.strictEqual(global.__, lastLast);
    } else {
        lastLast(global.__);
    }

    if (typeof lastX3 !== "function") {
        assert.strictEqual(global.___, lastX3);
    } else {
        lastX3(global.___);
    }
}

describe("output cache", function() {
    beforeEach(function() {
        global._ = global.__ = global.___ = undefined;
    });

    it("rotates values", async function() {
        testOutputCache(undefined, undefined, undefined);
        await runCode("42");
        testOutputCache(42, undefined, undefined);
        await runCode("'bob'");
        testOutputCache("bob", 42, undefined);
        await runCode("true");
        testOutputCache(true, "bob", 42);
        await runCode("747");
        testOutputCache(747, true, "bob");
    });

    it("resolves promises", async function() {
        testOutputCache(undefined, undefined, undefined);
        await runCode("%asyncval 3.14159");
        testOutputCache("3.14159", undefined, undefined);
        await runCode("%asyncval sally");
        testOutputCache("sally", "3.14159", undefined);
        await runCode("%asyncval true");
        testOutputCache("true", "sally", "3.14159");
        await runCode("%asyncval minecraft");
        testOutputCache("minecraft", "true", "sally");
    });

    it("sets undefined on error", async function() {
        function testError(val) {
            assert.instanceOf(val, ReferenceError);
            assert.strictEqual(val.message, "asdfasdfasdf is not defined");
        }

        testOutputCache(undefined, undefined, undefined);
        await runCode("42");
        testOutputCache(42, undefined, undefined);
        await testMagic( // asdfasdfasdf is undefined, should throw reference error
            // magic command
            "x = asdfasdfasdf",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            [/ReferenceError: asdfasdfasdf is not defined/],
            // show output
            // true,
        );
        testOutputCache(testError, 42, undefined);
        await runCode("true");
        testOutputCache(true, testError, 42);
        await runCode("747");
        testOutputCache(747, true, testError);
    });
});
