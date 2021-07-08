const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: isEmail,
	},
	password: {
		type: String,
		required: true,
	},
	register_date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("User", userSchema);
