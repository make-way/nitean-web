import TiptapViewer from "@/components/rich-text-editor/TiptapViewer";

export default function PostContent({ post }: any) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none pb-8">
      <TiptapViewer content={post.content} />
    </article>
  );
}
