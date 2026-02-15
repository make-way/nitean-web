import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PostHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-start gap-6">
      <Link
        href="/"
        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
    </div>
  );
}
