/* global $$ */
const {gatherEnv, formatEnv} = require("./report/envinfo");
const {gatherJupyter, formatJupyter} = require("./report/jupyter");
const {gatherGit, formatGit} = require("./report/git");
const {gatherNpm, formatNpm} = require("./report/npm");
const {gatherDocker, formatDocker} = require("./report/docker");
// TODO: conda

const stdformat = {
    formatStr,
    formatList,
    formatPre,
    formatVersionPathObj,
    sectionHeader,
    subSectionHeader,
};

async function report() {
    // process.cwd("..");
    let opts = this.args;

    // TODO: this could be extensible to allow plugins
    // API would be like:
    // addDataSource(fn) // fn is called with opts, returns a Promise that resolves to an Object with the environment data
    // addReportSection(fn) // fn is call with stformat for context, combined data, options; adds section data to output
    // reportOrder[] // an array specifying the order of the sections

    // gather all the information
    let {0: envData, 1: jupyterData, 2: gitData, 3: npmData, 4: dockerData} = await Promise.all([
        gatherEnv.call(this, opts),
        gatherJupyter.call(this, opts),
        gatherGit.call(this, opts),
        gatherNpm.call(this, opts),
        gatherDocker.call(this, opts),
    ]);

    let combinedData = {
        ... envData,
        ... jupyterData,
        ... gitData,
        ... npmData,
        ... dockerData,
    };

    // console.log("combined report data:", JSON.stringify(combinedData, null, 4));

    let dateTimeOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    };

    let dateStr = new Intl.DateTimeFormat("en-US", dateTimeOptions).format();
    let sections = [
        "# Report",
        formatStr("Report Created", dateStr),
    ];
    formatEnv.call(stdformat, combinedData, sections, opts);
    formatDocker.call(stdformat, combinedData, sections, opts);
    formatJupyter.call(stdformat, combinedData, sections, opts);
    formatGit.call(stdformat, combinedData, sections, opts);
    formatNpm.call(stdformat, combinedData, sections, opts);

    printReport(sections);
}
let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    report,
    __filename,
    "Prints a report of the system configuration for reproducibility purposes",
    ["name", "%report"],
    // ["arguments", "<myArg>"],
    // ["description", "Executes 'report' in the underlying shell with the specified args"]
    ["option", "--no-npm-ls", "Don't print `npm ls` details"],
    // https://www.npmjs.com/package/commander
);
$$.addMagic("%report", report);

function printReport(sections) {
    // TODO: order sections

    $$.mime({
        "text/markdown": sections.join("\n"),
    });
}

function formatStr(name, str) {
    return `__${name}:__ ${str}<br>\n`;
}

function formatList(str) {
    return `* ${str}\n`;
}

function formatPre(str) {
    return `<pre>\n${str}\n</pre>\n`;
}

function formatVersionPathObj(name, obj) {
    if (typeof obj === "string") {
        return formatStr(name, obj);
    }

    if (typeof obj !== "object") {
        return formatStr(name, "not in version / path format");
    }

    return formatStr(name, `${obj.version} (${obj.path})`);
}

function sectionHeader(name) {
    return `## ${name}\n`;
}

function subSectionHeader(name) {
    return `### ${name}\n`;
}

module.exports = {
    formatStr,
    formatVersionPathObj,
    sectionHeader,
};

