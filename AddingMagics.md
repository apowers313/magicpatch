<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Adding your own magics

- [addMagic](#addmagic)
- [Magic Function](#magic-function)
- [Magic Object](#magic-object)
- [Magic Function: Context](#magic-function-context)
- [Utilities](#utilities)
  - [exec(cmd, args[], opt)](#execcmd-args-opt)
  - [scriptExec(scriptProg, scriptProgArgs[], code)](#scriptexecscriptprog-scriptprogargs-code)
  - [decorateMagic(fn, file, briefString, ... opts)](#decoratemagicfn-file-briefstring--opts)
  - [varSubst(str)](#varsubststr)
  - [parserRegExps](#parserregexps)
- [Outlandish Things](#outlandish-things)
  - [Magic Symbols](#magic-symbols)
  - [Removing Magics / Starting Over From Scratch](#removing-magics--starting-over-from-scratch)
  - [magicpatchInternal](#magicpatchinternal)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## addMagic
Both `%addmagic` and `$$.addMagic` wrap the underlying `addMagic` function, which has two signatures:
  * `addMagic(<name:string>, <functionName:string>)` - Primarily used by `%addmagic` inside Jupyter. The functionName will be converted to a function using `eval`.
  * `addMagic(<name:string>, <magicObject:object>)` - Used for adding magics via a script or module through `$$.addMagic`. The `magicObject` is expected to have at least a `fn` property that is the function to be run for the magic.

## Magic Function
The magic function is the one you specify when calling `addMagic`. The function will typically receive an array of strings as specified during the call:

```js
function myMagic(... args) {
  console.log("first arg:", args[0]);
  console.log("second arg:", args[1]);
  console.log("third arg:", args[2]);
}

%addmagic %mymagic myMagic
// same as $$.addMagic("%mymagic", myMagic)
%mymagic foo bar
// expected output --
// first arg: %mymagic
// second arg: foo
// third arg: bar
```

Since the first argument is always the command name, I typically use the pattern `function myMagic(cmd, ...args)` when declaring my magic functions.

Note that while your magic function will **usually** receive strings, it is possible to pass in non-string values using variable substitution. For example, this will pass an object to your magic function:


``` js
var myObj = {test: true};
%mymagic {myObj} // variable name wrapped in curly braces
```

## Magic Object
The magic object passed in through the second `addMagic` signature accepts the following properties:
  * `fn` - Required, function. A reference to the magic function, as described in the previous section.
  * `brief` - Optional, string. A single sentence documentation of the function in Markdown format.
  * `doc` - Optional, string. A long documentation of the function in Markdown format.
  * `cellMagic` - Optional, boolean. This magic is a cell magic. It can only be specified on the first line of the cell and the rest of the text in the cell will be passed to it as an argument.
  * `ctx` - Optional, object. A context value to pass your function. Properties on `ctx` show up as `this.<property>` when your function is called. Be careful not to collide with other values on `this` as mentioned in the "Magic Function: Context" section below. [TODO: moved to magicObject] If `ctx.argsParser` is specified and is a function, it will be run on the arguments of your magic function and the results will be assigned to `ctx.args`. This is used internally by the `decorateMagic` utility to run [commander](https://www.npmjs.com/package/commander) on the arguments passed to functions to parse args like `-n` passed to magic commands.
  * `matcher` - Optional, regexp. This is a dangerous feature that has a great ability to break things -- use with care and test extensively. A regular expression that will match the line for when your function should be called. This is primarily used for features like shell execution (e.g. `!ls`), and a default matcher will be specified if you don't pass one in. The parser is expected to include certain named capture groups, such as `magicSymbol`.

Note that any properties assigned to your magic function are also copied to the magic object. This can be convenient shorthand: the property on a magic function `myMagic.brief` becomes `magicObject.brief` allowing quick documentation, even from the Jupyter shell.

## Magic Function: Context
When your magic function is called, it will have access to the magicpatch internals loaded into the the `this` object:
  * `magicObj` - The magic object that was used to define this magic.
  * `magicMap` - The whole [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of magic objects. Useful for creating magics like `%lsmagic` or `%quickref` that describe all the magics. Modifying this Map may have bad consequences.
  * `args` - The arguments as parsed by `argsParser`.
  * `utils` - An object containing the utility functions described in the next section.
  * `exec` - The `exec` utility function described in the next section. Also available at `this.utils.exec`.
  * `varSubst` - The `varSubst` utility function described in the next section. Also available at `this.utils.varSubst`.
  * `history` - The `In` array describing all the previous commands that have been run. Useful for implementing magics like `%history`.
  * `config` - An object describing the configuration of magicpatch. Mostly useful for the `requireMagic` that toggles automagic on and off.
  * `code` - The entire code of this cell that was passed to magicpatch. Note that whitespace is trimmed from the start and end of the string.
  * `line` - The currently executing line of `code`
  * `lineNo` - The currently executing line number of `code`
  * `argsStart` - The index of the first character of arguments passed to the magic.
  * `hasAssignment` - Whether `line` includes a variable assignment like `x = %foo`.
  * `matchParts` - Parts of the magic as matched by the regular expressions used for parsing magics.
  * `showDoc` - `true` if the magic was invoked as `%magic?` or `?%magic`. Should always be `false` since a magic function will not be called if documentation was requested.
  * `showCode` - Similar to `showDoc` but for `%magic??` and `??%magic`.
  * `interpreter` - The `magicInterpreter` function. Only used for debugging.
  * `fn.ctx.*` - Any other variables specified as part of the magic object `ctx` object.

## Utilities
These utility functions are provided for convenience when developing new magics. They can be found in `$$.addMagic.utils` or in the `this.utils` of your magic function.

### exec(cmd, args[], opt)
Calls [spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) with the specified `cmd` and `args` and returns a Promise that resolves with the result of the command or rejects with an Error if `spawn` emits an error event. The Promise will resolve to the status code of the program (0 on success, non-zero on error), or will resolve to the output of the program if `captureStdout`, `captureStderr`, or `captureOutput` are specified.

Values for the `opt` argument include:
  * `argv0` - String. The name of the program, or `"(magicpatch exec)"` by default.
  * `shell` - Boolean. Whether `spawn` should use a shell or not. True by default.
  * `captureStdout` - If truthy, all data written `stdout` by the program will be captured into an array and split by newlines. Promise returned by `exec` will resolve to the output array.
  * `captureStderr` - Same as `captureStdout`, but all data written to `stderr` will be captured.
  * `captureOutput` - If truthy sets both `captureStdout` and `captureStderr` to `true`.

### scriptExec(scriptProg, scriptProgArgs[], code)
Calls `exec` wih the program specified by the string `scriptProg` with the arguments. The `code` string is stored as a temporary file and passed as the final argument to `exec` with the intent of running it as a script. For example, `scriptExec("bash", [], "echo hi")` would save the code `echo hi` into a temporary file and then run it as a bash script.

### decorateMagic(fn, file, briefString, ... opts)
When called before `fn` is passed to `addMagic`, this will documentation and other niceness to the specified function. The arguments are:
  * `fn` - Function. The magic function to be decorated
  * `file` - String. The path to this file that will be used to tell end users where the code is located. Simply specify `__filename` for this parameter.
  * `briefString` - String. A one sentence description of what this magic function does.
  * `opts` Array of Arrays. Each option argument is an array of the format `[cmd, param1, param2, param3 ...]`, where `cmd` corresponds to a [commander](https://www.npmjs.com/package/commander) `program` function and the parameters that follow will be passed to that function. Common commands are:
    * `name` - The name of the magic function, followed by a string. For example `["name", "%mymagic"]`
    * `arguments` - A string describing positional arguments (i.e. no flag before the argumentt) expected to be passed to the magic function. For example, `["arguments", "[filename]"]` would indicate that a magic like `%require` expects a `filename` to be passed in.
    * `description` - A long description of the magic function in Markdown format. If not specified, `briefString` will be used for the description.
    * `option` - Any flags to be parsed from the arguments.

This function will decorate `fn` with `brief`, `doc`, and `file` for documentation and add a `argsParser` function that will call [commander](https://www.npmjs.com/package/commander)'s parser.

### varSubst(str)
Takes a single string argument, and replaces any `{var}` statements with the value returned by `eval(var)`. If the string is only a statement contained within curly brackets, the value from within those brackets is returned. If the curly brackets occur as part of a longer string, a string will be returned with the curly bracketed value embedded in the string as interpreted by the [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

### parserRegExps
The regular expressions used by the interpreter for parsing magics. I don't know why anyone would ever need these externally, but here they are.

## Outlandish Things
I don't know if people will ever use these features, but here they are for the curious or the crazy...

### Magic Symbols
Any magic symbol is allowed. `%` is used for line magics and `%%` is used for cell magics to maintain the convention of IPython, however any symbol(s) matching the regular expression `\W+` (the [non-word character](https://www.w3schools.com/jsref/jsref_regexp_wordchar_non.asp) is allowed.

### Removing Magics / Starting Over From Scratch
If you don't like the magics included by default in this package but want to reuse the interpreter functionality (for example if you want to ditch magics starting with `%` and use `.` like the [node.js REPL shell](https://nodejs.org/api/repl.html)), magicpatch exports a `magicMap` [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that contains all the magics. It also exposes it as `$$.addMagic.magicMap`. `magicMap` is used by the interpreter to lookup, match, and run magics. Calling `magicMap.delete(<magicName>)` will remove a magic. For example, `magicMap.delete("%echo")` would delete the `%echo` magic. Calling `magicMap.clear()` will remove ALL magics (including `%addmagic`, but not `$$.addMagic`) allowing you to start over from scratch and specify your own magics.

### magicpatchInternal
The `global.__magicpatchInternal` object is a non-enumerable / hidden global value that's really for internal use only. Writing to it would probably be a bad idea.
  * `initialized` - `true` when magicpatch is installed and initialized
  * `kernelDir` - The `__dirname` that magicpatch is installed in
  * `origVmRunInThisContext` - The original `global.vm.runInThisContext` before it was replaced by magicpatch
  * `debugInterp` - When truthy, prints out debug statements to help debug the interpreter. `false` by default