import Image from "next/image";
import Link from "next/link";
import { getAllMembers, getOnlineMembers } from "@/server/services/member";
import TranslatedText from "@/components/i18n/TranslatedText";
import { timeAgo } from "@/utils/TimeAgo";

export const dynamic = "force-dynamic";

export default async function MembersPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>;
}) {
    const { type = "all" } = await searchParams;
    const membersData = type === "online" ? await getOnlineMembers() : await getAllMembers();

    const members = (membersData as any[]).map((member, index) => ({
        displayId: index + 1,
        id: member.id,
        name: member.name,
        username: member.username,
        avatar: member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
        postsCount: member._count?.posts || 0,
        isOnline: member.lastSeen ? (Date.now() - new Date(member.lastSeen).getTime() < 5 * 60 * 1000) : false,
        lastSeen: member.lastSeen,
    }));

    return (
        <main className="flex-1 max-w-175 min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
            {/* Tabs */}
            <div className="flex bg-white dark:bg-black gap-12 px-3 sm:px-6 py-6 border-b border-zinc-100 dark:border-zinc-800  sticky md:top-0 top-15 z-60">
                <Link
                    href="/members?type=all"
                    className={`text-[17px] font-black pb-4 -mb-5 transition-colors ${type === "all"
                        ? "text-zinc-900 dark:text-white border-b-4 border-indigo-600"
                        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        }`}
                >
                    <TranslatedText translationKey="label.members" />
                </Link>
                <Link
                    href="/members?type=online"
                    className={`text-[17px] font-black pb-4 -mb-5 transition-colors ${type === "online"
                        ? "text-zinc-900 dark:text-white border-b-4 border-indigo-600"
                        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        }`}
                >
                    <TranslatedText translationKey="label.users_online" />
                </Link>
            </div>

            <div>
                <div className="max-w-4xl mx-auto bg-white dark:bg-black">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-6 p-3 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
                            >
                                <div className="text-lg font-semibold text-gray-400 dark:text-zinc-500 w-8 shrink-0">
                                    {member.displayId}
                                </div>

                                <Link href={`/${member.username}`} className="relative w-12 h-12 shrink-0 group-hover:scale-105 transition-transform duration-200">
                                    <Image
                                        src={member.avatar}
                                        alt={member.name}
                                        fill
                                        className="rounded-full object-cover shadow-sm bg-gray-100 dark:bg-zinc-800 border-2 border-transparent group-hover:border-blue-500"
                                    />
                                    {member.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-black rounded-full shadow-sm"></div>
                                    )}
                                </Link>

                                <div className="flex-1 flex items-start flex-col gap-2">
                                    <Link href={`/${member.username}`} className="text-base font-bold tracking-tight text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {member.name}
                                    </Link>

                                    <span className="text-sm text-gray-500 dark:text-zinc-500">
                                        @{member.username}
                                    </span>
                                    {!member.isOnline && member.lastSeen && (
                                        <span className="text-xs text-blue-500/60 dark:text-blue-400/60 font-medium">
                                            <TranslatedText translationKey="label.last_seen" /> {timeAgo(member.lastSeen)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                                        {member.postsCount}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-zinc-400 text-lg">No members found yet.</p>
                        </div>
                    )}
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 py-12 flex items-center justify-center">
                    End Feed
                </div>
            </div>
        </main>
    );
}

