/* global $$ */

function magicStub(name) {
    $$.addMagic(name, {
        name: name,
        fn: stub,
        stub: true,
        standard: true,
    });
}

function stub(name) {
    console.error(`Sorry, the magic '${name}' is not implemented (yet).`);
}

module.exports = {};

/** **
 * jupyter shell & sweeteners
 ****/
magicStub("%alias_magic"); // alias to existing magic
magicStub("%autocall"); // enable function calls without parens
magicStub("%autosave"); // Set the autosave interval in the notebook (in seconds).
magicStub("%colors"); // set color pallet; TODO: how to do colors?
magicStub("%config"); // mange configuration
magicStub("%connect_info"); // prints connection info JSON
magicStub("%macro"); // Define a macro for future re-execution. It accepts ranges of history, filenames or string objects.
magicStub("%magic"); // list all magic commands and their help
magicStub("%notebook"); // export the current IPython history to a notebook file
magicStub("%pastebin"); // Upload code to dpaste's paste bin, returning the URL.
magicStub("%pprint"); // toggle pretty printing
magicStub("%precision"); // Set floating point precision for pretty printing
magicStub("%recall"); // recall output to command line - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-recall
magicStub("%rep"); // same as %recall
// jupyter kernel
magicStub("%store"); // store / recall variable for reference across notebooks
magicStub("%reset"); // reset everything: variables, histories, etc.
magicStub("%reset_selective"); // alias for %reset
magicStub("%rerun"); // Re-run previous input
magicStub("%save"); // save lines or a macro to a file
// jupyter pager
// paging not implemented in protocol in jp-kernel
// https://github.com/n-riesco/jp-kernel/blob/0bc2665470bfd2350ef8d0450b4a4c48f865904c/lib/handlers_v5.js
magicStub("%more"); // display information in IPython pager
magicStub("%less");
magicStub("%pfile");
magicStub("%psource"); // Print (or run through pager) the source code for an object.
magicStub("%page"); // Pretty print the object and display it through a pager.
// logging
magicStub("%logoff"); // Temporarily stop logging
magicStub("%logon"); // Restart logging
magicStub("%logstart"); // Start logging anywhere in a session.
magicStub("%logstate");
magicStub("%logstop");
// useless?
magicStub("%clear"); // clear the terminal
// editor support
magicStub("%edit"); // open editor, edit a file, save results into window
magicStub("%ed"); // alias for %edit

/** **
 * directory history
 ****/
magicStub("%bookmark"); // Manage IPython's bookmark system; named bookmark for a directory

/** **
 * cell magics
 ****/
// magicStub("%%!");
magicStub("%%bash");
magicStub("%%capture");
magicStub("%%debug");
magicStub("%%file");
magicStub("%%html");
magicStub("%%HTML");
magicStub("%%javascript");
magicStub("%%js");
magicStub("%%latex");
magicStub("%%markdown");
magicStub("%%perl");
magicStub("%%prun");
magicStub("%%pypy");
magicStub("%%python");
magicStub("%%python2");
magicStub("%%python3");
magicStub("%%ruby");
magicStub("%%sh");
magicStub("%%svg");
magicStub("%%SVG");
magicStub("%%sx");
magicStub("%%system");
magicStub("%%time");
magicStub("%%timeit");
magicStub("%%writefile");

/** **
 * performance tuning
 ****/
magicStub("%time");
magicStub("%timeit");

/** **
 * python stuff
 ****/
magicStub("%conda");
magicStub("%doctest_mode"); // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-doctest_mode
magicStub("%gui"); // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-gui
magicStub("%matplotlib");
magicStub("%prun"); // Run a statement through the python code profiler
magicStub("%pdb"); // python debugger - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdb
magicStub("%pycat"); // Show a syntax-highlighted file through a pager
magicStub("%pylab"); // Load numpy and matplotlib - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pylab
magicStub("%qtconsole");
magicStub("%load_ext");
magicStub("%reload_ext");
magicStub("%unload_ext"); // unload Python extension

/** **
 * nodejs stuff
 ****/
magicStub("%autoawait"); // wait for calls to finish
magicStub("%debug"); // activate interactive debugger; use inspect?
magicStub("%killbgscripts"); // Kill all BG processes started by %%script and its family.
magicStub("%run"); // run script
magicStub("%who_ls"); // %who with variables returned as an array
magicStub("%xdel"); // delete a variable -  https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-xdel
// variable inspection
magicStub("%pdef"); // print function definition - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdef
magicStub("%pdoc"); // print documentation - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdoc
magicStub("%pinfo"); // print info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo
magicStub("%pinfo2"); // print deteailed info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo2
magicStub("%psearch"); // Search for object in namespaces by wildcard
magicStub("%tb"); // Print the last traceback
magicStub("%xmode"); // Switch modes for the exception handlers

/** **
 * shell commands
 ****/
magicStub("%alias"); // alias to shell command
magicStub("%unalias");
magicStub("%ldir"); // ls, only show directories
magicStub("%lf"); // ls, only show files
magicStub("%lk");
magicStub("%ll");
magicStub("%lx");
magicStub("%man"); // Find the man page for the given command and display in pager.
magicStub("%rehashx"); // Update the alias table with all executable files in $PATH.
magicStub("%set_env"); // set environment: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-set_env
magicStub("%sc"); // shell capture: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-sc
