const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
    fixture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fixture",
        unique: true,
    },
    homeTeamScore: {
        type: Number,
        required: true,
    },
    awayTeamScore: {
        type: Number,
        required: true,
    },
    addPointsHomeTeam: {
        type: Number,
        default: 0,
    },
    addPointsAwayTeam: {
        type: Number,
        default: 0,
    },
    isWalkOverHomeTeam: {
        type: Boolean,
        default: false,
    },
    isWalkOverAwayTeam: {
        type: Boolean,
        default: false,
    },
    info: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Result", resultSchema)