import Header from "@/components/Header";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { PostStatus } from "@/enum";
import { timeAgo } from "@/utils/TimeAgo";

export default async function Home() {
    const posts = await prisma.post.findMany({
    where: { status: PostStatus.Draft },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });  

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-8">
        {/* Pinterest layout */}
        <div className="columns-1 gap-6">
          {posts.map((post) => (
            <article
            key={post.id}
            className="mb-6 break-inside-avoid rounded-2xl
                        bg-white border border-dashed border-zinc-300
                        hover:border-solid hover:border-zinc-400 hover:shadow-sm
                        transition-all duration-200
                        dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500"
            >


              {/* Image */}
              {post?.thumbnail && (
                <div className="relative w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={post?.thumbnail}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-120 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="mt-1 text-base font-semibold">
                  {post.title}
                </h3>
                
                <span className="text-xs text-zinc-500">{timeAgo(post.createdAt)}</span>

                {post.summary && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.summary}
                  </p>
                )}

                {/* Author */}
                <div className="mt-4 flex items-center gap-3">
                  {post.user.image ? (
                                      <Image
                    src={post?.user?.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="w-7 h-7 object-cover"
                  />
                  ): (
                    <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  )}
                  <div className="text-xs">
                    <p className="font-medium uppercase">{post.user.name}</p>
                    <small>@{post.user.username}</small>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
