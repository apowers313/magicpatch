require("./helpers/magicpatch");
const {getMagic} = require("./helpers/helpers");
const {assert} = require("chai");

describe("decoration", function() {
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
        assert.match(magicObj.file, /\/magicpatch\/lib\/builtin\.js$/);
    });

    it("errors on bad fn");
    it("errors on bad file");
    it("errors on bad brief");
    it("errors on bad options");
    it("adds doc with options");
    it("adds parser");
});
