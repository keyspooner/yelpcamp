var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//EXPRESS - set the root route
router.get("/", function(req, res) {
    res.render("landing");
});


//===============
//AUTHENTICATION ROUTES
//===============

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    //passport mongo
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//using passport local middleware
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;