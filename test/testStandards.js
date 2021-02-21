const {getMagic} = require("./helpers/magicpatch");
const {assert} = require("chai");

// these tests are enforcing parity with IPython magics, as reported by %lsmagic (even if lots of these are stubs)
describe("standard magics", function() {
    it("%alias", function() {
        let magicObject = getMagic("%alias");
        assert.isObject(magicObject);
    });
    it("%alias_magic", function() {
        let magicObject = getMagic("%alias_magic");
        assert.isObject(magicObject);
    });
    it("%autoawait", function() {
        let magicObject = getMagic("%autoawait");
        assert.isObject(magicObject);
    });
    it("%autocall", function() {
        let magicObject = getMagic("%autocall");
        assert.isObject(magicObject);
    });
    it("%automagic", function() {
        let magicObject = getMagic("%automagic");
        assert.isObject(magicObject);
    });
    it("%autosave", function() {
        let magicObject = getMagic("%autosave");
        assert.isObject(magicObject);
    });
    it("%bookmark", function() {
        let magicObject = getMagic("%bookmark");
        assert.isObject(magicObject);
    });
    it("%cat", function() {
        let magicObject = getMagic("%cat");
        assert.isObject(magicObject);
    });
    it("%cd", function() {
        let magicObject = getMagic("%cd");
        assert.isObject(magicObject);
    });
    it("%clear", function() {
        let magicObject = getMagic("%clear");
        assert.isObject(magicObject);
    });
    it("%colors", function() {
        let magicObject = getMagic("%colors");
        assert.isObject(magicObject);
    });
    it("%conda", function() {
        let magicObject = getMagic("%conda");
        assert.isObject(magicObject);
    });
    it("%config", function() {
        let magicObject = getMagic("%config");
        assert.isObject(magicObject);
    });
    it("%connect_info", function() {
        let magicObject = getMagic("%connect_info");
        assert.isObject(magicObject);
    });
    it("%cp", function() {
        let magicObject = getMagic("%cp");
        assert.isObject(magicObject);
    });
    it("%debug", function() {
        let magicObject = getMagic("%debug");
        assert.isObject(magicObject);
    });
    it("%dhist", function() {
        let magicObject = getMagic("%dhist");
        assert.isObject(magicObject);
    });
    it("%dirs", function() {
        let magicObject = getMagic("%dirs");
        assert.isObject(magicObject);
    });
    it("%doctest_mode", function() {
        let magicObject = getMagic("%doctest_mode");
        assert.isObject(magicObject);
    });
    it("%ed", function() {
        let magicObject = getMagic("%ed");
        assert.isObject(magicObject);
    });
    it("%edit", function() {
        let magicObject = getMagic("%edit");
        assert.isObject(magicObject);
    });
    it("%env", function() {
        let magicObject = getMagic("%env");
        assert.isObject(magicObject);
    });
    it("%gui", function() {
        let magicObject = getMagic("%gui");
        assert.isObject(magicObject);
    });
    it("%hist", function() {
        let magicObject = getMagic("%hist");
        assert.isObject(magicObject);
    });
    it("%history", function() {
        let magicObject = getMagic("%history");
        assert.isObject(magicObject);
    });
    it("%killbgscripts", function() {
        let magicObject = getMagic("%killbgscripts");
        assert.isObject(magicObject);
    });
    it("%ldir", function() {
        let magicObject = getMagic("%ldir");
        assert.isObject(magicObject);
    });
    it("%less", function() {
        let magicObject = getMagic("%less");
        assert.isObject(magicObject);
    });
    it("%lf", function() {
        let magicObject = getMagic("%lf");
        assert.isObject(magicObject);
    });
    it("%lk", function() {
        let magicObject = getMagic("%lk");
        assert.isObject(magicObject);
    });
    it("%ll", function() {
        let magicObject = getMagic("%ll");
        assert.isObject(magicObject);
    });
    it("%load", function() {
        let magicObject = getMagic("%load");
        assert.isObject(magicObject);
    });
    it("%load_ext", function() {
        let magicObject = getMagic("%load_ext");
        assert.isObject(magicObject);
    });
    it("%loadpy", function() {
        let magicObject = getMagic("%loadpy");
        assert.isObject(magicObject);
    });
    it("%logoff", function() {
        let magicObject = getMagic("%logoff");
        assert.isObject(magicObject);
    });
    it("%logon", function() {
        let magicObject = getMagic("%logon");
        assert.isObject(magicObject);
    });
    it("%logstart", function() {
        let magicObject = getMagic("%logstart");
        assert.isObject(magicObject);
    });
    it("%logstate", function() {
        let magicObject = getMagic("%logstate");
        assert.isObject(magicObject);
    });
    it("%logstop", function() {
        let magicObject = getMagic("%logstop");
        assert.isObject(magicObject);
    });
    it("%ls", function() {
        let magicObject = getMagic("%ls");
        assert.isObject(magicObject);
    });
    it("%lsmagic", function() {
        let magicObject = getMagic("%lsmagic");
        assert.isObject(magicObject);
    });
    it("%lx", function() {
        let magicObject = getMagic("%lx");
        assert.isObject(magicObject);
    });
    it("%macro", function() {
        let magicObject = getMagic("%macro");
        assert.isObject(magicObject);
    });
    it("%magic", function() {
        let magicObject = getMagic("%magic");
        assert.isObject(magicObject);
    });
    it("%man", function() {
        let magicObject = getMagic("%man");
        assert.isObject(magicObject);
    });
    it("%matplotlib", function() {
        let magicObject = getMagic("%matplotlib");
        assert.isObject(magicObject);
    });
    it("%mkdir", function() {
        let magicObject = getMagic("%mkdir");
        assert.isObject(magicObject);
    });
    it("%more", function() {
        let magicObject = getMagic("%more");
        assert.isObject(magicObject);
    });
    it("%mv", function() {
        let magicObject = getMagic("%mv");
        assert.isObject(magicObject);
    });
    it("%notebook", function() {
        let magicObject = getMagic("%notebook");
        assert.isObject(magicObject);
    });
    it("%page", function() {
        let magicObject = getMagic("%page");
        assert.isObject(magicObject);
    });
    it("%pastebin", function() {
        let magicObject = getMagic("%pastebin");
        assert.isObject(magicObject);
    });
    it("%pdb", function() {
        let magicObject = getMagic("%pdb");
        assert.isObject(magicObject);
    });
    it("%pdef", function() {
        let magicObject = getMagic("%pdef");
        assert.isObject(magicObject);
    });
    it("%pdoc", function() {
        let magicObject = getMagic("%pdoc");
        assert.isObject(magicObject);
    });
    it("%pfile", function() {
        let magicObject = getMagic("%pfile");
        assert.isObject(magicObject);
    });
    it("%pinfo", function() {
        let magicObject = getMagic("%pinfo");
        assert.isObject(magicObject);
    });
    it("%pinfo2", function() {
        let magicObject = getMagic("%pinfo2");
        assert.isObject(magicObject);
    });
    it("%pip", function() {
        let magicObject = getMagic("%pip");
        assert.isObject(magicObject);
    });
    it("%popd", function() {
        let magicObject = getMagic("%popd");
        assert.isObject(magicObject);
    });
    it("%pprint", function() {
        let magicObject = getMagic("%pprint");
        assert.isObject(magicObject);
    });
    it("%precision", function() {
        let magicObject = getMagic("%precision");
        assert.isObject(magicObject);
    });
    it("%prun", function() {
        let magicObject = getMagic("%prun");
        assert.isObject(magicObject);
    });
    it("%psearch", function() {
        let magicObject = getMagic("%psearch");
        assert.isObject(magicObject);
    });
    it("%psource", function() {
        let magicObject = getMagic("%psource");
        assert.isObject(magicObject);
    });
    it("%pushd", function() {
        let magicObject = getMagic("%pushd");
        assert.isObject(magicObject);
    });
    it("%pwd", function() {
        let magicObject = getMagic("%pwd");
        assert.isObject(magicObject);
    });
    it("%pycat", function() {
        let magicObject = getMagic("%pycat");
        assert.isObject(magicObject);
    });
    it("%pylab", function() {
        let magicObject = getMagic("%pylab");
        assert.isObject(magicObject);
    });
    it("%qtconsole", function() {
        let magicObject = getMagic("%qtconsole");
        assert.isObject(magicObject);
    });
    it("%quickref", function() {
        let magicObject = getMagic("%quickref");
        assert.isObject(magicObject);
    });
    it("%recall", function() {
        let magicObject = getMagic("%recall");
        assert.isObject(magicObject);
    });
    it("%rehashx", function() {
        let magicObject = getMagic("%rehashx");
        assert.isObject(magicObject);
    });
    it("%reload_ext", function() {
        let magicObject = getMagic("%reload_ext");
        assert.isObject(magicObject);
    });
    it("%rep", function() {
        let magicObject = getMagic("%rep");
        assert.isObject(magicObject);
    });
    it("%rerun", function() {
        let magicObject = getMagic("%rerun");
        assert.isObject(magicObject);
    });
    it("%reset", function() {
        let magicObject = getMagic("%reset");
        assert.isObject(magicObject);
    });
    it("%reset_selective", function() {
        let magicObject = getMagic("%reset_selective");
        assert.isObject(magicObject);
    });
    it("%rm", function() {
        let magicObject = getMagic("%rm");
        assert.isObject(magicObject);
    });
    it("%rmdir", function() {
        let magicObject = getMagic("%rmdir");
        assert.isObject(magicObject);
    });
    it("%run", function() {
        let magicObject = getMagic("%run");
        assert.isObject(magicObject);
    });
    it("%save", function() {
        let magicObject = getMagic("%save");
        assert.isObject(magicObject);
    });
    it("%sc", function() {
        let magicObject = getMagic("%sc");
        assert.isObject(magicObject);
    });
    it("%set_env", function() {
        let magicObject = getMagic("%set_env");
        assert.isObject(magicObject);
    });
    it("%store", function() {
        let magicObject = getMagic("%store");
        assert.isObject(magicObject);
    });
    it("%sx", function() {
        let magicObject = getMagic("%sx");
        assert.isObject(magicObject);
    });
    it("%system", function() {
        let magicObject = getMagic("%system");
        assert.isObject(magicObject);
    });
    it("%tb", function() {
        let magicObject = getMagic("%tb");
        assert.isObject(magicObject);
    });
    it("%time", function() {
        let magicObject = getMagic("%time");
        assert.isObject(magicObject);
    });
    it("%timeit", function() {
        let magicObject = getMagic("%timeit");
        assert.isObject(magicObject);
    });
    it("%unalias", function() {
        let magicObject = getMagic("%unalias");
        assert.isObject(magicObject);
    });
    it("%unload_ext", function() {
        let magicObject = getMagic("%unload_ext");
        assert.isObject(magicObject);
    });
    it("%who", function() {
        let magicObject = getMagic("%who");
        assert.isObject(magicObject);
    });
    it("%who_ls", function() {
        let magicObject = getMagic("%who_ls");
        assert.isObject(magicObject);
    });
    it("%whos", function() {
        let magicObject = getMagic("%whos");
        assert.isObject(magicObject);
    });
    it("%xdel", function() {
        let magicObject = getMagic("%xdel");
        assert.isObject(magicObject);
    });
    it("%xmode", function() {
        let magicObject = getMagic("%xmode");
        assert.isObject(magicObject);
    });
    // this one is problematic because of how we think about special characters
    // it("%%!", function() {
    //     let magicObject = getMagic("%%!");
    //     assert.isObject(magicObject);
    // });
    it("%%HTML", function() {
        let magicObject = getMagic("%%HTML");
        assert.isObject(magicObject);
    });
    it("%%SVG", function() {
        let magicObject = getMagic("%%SVG");
        assert.isObject(magicObject);
    });
    it("%%bash", function() {
        let magicObject = getMagic("%%bash");
        assert.isObject(magicObject);
    });
    it("%%capture", function() {
        let magicObject = getMagic("%%capture");
        assert.isObject(magicObject);
    });
    it("%%debug", function() {
        let magicObject = getMagic("%%debug");
        assert.isObject(magicObject);
    });
    it("%%file", function() {
        let magicObject = getMagic("%%file");
        assert.isObject(magicObject);
    });
    it("%%html", function() {
        let magicObject = getMagic("%%html");
        assert.isObject(magicObject);
    });
    it("%%javascript", function() {
        let magicObject = getMagic("%%javascript");
        assert.isObject(magicObject);
    });
    it("%%js", function() {
        let magicObject = getMagic("%%js");
        assert.isObject(magicObject);
    });
    it("%%latex", function() {
        let magicObject = getMagic("%%latex");
        assert.isObject(magicObject);
    });
    it("%%markdown", function() {
        let magicObject = getMagic("%%markdown");
        assert.isObject(magicObject);
    });
    it("%%perl", function() {
        let magicObject = getMagic("%%perl");
        assert.isObject(magicObject);
    });
    it("%%prun", function() {
        let magicObject = getMagic("%%prun");
        assert.isObject(magicObject);
    });
    it("%%pypy", function() {
        let magicObject = getMagic("%%pypy");
        assert.isObject(magicObject);
    });
    it("%%python", function() {
        let magicObject = getMagic("%%python");
        assert.isObject(magicObject);
    });
    it("%%python2", function() {
        let magicObject = getMagic("%%python2");
        assert.isObject(magicObject);
    });
    it("%%python3", function() {
        let magicObject = getMagic("%%python3");
        assert.isObject(magicObject);
    });
    it("%%ruby", function() {
        let magicObject = getMagic("%%ruby");
        assert.isObject(magicObject);
    });
    it("%%script", function() {
        let magicObject = getMagic("%%script");
        assert.isObject(magicObject);
    });
    it("%%sh", function() {
        let magicObject = getMagic("%%sh");
        assert.isObject(magicObject);
    });
    it("%%svg", function() {
        let magicObject = getMagic("%%svg");
        assert.isObject(magicObject);
    });
    it("%%sx", function() {
        let magicObject = getMagic("%%sx");
        assert.isObject(magicObject);
    });
    it("%%system", function() {
        let magicObject = getMagic("%%system");
        assert.isObject(magicObject);
    });
    it("%%time", function() {
        let magicObject = getMagic("%%time");
        assert.isObject(magicObject);
    });
    it("%%timeit", function() {
        let magicObject = getMagic("%%timeit");
        assert.isObject(magicObject);
    });
    it("%%writefile", function() {
        let magicObject = getMagic("%%writefile");
        assert.isObject(magicObject);
    });
});
