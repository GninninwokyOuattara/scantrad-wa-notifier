const Mangas = require("../db/model/manga"),
    generateMessage = require("./messageFormatter"),
    notify = require("./notifier");

const osmosis = require("osmosis"),
    lastPublished = require("./scrapper");
let chapter = [];
let i = 0;

// console.log("ici");
// lastPublished().then((chapter) => {
//     console.log(i, chapter);
// });

setInterval(() => {
    (async () => {
        //get the last published chapter on scantrad
        const chapter = await lastPublished();
        if (chapter && chapter != {}) {
            const lastStored = await Mangas.findOne({
                mangaName: chapter.manga,
            });
            if (lastStored) {
                //check is lastStored == current chapter
                if (chapter.num != lastStored.chapterData.num) {
                    //update
                    const updated = await Mangas.updateOne(
                        { mangaName: chapter.manga },
                        {
                            chapterData: {
                                title: chapter.title,
                                link: "https://scantrad.fr/" + chapter.link,
                                num: chapter.num,
                            },
                        }
                    );
                    console.log("updated");
                    notify(process.env.GROUP_ID, updated);
                } else {
                    //pass
                    console.log("Passed");
                }
            } else {
                //Most likely a new project they picked up, so we add.
                try {
                    const stored = await Mangas.create({
                        mangaName: chapter.manga,
                        chapterData: {
                            title: chapter.title,
                            link: "https://scantrad.fr/" + chapter.link,
                            num: chapter.num,
                        },
                    });
                    notify(process.env.GROUP_ID, updated);
                } catch (err) {
                    //OHH NOOOO!!!!... Anyway.
                }
            }
        }
    })();
}, 15000);
