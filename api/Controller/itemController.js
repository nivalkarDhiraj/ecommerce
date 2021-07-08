const Item = require("../models/item");
//to get product
module.exports.get_items = (req, res) => {
	Item.find()
		.sort({
			Date: -1,
		})
		.then((itmes) => res.json(itmes))
		.catch((error) => {
			return res.status(500).json({ message: error.message });
		});
};
//to create new product
module.exports.post_item = (req, res) => {
	const newItem = new Item(req.body);
	newItem
		.save()
		.then((item) => res.json(item))
		.catch((error) => {
			return res.status(500).json({ message: error.message });
		});
};
//to update product
module.exports.update_items = (req, res) => {
	Item.findByIdAndUpdate(
		{
			_id: req.params.id,
		},
		req.body
	)
		.then(function (item) {
			Item.findOne({
				_id: req.params.id,
			})
				.then(function (item) {
					res.json(item);
				})
				.catch((error) => {
					return res.status(500).json({ message: error.message });
				});
		})
		.catch((error) => {
			return res.status(500).json({ message: error.message });
		});
};
//to delete product
module.exports.delete_item = (req, res) => {
	Item.findByIdAndDelete({
		_id: req.params.id,
	})
		.then(function (item) {
			res.json({
				success: true,
			});
		})
		.catch((error) => {
			return res.status(500).json({ message: error.message });
		});
};
