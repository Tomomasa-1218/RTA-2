import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { taskCreateSchema } from "@/lib/validators/task";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as "PENDING" | "DONE" | null;
  const priority = searchParams.get("priority") as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | null;
  const search = searchParams.get("search");

  const tasks = await prisma.task.findMany({
    where: {
      ownerId: (session.user as any).id,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parse = taskCreateSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }

  const { title, description, priority, dueDate } = parse.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate,
      ownerId: (session.user as any).id,
    },
  });

  return NextResponse.json(task, { status: 201 });
} 