// const axios = require('axios');
// const redis = require('redis');
// // const {getClient} = require('../../server');

// const client = redis.createClient();
// client.on("connect", () => {
// 	console.log("Redis connected...");
// });
// client.on("error", function (error) {
// 	console.error;
// });


// module.exports = (req, res, next) => {
//     const userID = req.user.id;
// 	client.get("cart", async (err, data) => {
// 		console.log("cart from redis", data);
// 		if (data) {
// 			return res.status(200).send(data);
//             next();
// 		} else {
// 			let cartData = await axios.get(`http://localhost:${process.env.PORT}/cart/${userID}`);
// 			if (cartData.status === 200) {
// 				client.set("cart", JSON.stringify(cartData.data), (err, data) => {
// 					if (err != null) {
// 						console.log(err);
// 						return res.status(500).json({ message: "Something went wrong" });
// 					}
// 					return res.status(200).json(data);
// 				});
// 			}
// 		}
// 	});
// }

// ==============================================================

// const userID = req.user.id;
	// client.get("cart", async (err, data) => {
	// 	console.log("cart from redis", data);
	// 	if (data) {
	// 		return res.status(200).send(data);
	// 	} else {
	// 		let cartData = await axios.get(`http://localhost:${PORT}/cart/${userID}`);
	// 		if (cartData.status === 200) {
	// 			client.set("cart", JSON.stringify(cartData.data), (err, data) => {
	// 				if (err != null) {
	// 					console.log(err);
	// 					return res.status(500).json({ message: "Something went wrong" });
	// 				}
	// 				return res.status(200).json(data);
	// 			});
	// 		}
	// 	}
	// });