const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: "please enter all fieds" });
	}
	User.findOne({ email: email }).then((user) => {
		if (user) return res.status(400).json({ message: "User already exist" });
	});

	//create salt and hash
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) throw err;
			const newUser = new User({ name: name, email: email, password: hash });
			newUser
				.save()
				.then((user) => {
					console.log(user);
					return res.status(201).json({ message: "User saved successfully." });
				})
				.catch((error) => {
					return res.status(500).json({ message: error.message });
				});
		});
	});
};

module.exports.login = (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Please enter all the fields." });
	}
	User.findOne({ email: email }).then((user) => {
		if (!user) {
			return res.status(400).json({ message: "User does not exist." });
		}
		//password validation
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch) {
				return res.status(400).json({ message: "Invalid email or password." });
			}
			jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: 3600 }, (err, token) => {
				if (err) {
					throw err;
				}
				return res
					.status(200)
					.json({ token: token, user: { id: user._id, name: user.name, email: user.email } }); //remove user later
			});
		});
	});
};

module.exports.getUser = (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => {
			return res.status(200).json(user);
		})
		.catch((err) => {
			return res.status(500).json({ message: err.message });
		});
};
