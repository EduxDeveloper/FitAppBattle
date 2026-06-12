import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    age: { type: Number },
    gender: { type: String },
    weightKg: { type: Number },
    heightCm: { type: Number },
    activityLevel: { type: String },

    bmi: { type: Number },
    bmr: { type: Number },
    tdee: { type: Number },

    goal: { type: String },
    targetWeightKg: { type: Number },
    dailyCaloriesTarget: { type: Number },

    macros: {
      proteinG: { type: Number },
      carbsG: { type: Number },
      fatsG: { type: Number },
    },

    points: { type: Number },
    currentStreak: { type: Number },
    bestStreak: { type: Number },

    language: { type: String },
    notificationsEnabled: { type: Boolean },
    darkMode: { type: Boolean },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Users", userSchema);
