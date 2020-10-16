const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BlacklistSchema = new Schema(
    {
        data: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Blacklist", BlacklistSchema);
