require("./helpers/magicpatch");
const {runCode} = require("./helpers/helpers");
const {assert} = require("chai");

describe.only("quickref", function() {
    it("shows quick reference", async function() {
        let ret = await runCode("%quickref", true);
        assert.strictEqual(ret.stdout[0], "IJavascript + magicpatch -- An enhanced Interactive JavaScript - Quick Reference Card\n");
        // await runCode(
        //     // magic command
        //     "%quickref",
        //     // return value
        //     undefined,
        //     // stdout
        //     [
        //         "Available line magics:\n" +
        //         "%addmagic %asyncval %automagic %echo %lsmagic %require\n",
        //         "\n",
        //         "Available cell magics:\n" +
        //         "%%script\n",
        //         "\n",
        //         "Automagic is ON, % prefix IS NOT needed for line magics.\n",
        //     ],
        //     // stderr
        //     [],
        //     // print output
        //     // true,
        // );
    });
});
