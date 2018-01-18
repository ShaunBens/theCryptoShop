import axios from "axios";
import Validator from "./validate";

const login = fields => {
	return new Promise((resolve, reject) => {
		const { username, password } = fields;
		const validator = new Validator();
		const data = { username, password };

		if (username.match(/(.*?@[a-z]+\.[a-z]+)+$/g)) {
			console.log("it's email format");
			data.email = username;
			delete data.username;
		}

		const invalid = validator.Setprops(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		resolve(axios.post("/login", data));
	});
};

const register = fields => {
	return new Promise((resolve, reject) => {
		const { email, username, password, passconfirm } = fields;
		const validator = new Validator();
		const data = { username, email, password, passconfirm };

		const invalid = validator.Setprops(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		delete data.passconfirm;
		resolve(axios.post("/register", data));
	});
};

export { login, register };