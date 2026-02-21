// import Header from "@/components/Header";
// import PostCard from "@/components/PostCard";
// import { getCachedPosts } from "@/server/services/post";

// export default async function Home() {
//   const initialPosts = await getCachedPosts(10, 0);

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-black">
//       <Header />
//       <main className="mx-auto max-w-2xl px-3 py-8">
//         <div className="columns-1 gap-6 mb-6">
//           {initialPosts.map((post) => (
//             <PostCard key={post.id} post={post} />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

import { auth } from "@/lib/auth"; // Your better-auth instance
import { headers } from "next/headers";
import { getCachedPosts } from "@/server/services/post";
import prisma from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";

export default async function Page() {
    // 1. Get the session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.user?.id; // This is your currentUserId!

    // 2. Get the cached posts
    const posts = await getCachedPosts(10, 0);

    // 3. Map through posts to see if the current user liked them
    const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
        let isLiked = false;
        
        if (currentUserId) {
            const like = await prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId: currentUserId,
                        postId: post.id
                    }
                }
            });
            isLiked = !!like;
        }

        return { ...post, isLiked };
    }));

    return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto max-w-2xl px-3 py-8">
        <div className="columns-1 gap-6 mb-6">
          {postsWithLikeStatus.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
    );
}