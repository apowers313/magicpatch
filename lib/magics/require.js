/* global $$ */
const path = require("path");
const {decorateMagic} = $$.addMagic.utils;

function req(cmd, file) {
    // TODO: should always use basepath of notebook?
    let reqPath = path.resolve(process.cwd(), file);
    console.log(`[ loading ${reqPath} ]`);
    return require(reqPath);
}
decorateMagic(
    req,
    __filename,
    "Used to import modules, JSON, and local files.",
    ["name", "%require"],
    ["arguments", "<filename>"],
);
// register the require magic
$$.addMagic("%require", req);
$$.addMagic("%load", req);
$$.addMagic("%loadjs", req);

module.exports = {
    req,
};
