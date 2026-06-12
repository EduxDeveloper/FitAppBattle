import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenges",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    text: { type: String },
    type: { type: String },

    attachmentUrl: { type: String },
    attachmentType: { type: String },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Messages", messageSchema);
