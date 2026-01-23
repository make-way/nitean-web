import prisma from "@/lib/prisma";
import { PostStatus } from "@/enum";
import Image from "next/image";
import Link from "next/link";
import { FileEditIcon, Heart, Trash } from "lucide-react";
import { timeAgo } from "@/utils/TimeAgo";

export default async function ArticlesPage() {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.Draft },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="mt-8 space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="block rounded-xl border bg-white p-5 transition hover:shadow-sm"
        >
          <div className="flex items-start gap-5">
            {/* Left Content */}
            <div className="flex-1">
                <Link href={'/post'}>
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
                </Link>

              <div className="mt-1 text-sm text-gray-500">
                {timeAgo(post.createdAt)}
                <div className="flex items-center pt-3 gap-1">
                    {post.user.image && (
                        <Image src={post.user?.image } alt="" width={21} height={21} className="rounded-full"/>
                    )}
                    <span className="font-medium uppercase">{post.user.username}</span> | 
                    <FileEditIcon className="w-10 h-10 rounded-full p-2
                        text-gray-500 hover:text-gray-900
                        hover:bg-gray-100 transition cursor-pointer"/>
                    <Trash className="w-10 h-10 rounded-full p-2
                        text-red-500 hover:text-red-800
                        hover:bg-gray-100 transition cursor-pointer"/>
                </div>
              </div>

             <Link href={`/post/update/${post.slug}`}>
                <p className="mt-3 line-clamp-2 text-gray-600">
                    {post.summary}
                </p>
             </Link>

              {/* Meta */}
              {/* <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <span><Heart className="w-10 h-10 rounded-full p-2
                        text-gray-500 hover:text-gray-900
                        hover:bg-gray-100 transition"/></span>
              </div> */}
            </div>

            {/* Right Image */}
            {post.thumbnail && (
              <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
