import challengeParticipantModel from "../Models/challengeParticipant.model.js";

const challengeParticipantController = {};

challengeParticipantController.getParticipants = async (req, res) => {
  try {
    const filter = req.query.challengeId ? { challengeId: req.query.challengeId } : {};
    const participants = await challengeParticipantModel.find(filter).populate("userId");
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: "Error getting participants", error });
  }
};

challengeParticipantController.createParticipant = async (req, res) => {
  try {
    const newParticipant = new challengeParticipantModel(req.body);
    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ message: "Error creating participant", error });
  }
};

challengeParticipantController.updateParticipant = async (req, res) => {
  try {
    const updatedParticipant = await challengeParticipantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParticipant) return res.status(404).json({ message: "Participant not found" });
    res.status(200).json(updatedParticipant);
  } catch (error) {
    res.status(500).json({ message: "Error updating participant", error });
  }
};

challengeParticipantController.deleteParticipant = async (req, res) => {
  try {
    const deletedParticipant = await challengeParticipantModel.findByIdAndDelete(req.params.id);
    if (!deletedParticipant) return res.status(404).json({ message: "Participant not found" });
    res.status(200).json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting participant", error });
  }
};

export default challengeParticipantController;
