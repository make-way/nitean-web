'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Smile, 
  Mic, 
  SendHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

export default function FeedComposer() {
  const { data: session } = useSession();
  const [text, setText] = useState('');

  if (!session) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="flex gap-4">
        {/* Input Area */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                <ImageIcon className="w-3.5 h-3.5 text-white" />
             </div>
             <span className="text-zinc-500 font-bold text-sm">What&apos;s on your mind right now?</span>
          </div>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-transparent border-none resize-none text-[17px] font-medium placeholder:text-zinc-300 focus:ring-0 outline-none min-h-[60px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
            <button className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <Smile className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <Mic className="w-5 h-5" />
            </button>
            <Link href="/post/create" className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <ImageIcon className="w-5 h-5" />
            </Link>
        </div>
        
        <button 
            disabled={!text.trim()}
            className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
            <span>Post</span>
            <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
