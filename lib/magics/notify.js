/* istanbul ignore file */
/* global $$ */

let notifier = require("node-notifier");
const path = require("path");

async function notify() {
    let opts = this.args;
    // console.log("opts", opts);

    let notificationOpts = {
        title: "Jupyter",
        message: opts.args.join(" ") || "Jupyter Notification",
        icon: path.resolve(__dirname, "../../logo/jupyter.png"),
        closeLabel: "Cancel",
        actions: "Ok",
        sound: opts.sound || false,
        timeout: (typeof opts.timeout === "number") ? opts.timeout : 10,
        // subtitle: "This is a subtitle",
        // wait: true,
        // reply: true,

        // For more OS-specific options:
        // https://www.npmjs.com/package/node-notifier
    };

    // console.log("notificationOpts", notificationOpts);

    return doNotification(notificationOpts);
}

function doNotification(opts) {
    return new Promise((resolve, reject) => {
        notifier.notify(opts, (err, response, metadata) => {
            if (err) {
                return reject(err);
            }

            return resolve({response, metadata});
        });
    });
}

let {decorateMagic} = $$.addMagic.utils;
decorateMagic(
    notify,
    __filename,
    "Shows an OS-specific notification to the user.",
    ["name", "%notify"],
    ["arguments", "[message...]"],
    ["option", "-t,--timeout <seconds>", "Number of seconds to wait for a user to interact with the message before returning.", $$.addMagic.utils.numberParser.bind(null, "%notify")],
    ["option", "-s,--sound [name]", "Play a sound with the notification. On MacOS sounds can be one of: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink."],
);

$$.addMagic("%notify", notify);
