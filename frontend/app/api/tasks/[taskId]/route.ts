import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validators/task";

export async function GET(
  _req: Request,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findFirst({
    where: { id: params.taskId, ownerId: (session.user as any).id },
  });
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PUT(
  req: Request,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parse = taskUpdateSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const updated = await prisma.task.update({
      where: { id: params.taskId, ownerId: (session.user as any).id },
      data: parse.data,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Not found or no permission" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.task.delete({
      where: { id: params.taskId, ownerId: (session.user as any).id },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Not found or no permission" }, { status: 404 });
  }
} 