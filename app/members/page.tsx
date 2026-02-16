import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

interface Member {
  id: number;
  name: string;
  avatar: string;
  score: number;
}

const fakeMembers: Member[] = [
  {
    id: 1,
    name: "SAROEUN KHAV",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saroeun",
    score: 1,
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    score: 5,
  },
  {
    id: 3,
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    score: 3,
  },
  {
    id: 4,
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    score: 12,
  },
  {
    id: 5,
    name: "Maria Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    score: 8,
  },
  {
    id: 6,
    name: "SAROEUN KHAV",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saroeun",
    score: 1,
  },
  {
    id: 7,
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    score: 5,
  },
  {
    id: 8,
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    score: 3,
  },
  {
    id: 9,
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    score: 12,
  },
  {
    id: 10,
    name: "Maria Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    score: 8,
  },
];

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
    <Header />
      <div className="max-w-3xl mx-auto border border-gray-200 overflow-hidden my-12 bg-white dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center gap-10 px-5 py-4 border-b border-gray-200 bg-gray-50/50 dark:bg-zinc-800/50">
          <div className="w-10 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest">
            #
          </div>
          <div className="w-14 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest">
            
          </div>
          <div className="flex-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Name
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest min-w-[80px] text-right">
            Followers
          </div>
        </div>
        {fakeMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-10 p-5 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="text-xl font-medium text-gray-900 dark:text-zinc-100 w-10 shrink-0">
              {member.id}
            </div>
            
            <Link href={`/profile/${member.name}`} className="relative w-14 h-14 shrink-0">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                className="rounded-full object-cover shadow-sm bg-gray-100 dark:bg-zinc-800"
              />
            </Link>
            
            <div className="flex-1">
              <Link href={`/profile/${member.name}`} className="text-lg font-semibold tracking-tight text-gray-900 dark:text-zinc-100">
                {member.name}
              </Link>
            </div>
            
            <div className="text-lg font-bold text-gray-900 dark:text-zinc-100 min-w-[80px] text-right">
              {member.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
