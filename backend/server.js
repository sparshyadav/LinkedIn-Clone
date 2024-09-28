import express from "express";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`)
})