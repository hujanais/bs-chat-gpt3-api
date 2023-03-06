import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import express from "express";
import path from "path";
import { router } from "./routes/chatgpt-route";

const app = express();

app.use(cors());

const port = +(process.env.PORT || "3000");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
