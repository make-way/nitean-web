'use client';

import { useState } from 'react';

const PostComment = () => {
  const [comment, setComment] = useState('');
  const maxLength = 300;
  return (
    <div className='border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, maxLength))}
        placeholder='Please write your comment here...'
        className='h-40 w-full resize-none bg-transparent text-lg outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400'
      />

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600' />
          <span className='text-zinc-500 dark:text-zinc-400'>
            {comment.length}/{maxLength}
          </span>
        </div>

        <button className='rounded-full cursor-pointer bg-yellow-400 px-6 py-2.5 font-medium text-black transition hover:bg-yellow-500'>Submit</button>
      </div>

      <p className='mt-4 text-sm text-zinc-500 dark:text-zinc-400'>Please note: Comments are moderated before posting.</p>
    </div>
  );
};

export default PostComment;
