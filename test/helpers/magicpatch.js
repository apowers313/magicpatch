const path = require("path");
let helpers = require("magicpatch-test")({
    magicPatchPath: path.resolve(__dirname, "../.."),
    preHook: () => {
        require("./spawnMock");
    },
});

// now that we've setup appropriately, export the magicpatch main module
// require("../..");

module.exports = helpers;
