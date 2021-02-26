const {testMagic} = require("./helpers/magicpatch");

const echoDoc =
`__%echo Documentation:__

Usage: %echo &lt;string&gt;<br>
<br>
Write arguments to the standard output.<br>


__File:__ `;

describe("docs", function() {
    it("question mark before", async function() {
        await testMagic(
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

    it("question mark after", async function() {
        await testMagic(
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
