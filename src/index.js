const wa = require("@open-wa/wa-automate"),
    // const    {create, Client } = require("@open-wa/wa-automate")
    express = require("express"),
    Mangas = require("./db/model/manga"),
    Blacklist = require("./db/model/blacklist"),
    Commands = require("./utils/botCommands");

require("./db/mongoose");
// require("./sessionCreator");
global.client = {};
// try {
//     wa.create().then((client) => {
//         global.client = client;
//         // require("./utils/scantrad");
//         require("./listener");
//     });
// } catch (error) {
//     throw error.message;
// }

const runner = async () => {
    try {
        global.client = await wa.create();
        require("./listener");
        require("./utils/scantrad");
    } catch (error) {
        if (error.name == "TimeoutError") {
            console.log("TimeoutError. Retrying...");
            runner();
        }
    }
};

runner();
