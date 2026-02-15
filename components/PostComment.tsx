'use client';

import { useState } from 'react';
import { createCommentAction } from '@/server/actions/comment';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Assuming sonner is used for toasts, or I can use alert

import Image from 'next/image';

interface PostCommentProps {
  postId: number;
  userImage?: string | null;
}

const PostComment = ({ postId, userImage }: PostCommentProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const maxLength = 300;

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createCommentAction(postId, comment);
      if (result.success) {
        setComment('');
        router.refresh(); // Refresh to show new comment
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='border border-zinc-200 p-6 dark:border-zinc-800 dark:bg-zinc-900'>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, maxLength))}
        placeholder='Please write your comment here...'
        className='h-40 w-full resize-none bg-transparent text-lg outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400'
        disabled={isSubmitting}
      />

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {userImage ? (
            <div className='relative h-8 w-8 overflow-hidden rounded-full'>
              <Image src={userImage} alt="User" fill className="object-cover" />
            </div>
          ) : (
            <div className='h-8 w-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600' />
          )}
          <span className='text-zinc-500 dark:text-zinc-400'>
            {comment.length}/{maxLength}
          </span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          className='rounded-full cursor-pointer bg-yellow-400 px-6 py-2.5 font-medium text-black transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      <p className='mt-4 text-sm text-zinc-500 dark:text-zinc-400'>Please note: Comments are moderated before posting.</p>
    </div>
  );
};

export default PostComment;
