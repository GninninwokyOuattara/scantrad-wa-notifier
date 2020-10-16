const notify = (group, obj) => {
    try {
        await global.client.sendLinkWithAutoPreview(group,
            obj.chapterData.link,
            generateMessage(obj))
    } catch (error) {
        //OH NO!... Anyway.
    }
}

module.exports = notify

