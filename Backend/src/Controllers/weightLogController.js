import weightLogModel from "../Models/weightLog.model.js";

const weightLogController = {};

weightLogController.getWeightLogs = async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const weightLogs = await weightLogModel.find(filter).sort({ date: -1 });
    res.status(200).json(weightLogs);
  } catch (error) {
    res.status(500).json({ message: "Error getting weight logs", error });
  }
};

weightLogController.createWeightLog = async (req, res) => {
  try {
    const newWeightLog = new weightLogModel(req.body);
    await newWeightLog.save();
    res.status(201).json(newWeightLog);
  } catch (error) {
    res.status(500).json({ message: "Error creating weight log", error });
  }
};

weightLogController.updateWeightLog = async (req, res) => {
  try {
    const updatedWeightLog = await weightLogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWeightLog) return res.status(404).json({ message: "Weight log not found" });
    res.status(200).json(updatedWeightLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating weight log", error });
  }
};

weightLogController.deleteWeightLog = async (req, res) => {
  try {
    const deletedWeightLog = await weightLogModel.findByIdAndDelete(req.params.id);
    if (!deletedWeightLog) return res.status(404).json({ message: "Weight log not found" });
    res.status(200).json({ message: "Weight log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting weight log", error });
  }
};

export default weightLogController;
