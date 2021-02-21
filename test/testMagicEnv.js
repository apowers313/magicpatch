const {runCode, testMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");

let savedEnv = {};
function setupEnv() {
    // delete all environment variables
    for (let key of Object.keys(process.env)) {
        savedEnv[key] = process.env[key];
        delete process.env[key];
    }

    process.env.TERM = "xterm-256color";
    process.env.SHELL = "/bin/bash";
    process.env.EDITOR = "subl -w";
    process.env.USER = "ampower";
    process.env.HOME = "/Users/ampower";
}

function restoreEnv() {
    for (let key of Object.keys(savedEnv)) {
        process.env[key] = savedEnv[key];
    }
}

describe("%env", function() {
    beforeEach(function() {
        setupEnv();
    });

    afterEach(function() {
        restoreEnv();
    });

    it("returns variable", async function() {
        process.env.foo = "blorglesnork";
        await testMagic(
            // magic command
            "%env foo",
            // return value
            "blorglesnork",
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
    });

    it("sets variable", async function() {
        await testMagic(
            // magic command
            "%env foo=bar",
            // return value
            undefined,
            // stdout
            ["env: foo=bar"],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.env.foo, "bar");
    });

    it("handles multitple =", async function() {
        await testMagic(
            // magic command
            "%env foo=bar=blah",
            // return value
            undefined,
            // stdout
            ["env: foo=bar=blah"],
            // stderr
            [],
            // print output
            // true,
        );
        assert.strictEqual(process.env.foo, "bar=blah");
    });

    it("trims whitespace", async function() {
        await testMagic(
            // magic command
            "%env  foo  =  newfoo   ",
            // return value
            undefined,
            // stdout
            ["env: foo=newfoo"],
            // stderr
            [],
            // print output
            // true,
        );
        await runCode("%env  foo  =  newfoo   ");
        assert.strictEqual(process.env.foo, "newfoo");
    });

    it("no arg prints whole environment", async function() {
        await testMagic(
            // magic command
            "%env",
            // return value
            {
                TERM: "xterm-256color",
                SHELL: "/bin/bash",
                EDITOR: "subl -w",
                USER: "ampower",
                HOME: "/Users/ampower",
            },
            // stdout
            [],
            // stderr
            [],
            // print output
            // true,
        );
    });
});
