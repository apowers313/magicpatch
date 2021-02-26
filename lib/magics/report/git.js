/* istanbul ignore file */
const git = require("isomorphic-git");
const fs = require("fs");

async function gatherGit() {
    let dir = "Not found";
    try {
        dir = await git.findRoot({
            fs,
            filepath: process.cwd(),
        });
    } catch (err) {
        return {Git: {gitroot: dir}};
    }

    // TODO: if not git..

    let {0: status, 1: branch, 2: remotes, 3: commits} = await Promise.all([
        git.statusMatrix({fs, dir, filter: (f) => !f.startsWith("node_modules")}),
        git.currentBranch({fs, dir, fullname: false}),
        git.listRemotes({fs, dir}),
        git.log({fs, dir, depth: 5}),
    ]);

    // convert statuses to human readable strings
    status = status.map((f) => {
        let filename = f.shift();
        let status = statusMap.get(f.join(""));
        return {
            filename,
            status,
        };
    }).filter((o) => o.status !== "unmodified");

    return {
        Git: {
            gitroot: dir,
            status,
            branch,
            remotes,
            lastCommit: commits ? commits[0] : null,
        },
    };
}

const statusMap = new Map([
    ["020", "new, untracked"],
    ["022", "added, staged"],
    ["023", "added, staged, with unstaged changes"],
    ["111", "unmodified"],
    ["121", "modified, unstaged"],
    ["122", "modified, staged"],
    ["123", "modified, staged, with unstaged changes"],
    ["101", "deleted, unstaged"],
    ["100", "deleted, staged"],
]);

function formatGit(data, sections, opts) {
    let sectionStr = this.sectionHeader("Git");
    sectionStr += this.formatStr("Git Directory", data.Git.gitroot);

    // if no git root, skip the rest
    if (data.Git.gitroot === "Not found") {
        sections.push(sectionStr);
        return;
    }

    sectionStr += this.formatStr("Branch", data.Git.branch);
    sectionStr += this.formatStr("Last Commit", `${data.Git.lastCommit.oid} ("${data.Git.lastCommit.commit.message.trim()}")`);
    sectionStr += this.formatStr("Parent", data.Git.lastCommit.commit.parent);
    sectionStr += this.formatStr("Tree", data.Git.lastCommit.commit.tree);

    sectionStr += this.subSectionHeader("Remotes", data.Git.gitroot);
    data.Git.remotes.forEach((r) => {
        sectionStr += this.formatList(`${r.remote} (${r.url})`);
    });

    sectionStr += this.subSectionHeader("Git Status");
    data.Git.status.forEach((s) => {
        sectionStr += this.formatList(`${s.filename}: ${s.status}`);
    });

    sections.push(sectionStr);
}

module.exports = {
    gatherGit,
    formatGit,
};
