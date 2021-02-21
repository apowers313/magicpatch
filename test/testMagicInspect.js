const {testMagic} = require("./helpers/magicpatch");

describe("inspect", function() {
    before(function() {
        global.testObj = {
            foo: "bar",
            down: {
                the: {
                    rabbit: {
                        hole: {
                            drink: "me",
                        },
                    },
                },
            },
        };
    });

    after(function() {
        delete global.testObj;
    });

    it("prints object", function() {
        return testMagic(
            // magic command
            "%inspect testObj",
            // return value
            undefined,
            // stdout
            [
                "testObj value:",
                "{\n" +
                "  foo: 'bar',\n" +
                "  down: {\n" +
                "    the: {\n" +
                "      rabbit: {\n" +
                "        hole: {\n" +
                "          drink: 'me'\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}\n",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("respects depth", function() {
        return testMagic(
            // magic command
            "%inspect  -d 0 testObj",
            // return value
            undefined,
            // stdout
            [
                "testObj value:",
                "{\n  foo: 'bar',\n  down: [Object]\n}",
            ],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("throws if no variable specified", function() {
        return testMagic(
            // magic command
            "%inspect",
            // return value
            undefined,
            // stdout
            [],
            // stderr
            ["%inspect expected an object name\n"],
            // print output
            // true,
        );
    });
});
