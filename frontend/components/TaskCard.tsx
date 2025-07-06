"use client";
import { Task } from "@/app/generated/prisma";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { FiTrash2, FiEdit, FiCheckCircle } from "react-icons/fi";
import clsx from "clsx";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: Props) {
  const { deleteTask, updateTask } = useTaskStore();

  const toggleStatus = () =>
    updateTask(task.id, {
      status: task.status === "DONE" ? "PENDING" : "DONE",
    });

  return (
    <div
      className={clsx(
        "border rounded p-4 flex flex-col gap-2",
        task.status === "DONE" && "opacity-60 line-through"
      )}
    >
      <h3 className="font-semibold">{task.title}</h3>
      {task.description && <p className="text-sm">{task.description}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={toggleStatus} title="Toggle">
          <FiCheckCircle />
        </button>
        <button onClick={() => onEdit(task)} title="Edit">
          <FiEdit />
        </button>
        <button onClick={() => deleteTask(task.id)} title="Delete">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
} 