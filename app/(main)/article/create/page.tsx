import CreatePostForm from "./CreatePostForm";
import LeftSidebar from "@/components/layout/LeftSidebar";

export default function Page() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-[1600px] mx-auto flex justify-center">
                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Main Feed */}
                <main className="flex-1 max-w-[700px] min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                    <CreatePostForm />
                </main>
            </div>
        </div>
    );
}
