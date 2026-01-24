// components/CommentCard.tsx
import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

type CommentCardProps = {
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
};

const CommentCard: FC<CommentCardProps> = ({
  author,
  avatar,
  timeAgo,
  content,
  likes,
}) => {
  return (
    <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt={author}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="font-medium">{author}</p>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {timeAgo}
            </span>
          </div>

          <p className="mb-3 text-zinc-800 dark:text-zinc-200">{content}</p>

          {/* Like Button */}
          <button
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>
              {likes} {likes === 1 ? 'Like' : 'Likes'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;