function copyProps(src, dst) {
    // copy all values from function to magicObj
    for (let key of Object.keys(src)) {
        dst[key] = src[key];
    }
}

module.exports = {
    copyProps,
};
