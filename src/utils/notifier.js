const notify = (group, obj) => {
    try {
        global.client.sendLinkWithAutoPreview(
            group,
            obj.chapterData.link,
            generateMessage(obj)
        );
    } catch (error) {
        //OH NO!... Anyway.
    }
};

module.exports = notify;
