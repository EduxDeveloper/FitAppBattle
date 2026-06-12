import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";
import userModel from "../Models/user.model.js";

const loginUserController = {};

loginUserController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Blocked account" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;
      if (userFound.loginAttemps >= 7) {
        userFound.timeOut = Date.now() + 5 * 60 * 1000;
        userFound.loginAttemps = 0;

        await userFound.save();
        return res.status(403).json({ message: "Blocked account for many attempts" });
      }

      await userFound.save();
      return res.status(401).json({ message: "Wrong password" });
    }

    userFound.loginAttemps = 0;
    userFound.timeOut = null;
    await userFound.save();

    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" }
    );

    res.cookie("authCookie", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
    });

    const userWithoutPassword = await userModel.findById(userFound._id).select("-password");
    return res.status(200).json({ message: "Login successfully", user: userWithoutPassword });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

loginUserController.checkSession = async (req, res) => {
  try {
    const token = req.cookies.authCookie;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const userFound = await userModel.findById(decoded.id).select("-password");

    if (!userFound) return res.status(401).json({ message: "User not found" });

    res.status(200).json({ message: "Authenticated", user: userFound });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default loginUserController;
