/* global $$ */
const path = require("path");
const {decorateMagic} = $$.addMagic.utils;
const pkgJsonFinder = require("find-package-json");

function clearCache() {
    let cacheKeys = Object.keys(require.cache);
    cacheKeys.forEach((key) => {
        delete require.cache[key];
    });
}

function req() {
    let opts = this.args;
    // console.log("opts", opts);
    let files = opts.args;

    if (files.length === 0) {
        throw new TypeError("require: no file specified");
    }

    // clear require.cache if requested
    if (opts.clearCache) {
        clearCache();
    }

    if ((opts.rootDir + opts.nodeDir + opts.initialDir) > 1) {
        throw new TypeError("require: only one of '--root-dir', '--node-dir', and '--initial-dir' may be specified");
    }

    let basePath = process.cwd();
    let pkgJsonPath = pkgJsonFinder(process.cwd()).next().filename;
    if (opts.rootDir) {
        basePath = path.dirname(pkgJsonPath);
    }

    if (opts.nodeDir) {
        let rootDir = path.dirname(pkgJsonPath);
        basePath = path.resolve(rootDir, "node_modules");
    }

    if (opts.initialDir) {
        basePath = global.__magicpatchInternal.initialDir;
    }

    // console.log("basePath", basePath);

    let results = [];
    files.forEach((file) => {
        let reqPath = path.resolve(basePath, file);
        console.log(`[ loading ${reqPath} ]`);
        results.push(require(reqPath));
    });

    if (results.length === 1) {
        return results[0];
    }

    return results;
}
decorateMagic(
    req,
    __filename,
    "Used to import modules, JSON, and local files.",
    ["name", "%require"],
    ["arguments", "<filenames...>"],
    ["option", "-c,--clear-cache", "Clear the node.js require cache before loading the module"],
    ["option", "-r,--root-dir", "Use the directory containing package.json as the path for loading modules. Assumes the root of the project is the current directory or a parent directory."],
    ["option", "-n,--node-dir", "Load from the node_modules directory in the root of the project. Assumes the root of the project is the current directory or a parent directory."],
    ["option", "-i,--initial-dir", "Use the initial directory as the path for loading modules"],
    // TODO: description of filename
);
// register the require magic
$$.addMagic("%require", req);
$$.addMagic("%load", req);
$$.addMagic("%loadjs", req);

module.exports = {
    req,
};
