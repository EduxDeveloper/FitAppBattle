import express from "express";
import loginUserController from "../Controllers/loginUserController.js";

const router = express.Router();

router.route("/").post(loginUserController.login);
router.route("/check").get(loginUserController.checkSession);

export default router;
