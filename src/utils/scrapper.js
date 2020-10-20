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

const getLastPublished = () => {
    let chapterList = [];
    return new Promise((resolve, reject) => {
        osmosis
            .get("https://scantrad.net")
            .find(".hm-info")
            .set({
                manga: ".hmi-titre > a",
                title: ".hmi-sub",
                num: ".hmi-titre .hmit-numero",
                link: ".hmi-sub@href",
            })
            .data((item) => {
                chapterList.push(item);
            })
            .error((err) => reject(err))
            .done(() => resolve(chapterList[0]));
    });
};

const getMangaState = (manga) => {
    let out = {};
    return new Promise((resolve, reject) => {
        osmosis
            .get("https://scantrad.net/planning")
            .find(".home-manga")
            .set({
                manga: "@href",
                state: ".hma-etat",
            })
            .data((item) => {
                out[item.manga] = item.state;
            })
            .error((err) => reject(err))
            .done(() => resolve(out[manga]));
    });
};

module.exports = { lastPublished, getLastPublished, getMangaState };
