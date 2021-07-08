const Item = require("../models/item");
const Cart = require("../models/cart");
const redis = require("redis");

// creating redis client
const client = redis.createClient({
	host: process.env.REDIS_HOSTNAME,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
	console.log("Redis connected...");
});
client.on("error", function (error) {
	console.error;
});

module.exports.get_cart_items = async (req, res) => {
	const userID = req.user.id;

	//redis caching
	client.get("cart", async (err, data) => {
		console.log("cart from redis", data);
		if (data) {
			return res.status(200).send(data); //cart form redis
		} else {
			try {
				let cart = await Cart.findOne({ userID: userID });

				// if cart is present send cart else send null
				if (cart && cart.items.length > 0) {
					console.log("cart from mongo", cart);
					client.set("cart", JSON.stringify(cart), (err, data) => {
						if (err != null) {
							console.log(err);
							return res.status(500).json({ message: "Something went wrong" });
						}
						// return res.status(200).json(data);
					});
					return res.send(cart); //cart from mongodb
				} else {
					return res.send(null);
				}
			} catch (err) {
				console.log(err);
				return res.status(500).json({ message: "Something went wrong" });
			}
		}
	});
};

module.exports.add_cart_item = async (req, res) => {
	const userID = req.user.id;
	const { productID, quantity } = req.body;

	try {
		let cart = await Cart.findOne({ userID: userID });
		let item = await Item.findOne({ _id: productID });

		if (!item) {
			return res.status(404).json({ message: "Item not found" });
		}

		const price = item.price;
		const name = item.title;

		client.del("cart", async (err, data) => {
			if (err != null) {
				console.log(err);
				return res.status(500).json({ message: "Something went wrong- Redis" });
			}
		});
		// if cart exists
		if (cart) {
			// get index of particular product in items array
			let itemIndex = cart.items.findIndex((p) => p.productID == productID);

			//check if product exists or not
			if (itemIndex > -1) {
				// if item is present we need to add the quantity
				let productItem = cart.items[itemIndex];
				productItem.quantity += parseInt(quantity);
			} else {
				cart.items.push({ productID: productID, name: name, quantity: quantity, price: price });
			}
			cart.bill += quantity * price;
			cart = await cart.save();
			return res.status(201).send(cart);
		} else {
			// If there is no cart, then create a new one
			const newCart = new Cart({
				userID: userID,
				items: [{ productID: productID, name: name, quantity: quantity, price: price }],
				bill: quantity * price,
			});
			newCart
				.save()
				.then((cart) => {
					return res.status(201).json(cart);
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ message: "Something went wrong" });
				});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

module.exports.delete_item = async (req, res) => {
	const userID = req.user.id;
	const productID = req.params.id;

	try {
		let cart = await Cart.findOne({ userID: userID });
		let itemIndex = cart.items.findIndex((p) => p.productID == productID);
		if (itemIndex > -1) {
			let productItem = cart.items[itemIndex];
			cart.bill -= productItem.quantity * productItem.price;
			cart.items.splice(itemIndex, 1);
		}

		client.del("cart", (err, data) => {
			if (err != null) {
				console.log(err);
				return res.status(500).json({ message: "Something went wrong- Redis" });
			}
		});

		cart
			.save()
			.then((cart) => {
				return res.status(200).json(cart);
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({ message: "Something went wrong" });
			});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};
