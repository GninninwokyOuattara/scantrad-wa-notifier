const Commands = require("./botCommands"),
    Blacklist = require("../db/model/blacklist");

const handler = (action, title) => {
    switch (action) {
        //Control on first arg (action) given after bot call
        case "blacklist":
        case "b":
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
        case "rb":
            if (title) {
                //remove title from blacklist
                return Commands.execute("removeFromBlackList", title);
            }
            Commands.execute("sendResult", "No", "manga specified");
            break;
        case "state":
        case "s":
            //Look for current state of manga.
            if (title) {
                return Commands.execute(
                    "mangaState",
                    title.trim().toLowerCase().replace(/ /g, "-")
                );
            }
            Commands.execute("sendResult", "No", "manga specified");
            break;
        case "command":
        case "c":
            //return command(s) list
            if (title) {
                return Commands.execute("invalidCommand");
            }
            Commands.execute("commandList");
            break;
        case "list":
        case "l":
            //return command(s) list
            if (title) {
                return Commands.execute("invalidCommand");
            }
            Commands.execute("mangasList");
            break;
        case "detail":
        case "d":
            //return command(s) list
            if (title) {
                return Commands.execute(
                    "mangaDetail",
                    title.trim().toLowerCase().replace(/ /g, "-")
                );
            }
            Commands.execute("invalidCommand");
            break;
        default:
            //Doesn't correspond to any action supported.
            Commands.execute("invalidCommand");
            break;
    }
};

module.exports = handler;
