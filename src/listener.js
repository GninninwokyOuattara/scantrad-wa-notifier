const Command = require("osmosis/lib/Command");
const Blacklist = require("./db/model/blacklist"),
    Commands = require("./utils/botCommands");

const regex = new RegExp(
    "(" + process.env.BOT_COMMAND + ") (?<command>\\w+) ?(?<arg>.*)"
);
console.log("listener listening...");

const cli = client;
cli.onAnyMessage(async (message) => {
    //NOTE : SOMETIMES MESSAGES DO NOT TRIGGER THE LISTENER.

    //Making sure message come from the good chat group
    inGoodGroup = message.chatId == process.env.GROUP_ID;
    let validFormat = regex.exec(message.body);
    if (inGoodGroup && validFormat) {
        //- In the correct chat group
        //- Format correspond to command
        return handler(validFormat.groups.command, validFormat.groups.arg);
    }
});

const handler = (action, title) => {
    switch (action) {
        //Control on first arg after bot call
        case "blacklist":
        case "bl":
            if (title) {
                //Add title to blacklist
                return Commands.execute("addToBlackList", title);
            } else {
                //No args specified
                //execute default command -> return Blacklisted stuff
                Blacklist.findOne({}).then((res) => {
                    return Commands.execute("sendBlackList");
                });
            }
            break;
        case "rblacklist":
        case "rbl":
            if (title) {
                //remove title from blacklist
                return Commands.execute("removeFromBlackList", title);
            }
            Commands.execute("sendResult", "No", "manga specified");
            break;

        default:
            //Doesn't correspond to any action supported.
            Commands.execute("invalidCommand");
            break;
    }
};
