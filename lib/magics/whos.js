/* global $$ */
const {getGlobalVars} = $$.addMagic.utils;
const {table} = require("table");
const humanize = require("humanize-anything");

function whos() {
    //  Variable   Type   Data/Info
    // -------------------------------
    //  beer       str    yum
    //  bob        str    nice
    //  x          int    3

    let vars = getGlobalVars();
    let varDetails = vars.map((varName) => {
        let value = eval(varName);
        return [varName, humanize.type(value), humanize(value)];
    });
    varDetails.unshift(["Variable", "Type", "Data/Info"]);

    let config = {
        border: {
            bodyLeft: "",
            bodyRight: "",
            bodyJoin: " ",

            joinBody: "-",
            joinLeft: "-",
            joinRight: "-",
            joinJoin: "-",

            bottomBody: "",
            bottomJoin: "",
            bottomLeft: "",
            bottomRight: "",
        },
        drawHorizontalLine: (index) => {
            return index === 1;
        },
    };

    let output = table(varDetails, config);

    console.log(output);
}
$$.addMagic("%whos", whos);
