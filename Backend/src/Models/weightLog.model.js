import mongoose, { Schema, model } from "mongoose";

const weightLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    date: { type: Date },
    weightKg: { type: Number },
    notes: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("WeightLogs", weightLogSchema);
