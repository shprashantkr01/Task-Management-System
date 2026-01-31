import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./modules/auth/auth.middleware";
import taksRoutes from "./modules/task/task.routes";



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


app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized" });
});


app.use("/tasks", taksRoutes);

export default app;
