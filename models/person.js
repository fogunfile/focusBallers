import {Schema} from 'mongoose'

const personSchema = Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    nickname: {
        type: String,
    },
    email: {
        type: String
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
    isUser: {
        type: Boolean,
        default: false,
    },
    isFA: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("Person", personSchema)