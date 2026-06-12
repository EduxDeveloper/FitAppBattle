import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    title: { type: String },
    message: { type: String },
    type: { type: String },

    relatedEntity: { type: String },
    relatedId: { type: mongoose.Schema.Types.ObjectId },

    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Notifications", notificationSchema);
