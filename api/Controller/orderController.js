const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");
const Insta = require("instamojo-nodejs");
const redis = require("redis");

// creating redis client
const client = redis.createClient({
	host: process.env.REDIS_HOSTNAME,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
	console.log("Redis connected in orders...");
});
client.on("error", function (error) {
	console.error;
});

const API_KEY = process.env.INSTAMOJO_API_KEY //api key for instamojo
const AUTH_KEY = process.env.INSTAMOJO_AUTH_KEY; //auth key for instamojo

Insta.setKeys(API_KEY, AUTH_KEY);
Insta.isSandboxMode(true); //for testing purpose

//get all the orders
module.exports.get_order = async (req, res) => {
	const userId = req.user.id;
	Order.find({ userId })
		.sort({ date: -1 })
		.then((orders) => res.json(orders));
};

//redirect to instamojo to collect payment
module.exports.checkout = async (req, res) => {
	try {
		const userId = req.user.id;
		let cart = await Cart.findOne({ userID: userId });
		var data = new Insta.PaymentData();

		data.purpose = "Test"; // REQUIRED
		data.amount = cart.bill; // REQUIRED
		data.setRedirectUrl(`https://ecom-del.herokuapp.com/order/callback?userId=${userId}`);

		Insta.createPayment(data, function (error, response) {
			if (error) {
				// some error
				console.log(error);
			} else {
				// Payment redirection link at response.payment_request.longurl
				const Response = JSON.parse(response);
				console.log(Response.payment_request.longurl); //instamojo payment url
				res.send(Response.payment_request.longurl);
			}
		});
	} catch {
		res.send("something went wrong");
	}
};

//deleting items in cart and moving to orders in case of successful payment
module.exports.callback = async (req, res) => {
	try {
		const userId = req.query.userId;
		const payment_id = req.query.payment_id;
		const payment_request_id = req.query.payment_request_id;

		// checking if the payment_id and payment_request_id are valid
		await Insta.getPaymentDetails(payment_request_id, payment_id, async function (error, response) {
			if (error) {
				// Some error
				console.log(error);
			} else {
				// const Response = JSON.parse(response);
				if (response.success) {
					let user = await User.findOne({ _id: userId });

					let cart = await Cart.findOne({ userID: userId });

					if (cart) {
						const order = await Order.create({
							userId: userId,
							items: cart.items,
							bill: cart.bill,
							payment_id: payment_id,
							payment_request_id: payment_request_id,
						});
						const data = await Cart.findByIdAndDelete({ _id: cart.id });

						//deleting cart in redis
						client.del("cart", async (err, data) => {
							if (err != null) {
								console.log(err);
								return res.status(500).json({ message: "Something went wrong- Redis" });
							}
						});

						res.send(order);
					} else {
						res.send("cart not found");
					}
				}
			}
		});
	} catch (err) {
		console.log(err);
		res.send("something went wrong");
	}
};
