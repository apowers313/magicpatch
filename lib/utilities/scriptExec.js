const fs = require("fs");
const tmp = require("tmp");
const {exec} = require("./exec");

// delete temp files if we forget
tmp.setGracefulCleanup();

function scriptExec(scriptProg, scriptProgArgs, code) {
    // create a temporary file
    let tmpFile = tmp.fileSync();

    // write code to temporary file
    try {
        fs.writeFileSync(tmpFile.name, code, {encoding: "utf8"});
    } catch (e) {
        console.error("ERROR", e);
    }
    scriptProgArgs.push(tmpFile.name);

    // run the code with the specified program
    let ret = exec(scriptProg, scriptProgArgs);
    return ret;
}

module.exports = {
    scriptExec,
};
