Adds functionality to the [Jupyter](https://jupyter.org/) [IJavascript](http://n-riesco.github.io/ijavascript) kernel that attempts to make it as close as possible to the [IPython experience](https://ipython.readthedocs.io/en/stable/interactive/reference.html#interactive-use) by adding `%magic` commands, `!shell` execution, and `{variable}` substitution, and more!

__work in progress__

## notes for future documentation
* philosophy
  * productivity
  * reproducibility
  * user expectations
  * community
* %addmagic, $$.addMagic
* %require
* %echo
* !cmd
* {var} substitution
* output caching
* input caching
* online help: ?%magic, %magic?, ??%magic, %magic??, %lsmagic, %quickref
* stdmagic
* example notebook
* adding your own magic
  * name, function
    * function args
    * function properties
      * doc
      * brief
      * ctx
    * doc, brief, ctx
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
    * cmdObj.doc || cmdObj.fn.
    * cmdObj.brief || cmdObj.fn.brief
  * special things
    * any symbol allowed
    * special matcher
* making contributions
  * magics: stdmagic