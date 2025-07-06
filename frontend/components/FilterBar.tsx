"use client";
import { useState } from "react";
import { useTaskStore } from "@/lib/store/useTaskStore";

export default function FilterBar() {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const { fetchTasks } = useTaskStore();

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);

    fetch(`/api/tasks?${params.toString()}`)
      .then((res) => res.json())
      .then(() => fetchTasks());
  };

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">全て</option>
        <option value="PENDING">未完了</option>
        <option value="DONE">完了</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">優先度</option>
        <option value="LOW">低</option>
        <option value="MEDIUM">中</option>
        <option value="HIGH">高</option>
      </select>
      <button
        onClick={applyFilter}
        className="bg-secondary text-white px-4 rounded"
      >
        絞り込み
      </button>
    </div>
  );
} 