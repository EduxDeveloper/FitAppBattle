import mealLogModel from "../Models/mealLog.model.js";

const mealLogController = {};

mealLogController.getMealLogs = async (req, res) => {
  try {
    // If a user queries their own logs: /api/meal-logs?userId=...
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const mealLogs = await mealLogModel.find(filter).populate("foodItemId");
    res.status(200).json(mealLogs);
  } catch (error) {
    res.status(500).json({ message: "Error getting meal logs", error });
  }
};

mealLogController.createMealLog = async (req, res) => {
  try {
    const newMealLog = new mealLogModel(req.body);
    await newMealLog.save();
    res.status(201).json(newMealLog);
  } catch (error) {
    res.status(500).json({ message: "Error creating meal log", error });
  }
};

mealLogController.updateMealLog = async (req, res) => {
  try {
    const updatedMealLog = await mealLogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMealLog) return res.status(404).json({ message: "Meal log not found" });
    res.status(200).json(updatedMealLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating meal log", error });
  }
};

mealLogController.deleteMealLog = async (req, res) => {
  try {
    const deletedMealLog = await mealLogModel.findByIdAndDelete(req.params.id);
    if (!deletedMealLog) return res.status(404).json({ message: "Meal log not found" });
    res.status(200).json({ message: "Meal log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal log", error });
  }
};

export default mealLogController;
