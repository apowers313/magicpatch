function printAutomagicStatus(required) {
    if (!required) {
        console.log("Automagic is ON, % prefix IS NOT needed for line magics.");
    } else {
        console.log("Automagic is OFF, % prefix IS needed for line magics.");
    }
}

module.exports = {
    printAutomagicStatus,
};
