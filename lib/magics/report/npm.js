/* istanbul ignore file */
/* global $$ */

const {strToMarkdown} = $$.addMagic.utils;

async function gatherNpm() {
    return {npmls: await this.exec("npm", ["ls"], {captureOutput: true, quiet: true})};
}

function formatNpm(data, sections, opts) {
    if (!opts.npmLs) {
        return;
    }

    let sectionStr = this.sectionHeader("NPM ls");

    // console.log("data.npmls", data.npmls);
    // sectionStr += this.formatStr("npmls", typeof data.npmls);

    sectionStr += this.formatPre(data.npmls.join("\n"));

    sections.push(sectionStr);
}

module.exports = {
    gatherNpm,
    formatNpm,
};
