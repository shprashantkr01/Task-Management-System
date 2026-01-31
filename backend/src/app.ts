import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Task Management API is running",
  });
});

app.use("/auth", authRoutes);


export default app;
