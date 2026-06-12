import express from "express";
import challengeController from "../Controllers/challengeController.js";

const router = express.Router();

router.route("/")
  .get(challengeController.getChallenges)
  .post(challengeController.createChallenge);

router.route("/:id")
  .get(challengeController.getChallenge)
  .put(challengeController.updateChallenge)
  .delete(challengeController.deleteChallenge);

export default router;
