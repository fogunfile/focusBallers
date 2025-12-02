const       mongoose        =   require("mongoose");
const       db              =   require("./index");


const seasonSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    description: {
        type: String,
    },

    start: {
        type: Date,
        default: Date.now()
    },

    end: {
        type: Date,
    },
    
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("Season", seasonSchema);