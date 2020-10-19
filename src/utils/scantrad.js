const Mangas = require("../db/model/manga"),
    Blacklist = require("../db/model/blacklist"),
    {
        areTheSame,
        generateMessage,
        generateMessageWithoutLink,
    } = require("./quickUtility"),
    osmosis = require("osmosis"),
    { lastPublished, getLastPublished } = require("./scrapper"),
    notify = require("./notifier");

console.log("Watching scantrad...");
setInterval(() => {
    (async () => {
        //Retrieve last published chapter

        // const chapter = await getLastPublished();
        // const blacklist = await Blacklist.findOne({});
        const [chapter, blacklist] = await Promise.all([
            getLastPublished(),
            Blacklist.findOne({}),
        ]);
        if (blacklist.blacklisted.includes(chapter.manga)) {
            //skip if the manga is blacklisted.
            console.log("skipped");
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
                    //It's a different chapter, possibly a New one.
                    //we update the data then
                    let updated;
                    try {
                        updated = await Mangas.findOneAndUpdate(
                            {
                                mangaName: chapter.manga,
                            },
                            {
                                chapterData: {
                                    title: chapter.title,
                                    link: "https://scantrad.fr/" + chapter.link,
                                    num: chapter.num,
                                },
                            },
                            {
                                new: true,
                            }
                        );
                        //Then notify
                        console.log("u", updated);
                        sendUpdate(client, updated);

                        // client.sendLinkWithAutoPreview(
                        //     process.env.GROUP_ID,
                        //     "https://youtube.fr",
                        //     "update"
                        // );
                        // return notify(updated, false);
                    } catch (error) {
                        console.log(error.message);
                    }
                    // console.log("Envoie update");
                    // if (
                    //     await client.sendText(process.env.GROUP_ID, "updated")
                    // ) {
                    //     console.log("Fin update");
                    // }
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
                    //Then we notify
                    console.log(stored);
                    sendNew(client, stored);
                    // console.log("Envoie nouveau");
                    // if (await client.sendText(process.env.GROUP_ID, "new")) {
                    //     console.log("Fin nouveau");
                    // }

                    // client.sendLinkWithAutoPreview(
                    //     process.env.GROUP_ID,
                    //     "https://google.fr",
                    //     "new"
                    // );
                    // return notify(stored, true);
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
    })();
}, 10000);

const sendNew = async (cli, name) => {
    let mess = generateMessage(name, true);
    console.log(mess);
    cli.sendText(process.env.GROUP_ID, mess);
};

const sendUpdate = async (cli, name) => {
    let mess = generateMessage(name, false);
    console.log(mess);
    cli.sendText(process.env.GROUP_ID, mess);
};
