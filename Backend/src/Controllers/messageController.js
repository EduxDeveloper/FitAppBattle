import messageModel from "../Models/message.model.js";

const messageController = {};

messageController.getMessages = async (req, res) => {
  try {
    const filter = req.query.challengeId ? { challengeId: req.query.challengeId } : {};
    const messages = await messageModel.find(filter).populate("senderId").sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error getting messages", error });
  }
};

messageController.createMessage = async (req, res) => {
  try {
    const newMessage = new messageModel(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error creating message", error });
  }
};

messageController.updateMessage = async (req, res) => {
  try {
    const updatedMessage = await messageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMessage) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error });
  }
};

messageController.deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await messageModel.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};

export default messageController;
