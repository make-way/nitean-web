import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FileEditIcon, Trash } from "lucide-react";
import { timeAgo } from "@/utils/TimeAgo";
import { notFound } from "next/navigation";
import { getPostsOwner } from "@/server/actions/post";

export default async function ArticlesPage({ params }: { params: Promise<{ username: string }>; }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) notFound();

  // Fetch Posts using the cached function
  const posts = await getPostsOwner(user.id);

  if (posts.length === 0) {
    return (
      <div className="mt-20 text-center text-gray-500">
        <p>No drafts found. Time to write something new!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group block border bg-white p-5 transition"
        >
          <div className="flex items-start gap-5">
            {/* Left Content */}
            <div className="flex-1">
              <Link href={`/post/update/${post.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {post.title || "Untitled Draft"}
                </h2>
              </Link>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>{timeAgo(post.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {post.user.image && (
                    <Image src={post.user.image} alt="" width={20} height={20} className="rounded-full" />
                  )}
                  <span className="font-medium uppercase text-xs tracking-wider">
                    {post.user.username}
                  </span>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-gray-600 text-sm leading-relaxed">
                {post.summary || "No summary provided for this draft."}
              </p>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <Link 
                  href={`/post/update/${post.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <FileEditIcon className="w-4 h-4" />
                  Edit
                </Link>
                <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700">
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Right Image */}
            {post.thumbnail && (
              <div className="relative h-24 w-24 sm:h-32 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg border">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100px, 200px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}