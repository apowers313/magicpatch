function varSubst(str) {
    let ret;
    let varOnlyRegExp = /^{(?<varName>[^}]*)}$/; // looks like "{var}"
    let varOnly = str.match(varOnlyRegExp);
    // console.log("varOnly", varOnly);
    if (varOnly) {
        ret = eval(varOnly.groups.varName);
    } else {
        let varMatch = /{[^}]*}/g; // looks like "something{var1}something{var2}{var3}something..."
        ret = str.replace(varMatch, (v) => {
            // console.log("match found", v);
            // console.log("returning:", eval(v));
            return `${eval(v)}`;
        });
    }

    return ret;
}

module.exports = {
    varSubst,
};
