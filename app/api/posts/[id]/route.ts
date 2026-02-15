import { NextResponse } from 'next/server';
import { postSchema } from '@/lib/validations/post';
import prisma from '@/lib/prisma';
import { PostStatus } from '@/enum';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Try to fetch by slug first, then by ID if numeric
    let post;

    if (!isNaN(Number(id))) {
      // It's a numeric ID
      post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });
    } else {
      // It's a slug
      post = await prisma.post.findUnique({
        where: { slug: id },
        include: { user: true },
      });
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = postSchema.parse(body);

    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find post by slug or ID
    let existingPost;
    if (!isNaN(Number(id))) {
      existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
        select: { userId: true },
      });
    } else {
      existingPost = await prisma.post.findUnique({
        where: { slug: id },
        select: { userId: true },
      });
    }

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the post
    let updateWhere: any;
    if (!isNaN(Number(id))) {
      updateWhere = { id: Number(id) };
    } else {
      updateWhere = { slug: id };
    }

    const updatedPost = await prisma.post.update({
      where: updateWhere,
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        status: data.status as PostStatus,
      },
      include: { user: true },
    });

    return NextResponse.json({ message: 'Post Updated Successfully', post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find post by slug or ID
    let existingPost;
    if (!isNaN(Number(id))) {
      existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
        select: { userId: true },
      });
    } else {
      existingPost = await prisma.post.findUnique({
        where: { slug: id },
        select: { userId: true },
      });
    }

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the post
    let deleteWhere: any;
    if (!isNaN(Number(id))) {
      deleteWhere = { id: Number(id) };
    } else {
      deleteWhere = { slug: id };
    }

    const deletedPost = await prisma.post.delete({
      where: deleteWhere,
      include: { user: true },
    });

    return NextResponse.json({ message: 'Post Deleted Successfully', post: deletedPost }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
