const { query } = require("express");
const Command = require("osmosis/lib/Command");
const Blacklist = require("./db/model/blacklist"),
    Commands = require("./utils/botCommands");

console.log("listener listening...");

// global.client.onAnyMessage(async (message) => {
//     if (message.body) {
//         await client.sendText(message.from, message.body);
//         // console.log(message.from);
//     }
// });

// global.client.onAnyMessage(async (message) => {
//     //Filter for groupId given as environnement variable.
//     console.log("Message recu", message.body);
//     return handler(message);
// });

client.onAnyMessage(async (message) => {
    //
    console.log("Recu");
    inGoodGroup = message.chatId == process.env.GROUP_ID;
    // console.log(inGoodGroup);
    q = message.body.split(" ");
    console.log(q[0] == process.env.BOT_COMMAND);
    if (message.fromMe && inGoodGroup && q[0] == process.env.BOT_COMMAND) {
        // Commands.execute("sendTest", q[1]);
        // console.log(message.body);
        console.log(q, q.length);
        if (q.length > 3 || q.length == 1) {
            //check length of array
            //if > 3; It's not a command supported yet.
            //Calling the bot is not a command too.
            return Commands.execute("invalidCommand");
        }
        console.log(q[2]);
        return handler(q[1], q[2]);
    }
});

// const handler = (message) => {
//     console.log(message.chatId.toString());
//     console.log(process.env.GROUP_ID);
//     console.log(message.chatId.toString() == process.env.GROUP_ID);
//     k = message.chatId.toString() == process.env.GROUP_ID;
//     if (k) {
//         console.log("inside" - message.body);
//         query = message.body.split(" ");
//         console.log(query);
//         console.log(query[0], query[1]);
//         if (query[0] == process.env.BOT_COMMAND) {
//             console.log("Envoie succès");
//             Commands.execute("sendTest", second);
//         } else {
//             console.log("Envoie echec");
//             Command.execute("invalidCommand");
//         }
//     }
// };
const handler = (action, title = undefined) => {
    switch (action) {
        case "blacklist":
            if (title) {
                //Add title to blacklist
                return Commands.execute("addToBlackList", title);
                // Blacklist.findOne({}).then((blacklist) => {
                //     blacklist.push(title)
                //     Blacklist.findByIdAndUpdate({}, { blacklisted: blacklist }).then((res) => {
                //         return
                //     })
                // })
                // return Commands.execute("sendTest", "Add black list");
            } else {
                //No args specified
                //execute default command -> return Blacklisted stuff
                Blacklist.findOne({}).then((res) => {
                    return Commands.execute("sendBlackList");
                });
            }
            break;

        default:
            break;
    }
};
