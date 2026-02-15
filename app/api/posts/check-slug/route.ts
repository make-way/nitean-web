import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug')?.trim();
    const excludeSlug = searchParams.get('excludeSlug')?.trim();

    if (!slug) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // If checking the same slug as the original post, it's not a duplicate
    if (excludeSlug && slug === excludeSlug) {
      return NextResponse.json({ exists: false });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    return NextResponse.json({
      exists: Boolean(post),
    });
  } catch (error) {
    return NextResponse.json({ exists: false, error: 'Internal server error' }, { status: 500 });
  }
}
