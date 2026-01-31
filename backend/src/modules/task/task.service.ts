import prisma from "../../config/prisma";

export async function createTask(userId: number, title: string) {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
}

export async function getTasks(userId: number) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTask(
  userId: number,
  taskId: number,
  data: { title?: string; completed?: boolean }
) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
}

export async function deleteTask(userId: number, taskId: number) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
}
