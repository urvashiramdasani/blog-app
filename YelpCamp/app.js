var express 	   	= require("express"),
	 app           	= express(),
	 bodyParser    	= require("body-parser"),
	 mongoose      	= require("mongoose"),
	 Campground    	= require("./models/campground"),
	 seedDB        	= require("./seeds"),
	 Comment       	= require("./models/comment"),
	 passport      	= require("passport"),
	 localStrategy 	= require("passport-local"),
	 User          	= require("./models/user"),
	 session       	= require("express-session"),
	 methodOverride = require("method-override"),
	 flash          = require("connect-flash")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
// seedDB() // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next()
})

app.use(authRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(3000, function() {
	console.log("The YelpCamp Server has started!")
})

// MEAN - Mongo Express Angular Node
// npm cache clean --force if dependencies don't install - (Unexpected end of JSON input while parsing...)
// REST - Representation of State Transfer