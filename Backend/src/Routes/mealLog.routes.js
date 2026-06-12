import express from "express";
import mealLogController from "../Controllers/mealLogController.js";

const router = express.Router();

router.route("/")
  .get(mealLogController.getMealLogs)
  .post(mealLogController.createMealLog);

router.route("/:id")
  .put(mealLogController.updateMealLog)
  .delete(mealLogController.deleteMealLog);

export default router;
