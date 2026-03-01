'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    Smile,
    Image as ImageIcon,
    ChevronDown,
    X,
    UserPlus,
    List,
    Search,
    History,
    Dog,
    Utensils,
    Trophy,
    Car,
    Lightbulb,
    Hash,
    Flag,
    Check,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import CATEGORIZED_EMOJIS from '@/lib/data/emojis.json';
import { createPostAction } from '@/server/actions/post';
import { useUploadThing } from '@/lib/uploadthing';

type EmojiData = Record<string, string[]>;
const emojis: EmojiData = CATEGORIZED_EMOJIS as EmojiData;

const CATEGORY_ICONS: Record<string, any> = {
    "Recent": History,
    "Smileys & People": Smile,
    "Animals & Nature": Dog,
    "Food & Drink": Utensils,
    "Activities": Trophy,
    "Travel & Places": Car,
    "Objects": Lightbulb,
    "Symbols": Hash,
    "Flags": Flag,
};

interface FeedComposerProps {
    replyToPostId?: string;
    placeholder?: string;
    onSuccess?: () => void;
}

export default function FeedComposer({ replyToPostId, placeholder, onSuccess }: FeedComposerProps) {
    const { data: session } = useSession();
    const [text, setText] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState("Smileys & People");
    const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
    const [hoveredEmoji, setHoveredEmoji] = useState<{ char: string; category: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const MAX_CHARS = 300;
    const MAX_IMAGES = 4;

    const { startUpload } = useUploadThing("feedMedia");

    // Auto-height logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    // Click outside handler for emoji picker
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredEmojis = useMemo(() => {
        if (!searchQuery) return null;
        const all = Object.values(emojis).flat();
        return all.filter(e => e.includes(searchQuery));
    }, [searchQuery]);

    if (!session) return null;

    const handleImageClick = () => {
        if (selectedImages.length >= MAX_IMAGES) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = MAX_IMAGES - selectedImages.length;
        const filesToProcess = files.slice(0, remainingSlots);

        setSelectedFiles(prev => [...prev, ...filesToProcess].slice(0, MAX_IMAGES));

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setSelectedImages(prev => [...prev, result].slice(0, MAX_IMAGES));
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onEmojiSelect = (emoji: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = text.substring(0, start) + emoji + text.substring(end);

        if (newText.length <= MAX_CHARS) {
            setText(newText);
            setRecentEmojis(prev => {
                const filtered = prev.filter(e => e !== emoji);
                return [emoji, ...filtered].slice(0, 30);
            });

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        }
    };

    const handlePost = async () => {
        if (!text.trim() && selectedFiles.length === 0) return;
        setIsPosting(true);

        try {
            let mediaData: { url: string; type: 'Image' | 'Video' | 'Audio' | 'File'; size: number }[] = [];

            if (selectedFiles.length > 0) {
                const uploadRes = await startUpload(selectedFiles);
                if (uploadRes) {
                    mediaData = uploadRes.map(file => ({
                        url: file.url,
                        type: file.type.startsWith('image') ? 'Image' : 'Video' as any,
                        size: file.size
                    }));
                }
            }

            const result = await createPostAction({
                content: text,
                replyToPostId,
                media: mediaData,
                visibility: 'PUBLIC'
            });

            if (result.success) {
                setText('');
                setSelectedImages([]);
                setSelectedFiles([]);
                onSuccess?.();
            } else {
                alert(result.error || 'Failed to post');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsPosting(false);
        }
    };

    const remainingChars = MAX_CHARS - text.length;

    return (
        <div className="bg-white dark:bg-black p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <Image
                        src={session.user.image || "/placeholder-user.jpg"}
                        alt={session.user.name || "User"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-sky-500 font-bold text-[14px] hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors">
                        Everyone
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={MAX_CHARS}
                        placeholder={placeholder || "What's on your mind right now?"}
                        className="w-full bg-transparent border-none resize-none text-[20px] font-medium placeholder:text-zinc-500 focus:ring-0 outline-none min-h-[50px] leading-tight overflow-hidden"
                        rows={1}
                        disabled={isPosting}
                    />

                    {selectedImages.length > 0 && (
                        <div className={`grid gap-2 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 ${selectedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {selectedImages.map((img, index) => (
                                <div key={index} className={`relative group ${selectedImages.length === 3 && index === 0 ? 'row-span-2' : ''}`}>
                                    <Image
                                        src={img}
                                        alt={`Selected ${index + 1}`}
                                        width={600}
                                        height={selectedImages.length === 1 ? 400 : 800}
                                        className="w-full h-full object-cover max-h-[500px]"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="bg-zinc-900/70 hover:bg-zinc-900/80 text-white p-1.5 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 relative">
                            <button
                                onClick={handleImageClick}
                                disabled={selectedImages.length >= MAX_IMAGES || isPosting}
                                className="p-2 rounded-full text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <ImageIcon className="w-[20px] h-[20px]" />
                            </button>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                disabled={isPosting}
                                className="p-2 rounded-full text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors cursor-pointer"
                            >
                                <Smile className="w-[20px] h-[20px]" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative w-9 h-9 flex items-center justify-center">
                                {text.length > 0 && (
                                    <span className={`absolute text-[10px] font-bold ${remainingChars <= 20 ? 'text-amber-500' : 'text-sky-500'}`}>
                                        {remainingChars}
                                    </span>
                                )}
                                <svg className="w-8 h-8 transform -rotate-90">
                                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-zinc-200 dark:text-zinc-800" />
                                    <circle
                                        cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent"
                                        strokeDasharray={87.96}
                                        strokeDashoffset={87.96 - (87.96 * Math.min(text.length, MAX_CHARS)) / MAX_CHARS}
                                        className={`${remainingChars <= 20 ? 'text-amber-500' : 'text-sky-500'} transition-all duration-300`}
                                    />
                                </svg>
                            </div>
                            <div className="w-[1px] h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                            <button
                                onClick={() => { setText(''); setSelectedImages([]); setSelectedFiles([]); }}
                                className="px-5 py-1.5 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isPosting || (!text.trim() && selectedImages.length === 0)}
                                onClick={handlePost}
                                className="px-5 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-full text-sm disabled:opacity-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                            >
                                {isPosting ? 'Posting...' : replyToPostId ? 'Reply' : 'Post'}
                            </button>
                        </div>
                    </div>

                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="mt-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 w-full">
                            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search emojis"
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-50 dark:border-zinc-900 overflow-x-auto no-scrollbar">
                                {Object.keys(CATEGORY_ICONS).map((cat) => {
                                    const Icon = CATEGORY_ICONS[cat];
                                    if (cat === "Recent" && recentEmojis.length === 0) return null;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                const element = document.getElementById(`emoji-cat-${cat}`);
                                                if (element && scrollContainerRef.current) {
                                                    scrollContainerRef.current.scrollTo({ top: element.offsetTop - 10, behavior: 'smooth' });
                                                }
                                            }}
                                            className={`p-2 rounded-md transition-all flex-shrink-0 ${activeCategory === cat ? 'text-sky-500 border-b-2 border-sky-500 rounded-none' : 'text-zinc-400 hover:text-zinc-600'}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    );
                                })}
                            </div>
                            <div ref={scrollContainerRef} className="h-[250px] overflow-y-auto p-3 scroll-smooth">
                                {searchQuery ? (
                                    <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                                        {filteredEmojis?.map((emoji, i) => (
                                            <button key={i} onClick={() => onEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center text-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">{emoji}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {recentEmojis.length > 0 && (
                                            <div id="emoji-cat-Recent" className="mb-4">
                                                <h3 className="text-xs font-bold text-zinc-500 mb-2 uppercase">Recently Used</h3>
                                                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                                                    {recentEmojis.map((emoji, i) => (
                                                        <button key={i} onClick={() => onEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center text-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">{emoji}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {Object.entries(emojis).map(([category, list]) => (
                                            <div key={category} id={`emoji-cat-${category}`} className="mb-4">
                                                <h3 className="text-xs font-bold text-zinc-500 mb-2 uppercase">{category}</h3>
                                                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                                                    {list.map((emoji, i) => (
                                                        <button key={i} onClick={() => onEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center text-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">{emoji}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800 text-3xl">
                                        {hoveredEmoji?.char || "👋"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] text-zinc-900 dark:text-zinc-100 font-bold">{hoveredEmoji ? "Emoji" : "Welcome"}</span>
                                        <span className="text-[13px] text-zinc-500 font-medium">{hoveredEmoji ? hoveredEmoji.category : "Choose an emoji"}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowEmojiPicker(false)} className="w-11 h-11 flex items-center justify-center bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600"><Check className="w-6 h-6" strokeWidth={3} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
        </div>
    );
}
