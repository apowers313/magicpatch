require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

const echoDoc =
`__%echo Documentation:__

Usage: %echo &lt;string&gt;<br>
<br>
Write arguments to the standard output.<br>


__File:__ /`;

describe("docs", function() {
    it("question mark before", function() {
        testMagic(
            // magic command
            "?%echo",
            // return value
            undefined,
            // stdout
            [echoDoc],
            // stderr
            [],
        );
    });

    it("question mark after", function() {
        testMagic(
            // magic command
            "%echo?",
            // return value
            undefined,
            // stdout
            [echoDoc],
            // stderr
            [],
        );
    });
});
