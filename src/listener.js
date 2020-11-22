const Blacklist = require("./db/model/blacklist"),
    handler = require("./utils/commandsHandler"),
    Commands = require("./utils/botCommands");
// const { commandList, mangasList } = require("./utils/botCommands");
// const { handler }  = require("./utils/commandsHandler");

console.log("Listener listening...");

const regex = new RegExp(
    "^(" + process.env.BOT_COMMAND + ") (?<command>\\w+) ?(?<arg>.*)"
);

const cli = client;
cli.onAnyMessage(async (message) => {
    //NOTE : SOMETIMES MESSAGES DO NOT TRIGGER THE LISTENER.
    //1 - Might happen. 2 - Suspicious. 3 - Something definitely wrong
    //Making sure message come from the good chat group
    inGoodGroup = message.chatId == process.env.GROUP_ID;
    let validFormat = regex.exec(message.body);
    if (inGoodGroup && validFormat) {
        //- In the correct chat group
        //- Format correspond to command
        return handler(validFormat.groups.command, validFormat.groups.arg);
    }
});
