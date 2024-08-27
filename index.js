import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Middleware
app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Welcome to the Chat App API"));
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(databaseURL)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("Databse error: ", error.message));