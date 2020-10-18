const Blacklist = require("../db/model/blacklist");

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
        return client.sendText(process.env.GROUP_ID, "Invalid command");
    },
    sendResult: function (title, text) {
        return client.sendText(process.env.GROUP_ID, `${title} ${text}`);
    },
    addToBlackList: function (title) {
        Blacklist.findOne({}).then((data) => {
            //return either empty array or not
            if (data.blacklisted.includes(title)) {
                return Commands.execute(
                    "sendResult",
                    title,
                    "Already blacklisted"
                );
            } else {
                data.blacklisted.push(title); //add new title to the array
                Blacklist.findOneAndUpdate(
                    {},
                    { blacklisted: data.blacklisted }
                ).then((res) => {
                    return Commands.execute(
                        "sendResult",
                        title,
                        "Added to blacklist"
                    );
                });
            }
        });
    },
    sendBlackList: function () {
        Blacklist.findOne({}).then((data) => {
            //Retrieve array of blacklist from db
            console.log(data.blacklisted);
            let out = "";
            data.blacklisted.forEach((item) => {
                //build the output
                out += `- ${item}\n`;
            });
            if (out.length) {
                return client.sendText(process.env.GROUP_ID, out);
            } else {
                return client.sendText(process.env.GROUP_ID, "Empty");
            }
        });
    },
};

module.exports = Commands;
