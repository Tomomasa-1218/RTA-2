import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userRegisterSchema } from "@/lib/validators/user";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const json = await req.json();
  const parse = userRegisterSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password } = parse.data;

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    return NextResponse.json({ error: "既に登録済みです" }, { status: 400 });
  }

  const passwordHash = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return NextResponse.json(
    { ok: true, user: { id: user.id, email: user.email, name: user.name } },
    { status: 201 }
  );
} 