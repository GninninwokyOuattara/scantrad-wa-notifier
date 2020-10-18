const mongoose = require("mongoose"),
    Mangas = require("./model/manga"),
    Blacklist = require("./model/blacklist");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

//Create a new blacklist document if it haven't done so yet.
Blacklist.findOne()
    .then((res) => {
        if (res == null) {
            Blacklist.create({ blacklisted: [] })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    })
    .catch((err) => {
        console.log(err);
    });
