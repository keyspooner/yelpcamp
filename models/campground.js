var mongoose = require("mongoose");
var Comment = require("./comment");


//SCHEMA SETUP
var campGroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
      },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

campGroundSchema.pre("remove", async function(next) {
  try {
    await Comment.deleteMany({
      "_id": {
        $in: this.comments
      }
    });
    next();
  } catch(err) {
    console.log(err)
  }
});

var Campground = mongoose.model("Campground", campGroundSchema);

module.exports = Campground;