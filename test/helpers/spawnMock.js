// fake 'spawn()' for !cmd testing
const mockery = require("mockery");
const mockSpawn = require("mock-spawn");
let mySpawn = mockSpawn();
mySpawn.setStrategy(function(command, args) {
    command = `${command}${args.length ? " " : ""}${args.join(" ")}`;
    if (/^bash /.test(command)) {
        command = "bash";
    }

    // console.log("command", command);
    switch (command) {
    case "ls":
        return function(cb) {
            this.stdout.write(
                "THIS IS MOCKED OUTPUT\n" +
                "README.md\n" +
                "bin\n" +
                "examples\n" +
                "index.js\n" +
                "lib\n" +
                "node_modules\n" +
                "package-lock.json\n" +
                "package.json\n" +
                "test\n",
            );
            return cb(0);
        };
    case "ls -laF":
        return function(cb) {
            this.stdout.write(
                "total 208\n" +
                "drwxr-xr-x   14 ampower  staff    448 Dec 23 15:20 ./\n" +
                "drwxr-xr-x   34 ampower  staff   1088 Dec 20 10:29 ../\n" +
                "-rw-r--r--@   1 ampower  staff    130 Dec 20 10:29 .eslintrc.js\n" +
                "drwxr-xr-x   12 ampower  staff    384 Dec 23 15:30 .git/\n" +
                "-rw-r--r--    1 ampower  staff    123 Dec 20 14:18 .gitignore\n" +
                "-rw-r--r--    1 ampower  staff   1548 Dec 23 14:02 README.md\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 13:19 bin/\n" +
                "drwxr-xr-x    3 ampower  staff     96 Dec 20 14:19 examples/\n" +
                "-rw-r--r--    1 ampower  staff    673 Dec 20 14:16 index.js\n" +
                "drwxr-xr-x    5 ampower  staff    160 Dec 20 21:06 lib/\n" +
                "drwxr-xr-x  220 ampower  staff   7040 Dec 23 15:20 node_modules/\n" +
                "-rw-r--r--    1 ampower  staff  85173 Dec 23 15:20 package-lock.json\n" +
                "-rw-r--r--    1 ampower  staff   1132 Dec 23 15:20 package.json\n" +
                "drwxr-xr-x   13 ampower  staff    416 Dec 23 13:58 test/\n",
            );
            return cb(0);
        };
    case "bash":
        return function(cb) {
            this.stdout.write(
                "loop 0\n" +
                "loop 1\n" +
                "loop 2\n" +
                "loop 3\n" +
                "loop 4\n",
            );
            return cb(0);
        };
    case "fourlines":
        return function(cb) {
            this.stdout.write(
                "stdout one\n" +
                "stdout two\n",
            );
            this.stderr.write(
                "stderr one\n" +
                "stderr two\n",
            );
            return cb(0);
        };
    case "cp":
        return function(cb) {
            this.stdout.write(
                "MOCKED CP OUTPUT\n",
            );
            return cb(0);
        };
    case "npm audit":
        return function(cb) {
            this.stdout.write(
                "\n" +
                "                       === npm audit security report ===\n" +
                "\n" +
                "found 0 vulnerabilities\n" +
                " in 362 scanned packages\n",
            );
            return cb(0);
        };
    case "jupyter --version":
        return function(cb) {
            this.stdout.write(
                `jupyter core     : 4.6.2
jupyter-notebook : 6.0.3
qtconsole        : 4.6.0
ipython          : 7.12.0
ipykernel        : 5.1.4
jupyter client   : 5.3.4
jupyter lab      : not installed
nbconvert        : 5.6.1
ipywidgets       : 7.5.1
nbformat         : 5.0.4
traitlets        : 4.3.3`,
            );
            return cb(0);
        };
    case "jupyter kernelspec list":
        return function(cb) {
            this.stdout.write(
                `Available kernels:
  javascript    /Users/ampower/Library/Jupyter/kernels/javascript
  python3       /opt/local/Library/Frameworks/Python.framework/Versions/3.7/share/jupyter/kernels/python3`,
            );
            return cb(0);
        };
    default:
        console.error(`unknown spawn command '${command}', can't mock`);
        return null;
    }
});

const spawnMock = {
    spawn: mySpawn,
    execFile: require("child_process").execFile, // for notify
};
mockery.registerMock("child_process", spawnMock);
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
});
