import challengeModel from "../Models/challenge.model.js";

const challengeController = {};

challengeController.getChallenges = async (req, res) => {
  try {
    const challenges = await challengeModel.find();
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Error getting challenges", error });
  }
};

challengeController.getChallenge = async (req, res) => {
  try {
    const challenge = await challengeModel.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Error getting challenge", error });
  }
};

challengeController.createChallenge = async (req, res) => {
  try {
    const newChallenge = new challengeModel(req.body);
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ message: "Error creating challenge", error });
  }
};

challengeController.updateChallenge = async (req, res) => {
  try {
    const updatedChallenge = await challengeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedChallenge) return res.status(404).json({ message: "Challenge not found" });
    res.status(200).json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ message: "Error updating challenge", error });
  }
};

challengeController.deleteChallenge = async (req, res) => {
  try {
    const deletedChallenge = await challengeModel.findByIdAndDelete(req.params.id);
    if (!deletedChallenge) return res.status(404).json({ message: "Challenge not found" });
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting challenge", error });
  }
};

export default challengeController;
