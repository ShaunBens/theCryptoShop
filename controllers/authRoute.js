const Jwt = require("jsonwebtoken");
const authRoute = require("express").Router();
const _ = require("lodash");
const Passport = require("../config/jwt.js");
const { jwtOpts: config } = require("../config/config.js")("dev");

module.exports = function() {

	authRoute.post("/login", function(req, res) {
		// console.log(req.body);
		const { username: name, password } = req.body;

		if (!name || !password) {
			res
				.status(401)
				.send("Error 401, required user to filled up the form before post");
			return;
		}

		// usually this would be a database call:
		const user = Users[_.findIndex(Users, { username: name })];

		if (!user) {
			res.status(401).json({ message: "no such user found" });
		}

		if (user.password === password) {
			// from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
			const payload = { _id: user._id };
			const token = Jwt.sign(payload, config.secretOrKey);

			req.session.cookie.maxAge = 6000; // timeout
			req.session.authenticated = true;
			req.session.token = token;

			console.log(req.session);
			res.json({ message: "ok", token: token });
		} else {
			res.status(401).json({ message: "passwords did not match" });
		}
	});

	authRoute.get("/user", Passport.authenticate("jwt", { session: false }), function(req, res) {
		console.log("======================================");
		console.log(req.session);
		// req.session.regenerate();

		console.log(req.session);
		res.status(200).send("Success! You can not see this without a token");
	});

	return authRoute;
};

// temp database sim
const Users = [
	{
		_id: 1,
		username: "71emj",
		password: "11111111"
	},
	{
		_id: 2,
		username: "timjeng",
		password: "22222222"
	}
];
