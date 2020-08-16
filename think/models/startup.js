var mongoose = require("mongoose")

var startupSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

module.exports = mongoose.model("Startup", startupSchema)