const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const MangaSchema = new Schema(
    {
        mangaName: {
            type: String,
            required: true,
            default: "",
        },
        chapterData: {
            type: Object,
            required: true,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Mangas", MangaSchema);
