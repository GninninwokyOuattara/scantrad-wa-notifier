const generateMessage = (obj) => {
    return `${process.env.BOT_NAME}\n\n${obj.mangaName} - ${obj.chapterData.num}\n${obj.chapterData.title}\n${obj.chapterData.link}`;
};

module.exports = generateMessage;
