import Link from "next/link";
import React, { ReactNode } from "react";

interface MenuItemProps {
    icon: ReactNode;
    label: string;
    url: string;
    badge?: string;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, url, badge, onClick }) => {
    return (
        <Link href={url} className="flex w-full items-center justify-between px-4 py-2 text-left text-white-700 hover:bg-zinc-800 cursor-pointer">
            <div className="flex items-center gap-3">
                <span className="text-zinc-500">{icon}</span>
                <span>{label}</span>
            </div>

            {badge && (
                <span className="rounded-full bg-blue-400 px-2 py-0.5 text-xs font-semibold text-black">
                {badge}
                </span>
            )}
        </Link>
    );
};

export default MenuItem;
