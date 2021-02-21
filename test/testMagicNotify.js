const {runCode} = require("./helpers/magicpatch");
const {assert} = require("chai");

// TODO: these tests require OS-specific mocks of `execFile` in test/helpers/spawnMock.js
// run manually by deleting .skip until those mocks are implemented
describe.skip("%notify", function() {
    it("notifies with default message", async function() {
        this.timeout(20000);
        this.slow(30000);
        let ret = await runCode("%notify");
        assert.isObject(ret.val);
        assert.strictEqual(ret.val.response, "timeout");
        assert.isObject(ret.val.metadata);
        assert.strictEqual(ret.val.metadata.activationType, "timeout");
        assert.isString(ret.val.metadata.activationAt);
        assert.isString(ret.val.metadata.deliveredAt);
    });

    it("notifies with timeout", async function() {
        this.slow(3000);
        let ret = await runCode("%notify -t 1");
        assert.isObject(ret.val);
        assert.strictEqual(ret.val.response, "timeout");
        assert.isObject(ret.val.metadata);
        assert.strictEqual(ret.val.metadata.activationType, "timeout");
        assert.isString(ret.val.metadata.activationAt);
        assert.isString(ret.val.metadata.deliveredAt);
    });

    it("notifies with user-specified message", async function() {
        this.slow(3000);
        let ret = await runCode("%notify -t 1 This is a message");
        assert.isObject(ret.val);
        assert.strictEqual(ret.val.response, "timeout");
        assert.isObject(ret.val.metadata);
        assert.strictEqual(ret.val.metadata.activationType, "timeout");
        assert.isString(ret.val.metadata.activationAt);
        assert.isString(ret.val.metadata.deliveredAt);
    });

    it("notifies with requested sound", async function() {
        this.slow(3000);
        let ret = await runCode("%notify -t 1 -s Glass This is a message");
        assert.isObject(ret.val);
        assert.strictEqual(ret.val.response, "timeout");
        assert.isObject(ret.val.metadata);
        assert.strictEqual(ret.val.metadata.activationType, "timeout");
        assert.isString(ret.val.metadata.activationAt);
        assert.isString(ret.val.metadata.deliveredAt);
    });

    it("notifies with default sound", async function() {
        this.slow(3000);
        let ret = await runCode("%notify -t 1 -s This is a message");
        assert.isObject(ret.val);
        assert.strictEqual(ret.val.response, "timeout");
        assert.isObject(ret.val.metadata);
        assert.strictEqual(ret.val.metadata.activationType, "timeout");
        assert.isString(ret.val.metadata.activationAt);
        assert.isString(ret.val.metadata.deliveredAt);
    });

    it("errors on timeout with no args");
});
