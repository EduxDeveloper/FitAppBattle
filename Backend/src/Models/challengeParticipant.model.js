import mongoose, { Schema, model } from "mongoose";

const challengeParticipantSchema = new Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenges",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    joinedAt: { type: Date },
    status: { type: String },

    currentValue: { type: Number },
    rank: { type: Number },

    badges: [
      {
        name: { type: String },
        emoji: { type: String },
        awardedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("ChallengeParticipants", challengeParticipantSchema);
