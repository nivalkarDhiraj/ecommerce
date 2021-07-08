const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	discription: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	date_added: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Item", itemSchema);
