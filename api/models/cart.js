const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userID: {
		type: String,
	},
	items: [
		{
			productID: {
				type: String,
			},
			name: String,
			quantity: {
				type: Number,
				required: true,
				min: [1, "Quantity can not be less than 1"],
				default: 1,
			},
			price: Number,
		},
	],
	bill: {
		type: Number,
		required: true,
		default: 0,
	},
});

module.exports = mongoose.model("Cart", cartSchema);
