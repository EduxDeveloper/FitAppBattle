import express from "express";
import messageController from "../Controllers/messageController.js";

const router = express.Router();

router.route("/")
  .get(messageController.getMessages)
  .post(messageController.createMessage);

router.route("/:id")
  .put(messageController.updateMessage)
  .delete(messageController.deleteMessage);

export default router;
