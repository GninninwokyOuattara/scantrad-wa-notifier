const mongoose = require("mongoose");

const mangaSchema = mongoose.Schema(
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
