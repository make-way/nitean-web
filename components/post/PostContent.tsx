import Image from "next/image";
import TiptapViewer from "@/components/rich-text-editor/TiptapViewer";

export default function PostContent({ post }: any) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-120 object-cover"
        />
      )}
      <TiptapViewer content={post.content} />
    </article>
  );
}
