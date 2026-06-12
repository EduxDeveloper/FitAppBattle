import express from "express";
import notificationController from "../Controllers/notificationController.js";

const router = express.Router();

router.route("/")
  .get(notificationController.getNotifications)
  .post(notificationController.createNotification);

router.route("/:id")
  .put(notificationController.updateNotification)
  .delete(notificationController.deleteNotification);

export default router;
