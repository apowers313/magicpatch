function numberParser(name, val) {
    let ret = parseInt(val);
    // eslint-disable-next-line eqeqeq
    if (ret != val) {
        throw new TypeError(`${name} expected number argument but got ${val}`);
    }

    return ret;
}

module.exports = {
    numberParser,
};
