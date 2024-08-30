import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import groupRouter from "./routes/GroupRoutes.js";
import directChatRouter from "./routes/DirectChatRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Welcome to the Chat App API"));
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRouter);
app.use("/api/chats", directChatRouter);

export default app;