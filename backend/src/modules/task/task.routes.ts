import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { create, getAll, update, remove } from "./task.controller";

const router = Router();

router.use(authMiddleware); // 🔐 protects ALL task routes

router.post("/", create);
router.get("/", getAll);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
