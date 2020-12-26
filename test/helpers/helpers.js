const stdMocks = require("std-mocks");
const chai = require("chai");
chai.use(require("chai-string"));
const {builtin} = require("./magicpatch");
const {assert} = chai;

function getMagic(name) {
    const {magicMap} = builtin;
    let magicObj = magicMap.get(name);
    assert.isObject(magicObj);
    assert.isFunction(magicObj.fn);
    assert.isString(magicObj.name);
    return magicObj;
}

async function runMagic(code, showOutput = false) {
    stdMocks.use();

    let val = await global.vm.runInThisContext(code);

    stdMocks.restore();
    let ret = stdMocks.flush();
    ret.val = val;

    if (showOutput) {
        console.log(`STDOUT: "${ret.stdout.join("")}"`);
        console.log(`STDERR: "${ret.stderr.join("")}"`);
        console.log("OUTPUT:", val);
    }

    return ret;
}

async function testMagic(code, val, stdout = [], stderr = [], showOutput = false) {
    const output = await runMagic(code, showOutput);
    if (showOutput) {
        console.log("test output:", output);
    }

    if (typeof val === "object") {
        assert.deepEqual(output.val, val);
    } else {
        assert.strictEqual(output.val, val);
    }

    assert.strictEqual(output.stdout.length, stdout.length, "wrong number of stdout lines");
    assert.strictEqual(output.stderr.length, stderr.length, "wrong number of stderr lines");
    for (let i = 0; i < stdout.length; i++) {
        if (stdout[i] instanceof RegExp) {
            assert.match(output.stdout[i], stdout[i]);
        } else {
            assert.startsWith(output.stdout[i], stdout[i]);
        }
    }

    for (let i = 0; i < stderr.length; i++) {
        if (stderr[i] instanceof RegExp) {
            assert.match(output.stderr[i], stderr[i]);
        } else {
            assert.startsWith(output.stderr[i], stderr[i]);
        }
    }
}

module.exports = {
    getMagic,
    runMagic,
    testMagic,
};
