'use client';

// components/CommentCard.tsx
import { ThumbsUp, Trash2, Edit2, X, Check } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { updateCommentAction, deleteCommentAction } from '@/server/actions/comment';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type CommentCardProps = {
  id: number;
  author: string;
  avatar?: string | null;
  timeAgo: string;
  content: string;
  likes: number;
  isOwner: boolean;
  isPostOwner: boolean;
};

const CommentCard: FC<CommentCardProps> = ({
  id,
  author,
  avatar,
  timeAgo,
  content,
  likes,
  isOwner,
  isPostOwner,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateCommentAction(id, editContent);
      if (result.success) {
        setIsEditing(false);
        router.refresh();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteCommentAction(id);
      if (result.success) {
        router.refresh();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete comment.');
    }
  };

  return (
    <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            alt={author}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-medium">{author}</p>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {timeAgo}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isOwner && !isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                  title="Edit comment"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              {(isOwner || isPostOwner) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your comment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 focus:ring-red-500 cursor-pointer"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 p-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-800"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(content);
                  }}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" /> Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-1 rounded bg-yellow-400 px-2 py-1 text-xs font-medium text-black hover:bg-yellow-500 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <Check className="h-3 w-3" /> {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mb-3 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{content}</p>
          )}

          {/* Like Button */}
          {/* <button
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>
              {likes} {likes === 1 ? 'Like' : 'Likes'}
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;