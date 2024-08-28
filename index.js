import mongoose from "mongoose";
import app from "./app.js";
import setupSocket from "./socket/socket.js";

const PORT = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

setupSocket(server);

mongoose.connect(databaseURL)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("Databse error: ", error.message));