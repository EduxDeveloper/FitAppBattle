import express from "express";
import foodItemController from "../Controllers/foodItemController.js";

const router = express.Router();

router.route("/")
  .get(foodItemController.getFoodItems)
  .post(foodItemController.createFoodItem);

router.route("/:id")
  .get(foodItemController.getFoodItem)
  .put(foodItemController.updateFoodItem)
  .delete(foodItemController.deleteFoodItem);

export default router;
