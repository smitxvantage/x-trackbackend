import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import dailyReportRoutes from "./modules/dailyReports/dailyReports.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import holidayRoutes from "./modules/holidays/holidays.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/daily-reports", dailyReportRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/notifications", notificationRoutes);


// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV ?? "dev" });
});

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
