import express from "express";
import weightLogController from "../Controllers/weightLogController.js";

const router = express.Router();

router.route("/")
  .get(weightLogController.getWeightLogs)
  .post(weightLogController.createWeightLog);

router.route("/:id")
  .put(weightLogController.updateWeightLog)
  .delete(weightLogController.deleteWeightLog);

export default router;
