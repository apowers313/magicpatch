/* global $$ */

function env() {
    // use the line for the expression instead of args
    let expr = this.varSubst(this.line.substring(this.startArgs));

    // parse the expression
    let varNameExpr = "\\s*(?<varName>\\w+)\\s*";
    let optionalAssignmentExpr = "(?:=\\s*(?<value>.*)?\\s*)?";
    let matchEnv = new RegExp(varNameExpr + optionalAssignmentExpr);
    let match = expr.match(matchEnv);

    // return whole environment if no envvar specified
    if (!match) {
        return process.env;
    }

    let {varName, value} = match.groups;

    // if no assignment, return the value of the envvar specified
    if (!value) {
        return process.env[varName];
    }

    // set the envvar and print out the value
    process.env[varName] = value;
    console.log(`env: ${varName}=${value}`);
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    env,
    __filename,
    "Get, set, or list environment variables.",
    ["name", "%env"],
    ["arguments", "<variable> [= value]"],
    ["description", "%env: lists all environment variables/values %env var: get value for var %env var val: set value for var %env var=val: set value for var %env var={val}: set value for var."],
);

$$.addMagic("%env", env);
