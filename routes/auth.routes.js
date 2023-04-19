import express from "express";

const authRouter = express.Router();

import {
	loginController,
	registerController,
	fetchUsers,
	logoutController,
	refreshTokenController,
} from "../controllers/auth.controller.js"

//fetch users
authRouter.get("/users", fetchUsers);
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.delete("/logout", logoutController);
authRouter.get("/token", refreshTokenController);
export { authRouter };
