const generateMessage = (obj, isNew = false) => {
    if (isNew) {
        return `\`\`\`${process.env.BOT_NAME}\n\n      ☆☆☆☆ NEW ☆☆☆☆\n\n——————————————————————————————\n${obj.mangaName}\nChapter - ${obj.chapterData.num}\n${obj.chapterData.title}\n——————————————————————————————\n${obj.chapterData.link}\n——————————————————————————————\`\`\``;
    }
    return `\`\`\`${process.env.BOT_NAME}\n\n——————————————————————————————\n${obj.mangaName}\nChapter - ${obj.chapterData.num}\n${obj.chapterData.title}\n——————————————————————————————\n${obj.chapterData.link}\n——————————————————————————————\`\`\``;
};

const generateMessageWithoutLink = (obj, isNew = false) => {
    if (isNew) {
        return `${process.env.BOT_NAME}\n\n     ☆☆☆☆ NEW ☆☆☆☆\n${obj.mangaName}\nChapter - ${obj.chapterData.num}\n${obj.chapterData.title}`;
    }
    return `${process.env.BOT_NAME}\n\n${obj.mangaName}\nChapter - ${obj.chapterData.num}\n${obj.chapterData.title}`;
};
const areTheSame = (first, second) => {
    //Compare two object
    //first -> current chapter
    //second -> chapter store in db
    //return 'true' is it's the same obj (chapter)
    if (first.title == second.title && first.num == second.num) {
        //NOTE : we do not compare by link because
        //there is a direct modification on the link before it's
        //stored in db
        return true;
    }
    return false;
};

const sendNew = async (cli, name) => {
    //Send message via to group with generated message for New stuff
    let mess = generateMessage(name, true);
    cli.sendText(process.env.GROUP_ID, mess);
};

const sendUpdate = async (cli, name) => {
    //Send message via to group with generated message for Old stuff
    let mess = generateMessage(name, false);
    console.log(mess);
    cli.sendText(process.env.GROUP_ID, mess);
};

module.exports = {
    generateMessage,
    areTheSame,
    generateMessageWithoutLink,
    sendNew,
    sendUpdate,
};
