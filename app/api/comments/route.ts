import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createComment } from "@/server/services/comment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const comment = await createComment({
      postId: Number(postId),
      content,
      userId: session.user.id,
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("API Comment POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("API Comment GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
