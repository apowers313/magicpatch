function gatherJupyter() {
    return Promise.all([
        this.exec("jupyter", ["--version"], {captureOutput: true, quiet: true}),
        this.exec("jupyter", ["kernelspec", "list"], {captureOutput: true, quiet: true}),
    ])
        .then((res) => {
            return {
                Jupyter: {
                    packages: parseJupyterVersion(res[0]),
                    kernels: parseJupyterKernelSpec(res[1]),
                },
            };
        });
}

function parseJupyterVersion(jupyterVersion) {
    // 'jupyter --version' should look like:

    // jupyter core     : 4.6.2
    // jupyter-notebook : 6.0.3
    // qtconsole        : 4.6.0
    // ipython          : 7.12.0
    // ipykernel        : 5.1.4
    // jupyter client   : 5.3.4
    // jupyter lab      : not installed
    // nbconvert        : 5.6.1
    // ipywidgets       : 7.5.1
    // nbformat         : 5.0.4
    // traitlets        : 4.3.3

    jupyterVersion.pop(); // last line is blank
    let jupyter = jupyterVersion.map((line) => {
        let match = line.match(/^(?<package>[^:]+):\s(?<version>.*)/);
        let parts = match ? match.groups : {package: "parsing error", version: "parsing error"};
        parts.package = parts.package.trim();
        return parts;
    });

    return jupyter;
}

function parseJupyterKernelSpec(jupyterKernelSpec) {
    // 'jupyter kernelspec list' should look like:

    // Available kernels:
    //   javascript      /Users/ampower/Library/Jupyter/kernels/javascript
    //   javascriptex    /Users/ampower/Library/Jupyter/kernels/javascriptex
    //   python3         /opt/local/Library/Frameworks/Python.framework/Versions/3.7/share/jupyter/kernels/python3

    jupyterKernelSpec.shift(); // first line is header
    jupyterKernelSpec.pop(); // last line is empty
    let kernels = jupyterKernelSpec.map((line) => {
        let match = line.match(/^\s+(?<kernel>\w+)\s+(?<path>\/.*)$/);
        let parts = match ? match.groups : {kernel: "parsing error", path: "parsing error"};
        return parts;
    });

    return kernels;
}

function formatJupyter(data, sections, opts) {
    let sectionStr = this.sectionHeader("Jupyter");

    sectionStr += this.subSectionHeader("Jupyter Packages");
    data.Jupyter.packages.forEach((jp) => {
        sectionStr += this.formatStr(jp.package, jp.version);
    });

    sectionStr += this.subSectionHeader("Jupyter Kernels");
    data.Jupyter.kernels.forEach((jp) => {
        sectionStr += this.formatStr(jp.kernel, jp.path);
    });

    sections.push(sectionStr);
}

module.exports = {
    gatherJupyter,
    formatJupyter,
};
