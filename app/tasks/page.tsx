"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type TaskT = { _id: string; text: string; done: boolean; createdAt: string };

function Button(props: any) {
  const { children, onClick, variant = "default", size = "md", className = "" } = props;
  const base = "rounded-lg font-medium transition active:scale-95 " + (size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2");
  const variants: any = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 text-black",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Input(props: any) {
  return (
    <input
      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<TaskT[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // init userId
  useEffect(() => {
    let uid = localStorage.getItem("f1_userId");
    if (!uid) {
      uid = uuidv4();
      localStorage.setItem("f1_userId", uid);
    }
    setUserId(uid);
  }, []);

  // fetch tasks once we have userId
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // server returns array of tasks
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks:", data);
        }
      })
      .catch((err) => {
        console.error("Fetch tasks error:", err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // create
  async function addTask() {
    if (!newTask.trim() || !userId) return;
    const payload = { userId, text: newTask.trim() };
    // optimistic UI: add to local list quickly (without _id); will replace after server returns
    setNewTask("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      if (created && created._id) {
        setTasks((t) => [created, ...t]);
      } else {
        console.error("Create returned:", created);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // toggle done
  async function toggleTask(id: string, currentDone: boolean) {
    // optimistic update
    setTasks((t) => t.map((x) => (x._id === id ? { ...x, done: !currentDone } : x)));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !currentDone }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  // delete
  async function deleteTask(id: string) {
    // optimistic
    setTasks((t) => t.filter((x) => x._id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-red-500">RACE WEEK TASKS 🏁</h1>
        <a href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition">
          ← Back to Cockpit
        </a>
      </header>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400 italic">No tasks yet. Start adding your pre-race checklist!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task._id, task.done)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
                <span className={task.done ? "line-through text-gray-500" : ""}>{task.text}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteTask(task._id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
