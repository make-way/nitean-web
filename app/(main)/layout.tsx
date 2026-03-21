import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mobile-nav-padding min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-[1500px] mx-auto flex justify-center">
                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {children}

                {/* Right Sidebar */}
                <RightSidebar />
            </div>
        </div>
    );
}
