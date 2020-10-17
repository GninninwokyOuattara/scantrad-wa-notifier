const Mangas = require("../db/model/manga"),
    { areTheSame, generateMessage } = require("./quickUtility");
require("../db/mongoose");
const osmosis = require("osmosis"),
    lastPublished = require("./scrapper");
let chapter = [];
let i = 0;

// console.log("ici");
// lastPublished().then((chapter) => {
//     console.log(i, chapter);
// });

// setInterval(() => {
//     (async () => {
//         //get the last published chapter on scantrad
//         const chapter = await lastPublished();
//         if (chapter && chapter != {}) {
//             console.log(chapter);
//             const lastStored = await Mangas.findOne({
//                 mangaName: chapter.manga,
//             });
//             console.log(lastStored);
//             if (lastStored) {
//                 //check is lastStored == current chapter
//                 if (chapter.num != lastStored.chapterData.num) {
//                     //update
//                     const updated = await Mangas.updateOne(
//                         { mangaName: chapter.manga },
//                         {
//                             chapterData: {
//                                 title: chapter.title,
//                                 link: "https://scantrad.fr/" + chapter.link,
//                                 num: chapter.num,
//                             },
//                         }
//                     );
//                     console.log(updated);
//                 } else {
//                     //pass
//                     console.log("Passed");
//                 }
//             } else {
//                 //Most likely a new project they picked up, so we add.
//                 try {
//                     const stored = await Mangas.create({
//                         mangaName: chapter.manga,
//                         chapterData: {
//                             title: chapter.title,
//                             link: "https://scantrad.fr/" + chapter.link,
//                             num: chapter.num,
//                         },
//                     });
//                 } catch (err) {
//                     //OHH NOOOO!!!!... Anyway.
//                 }
//             }
//         }
//     })();
// }, 5000);
setInterval(() => {
    (async () => {
        //Retrieve last published chapter
        const chapter = await lastPublished();
        console.log("last chapter----- ", chapter);

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
                    console.log("same chapter");
                }
            } else {
                //lastStored == null, meaning it does not exist in db
                //It probably is a new manga, so we have to add it to db.
                try {
                    const stored = await Mangas.create({
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
}, 5000);
