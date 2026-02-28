import Image from "next/image";
import Link from "next/link";
import { getAllMembers } from "@/server/services/member";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const membersData = await getAllMembers();

  const members = membersData.map((member, index) => ({
    displayId: index + 1,
    id: member.id,
    name: member.name,
    username: member.username,
    avatar: member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
    postsCount: member._count.posts,
    followersCount: 0, // Placeholder
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
                <div className="max-w-[1600px] mx-auto flex justify-center">
                    {/* Left Sidebar */}
                    <div className="hidden md:block">
                        <LeftSidebar />
                    </div>
    
                    {/* Main Feed */}
                    <main className="flex-1 max-w-[700px] min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl py-8">    

                        <div className="">
                          <div className="min-h-screen">
                            <div className="max-w-4xl mx-auto overflow-hidden bg-white dark:bg-zinc-900">

                              <div className="flex items-center gap-6 px-6 border-b border-gray-200 bg-gray-50/50 dark:bg-zinc-800/50 py-3">
                                <div className="w-8 shrink-0 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                  #
                                </div>
                                <div className="w-12 shrink-0">
                                </div>
                                <div className="flex-1 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                  Name
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest min-w-[70px] text-center">
                                  Posts
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest min-w-[70px] text-center">
                                  Followers
                                </div>
                              </div>

                              {members.length > 0 ? (
                                members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-6 p-6 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
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
                                    </Link>
                                    
                                    <div className="flex-1 flex items-start flex-col gap-2">
                                      <Link href={`/${member.username}`} className="text-base font-bold tracking-tight text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                          {member.name}
                                      </Link>

                                      <span className="text-sm text-gray-500 dark:text-zinc-500">
                                          @{member.username}
                                      </span>
                                  </div>

                                    <div className="min-w-[70px] flex items-center justify-center">
                                      <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                                          {member.postsCount}
                                      </span>
                                    </div>

                                    <div className="min-w-[70px] flex items-center justify-center">
                                      <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                                          {member.followersCount}
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
                          </div>

                        </div>
                    </main>
    
                    {/* Right Sidebar */}
                    <RightSidebar />
                </div>
            </div>
  );
}

