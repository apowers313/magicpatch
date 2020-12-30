require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

describe("%addmagic", function() {
    it("errors on magic without symbol", async function() {
        await testMagic(
            // magic command
            "%addmagic foo bar",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["addmagic expected new command to start with a symbol like '%' or '.' but got 'foo'"],
            // print output
            // true,
        );
    });

    it("errors on only one arg", async function() {
        await testMagic(
            // magic command
            "%addmagic x",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["addmagic expected exactly two arguments but got: 'x'"],
            // print output
            // true,
        );
    });

    it("errors on three args", async function() {
        await testMagic(
            // magic command
            "%addmagic a b c",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["addmagic expected exactly two arguments but got: 'a,b,c'"],
            // print output
            // true,
        );
    });

    it("errors on duplicate name", async function() {
        await testMagic(
            // magic command
            "%addmagic %require foo",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["addmagic: a magic named '%require' already exists"],
            // print output
            // true,
        );
    });

    it("errors on object with non-function 'fn'");
});
