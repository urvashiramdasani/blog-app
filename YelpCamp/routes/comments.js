var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")

// ===============
// Comment Routes
// ===============

router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) console.log(err)
		else res.render("comments/new", {campground: campground})
	})
})

router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err)
			res.redirect("/campgrounds")
		}
		else {
			var text = req.body.text
			comment = {text: text, author: {id: req.user._id, username: req.user.username}}
			Comment.create(comment, function(err, comment) {
				if(err) console.log(err)
				else {
					comment.save()
					console.log(comment)
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/"+campground._id)
				}
			})
		}
	})
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) res.redirect("back")
		else res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment})
	})
})

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	var text = req.body.text
	var comment = {text: text, author: {id: req.user._id, username: req.user.username}}
	Comment.findByIdAndUpdate(req.params.comment_id, comment, function(err, updatedComment) {
		if(err) res.redirect("back")
		else res.redirect("/campgrounds/"+req.params.id)
	})
})

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) res.redirect("back")
		else res.redirect("/campgrounds/"+req.params.id)
	})
})

module.exports = router