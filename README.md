# MagicPatch
Adds functionality to the [Jupyter](https://jupyter.org/) [IJavascript](http://n-riesco.github.io/ijavascript) kernel that attempts to make it as close as possible to the [IPython experience](https://ipython.readthedocs.io/en/stable/interactive/reference.html#interactive-use) by adding `%magic` commands, `!shell` execution, and `{variable}` substitution, and more!

__work in progress__

# Install
In Linux or MacOS:
``` sh
# install IJavascript as usual
npm install -g magicpatch
ijsinstall --startup-script=`magicpatch-location`
```

Windows:
[TODO: Anyone want to volunteer to figure this out and send me the output?]

# Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
  - [%magic](#%25magic)
  - [!cmd](#cmd)
  - [var assignment](#var-assignment)
  - [{var} substitution](#var-substitution)
  - [output caching](#output-caching)
  - [input caching](#input-caching)
  - [online help: ?%magic, %magic?, ??%magic, %magic??](#online-help-%25magic-%25magic-%25magic-%25magic)
  - [%%cellmagic](#%25llmagic)
- [Examples](#examples)
- [built in magics](#built-in-magics)
- [stdmagic](#stdmagic)
- [Adding your own magics](#adding-your-own-magics)
- [Philosophy](#philosophy)
- [Contributions](#contributions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Features
Wherever possible, this module tries to mimic the features of [IPython experience](https://ipython.readthedocs.io/en/stable/interactive/reference.html#interactive-use).
## %magic
See built in magics for magics included in this package.
## !cmd
## var assignment
## {var} substitution
## output caching
## input caching
## online help: ?%magic, %magic?, ??%magic, %magic??
## %%cellmagic

# Examples
Examples can be found TODO

# Built in Magics
* %echo
* %require
* %addmagic, $$.addMagic
* %automagic
* %%script

# stdmagic
* stdmagic
  * %lsmagic
  * %quickref

# Adding your own magics
* adding your own magic
  * name, function
    * function args
    * function properties
      * doc: magicObj.doc || magicObj.fn.doc
      * brief: magicObj.brief || magicObj.fn.brief
      * ctx
      * file
    * function context
      * exec
      * magicMap
      * history
      * args
      * line
      * code
      * ctx
  * name, magicObj
  * documentation
    * magicObj.doc || magicObj.fn.doc
    * magicObj.brief || magicObj.fn.brief
  * advanced features
    * any symbol allowed
    * special matcher
    * any other properties
    * cell magic: fn.cellMagic = true

# Philosophy
* productivity
* reproducibility
* user expectations
* community

# Contributions
* making contributions
  * magics: stdmagic