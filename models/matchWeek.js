const       mongoose        =   require("mongoose");
const       db              =   require("./index");


const matchWeekSchema = new mongoose.Schema({
    order: {
        type: Number,
    },

    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Season"
    },

    start: {
        type: Date,
    },

    end: {
        type: Date,
    },
    
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("MatchWeek", matchWeekSchema);