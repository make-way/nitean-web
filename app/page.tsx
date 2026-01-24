import Header from "@/components/Header";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { unstable_noStore as noStore } from "next/cache";
import PostCard from "@/components/PostCard";

export default async function Home() {
    noStore();
    const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });  

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-8">

        <div className="columns-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
