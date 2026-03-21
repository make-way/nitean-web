import Image from 'next/image';
import {
    MapPin,
    MoreHorizontal,
    ArrowUpRight,
    Facebook,
    Github,
    Linkedin,
    Youtube,
    Send,
    Music2
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { LoginButtons } from '@/components/auth/LoginButtons';
import Link from 'next/link';
import TranslatedText from "@/components/i18n/TranslatedText";
import { updateLastSeen } from '@/server/services/member';

export default async function RightSidebar() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return (
        <aside className="sticky top-0 h-screen w-96 p-6 hidden lg:flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-zinc-300 dark:border-zinc-800 shadow-sm text-center flex flex-col items-center gap-6">
                <Image src='/logo.svg' alt='Logo' width={64} height={64} />
                <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2"><TranslatedText translationKey="menu.sign_in_to_see_more" /></h3>
                    <p className="text-sm text-zinc-500 leading-relaxed px-4">
                        <TranslatedText translationKey="menu.join_the_community_to_discover_amazing_content_and_connect_with_people" />
                    </p>
                </div>

                <LoginButtons />
            </div>
        </aside>
    );

    // Update last seen
    if (session.user.id) {
        await updateLastSeen(session.user.id);
    }

    // Fetch article count directly from DB
    const postCount = await prisma.post.count({
        where: { userId: session.user.id }
    });

    const heartCount = await prisma.postLike.count({
        where: {
            post: {
                userId: session.user.id, // hearts given to posts that belong to me
            },
        },
    });

    return (
        <aside className="sticky top-0 h-screen w-96 p-6 hidden lg:flex flex-col gap-6 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-300 dark:border-zinc-800 shadow-sm">
                {/* Profile Header */}
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Image
                            src={session.user.image || '/avatar.png'}
                            alt={session.user.name}
                            width={100}
                            height={100}
                            loading="lazy"
                            className="w-25 h-25 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl"
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-800 rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">{session.user.name}</h2>
                    <p className="text-zinc-400 font-medium mb-1">@{session.user.username}</p>
                    {/* keep location for future */}
                    {/* <div className="flex items-center gap-1 text-zinc-400 text-sm">
                <MapPin className="w-3 h-3" />
                <span>Phnom Penh, Cambodia</span>
            </div> */}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between px-8 py-6 border-y border-zinc-50 dark:border-zinc-800">
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-zinc-900 dark:text-white">{postCount}</p>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-0.5"><TranslatedText translationKey="label.posts" /></p>
                    </div>
                    <div className="w-px h-10 bg-zinc-100 dark:bg-zinc-800 mx-1" />
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-zinc-900 dark:text-white">{heartCount}</p>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-0.5"><TranslatedText translationKey="label.hearts" /></p>
                    </div>
                </div>

                {/* About Me */}
                <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-zinc-900 dark:text-white"><TranslatedText translationKey="menu.about_me" /></h3>
                        {/* <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button> */}
                    </div>
                    {session.user.bio ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {session.user.bio}
                        </p>
                    ) : (
                        <div className="flex">
                            <Link href="/profile/settings" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-center text-sm font-bold hover:text-zinc-600 transition-colors w-full">
                                <TranslatedText translationKey='buttons.setup_your_profile' />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Story Highlights / Social Media */}
                {([
                    { name: 'Facebook', link: session.user.facebook_link, icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-500' },
                    { name: 'Github', link: session.user.github_link, icon: <Github className="w-5 h-5" />, color: 'bg-zinc-800' },
                    { name: 'Linkedin', link: session.user.linkedin_link, icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-600' },
                    { name: 'Youtube', link: session.user.youtube_link, icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
                    { name: 'Telegram', link: session.user.telegram_link, icon: <Send className="w-5 h-5" />, color: 'bg-sky-500' },
                    { name: 'TikTok', link: session.user.tiktok_link, icon: <Music2 className="w-5 h-5" />, color: 'bg-zinc-900' },
                ].filter(s => s.link).length > 0) && (
                        <div className="px-8 pb-4">
                            <h3 className="font-black text-zinc-900 dark:text-white mb-4"><TranslatedText translationKey="menu.my_social_media" /></h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {[
                                    { name: 'Facebook', link: session.user.facebook_link, icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-500' },
                                    { name: 'Github', link: session.user.github_link, icon: <Github className="w-5 h-5" />, color: 'bg-zinc-800' },
                                    { name: 'Linkedin', link: session.user.linkedin_link, icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-600' },
                                    { name: 'Youtube', link: session.user.youtube_link, icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
                                    { name: 'Telegram', link: session.user.telegram_link, icon: <Send className="w-5 h-5" />, color: 'bg-sky-500' },
                                    { name: 'TikTok', link: session.user.tiktok_link, icon: <Music2 className="w-5 h-5" />, color: 'bg-zinc-900' },
                                ].filter(s => s.link).map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.link!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-2 flex-shrink-0 transition-opacity hover:opacity-80"
                                    >
                                        <div className="w-14 h-14 rounded-full border-2 border-zinc-300 dark:border-zinc-800 p-1 flex items-center justify-center">
                                            <div className={`w-full h-full rounded-full flex items-center justify-center text-white ${social.color} shadow-lg`}>
                                                {social.icon}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </aside>
    );
}

function ContactItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-black text-zinc-900 dark:text-white truncate">{value}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 transition-all" />
        </div>
    )
}
