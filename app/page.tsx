

import Header from "@/components/Header";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Get Your Business Verified on Instagram",
    excerpt:
      "Learn how to get your business verified on Instagram with our step-by-step guide.",
    date: "13 Sept 2022",
    author: "Bill Roberts",
    role: "Founder",
    likes: 128,
    comments: 24,
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200",
  },
  {
    id: 2,
    title: "Recover Your Instagram Account",
    excerpt: "",
    date: "10 Oct 2024",
    author: "Sarah Kim",
    role: "Marketing Lead",
    likes: 96,
    comments: 18,
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800",
  },
  {
    id: 3,
    title: "Inactive Instagram Username",
    excerpt:
      "Expert tips for securing your ideal handle.",
    date: "15 Sept 2022",
    author: "John Miller",
    role: "Growth Manager",
    likes: 210,
    comments: 42,
    image:
      "https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=800",
  },
  {
    id: 4,
    title: "What Is an Instagram Handle?",
    excerpt: "",
    date: "12 Jun 2022",
    author: "Emily Stone",
    role: "Content Strategist",
    likes: 74,
    comments: 9,
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800",
  },
  {
    id: 5,
    title: "10 Instagram Growth Hacks",
    excerpt:
      "These proven growth hacks will help you reach more people organically and increase engagement fast.",
    date: "01 Jan 2024",
    author: "Alex Johnson",
    role: "Social Media Expert",
    likes: 302,
    comments: 67,
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800",
  },
  {
    id: 6,
    title: "Why Consistency Matters",
    excerpt: "",
    date: "18 Feb 2024",
    author: "Linda Perez",
    role: "Brand Manager",
    likes: 88,
    comments: 14,
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800",
  },
  {
    id: 7,
    title: "Instagram Algorithm 2024",
    excerpt:
      "Understand how Instagram ranks your content today.",
    date: "03 Mar 2024",
    author: "David Chen",
    role: "Product Analyst",
    likes: 175,
    comments: 31,
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=800",
  },
  {
    id: 8,
    title: "Reels vs Posts",
    excerpt: "",
    date: "22 Mar 2024",
    author: "Jessica Brown",
    role: "Video Strategist",
    likes: 134,
    comments: 22,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
  },
  {
    id: 9,
    title: "Captions That Convert",
    excerpt:
      "Write captions that drive clicks and sales.",
    date: "10 Apr 2024",
    author: "Michael Scott",
    role: "Copywriter",
    likes: 201,
    comments: 45,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
  },
  {
    id: 10,
    title: "Instagram Analytics",
    excerpt: "",
    date: "21 Apr 2024",
    author: "Anna Lee",
    role: "Data Specialist",
    likes: 66,
    comments: 11,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
  },
  {
    id: 11,
    title: "Posting Frequency on Instagram",
    excerpt:
      "We break down posting frequency backed by real data.",
    date: "01 May 2024",
    author: "Chris Walker",
    role: "Community Manager",
    likes: 119,
    comments: 19,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
  },
  {
    id: 12,
    title: "Instagram Scheduling Tools",
    excerpt: "",
    date: "12 May 2024",
    author: "Olivia Martin",
    role: "Automation Expert",
    likes: 158,
    comments: 27,
    image:
      "https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-18 sm:py-24">
        {/* Pinterest layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="mb-6 break-inside-avoid rounded-2xl 
                         bg-white border border-zinc-200
                         hover:shadow-sm transition
                         dark:bg-zinc-900 dark:border-zinc-800"
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-zinc-500">{post.date}</span>

                <h3 className="mt-1 text-base font-semibold">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                )}

                {/* Author */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="text-xs">
                    <p className="font-medium">{post.author}</p>
                    <p className="text-zinc-500">{post.role}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2
                              border-t border-zinc-100 dark:border-zinc-800
                              bg-zinc-50 dark:bg-zinc-950 rounded-b-2xl">
                <div className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-500 cursor-pointer">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </div>

                <div className="flex items-center gap-1 text-xs text-zinc-600 hover:text-blue-500 cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
