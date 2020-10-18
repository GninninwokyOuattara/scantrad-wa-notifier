const wa = require("@open-wa/wa-automate"),
    { ev } = require("@open-wa/wa-automate"),
    // const    {create, Client } = require("@open-wa/wa-automate")
    express = require("express"),
    Mangas = require("./db/model/manga"),
    Blacklist = require("./db/model/blacklist"),
    { insertIn } = require("./utils/scrapper"),
    Commands = require("./utils/botCommands");
const { query } = require("express");

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
        listener();
    } catch (error) {
        if (error.name == "TimeoutError") {
            console.log("TimeoutError. Retrying...");
            runner();
        }
    }
};

runner();
