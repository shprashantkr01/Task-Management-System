"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { clearTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  async function loadTasks() {
    const data = await apiRequest("/tasks");
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask() {
    if (!title) return;

    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    setTitle("");
    loadTasks();
    alert("Task added");
  }

  async function toggleTask(task: Task) {
    await apiRequest(`/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !task.completed }),
    });

    loadTasks();
  }

  async function deleteTask(id: number) {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
    alert("Task deleted");
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 border px-3 py-1"
        >
          Logout
        </button>
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask} className="bg-black text-red px-4">
          Add
        </button>
      </div>

      {/* Search */}
      <input
        className="w-full border p-2"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Task list */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border p-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              <span
                className={`${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
