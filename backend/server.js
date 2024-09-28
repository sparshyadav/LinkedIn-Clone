import express from "express";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Started on Port: ${PORT}`)
})