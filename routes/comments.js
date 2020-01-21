var express = require("express");

//https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find comment by id 
    //Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) { 
    Campground.findById(req.params.id, function(err, foundCampground) { 
        if (err) {
            console.log(err);
        } else {
            res.render("./comments/new", {campground: foundCampground});
        }
    });
    
})

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //look up campground using id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username add id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    //save
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }

        res.redirect("/campgrounds/" + req.params.id);
    })
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err)
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;