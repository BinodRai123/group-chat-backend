const chatModel = require("../models/chat.model");

async function  chatController(req, res){
  const { userId, friendId } = req.body;

  let chat = await chatModel.findOne({
    members: { $all: [userId, friendId] },
  });

  if (!chat) {
    chat = await chatModel.create({ members: [userId, friendId] });

  }

  res.status(200).json(chat);
}

module.exports = {chatController};