import CommentCard from "@/components/CommentCard";
import PostComment from "@/components/PostComment";

const sampleComments = [
  {
    id: 1,
    author: "PMP",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    timeAgo: "4 months ago",
    content: "Love the article you wrote",
    likes: 0,
  },
];

export default function PostComments() {
  return (
    <>
      <PostComment />

      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold">
          Comments ({sampleComments.length})
        </h2>

        {sampleComments.map((comment) => (
          <CommentCard key={comment.id} {...comment} />
        ))}
      </div>
    </>
  );
}
