var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


//SCHEMA SETUP
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

//add a bunch of methods
userSchema.plugin(passportLocalMongoose);


var User = mongoose.model("User", userSchema);

module.exports = User;