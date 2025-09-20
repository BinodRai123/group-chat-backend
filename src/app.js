const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

/* ---Calling Routes--- */
const userAuthRoutes = require("../src/routes/auth.routes");
const chatRoutes = require("../src/routes/chat.routes");
const uploadImage = require("../src/routes/uploadImage.routes");

const app = express();

/* ----Middlewares--- */
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

/* ---Routes--- */
app.use("/api/auth", userAuthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/uploadImage", uploadImage);

module.exports = app;