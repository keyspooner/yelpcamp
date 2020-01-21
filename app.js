// var express = require("express");
// var app = express();
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
//^^^^^^ Simplier way to define multiple variables


//RESTFUL ROUTES

// name      url            verb        desc.
// =====================================================
// INDEX    /thing          GET         Display all things
// NEW      /thing/new      GET         Display form to make new thing
// CREATE   /thing          POST        Add new thing
// SHOW     /thing/:id      GET         Display info about one thing


var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");

//requiring routes
var     campgroundRoutes    = require("./routes/campgrounds"),
        commentRoutes       = require("./routes/comments"),
        indexRoutes         = require("./routes/index");


//MONGOOSE -- Add to stop mongoose deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

console.log(process.env.DATABASEURL);
//MONGOOSE -- Connect to database
mongoose.connect(process.env.DATABASEURL, {
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {
//mongoose.connect("mongodb://yelpcamp:yelpcamppassword@cluster0-shard-00-00-mjmlj.mongodb.net:27017,cluster0-shard-00-01-mjmlj.mongodb.net:27017,cluster0-shard-00-02-mjmlj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("Error", err.message);
});



//BODY-PARSER - configure body-parser to use urlencoding
app.use(bodyParser.urlencoded({extended: true}));

//EJS - set so we don't have to use ".ejs" file extensions
app.set("view engine", "ejs");

//EXPRESS - set the public folder directory we will serve files from
app.use(express.static(__dirname + "/public"));

//EXPRESS-SESSION - Creates a session with an encrypted cookie based on the secret 
app.use(require("express-session")({
    secret: "This is a secret for express",
    resave: false,
    saveUninitialized: false
}));

//FLASH 
app.use(flash());

//PASSPORT - https://medium.com/@johnnysitu/node-js-user-authentication-with-passport-local-strategy-37605fd99715
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//METHOD-OVERRIDE
app.use(methodOverride("_method"));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//MONGO - add demo data to the database
//seedDB();

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});


// app.listen(3000, function() {
//     console.log("Server started!");
// });