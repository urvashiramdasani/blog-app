var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")

// INDEX
router.get("/", function(req, res) {
	Campground.find({}, function(err, allcampgrounds) {
		if(err) console.log(err)
		else res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user})
	})
})

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	// res.send("You hit the post route!")
	var name = req.body.name
	var image = req.body.image
	var desc = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author}
	Campground.create(newCampground, function(err, campground) {
		if(err) console.log(err)
		else res.redirect("/campgrounds")
	})
})

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new")
})

// SHOW
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) console.log(err)
		else {
			// console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
})

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground})
	})
})

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	var data = {name: req.body.name, image: req.body.image, description: req.body.description}
	Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground) {
		if(err) res.redirect("/campgrounds")
		else res.redirect("/campgrounds/"+req.params.id)
	})
})

// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) res.redirect("/campgrounds")
		else res.redirect("/campgrounds")
	})
})

module.exports = router