import express from "express";
import userModel from "../Models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    let data = { ...req.body };
    
    // Upload avatar to cloudinary if it's a base64 string
    if (data.avatar && data.avatar.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(data.avatar, {
          folder: "fitbattle_avatars"
        });
        data.avatar = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary error:", err);
      }
    }

    // Calculate metrics if we have the necessary fields
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const w = data.weightKg || user.weightKg;
    const h = data.heightCm || user.heightCm;
    const a = data.age || user.age;
    const g = data.gender || user.gender;
    const al = data.activityLevel || user.activityLevel;
    const goal = data.goal || user.goal;

    if (w && h && a && g && al) {
      // BMI
      data.bmi = parseFloat((w / Math.pow(h / 100, 2)).toFixed(1));
      
      // BMR
      let bmr = 10 * w + 6.25 * h - 5 * a;
      bmr += (g === 'm') ? 5 : -161;
      data.bmr = Math.round(bmr);

      // TDEE
      const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, extreme: 1.9 };
      const tdee = bmr * (multipliers[al] || 1.2);
      data.tdee = Math.round(tdee);

      // Daily Calories Target based on goal
      let targetCalories = Math.round(tdee);
      if (goal === 'Definir') targetCalories -= 500;
      else if (goal === 'Volumen') targetCalories += 500;
      data.dailyCaloriesTarget = targetCalories;

      // Macros
      const proteinG = Math.round(w * 2.2);
      const fatsG = Math.round(w * 0.8);
      const proteinKcal = proteinG * 4;
      const fatsKcal = fatsG * 9;
      const carbsKcal = targetCalories - proteinKcal - fatsKcal;
      const carbsG = Math.max(0, Math.round(carbsKcal / 4));
      
      data.macros = { proteinG, carbsG, fatsG };
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
});

router.put("/:id/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const userFound = await userModel.findById(req.params.id);
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    userFound.password = passwordHash;
    await userFound.save();

    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cambiar contraseña", error });
  }
});

export default router;
