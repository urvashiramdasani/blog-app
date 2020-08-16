var express 	   	= require("express"),
	 app           	= express(),
	 bodyParser    	= require("body-parser"),
	 mongoose      	= require("mongoose"),
	 passport      	= require("passport"),
	 expressSanitizer = require('express-sanitizer'),
	 localStrategy 	= require("passport-local"),
	 session       	= require("express-session"),
	 methodOverride = require("method-override"),
	 flash          = require("connect-flash"),
	 User          	= require("./models/user"),
	 Startup        = require("./models/startup");

mongoose.connect("mongodb+srv://urvi:urvi@cluster0-l0ees.mongodb.net/app?retryWrites=true&w=majority");
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "learn blockchain",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	// res.locals.error = req.flash("error")
	// res.locals.success = req.flash("success")
	next()
});

var PORT = process.env.PORT || 3000

app.get("/", function(req, res) {
	Startup.find({}, function(err, foundStartups) {
		if(err) {
			console.log(err)
			res.redirect("/")
		}
		else res.render("home", {startups: foundStartups})
	})
	// res.render("home")
});

app.get("/about", function(req, res) {
	res.render("about")
});

app.get("/startups", function(req, res) {
	Startup.find({}, function(err, foundStartups) {
		if(err) {
			console.log(err)
			res.redirect("/")
		}
		else res.render("startups/index", {startups: foundStartups})
	})
})

app.get("/startups/new", function(req, res) {
	res.render("startups/new")
})

app.post("/startups", function(req, res) {
	var name = req.body.name
	var image = req.body.image
	var desc = req.body.description
	// var author = {
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	var newStartup = {name: name, image: image, description: desc}
	Startup.create(newStartup, function(err, startup) {
		if(err) {
			console.log(err)
			res.redirect("/")
		} else res.redirect("/startups")
	})
})

app.get("/startups/:id", function(req, res) {
	Startup.findById(req.params.id,function(err, foundOne){
		if(err){
			console.log(err);
			res.redirect("/startups");
		}else{
			res.render("startups/show",{startup : foundOne});
		}
	});
})

app.get("/startups/:id/edit",function(req,res){
	Startup.findById(req.params.id,function(err, foundOne){
		if(err){
			console.log(err);
			res.redirect("/startups/" + req.params.id);
		}
		else{
			res.render("startups/edit",{startup: foundOne});
		}
	});
});

app.put("/startups/:id",function(req,res){
	Startup.findOneAndUpdate(req.params.id, req.body.startup, function(err, updatedOne){
		if(err)
		{
			console.log(err);
			res.redirect("/startups/" + req.params.id);
		}
		else{
			console.log(updatedOne);
			res.redirect("/startups/" + req.params.id);
		}
	});
});

app.get("/login", function(req, res) {
	res.render("login")
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/startups", 
	failureRedirect: "/login"
}),function(req, res) {
})

app.get("/register", function(req, res) {
	res.render("register")
})

app.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
		if(err) {
			console.log(err)
			return res.render("register")			
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/startups") 
		})
	})
})

app.delete("/startups/:id", function(req, res) {
	Startup.findByIdAndRemove(req.params.id, function(err) {
		if(err) res.redirect("/startups");
		else res.redirect("/startups");
	})
})

app.get("/logout", function(req, res) {
	req.logout()
	req.flash("success", "Logged you out!")
	res.redirect("/startups") 
})

app.listen(PORT, function() {
	console.log("The ________ Server has started!")
})
