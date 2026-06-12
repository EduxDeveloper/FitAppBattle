import notificationModel from "../Models/notification.model.js";

const notificationController = {};

notificationController.getNotifications = async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const notifications = await notificationModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error getting notifications", error });
  }
};

notificationController.createNotification = async (req, res) => {
  try {
    const newNotification = new notificationModel(req.body);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

notificationController.updateNotification = async (req, res) => {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNotification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

notificationController.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id);
    if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

export default notificationController;
