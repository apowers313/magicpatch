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

function runMagic(code, captureOutput = true) {
    if (captureOutput) {
        stdMocks.use();
    }

    let val = global.vm.runInThisContext(code);

    let ret;
    if (captureOutput) {
        stdMocks.restore();
        ret = stdMocks.flush();
    } else {
        ret = {};
        ret.stdout = [];
        ret.stderr = [];
    }

    // for (let line of ret.stdout) {
    //     console.log(line);
    // }
    // for (let line of ret.stderr) {
    //     console.error(line);
    // }
    ret.val = val;
    return ret;
}

function testMagic(code, val, stdout = [], stderr = []) {
    const output = runMagic(code);
    // console.log("OUTPUT", output);
    assert.strictEqual(output.val, val);
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
