const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BlacklistSchema = new Schema(
    {
        blacklisted: {
            type: Array,
            // required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Blacklist", BlacklistSchema);
