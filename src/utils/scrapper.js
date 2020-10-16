const osmosis = require("osmosis");

const lastPublished = async () => {
    const chapters = [];
    await osmosis
        .get("scantrad.net")
        .find(".home-manga.new-chapter")
        .set({
            manga: "div.hm-info div.hmi-titre > a",
            title: "div.hm-info a.hmi-sub",
            link: "div.hm-info a.hmi-sub@href",
            num: "div.hm-info div.hmi-titre > a.hmit-numero",
        })
        .data((chapter) => {
            chapters.push(chapter);
        });
    if (chapters.length != 0) {
        return chapters[0];
    }
    return false;
};

module.exports = lastPublished;
