import mongoose, { Schema, model } from "mongoose";

const mealLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    foodItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItems",
    },

    date: { type: Date },
    mealType: { type: String },
    servingSizeG: { type: Number },

    calories: { type: Number },
    proteinG: { type: Number },
    carbsG: { type: Number },
    fatsG: { type: Number },

    notes: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("MealLogs", mealLogSchema);
