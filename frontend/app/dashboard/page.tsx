"use client";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/lib/store/useTaskStore";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import FilterBar from "@/components/FilterBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { tasks, fetchTasks, loading } = useTaskStore();
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, fetchTasks, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <TaskForm
        defaultValues={tasks.find((t) => t.id === editing)}
        onSubmitEnd={() => setEditing(null)}
      />
      <FilterBar />
      {loading && <p>Loading...</p>}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={(t) => setEditing(t.id)} />
        ))}
      </div>
    </div>
  );
} 