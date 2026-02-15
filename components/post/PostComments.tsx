import CommentCard from "@/components/CommentCard";
import PostComment from "@/components/PostComment";
import { getCommentsByPostId } from "@/server/services/comment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatDistanceToNow } from "date-fns";

interface PostCommentsProps {
  postId: number;
  postUserId: string;
}

export default async function PostComments({ postId, postUserId }: PostCommentsProps) {
  const comments = await getCommentsByPostId(postId);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user;

  return (
    <div className="mt-12 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-8">
        Comments ({comments.length})
      </h2>

      {currentUser ? (
        <PostComment postId={postId} userImage={currentUser.image} />
      ) : (
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 text-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">Please log in to leave a comment.</p>
        </div>
      )}

      <div className="space-y-1.5 mt-10" id="comments">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard 
              key={comment.id}
              id={comment.id}
              author={comment.user.name || comment.user.username}
              avatar={comment.user.image}
              timeAgo={formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              content={comment.content}
              likes={0} // Likes not implemented in schema yet for comments
              isOwner={currentUser?.id === comment.userId}
              isPostOwner={currentUser?.id === postUserId}
            />
          ))
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 italic">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
