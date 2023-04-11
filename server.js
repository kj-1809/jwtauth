// const express = require("express");
import express from "express";
const app = express();
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

// const { authRoutes } = require("./routes/auth.routes");
// const { fetchRoutes } = require("./routes/fetch.routes");

import { authRouter } from "./routes/auth.routes.js";
import { fetchRouter } from "./routes/fetch.routes.js";

app.use(express.json());
app.use("/auth", authRouter);
app.use(fetchRouter);

app.listen(process.env.PORT, () => { console.log("running server on port ", process.env.PORT);
});
