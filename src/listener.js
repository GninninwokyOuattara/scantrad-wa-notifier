const Command = require("osmosis/lib/Command");
const Blacklist = require("./db/model/blacklist"),
    Commands = require("./utils/botCommands");

console.log("listener listening...");

client.onAnyMessage(async (message) => {
    //NOTE : SOMETIMES MESSAGES DO NOT TRIGGER THE LISTENER.

    //Making sure message come from the good chat group
    inGoodGroup = message.chatId == process.env.GROUP_ID;
    //split the message in case it's a command format
    q = message.body.split(" ");
    if (message.fromMe && inGoodGroup && q[0] == process.env.BOT_COMMAND) {
        //- Message came from host
        //- In the correct chat group
        //- First arg correspond to the bot pattern.
        if (q.length > 3 || q.length == 1) {
            //check length of array
            //if > 3; It's not a command supported yet.
            //Calling the bot is not a command too.
            return Commands.execute("invalidCommand");
        }
        return handler(q[1], q[2]);
    }
});

const handler = (action, title = undefined) => {
    switch (action) {
        //Control on first arg after bot call
        case "blacklist":
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

        default:
            Commands.execute("invalidCommand");
            break;
    }
};
