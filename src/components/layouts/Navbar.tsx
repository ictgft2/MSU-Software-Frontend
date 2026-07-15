"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, HelpCircle, UserCircle } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    // Helper to determine active tab underlines
    const isTabActive = (path: string) => {
        if (path === "/in" && (pathname === "/" || pathname === "/in")) return true;
        return pathname === path;
    };

    return (
        <header className="w-full h-16 bg-[#F9F9F9] border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            {/* Brand Identity / Title */}
            <div className="flex items-center gap-8">
                <span className="text-[#9E2A2B] font-bold text-lg tracking-wide">
                    The Gilead Medical Portal
                </span>

                {/* Top Mini-Tabs */}
                <nav className="flex gap-6 h-16">
                    <Link
                        href="/in"
                        className={`relative flex items-center text-sm font-semibold transition-colors h-full px-1 ${isTabActive("/in") ? "text-[#9E2A2B]" : "text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        Dashboard
                        {isTabActive("/in") && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#9E2A2B]" />
                        )}
                    </Link>

                    <Link
                        href="/in/protocol"
                        className={`relative flex items-center text-sm font-semibold transition-colors h-full px-1 ${isTabActive("/protocol") ? "text-[#9E2A2B]" : "text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        Protocol
                        {isTabActive("/in/protocol") && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#9E2A2B]" />
                        )}
                    </Link>

                    <Link
                        href="/analytics"
                        className={`relative flex items-center text-sm font-semibold transition-colors h-full px-1 ${isTabActive("/analytics") ? "text-[#9E2A2B]" : "text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        Analytics
                        {isTabActive("/analytics") && (
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#9E2A2B]" />
                        )}
                    </Link>
                </nav>
            </div>

            {/* Search and Profile Controls */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative w-80">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search patient ID or clinical protocol..."
                        className="w-full pl-10 pr-4 py-2 bg-[#EFEFEF] text-sm text-gray-700 placeholder-gray-500 rounded-md border border-transparent focus:outline-none focus:bg-white focus:border-red-200 transition-all"
                    />
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4 text-gray-600">
                    <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors text-[#9E2A2B]">
                        <Bell size={21} />
                        {/* Optional Notification Dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
                    </button>

                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <HelpCircle size={21} />
                    </button>

                    <hr className="h-6 w-[1px] bg-gray-300" />

                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <UserCircle size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}