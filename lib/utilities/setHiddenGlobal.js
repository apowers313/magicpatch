function setHiddenGlobal(name, val) {
    Object.defineProperty(global, name, {
        value: val,
        writable: true,
        configurable: true,
        enumerable: false,
    });
}

module.exports = {
    setHiddenGlobal,
};
