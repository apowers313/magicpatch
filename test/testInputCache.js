const {runCode} = require("./helpers/magicpatch");
const {assert} = require("chai");

function testInputCache(cmdHistory, offset) {
    // console.log("---------");
    // console.log("_i", global._i);
    // console.log("_ii", global._ii);
    // console.log("_iii", global._iii);
    // console.log("In", global.In);
    // console.log("In.length", global.In.length);
    // console.log("_ih", global._ih);
    // console.log("_ih.length", global._ih.length);
    // console.log("cmdHistory", cmdHistory);
    // console.log("cmdHistory[0]", cmdHistory[0]);
    // console.log("In[0]", global.In[0]);

    // test last-three
    assert.strictEqual(global._i, cmdHistory[offset]);
    assert.strictEqual(global._ii, cmdHistory[offset - 1]);
    assert.strictEqual(global._iii, cmdHistory[offset - 2]);

    // test full history
    for (let n = 0; n < cmdHistory.length; n++) {
        assert.strictEqual(global[`_i${n}`], cmdHistory[n]);
        assert.strictEqual(global._ih[n], cmdHistory[n]);
        assert.strictEqual(global.In[n], cmdHistory[n]);
    }
}

describe("input cache", function() {
    beforeEach(function() {
        global._i = global._ii = global._iii = global.In = global._ih = undefined;
        global._i0 = global._i1 = global._i2 = global._i3 = undefined;
    });

    it("keeps list", async function() {
        // testInputCache([undefined, undefined, undefined]);
        await runCode("42");
        testInputCache(["42", undefined, undefined], 0);
        await runCode("'bob'");
        testInputCache(["42", "'bob'", undefined], 1);
        await runCode("true");
        testInputCache(["42", "'bob'", "true"], 2);
        await runCode("747");
        testInputCache(["42", "'bob'", "true", "747"], 3);
    });
});
