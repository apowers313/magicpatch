#!/usr/bin/env node

const {writeFileSync} = require("fs");
const magicPatchPath = require.resolve("..");
const {gatherJupyter} = require("../lib/magics/report/jupyter.js");
const {exec} = require("../lib/utilities/exec.js");
const startupScriptRegExp = /^\s*--startup-script=/;
const magicpatchScriptRegExp = /^\s*--startup-script=(?<existingMagicPatchPath>.*magicpatch[\/\\]index\.js)$/;

(async function() {
    console.log("Installing magicpatch...");
    // get jupyter config
    let jupyterConfig = await gatherJupyter.call({exec});

    // make sure we got a  valid config
    if (typeof jupyterConfig !== "object" ||
        typeof jupyterConfig.Jupyter !== "object" ||
        !Array.isArray(jupyterConfig.Jupyter.kernels)) {
        throw new Error("Error getting Jupyter kernel spec list");
    }

    // only modify the javascript kernel
    let {kernels} = jupyterConfig.Jupyter;
    let jsKernSpec = kernels.filter((ks) => ks.kernel === "javascript");

    // no kernel found
    if (jsKernSpec.length === 0) {
        throw new Error("JavaScript Jupyter kernel not found. Try installing or re-installing IJavascript?");
    }

    let jsKernSpecPath = `${jsKernSpec[0].path}/kernel.json`;

    // too many kernels found
    if (jsKernSpec.length > 1) {
        console.log("Multiple javascript kernels found, modifying first one");
    }

    // read json
    let magicPatchArg = `--startup-script=${magicPatchPath}`;
    let jsKernSpecJson = require(jsKernSpecPath);

    // make sure json follows the format we expect
    if (typeof jsKernSpecJson !== "object" ||
        !Array.isArray(jsKernSpecJson.argv)) {
        throw new Error("Invalid kernel spec JSON");
    }

    // make sure a script doesn't already exist
    let existingScripts = jsKernSpecJson.argv.filter((arg) => startupScriptRegExp.test(arg));
    if (existingScripts.length > 0) {
        // --startup-script already exists in kernel.json
        if (existingScripts.length > 1) {
            throw new Error(`JavaScript kernel spec at '${jsKernSpecPath}' has multiple '--startup-script' entries, it is probably broken. Try reinstalling IJavascript.`);
        }

        let mpScript = existingScripts[0].match(magicpatchScriptRegExp);
        if (!mpScript) {
            throw new Error(`JavaScript kernel spec at '${jsKernSpecPath}' has an existing '--startup-script' entry that isn't magicpatch. You can create a script that calls both startup scripts and install it by hand. Sorry.`);
        }

        let {existingMagicPatchPath} = mpScript.groups;
        if (existingMagicPatchPath === magicPatchPath) {
            // it is already installed and pointing at the right path
            console.log(`Magicpatch is already installed for your Jupyter kernel: '${jsKernSpecPath}' loads the script '${magicPatchPath}'`);
            return;
        }

        throw new Error(`Magicpatch already installed at a different location: '${existingMagicPatchPath}'`);
    }

    // add magicpatch script to kernel arguments
    jsKernSpecJson.argv.splice(1, 0, magicPatchArg);

    // write changes to kernel spec file
    writeFileSync(jsKernSpecPath, JSON.stringify(jsKernSpecJson, {encoding: "utf8"}));
})()
    .then(() => console.log("Installation successful."))
    .catch((err) => console.log(err));
