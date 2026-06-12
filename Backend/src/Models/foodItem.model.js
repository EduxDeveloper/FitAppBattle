import mongoose, { Schema, model } from "mongoose";

const foodItemSchema = new Schema(
  {
    name: { type: String },
    brand: { type: String },
    servingSizeG: { type: Number },

    calories: { type: Number },
    proteinG: { type: Number },
    carbsG: { type: Number },
    fatsG: { type: Number },

    source: { type: String },
    aiConfidence: { type: Number },

    imageUrl: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("FoodItems", foodItemSchema);
