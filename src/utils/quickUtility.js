const generateMessage = (obj) => {
    return `${process.env.BOT_NAME}\n\n${obj.mangaName} - ${obj.chapterData.num}\n${obj.chapterData.title}\n${obj.chapterData.link}`;
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
module.exports = {
    generateMessage: generateMessage,
    areTheSame: areTheSame,
};
