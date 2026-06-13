import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import userModel from "../Models/user.model.js";
import { config } from "../../config.js";

const registerUserController = {};

registerUserController.register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
    } = req.body;

    const existsUser = await userModel.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const existsUsername = await userModel.findOne({ username });
    if (existsUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const passwordHashed = await bcryptjs.hash(password, 10);

    const newUser = new userModel({
      name,
      username,
      email,
      password: passwordHashed,
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
      isVerified: true,
      loginAttemps: 0,
      timeOut: null,
    });

    await newUser.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

registerUserController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;
    const token = req.cookies.registrationCookie;

    if (!token) {
      return res.status(400).json({ message: "Token expired or not found" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomCode: storedCode,
      name,
      username,
      email,
      password,
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newUser = new userModel({
      name,
      username,
      email,
      password,
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
      isVerified: true,
      loginAttemps: 0,
      timeOut: null,
    });

    await newUser.save();

    res.clearCookie("registrationCookie");

    return res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserController;
