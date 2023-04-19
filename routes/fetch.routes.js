import express from "express";
import jwt from "jsonwebtoken";
import { fetchController } from "../controllers/fetch.controller.js";

const fetchRouter = express.Router();

function isAuthenticated(req, res, next) {
	if (!req.headers["auth-token"]) {
		return res
			.status(401)
			.json({ error: "please send a auth-token with the request !" });
	}

	const token = req.headers["auth-token"].split(" ")[1];
	jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
		if (err) {
			return res.status(401).json({
				error: "please send a valid auth-token with the request !",
				errormsg: err,
			});
		}
		next();
	});
}

// adding auth middleware
fetchRouter.use(isAuthenticated);

fetchRouter.get("/data", fetchController);

export { fetchRouter };
