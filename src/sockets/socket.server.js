const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  //socket-io middleware
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication Error: no Token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);

      const user = await userModel
        .findOne({ _id: decoded.id })
        .select("-password -__v");
      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication Error: Invalid token"));
    }
  });

  let onlineUsers = new Map();

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    const user = socket.user;
    onlineUsers.set(user._id.toString(), {
      name: user.userName,
      profileImage: user.profileImage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    const onlineUserArray = Array.from(onlineUsers.entries()).map(
      ([id, data]) => ({
        _id: id,
        name: data.name,
        profileImage: data.profileImage,
        time: data.time,
      })
    );

    /* send current online friends */
    io.emit("online_users", onlineUserArray);
    console.log("Online Users:", onlineUserArray);

    /* --Join Room of two user-- */
    socket.on("join_chat", async (chatId) => {
      socket.join(chatId);
      const messages = (
        await messageModel
          .find({ chatId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      socket.emit("all_messages", messages);
    });

    /* --send message to chat-- */
    socket.on("send_message", async ({ chatId, senderId, text }) => {
      const message = await messageModel.create({ senderId, chatId, text });
      socket.to(chatId).emit("receive_message", message);

      socket.emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(user._id.toString());

      const onlineUserArray = Array.from(onlineUsers.entries()).map(
        ([id, data]) => ({
          _id: id,
          name: data.name,
          profileImage: data.profileImage,
          time: data.time,
        })
      );

      io.emit("online_users", onlineUserArray);
      console.log("A user disconnected:", socket.id);
    });
  });
}

module.exports = initSocketServer;
