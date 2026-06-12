import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

//User Routes
import registerUserRoutes from "./src/Routes/registerUser.routes.js";
import loginUserRoutes from "./src/Routes/loginUser.routes.js";
import logoutRoutes from "./src/Routes/logout.routes.js";
import recoveryRoutes from "./src/Routes/recoveryPassword.routes.js";
import foodItemRoutes from "./src/Routes/foodItem.routes.js";
import mealLogRoutes from "./src/Routes/mealLog.routes.js";
import weightLogRoutes from "./src/Routes/weightLog.routes.js";
import challengeRoutes from "./src/Routes/challenge.routes.js";
import challengeParticipantRoutes from "./src/Routes/challengeParticipant.routes.js";
import messageRoutes from "./src/Routes/message.routes.js";
import notificationRoutes from "./src/Routes/notification.routes.js";
import aiScanRoutes from "./src/Routes/aiScan.routes.js";
import userRoutes from "./src/Routes/user.routes.js";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174"
].filter(Boolean).map(origin => origin.replace(/\/$/, ""));

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            console.log(`CORS blocked for origin: ${origin}. Allowed origins:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser())

//Para que la API acepte json
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


//Routes
app.use("/api/register", registerUserRoutes);
app.use("/api/login", loginUserRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recovery", recoveryRoutes);
app.use("/api/food-items", foodItemRoutes);
app.use("/api/meal-logs", mealLogRoutes);
app.use("/api/weight-logs", weightLogRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/challenge-participants", challengeParticipantRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai-scan", aiScanRoutes);
app.use("/api/users", userRoutes);

export default app;
