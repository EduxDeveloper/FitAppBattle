import mongoose, { Schema, model } from "mongoose";

const challengeSchema = new Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    title: { type: String },
    description: { type: String },
    emoji: { type: String },

    goalType: { type: String },
    targetValue: { type: Number },
    maxParticipants: { type: Number },

    startDate: { type: Date },
    endDate: { type: Date },

    status: { type: String },

    chatEnabled: { type: Boolean },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Challenges", challengeSchema);
