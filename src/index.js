const wa = require("@open-wa/wa-automate"),
    // const    {create, Client } = require("@open-wa/wa-automate")
    express = require("express"),
    Mangas = require("./db/model/manga"),
    Blacklist = require("./db/model/blacklist"),
    Commands = require("./utils/botCommands");

require("./db/mongoose");

global.client = {};
global.running = false;

const runner = async () => {
    try {
        global.client = await wa.create();
        require("./listener");
        require("./utils/scantrad");
        running = true;
    } catch (err) {
        throw err.message;
    }
};

runner();
