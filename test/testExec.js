require("./helpers/magicpatch");
const {testMagic} = require("./helpers/helpers");

describe("exec", function() {
    // beforeEach(function() {
    //     mockery.enable();
    //     mockery.registerMock("child_process", spawnMock);
    // });

    // afterEach(function() {
    //     mockery.deregisterMock("child_process");
    //     mockery.disable();
    // });

    it("ls", async function() {
        await testMagic(
            // magic command
            "!ls",
            // return value
            0,
            // stdout
            [
                "THIS IS MOCKED OUTPUT\n" +
                "README.md\n" +
                "bin\n" +
                "examples\n" +
                "index.js\n" +
                "lib\n" +
                "node_modules\n" +
                "package-lock.json\n" +
                "package.json\n" +
                "test",
                "[ process 'ls' exited with code 0 ]",
            ],
            // stderr
            [],
        );
    });

    it("ls -laF", async function() {
        await testMagic(
            // magic command
            "!ls -laF",
            // return value
            0,
            // stdout
            [
                "total 208\n" +
                "drwxr-xr-x   14 ampower  staff    448 Dec 23 15:20 ./\n" +
                "drwxr-xr-x   34 ampower  staff   1088 Dec 20 10:29 ../\n" +
                "-rw-r--r--@   1 ampower  staff    130 Dec 20 10:29 .eslintrc.js\n" +
                "drwxr-xr-x   12 ampower  staff    384 Dec 23 15:30 .git/\n" +
                "-rw-r--r--    1 ampower  staff    123 Dec 20 14:18 .gitignore\n" +
                "-rw-r--r--    1 ampower  staff   1548 Dec 23 14:02 README.md\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 13:19 bin/\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 14:19 examples/\n" +
                "-rw-r--r--    1 ampower  staff    673 Dec 20 14:16 index.js\n" +
                "drwxr-xr-x    5 ampower  staff    160 Dec 20 21:06 lib/\n" +
                "drwxr-xr-x  220 ampower  staff   7040 Dec 23 15:20 node_modules/\n" +
                "-rw-r--r--    1 ampower  staff  85173 Dec 23 15:20 package-lock.json\n" +
                "-rw-r--r--    1 ampower  staff   1132 Dec 23 15:20 package.json\n" +
                "drwxr-xr-x   13 ampower  staff    416 Dec 23 13:58 test/",
                "[ process 'ls -laF' exited with code 0 ]",
            ],
            // stderr
            [],
        );
    });
});
