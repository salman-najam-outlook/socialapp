const express = require("express");
const router = express.Router();

const MessageCrtl = require("../controllers/message");
const AuthHelper = require("../helpers/authHelper");

router.post("/chat-messages/:sender_Id/:receiver_Id", AuthHelper.VerifyToken, MessageCrtl.SendMessage);

router.get("/chat-messages/:sender_Id/:receiver_Id", AuthHelper.VerifyToken, MessageCrtl.GetAllMessages);


module.exports = router;