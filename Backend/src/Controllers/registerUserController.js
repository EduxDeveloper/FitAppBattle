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
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        username,
        email,
        password: passwordHashed,
        age,
        gender,
        weightKg,
        heightCm,
        activityLevel,
        isVerified: false,
        loginAttemps: 0,
        timeOut: null,
      },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4, // Force IPv4 to bypass Render's lack of IPv6 outbound support
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta - FitBattle AI",
      text: "Para verificar tu cuenta, utiliza este código: " + randomCode + " . Expira en 15 minutos",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
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
