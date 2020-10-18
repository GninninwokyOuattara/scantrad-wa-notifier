const Mangas = require("../db/model/manga"),
    Blacklist = require("../db/model/blacklist"),
    { areTheSame, generateMessage } = require("./quickUtility"),
    osmosis = require("osmosis"),
    lastPublished = require("./scrapper");
console.log("Watching scantrad...");
setInterval(() => {
    (async () => {
        //Retrieve last published chapter
        const chapter = await lastPublished();
        const blacklist = await Blacklist.findOne({});
        if (blacklist.backlisted.includes(chapter.manga)) {
            //skip if the manga is blacklisted.
            return;
        }
        if (chapter && chapter != {}) {
            let lastStored;
            //Making sure chapter ain't empty, happened before...
            try {
                //try to find retrieved manga in db, return null is not
                lastStored = await Mangas.findOne({
                    mangaName: chapter.manga,
                });
            } catch (error) {
                console.log(error.message);
            }
            if (lastStored) {
                //Meaning the manga (by name) is already in db
                //it can either mean
                //What's retrived == what's stored or not
                if (!areTheSame(chapter, lastStored.chapterData)) {
                    //It's a different chapter
                    //we update the data then
                    let updated;
                    try {
                        updated = await Mangas.updateOne(
                            {
                                mangaName: chapter.manga,
                            },
                            {
                                chapterData: {
                                    title: chapter.title,
                                    link: "https://scantrad.fr/" + chapter.link,
                                    num: chapter.num,
                                },
                            }
                        );
                    } catch (error) {
                        console.log(error.message);
                    }
                } else {
                    //We just pass, nothing to do if it's the same thing.
                }
            } else {
                //lastStored == null, meaning it does not exist in db
                //It probably is a new manga, so we have to add it to db.
                let stored;
                try {
                    stored = await Mangas.create({
                        mangaName: chapter.manga,
                        chapterData: {
                            title: chapter.title,
                            link: "https://scantrad.fr/" + chapter.link,
                            num: chapter.num,
                        },
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
    })();
}, 10000);
