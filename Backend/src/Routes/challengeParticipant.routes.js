import express from "express";
import challengeParticipantController from "../Controllers/challengeParticipantController.js";

const router = express.Router();

router.route("/")
  .get(challengeParticipantController.getParticipants)
  .post(challengeParticipantController.createParticipant);

router.route("/:id")
  .put(challengeParticipantController.updateParticipant)
  .delete(challengeParticipantController.deleteParticipant);

export default router;
