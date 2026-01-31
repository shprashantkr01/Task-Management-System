import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./task.service";

export async function create(req: AuthRequest, res: Response) {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await createTask(req.user!.userId, title);
    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAll(req: AuthRequest, res: Response) {
  const tasks = await getTasks(req.user!.userId);
  return res.status(200).json(tasks);
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const taskId = Number(req.params.id);
    const task = await updateTask(req.user!.userId, taskId, req.body);
    return res.status(200).json(task);
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const taskId = Number(req.params.id);
    const result = await deleteTask(req.user!.userId, taskId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
