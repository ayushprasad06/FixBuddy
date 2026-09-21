import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.disable("etag");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FixBuddy server running on port ${PORT}`);
});