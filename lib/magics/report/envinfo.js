/* istanbul ignore file */
const envinfo = require("envinfo");

async function gatherEnv() {
    let env = await envinfo.run(
        envinfoConfig,
        {json: true, showNotFound: true},
    );
    env = JSON.parse(env);
    return env;
}

function formatEnv(data, sections, opts) {
    formatSystem.call(this, data, sections, opts);
    formatBinaries.call(this, data, sections, opts);
    formatLanguages.call(this, data, sections, opts);
    formatManagers.call(this, data, sections, opts);
    formatUtilities.call(this, data, sections, opts);
    formatVirtualization.call(this, data, sections, opts);
    formatBrowsers.call(this, data, sections, opts);
}

function formatSystem(data, sections, opts){
    let sectionStr = this.sectionHeader("System");
    sectionStr += this.formatStr("OS", data.System.OS);
    sectionStr += this.formatStr("CPU", data.System.CPU);
    sectionStr += this.formatStr("Memory", data.System.Memory);
    sectionStr += this.formatVersionPathObj("Shell", data.System.Shell);

    sections.push(sectionStr);
}

function formatBinaries(data, sections, opts) {
    let sectionStr = this.sectionHeader("Binaries");
    sectionStr += this.formatVersionPathObj("Node", data.Binaries.Node);
    sectionStr += this.formatVersionPathObj("NPM", data.Binaries.npm);
    sectionStr += this.formatVersionPathObj("Yarn", data.Binaries.Yarn);

    sections.push(sectionStr);
}

function formatLanguages(data, sections, opts) {
    let sectionStr = this.sectionHeader("Languages");
    sectionStr += this.formatVersionPathObj("Bash", data.Languages.Bash);
    sectionStr += this.formatVersionPathObj("Go", data.Languages.Go);
    sectionStr += this.formatVersionPathObj("Java", data.Languages.Java);
    sectionStr += this.formatVersionPathObj("Perl", data.Languages.Perl);
    sectionStr += this.formatVersionPathObj("PHP", data.Languages.PHP);
    sectionStr += this.formatVersionPathObj("Python", data.Languages.Python);
    sectionStr += this.formatVersionPathObj("Python3", data.Languages.Python3);
    sectionStr += this.formatVersionPathObj("R", data.Languages.R);
    sectionStr += this.formatVersionPathObj("Ruby", data.Languages.Ruby);

    sections.push(sectionStr);
}

function formatManagers(data, sections, opts) {
    let sectionStr = this.sectionHeader("Managers");
    sectionStr += this.formatVersionPathObj("pip2", data.Managers.pip2);
    sectionStr += this.formatVersionPathObj("pip3", data.Languages.pip3);

    sections.push(sectionStr);
}

function formatUtilities(data, sections, opts) {
    let sectionStr = this.sectionHeader("Utilities");
    sectionStr += this.formatVersionPathObj("CMake", data.Utilities.CMake);
    sectionStr += this.formatVersionPathObj("Make", data.Utilities.Make);
    sectionStr += this.formatVersionPathObj("GCC", data.Utilities.GCC);
    sectionStr += this.formatVersionPathObj("Git", data.Utilities.Git);
    sectionStr += this.formatVersionPathObj("Clang", data.Utilities.Clang);
    sectionStr += this.formatVersionPathObj("Make", data.Utilities.Make);

    sections.push(sectionStr);
}

function formatVirtualization(data, sections, opts) {
    let sectionStr = this.sectionHeader("Virtualization");
    sectionStr += this.formatVersionPathObj("Docker", data.Virtualization.Docker);
    sectionStr += this.formatVersionPathObj("Running In Docker", data.isDocker ? "yes" : "no"); // from docker.js
    sectionStr += this.formatVersionPathObj("Parallels", data.Virtualization.Parallels);
    sectionStr += this.formatVersionPathObj("VirtualBox", data.Virtualization.VirtualBox);

    sections.push(sectionStr);
}

function formatBrowsers(data, sections, opts) {
    let sectionStr = this.sectionHeader("Browsers");
    sectionStr += this.formatVersionPathObj("Brave", data.Browsers["Brave Browser"]);
    sectionStr += this.formatVersionPathObj("Chrome", data.Browsers.Chrome);
    sectionStr += this.formatVersionPathObj("Chrome Canary", data.Browsers["Chrome Canary"]);
    sectionStr += this.formatVersionPathObj("Edge", data.Browsers.Edge);
    sectionStr += this.formatVersionPathObj("Firefox", data.Browsers.Firefox);
    sectionStr += this.formatVersionPathObj("Firefox Developer Edition", data.Browsers["Firefox Developer Edition"]);
    sectionStr += this.formatVersionPathObj("Firefox Nightly", data.Browsers["Firefox Nightly"]);
    sectionStr += this.formatVersionPathObj("Safari", data.Browsers.Safari);
    sectionStr += this.formatVersionPathObj("Safari Technology Preview", data.Browsers["Safari Technology Preview"]);

    sections.push(sectionStr);
}

let envinfoConfig = {
    System: [
        "OS",
        "CPU",
        "Memory",
        "Container",
        "Shell",
    ],
    Binaries: [
        "Node",
        "Yarn",
        "npm",
        "Watchman",
    ],
    Managers: [
        "Apt",
        "Cargo",
        "CocoaPods",
        "Composer",
        "Gradle",
        "Homebrew",
        "Maven",
        "pip2",
        "pip3",
        "RubyGems",
        "Yum",
    ],
    Utilities: [
        "Bazel",
        "CMake",
        "Make",
        "GCC",
        "Git",
        "Clang",
        "Mercurial",
        "Subversion",
        "FFmpeg",
    ],
    Virtualization: [
        "Docker",
        "Parallels",
        "VirtualBox",
        "VMware Fusion",
    ],
    Languages: [
        "Bash",
        "Go",
        // "Elixir",
        // "Erlang",
        "Java",
        "Perl",
        "PHP",
        // "Protoc",
        "Python",
        "Python3",
        "R",
        "Ruby",
        "Rust",
        "Scala",
    ],
    Databases: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    Browsers: [
        "Brave Browser",
        "Chrome",
        "Chrome Canary",
        "Edge",
        "Firefox",
        "Firefox Developer Edition",
        "Firefox Nightly",
        "Internet Explorer",
        "Safari",
        "Safari Technology Preview",
    ],
    npmPackages: true,
    npmGlobalPackages: true,
};

module.exports = {
    gatherEnv,
    formatEnv,
};
