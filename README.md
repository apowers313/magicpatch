# MagicPatch
Adds functionality to the [Jupyter](https://jupyter.org/) [IJavascript](http://n-riesco.github.io/ijavascript) kernel that attempts to make it as close as possible to the [IPython experience](https://ipython.readthedocs.io/en/stable/interactive/reference.html#interactive-use) by adding `%magic` commands, `!shell` execution, and `{variable}` substitution, and more!

__work in progress__

## Install
``` sh
# install IJavascript as usual
npm install -g magicpatch
ijsinstall --startup-script=`magicpatch-location`
```

## Features
* !cmd
* {var} substitution
* output caching
* input caching
* online help: ?%magic, %magic?, ??%magic, %magic??

Examples can be found TODO

## built in magics
* %echo
* %require
* %addmagic, $$.addMagic
* %automagic

## stdmagic
* stdmagic
  * %lsmagic
  * %quickref

## Adding your own magics
* adding your own magic
  * name, function
    * function args
    * function properties
      * doc: cmdObj.doc || cmdObj.fn.doc
      * brief: cmdObj.brief || cmdObj.fn.brief
      * ctx
      * file
    * function context
      * exec
      * cmdMap
      * history
      * args
      * line
      * code
      * ctx
  * name, cmdObj
  * documentation
    * cmdObj.doc || cmdObj.fn.doc
    * cmdObj.brief || cmdObj.fn.brief
  * advanced features
    * any symbol allowed
    * special matcher
    * any other properties

## Philosophy
* productivity
* reproducibility
* user expectations
* community

## Contributions
* making contributions
  * magics: stdmagic