require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

describe("cell magic", function() {
    it("runs program", async function() {
        await testMagic(
            // magic command
            "%%shell bash\n" +
            "for (( i = 0; i < 5; i++ ))\n" +
            "    do echo loop $i\n" +
            "done\n",
            // return value
            0,
            // stdout
            [
                "loop 0\n" +
                "loop 1\n" +
                "loop 2\n" +
                "loop 3\n" +
                "loop 4\n",
                "[ process 'bash /",
            ],
            // stderr
            [],
            // show output
            false,
        );
    });
});
