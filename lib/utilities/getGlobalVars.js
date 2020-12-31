let globalVarsFilter = new Set([
    "$$",
    "$$done$$",
    "$$mimer$$",
    "__dirname",
    "__filename",
    "clearImmediate",
    "clearInterval",
    "clearTimeout",
    "console",
    "exports",
    "global",
    "module",
    "queueMicrotask",
    "require",
    "setImmediate",
    "setInterval",
    "setTimeout",
    // other junk from modules
    "__core-js_shared__",
    "core",
]);

function getGlobalVars() {
    let ret = [];
    for (let key of Object.keys(global)) {
        if (!globalVarsFilter.has(key)) {
            ret.push(key);
        }
    }

    ret = ret.sort();
    return ret;
}

module.exports = {
    getGlobalVars,
};
