import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes.js";
import { fetchRouter } from "./routes/fetch.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use(fetchRouter);

app.listen(process.env.PORT, () => { console.log("running server on port ", process.env.PORT);
});
