require("./helpers/magicpatch");
const {getMagic, testMagic} = require("./helpers/helpers");

const echoSource =
`__%echo Source:__

\`\`\` js
${getMagic("%echo").fn.toString()}
\`\`\`

__File:__ /`;

describe("source", function() {
    it("question mark before", function() {
        testMagic(
            // magic command
            "??%echo",
            // return value
            undefined,
            // stdout
            [echoSource],
            // stderr
            [],
        );
    });

    it("question mark after", function() {
        testMagic(
            // magic command
            "%echo??",
            // return value
            undefined,
            // stdout
            [echoSource],
            // stderr
            [],
        );
    });
});
