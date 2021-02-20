/* global $$ */

require("./helpers/magicpatch");
const {getMagic, testMagic, runCode} = require("./helpers/helpers");
const {assert} = require("chai");
const {decorateMagic} = $$.addMagic.utils;

describe("decoration", function() {
    afterEach(function() {
        $$.addMagic.magicMap.delete("%test");
    });

    it("does decoration", async function() {
        global.testFn = function testFn() {};
        assert.isUndefined(global.testFn.brief);
        assert.isUndefined(global.testFn.doc);
        assert.isUndefined(global.testFn.file);
        assert.isUndefined(global.testFn.argsParser);
        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
        );
        assert.strictEqual(global.testFn.brief, "Test brief");
        assert.strictEqual(global.testFn.doc, "Usage:  <br>\n<br>\nTest brief<br>\n");
        assert.strictEqual(global.testFn.file, "fakepath");
        assert.isFunction(global.testFn.argsParser);
    });

    it("adds name", async function() {
        global.testFn = function testFn() {};
        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
            ["name", "%test"],
        );
        assert.strictEqual(global.testFn.brief, "Test brief");
        assert.strictEqual(global.testFn.doc, "Usage: %test <br>\n<br>\nTest brief<br>\n");
        assert.strictEqual(global.testFn.file, "fakepath");
        assert.isFunction(global.testFn.argsParser);
    });

    it("adds brief", function() {
        let magicObj = getMagic("%echo");
        assert.strictEqual(magicObj.brief, magicObj.fn.brief);
        assert.strictEqual(magicObj.brief, "Write arguments to the standard output.");
    });

    it("adds simple doc", function() {
        let magicObj = getMagic("%echo");
        assert.strictEqual(magicObj.doc, magicObj.fn.doc);
        assert.strictEqual(magicObj.doc,
            "Usage: %echo &lt;string&gt;<br>\n" +
            "<br>\n" +
            "Write arguments to the standard output.<br>\n",
        );
    });

    it("adds a longer doc", function() {
        let magicObj = getMagic("%addmagic");
        assert.strictEqual(magicObj.doc,
            "Usage: %addmagic &lt;name&gt; &lt;function|object&gt;<br>\n" +
            "<br>\n" +
            "Adds a new `function` or `object` as a magic named `name`. Object must have a function `fn`.<br>\n");
    });

    it("adds file", function() {
        let magicObj = getMagic("%echo");
        assert.strictEqual(magicObj.file, magicObj.fn.file);
        assert.match(magicObj.file, /\/magicpatch\/lib\/magics\/echo\.js$/);
    });

    it("errors on bad fn");
    it("errors on bad file");
    it("errors on bad brief");
    it("errors on bad options");

    it("parses option", async function() {
        global.testFn = function testFn() {
            assert.isObject(this.args);
            assert.isTrue(this.args.q);
            console.log("test done");
            return 42;
        };
        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
            ["option", "-q"],
        );
        assert.strictEqual(global.testFn.doc, "Usage:  [options]<br>\n<br>\nTest brief<br>\n<br>\nOptions:<br>\n&nbsp;&nbsp;-q<br>\n");
        assert.isFunction(global.testFn.argsParser);
        await testMagic(
            // magic command
            "%addmagic %test testFn\n" +
            "%test -q",
            // return value
            42,
            // stdout
            [
                "[ added magic: '%test' which will call function 'testFn' ]",
                "test done",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("parses value", async function() {
        global.testFn = function testFn() {
            assert.isObject(this.args);
            assert.strictEqual(this.args.str, "foo");
            console.log("test done");
            return 42;
        };
        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
            ["option", "-s,--str <str>"],
        );
        assert.strictEqual(global.testFn.doc, "Usage:  [options]<br>\n<br>\nTest brief<br>\n<br>\nOptions:<br>\n&nbsp;&nbsp;-s,--str &lt;str&gt;<br>\n");
        assert.isFunction(global.testFn.argsParser);
        await testMagic(
            // magic command
            "%addmagic %test testFn\n" +
            "%test -s foo",
            // return value
            42,
            // stdout
            [
                "[ added magic: '%test' which will call function 'testFn' ]",
                "test done",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("parses twice", async function() {
        global.testFn = function testFn() {
            assert.isObject(this.args);
            console.log("this.args.str", this.args.str);
            return 747;
        };
        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
            ["option", "-s,--str <str>"],
        );
        assert.strictEqual(global.testFn.doc, "Usage:  [options]<br>\n<br>\nTest brief<br>\n<br>\nOptions:<br>\n&nbsp;&nbsp;-s,--str &lt;str&gt;<br>\n");
        assert.isFunction(global.testFn.argsParser);
        await testMagic(
            // magic command
            "%addmagic %test testFn\n" +
            "%test -s foo",
            // return value
            747,
            // stdout
            [
                "[ added magic: '%test' which will call function 'testFn' ]",
                "this.args.str foo",
            ],
            // stderr
            [],
            // print output
            // true,
        );
        await testMagic(
            // magic command
            "%test -s schmoo",
            // return value
            747,
            // stdout
            [
                "this.args.str schmoo",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("parses once then skips", async function() {
        global.testFn = function testFn() {
            assert.isObject(this.args);
            console.log("this.args.str", this.args.str);
            return 12;
        };

        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
            ["option", "-s,--str <str>"],
        );

        await runCode("%addmagic %test testFn");
        await testMagic(
            // magic command
            "%test -s foo",
            // return value
            12,
            // stdout
            [
                "this.args.str foo",
            ],
            // stderr
            [],
            // print output
            // true,
        );

        await testMagic(
            // magic command
            "%test",
            // return value
            12,
            // stdout
            [
                "this.args.str undefined",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("sensible error on malformed args", async function() {
        global.testFn = function testFn() {};

        decorateMagic(
            global.testFn,
            "fakepath",
            "Test brief",
        );

        await runCode("%addmagic %test testFn");
        await testMagic(
            // magic command
            "%test -x",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["error: unknown option '-x'"],
            // print output
            // true,
        );
    });

    it("passes through arguments");
});
