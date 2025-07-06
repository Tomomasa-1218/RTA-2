import { create } from "zustand";
import { Task } from "@/app/generated/prisma";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error?: string;
  fetchTasks: () => Promise<void>;
  addTask: (data: Omit<Task, "id" | "ownerId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  async fetchTasks() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch");
      const tasks: Task[] = await res.json();
      set({ tasks });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },
  async addTask(data) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add");
      const task: Task = await res.json();
      set((s) => ({ tasks: [task, ...s.tasks] }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  async updateTask(id, data) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const task: Task = await res.json();
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  async deleteTask(id) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },
})); 