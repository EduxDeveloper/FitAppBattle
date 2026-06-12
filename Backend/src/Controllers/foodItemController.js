import foodItemModel from "../Models/foodItem.model.js";

const foodItemController = {};

foodItemController.getFoodItems = async (req, res) => {
  try {
    const foodItems = await foodItemModel.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: "Error getting food items", error });
  }
};

foodItemController.getFoodItem = async (req, res) => {
  try {
    const foodItem = await foodItemModel.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });
    res.status(200).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: "Error getting food item", error });
  }
};

foodItemController.createFoodItem = async (req, res) => {
  try {
    const newFoodItem = new foodItemModel(req.body);
    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating food item", error });
  }
};

foodItemController.updateFoodItem = async (req, res) => {
  try {
    const updatedFoodItem = await foodItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFoodItem) return res.status(404).json({ message: "Food item not found" });
    res.status(200).json(updatedFoodItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating food item", error });
  }
};

foodItemController.deleteFoodItem = async (req, res) => {
  try {
    const deletedFoodItem = await foodItemModel.findByIdAndDelete(req.params.id);
    if (!deletedFoodItem) return res.status(404).json({ message: "Food item not found" });
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food item", error });
  }
};

export default foodItemController;
