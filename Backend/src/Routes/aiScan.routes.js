import express from "express";
import aiScanController from "../Controllers/aiScanController.js";

const router = express.Router();

router.route("/analyze").post(aiScanController.scanFood);

export default router;
