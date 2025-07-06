"use client";
import { Task } from "@/app/generated/prisma";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskCreateSchema,
  TaskCreateInput,
  taskUpdateSchema,
} from "@/lib/validators/task";
import { useEffect } from "react";

interface Props {
  defaultValues?: Task;
  onSubmitEnd?: () => void;
}

export default function TaskForm({ defaultValues, onSubmitEnd }: Props) {
  const createMode = !defaultValues;
  const { addTask, updateTask } = useTaskStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: zodResolver(createMode ? taskCreateSchema : taskUpdateSchema) as any,
    defaultValues: defaultValues ?? {},
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: TaskCreateInput) => {
    if (createMode) {
      await addTask(data as any);
      reset();
    } else {
      await updateTask(defaultValues!.id, data);
      onSubmitEnd?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input
        {...register("title")}
        placeholder="タイトル"
        className="border p-2 rounded"
      />
      {(errors as any).title?.message && (
        <p className="text-red-500 text-sm">{(errors as any).title.message}</p>
      )}
      <textarea
        {...register("description")}
        placeholder="説明"
        className="border p-2 rounded"
      />
      <select {...register("priority")} className="border p-2 rounded">
        <option value="LOW">低</option>
        <option value="MEDIUM">中</option>
        <option value="HIGH">高</option>
      </select>
      <input
        type="date"
        {...register("dueDate")}
        className="border p-2 rounded"
      />
      <button className="bg-primary text-white py-2 rounded">
        {createMode ? "追加" : "更新"}
      </button>
    </form>
  );
} 