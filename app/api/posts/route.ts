import { NextResponse } from "next/server";
import { postSchema } from "@/lib/validations/post";
import prisma from "@/lib/prisma";
import { PostStatus } from "@/enum";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = postSchema.parse(body);

        const post = await prisma.post.create({
        data: {
            title: data.title,
            slug: data?.slug || "",
            summary: data.summary,
            content: data.content,
            status: data.status as PostStatus,
            userId: data.userId,
        }
        });

        return NextResponse.json({ message: "Post Created Successfully", post }, { status: 201 });
    } catch (err) {
        console.error("POST /api/posts error:", err);
        return NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 500 }
        );
    }
}
