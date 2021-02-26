/* istanbul ignore file */
const isDocker = require("is-docker");

function gatherDocker() {
    return {
        isDocker: isDocker(),
    };
}

function formatDocker() {
    // currently included in envinfo
}

module.exports = {
    gatherDocker,
    formatDocker,
};
