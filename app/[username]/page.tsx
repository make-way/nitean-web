import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, FileText, Award } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username },
        include: { _count: { select: { posts: true } } },
    });

    if (!user) notFound();

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Member since</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {format(new Date(user.createdAt), "MMMM yyyy")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Articles published</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {user._count.posts}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Level badge (if not Basic) */}
            {user.level !== "Basic" && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Award className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Account level</p>
                            <p className="text-lg font-semibold text-slate-900">{user.level}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick action */}
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                <p className="text-slate-600">
                    View all articles by{" "}
                    <Link
                        href={`/${username}/posts`}
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        {user.name}
                    </Link>
                </p>
            </div>
        </div>
    );
}
