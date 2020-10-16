const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const MangaSchema = new Schema(
    {
        mangaName: {
            type: String,
            required: true,
        },
        mangaChapter: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Mangas", MangaSchema);
