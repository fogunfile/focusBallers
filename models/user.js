const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    firstname: {
        type: String,
    },
    surname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);