import Image from "next/image";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { timeAgo } from "@/utils/TimeAgo";

export default function PostAuthor({ user, createdAt }: any) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-4">
        <Link href={`/${user.username}`} className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image src={user.image || ""} alt={user.name} fill className="object-cover" />
        </Link>

        <div>
          <Link href={`/${user.username}`} className="font-medium text-lg uppercase hover:text-blue-500">
            {user.name}
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Student • {timeAgo(createdAt)}
          </p>
        </div>
      </div>

      <button className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        Follow
      </button>
    </div>
  );
}
