const Blacklist = require("../db/model/blacklist"),
    {
        getMangaState,
        getScantradMangas,
        getMangaDetails,
    } = require("./scrapper");

const Commands = {
    execute: function (name) {
        return (
            Commands[name] &&
            Commands[name].apply(Commands, [].slice.call(arguments, 1))
        );
    },
    confirm: function (arg) {
        return;
    },
    invalidCommand: function () {
        //Return "Invalid Command" for Invalid Command...
        return client.sendText(
            process.env.GROUP_ID,
            "```>> Invalid command```"
        );
    },
    sendResult: function (title, text) {
        //Return result of a command
        return client.sendText(process.env.GROUP_ID, `${title} ${text}`);
    },
    addToBlackList: function (title) {
        //Add argument given as parameter to the blacklist
        Blacklist.findOne({}).then((data) => {
            //return either empty array or not
            if (data.blacklisted.includes(title)) {
                return Commands.execute(
                    "sendResult",
                    `\`\`\`>> ${title}\`\`\``,
                    "```Already blacklisted```"
                );
            } else {
                data.blacklisted.push(title); //add new title to the array
                Blacklist.findOneAndUpdate(
                    {},
                    { blacklisted: data.blacklisted }
                ).then((res) => {
                    return Commands.execute(
                        "sendResult",
                        `\`\`\`>> ${title}\`\`\``,
                        "```Added to blacklist```"
                    );
                });
            }
        });
    },
    sendBlackList: function () {
        Blacklist.findOne({}).then((data) => {
            //Retrieve array of blacklist from db
            // console.log(data.blacklisted);
            let out = "";
            data.blacklisted.forEach((item) => {
                //build the output
                out += `\`\`\`- ${item}\n\`\`\``;
            });
            if (out.length) {
                return client.sendText(process.env.GROUP_ID, out);
            } else {
                return client.sendText(process.env.GROUP_ID, "```>> Empty```");
            }
        });
    },
    removeFromBlackList: function (title) {
        //Retrieve array of blacklist
        Blacklist.findOne({}).then((data) => {
            //return either empty array or not
            if (data.blacklisted.includes(title)) {
                let index = data.blacklisted.indexOf(title);
                if (index > -1) {
                    data.blacklisted.splice(index, 1);
                    Blacklist.findOneAndUpdate(
                        {},
                        { blacklisted: data.blacklisted }
                    ).then(() => {
                        return Commands.execute(
                            "sendResult",
                            `\`\`\`>> ${title}\`\`\``,
                            "```Removed from blacklist```"
                        );
                    });
                }
            } else {
                return Commands.execute(
                    "sendResult",
                    `\`\`\`>> ${title}\`\`\``,
                    "```Not blacklisted```"
                );
            }
        });
    },
    mangaState: function (title) {
        let state = "";
        getMangaState(title)
            .then((res) => {
                state = res;
                if (state) {
                    return Commands.execute(
                        "sendResult",
                        "```>> ```",
                        `\`\`\`${state}\`\`\``
                    );
                }
                return Commands.execute(
                    "sendResult",
                    "```>> Manga```",
                    "```not Found```"
                );
            })
            .catch((err) => {
                return Commands.execute(
                    "sendResult",
                    "```>> ```",
                    `\`\`\`${err}\`\`\``
                );
            });
    },
    mangasList: function () {
        getScantradMangas()
            .then((res) => {
                out = "";
                res.forEach((manga) => {
                    out += `\`\`\`- ${manga}\n\`\`\``;
                });
                if (out.length) {
                    return client.sendText(process.env.GROUP_ID, out);
                } else {
                    return client.sendText(
                        process.env.GROUP_ID,
                        "```>> Empty```"
                    );
                }
            })
            .catch((err) => {
                return Commands.execute(
                    "sendResult",
                    "```>> Unexpected```",
                    "```Error```"
                );
            });
    },
    mangaDetail: function (title) {
        getMangaDetails(title)
            .then((res) => {
                out = `\`\`\`- ${res}\n\`\`\``;
                return client.sendText(process.env.GROUP_ID, out);
            })
            .catch((err) => {
                return Commands.execute(
                    "sendResult",
                    "```>> ```",
                    `\`\`\`${err}\`\`\``
                );
            });
    },
    commandList: function () {
        return Commands.execute(
            "sendResult",
            "*> Commands List*\n\n——————————————————\n",
            `\`\`\`Call the bot with ${process.env.BOT_COMMAND}\`\`\`\n\n*${process.env.BOT_COMMAND} < blacklist | b >  < title >?*\n\`\`\`-> if < title >, add title to blacklist.\n-> else, show blacklisted title.\`\`\`\n\n*${process.env.BOT_COMMAND} < rblacklist | rb > < title >*\n\`\`\`-> remove < title > from blacklist.\`\`\`\n\n*${process.env.BOT_COMMAND} < state | s > < title >*\n\`\`\`-> show < title > translation state.\`\`\`\n\n*${process.env.BOT_COMMAND} < list | l >*\n\`\`\`-> show scantrad mangas list.\`\`\`\n\n*${process.env.BOT_COMMAND} < detail | d > < title >*\n\`\`\`-> show < title > synopsis.\`\`\`\n——————————————————`
        );
    },
};

module.exports = Commands;
