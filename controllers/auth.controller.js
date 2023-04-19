import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../supabaseClient.js";

async function loginController(req, res) {
	const { data: user, error } = await supabase
		.from("users")
		.select("*")
		.eq("username", req.body.username)
		.maybeSingle();

	if (error) {
		return res.status(500).json({ error: "some internal error occured !" });
	}

	if (!user) {
		return res.status(401).json({ error: "user does not exist!" });
	}

	const isValid = await bcrypt.compare(req.body.password, user.password);

	if (isValid) {
		const authToken = createToken(user, true);
		const refreshToken = createToken(user, false);
		const { data: refreshTokenData, error: refreshTokenError } = await supabase
			.from("refreshTokens")
			.insert([{ token: refreshToken }]);

		if (refreshTokenError) {
			return res.status(500).json({ error: "some internal error occured !" });
		}
		res.status(200).json({
			success: "Logged in successfully!",
			authToken ,
			refreshToken,
			refreshTokenData,
		});
	} else {
		res.status(401).json({ error: "Please enter correct login credentials !" });
	}
}

async function registerController(req, res) {
	if (!req.body.username) {
		return res.status(400).json({ error: "please enter a valid username" });
	}

	const { data: existingUser, error } = await supabase
		.from("users")
		.select("*")
		.eq("username", req.body.username);

	if (error) {
		return res.status(500).json({ error: "some internal error occured !" });
	}
	if (existingUser.length !== 0) {
		return res
			.status(400)
			.json({ error: "a user already exists with this username!" });
	}

	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const { data, error } = await supabase
			.from("users")
			.insert([{ username: req.body.username, password: hashedPassword }]);

		if (error) {
			throw Error(error);
		}
		res.status(200).json({ success: "user created successfully ! ", data });
	} catch {
		res.status(500).json({ error: "some internal server error" });
	}
}

async function fetchUsers(req, res) {
	const { data: users, error } = await supabase.from("users").select("*");

	if (error) {
		return res
			.status(500)
			.json({ error: "some error occured", errorMessage: error });
	}
	return res.status(200).json({ users });
}

async function logoutController(req, res) {
	const refreshToken = req.headers["refresh-token"].split(" ")[1];

	const { data, error } = await supabase
		.from("refreshTokens")
		.delete()
		.eq("token", refreshToken);

	if (error) {
		return res
			.status(500)
			.json({ error: "some internal server error occured !" });
	}

	res.status(200).json({ success: "logged out successfully !", data });
}

function createToken(payload, expires) {
	if (expires) {
		return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "15s" });
	} else {
		return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
	}
}

async function refreshTokenController(req, res) {
	const refreshToken = req.body.token;
	const { data: doesExist, error } = await supabase
		.from("refreshTokens")
		.select("*")
		.eq("token", refreshToken)
		.maybeSingle();

	if (!refreshToken || !doesExist) {
		return res.status(403);
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
		if (err) {
			return res.status(403).json({ error: "invalid refresh token ! " });
		}
		const newToken = createToken(
			{
				username: data.username,
				password: data.password,
			},
			true
		);
		res.status(200).json({ newToken });
	});
}

export {
	loginController,
	registerController,
	fetchUsers,
	logoutController,
	refreshTokenController,
};
