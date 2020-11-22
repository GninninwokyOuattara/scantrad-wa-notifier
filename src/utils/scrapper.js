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
            .error((err) => {
                reject(err);
            })
            .done(() => resolve(chapterList[0]));
    });
};

const getMangaState = (manga) => {
    let out = "";
    let c = 0;
    return new Promise((resolve, reject) => {
        osmosis
            .get("https://scantrad.net/planning")
            .find(".home-manga")
            .set({
                manga: "@href",
                state: ".hma-etat",
            })
            .data((item) => {
                if (item.manga.startsWith(manga)) {
                    out = item.manga;
                    c += 1;
                }
            })
            .error((err) => reject(err))
            .done(() => {
                if (c > 1) {
                    reject(
                        `There is ${c} mangas matching this title, please be more specific.`
                    );
                }

                osmosis
                    .get("https://scantrad.net/planning")
                    .find(".home-manga")
                    .set({
                        manga: "@href",
                        state: ".hma-etat",
                    })
                    .data((item) => {
                        if (item.manga.startsWith(manga)) {
                            out = item.state;
                        }
                    })
                    .error((err) => reject(err))
                    .done(() => resolve(out));
            });
    });
};

const getScantradMangas = () => {
    let out = [];
    return new Promise((resolve, reject) => {
        osmosis
            .get("https://scantrad.net/planning")
            .find(".home-manga")
            .set({
                manga: "@href",
                state: ".hma-etat",
            })
            .data((item) => {
                item = item.manga.replace(/-/g, " ");
                out.push(item);
            })
            .error((err) => reject(err))
            .done(() => resolve(out));
    });
};

const getMangaDetails = (manga) => {
    let out = "";
    let c = 0; //Number of match
    return new Promise((resolve, reject) => {
        osmosis
            .get("https://scantrad.net/planning")
            .find(".home-manga")
            .set({
                manga: "@href",
                state: ".hma-etat",
            })
            .data((item) => {
                if (item.manga.startsWith(manga)) {
                    out = item.manga;
                    c += 1;
                }
            })
            .error((err) => reject(err))
            .done(() => {
                if (c > 1) {
                    reject(
                        `There is ${c} mangas that match with this title, please be more specific.`
                    );
                }

                //Is there is only one item that match
                osmosis
                    .get(`https://scantrad.net/${out}`)
                    .delay(500)
                    .find("div.main-fiche > div.mf-info")
                    .set({
                        synopsis: "div.synopsis",
                    })
                    .data((data) => {
                        out = data.synopsis;
                    })
                    .error((err) => {
                        reject(err);
                    })
                    .done(() => {
                        if (out) {
                            resolve(out);
                        } else {
                            reject("Unexpected error");
                        }
                    });
            });
    });
};

module.exports = {
    lastPublished,
    getLastPublished,
    getMangaState,
    getScantradMangas,
    getMangaDetails,
};
