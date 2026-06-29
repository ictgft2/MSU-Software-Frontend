"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    UserRound,
    Stethoscope,
    ShieldCheck,
    Siren,
    Settings,
    LogOut,
    PlusSquare,
    Pill
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/in", icon: LayoutDashboard },
    { name: "Protocol", href: "/in/protocol", icon: FileText },
    { name: "Nurses", href: "/in/nurses", icon: UserRound },
    { name: "Doctors", href: "/in/doctors", icon: Stethoscope },
    { name: "Pharmacy", href: "/in/pharmacy", icon: Pill },
    { name: "Admin", href: "/in/admin", icon: ShieldCheck },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 h-full bg-gray-50 flex flex-col justify-between p-4 select-none">
            {/* Top Brand Area */}
            <div>
                <div className="flex items-center gap-3 px-2 py-4 mb-6">
                    <div className="bg-[#D32F2F] p-2 rounded-md flex items-center justify-center">
                        <PlusSquare size={24} className="fill-white stroke-[#D32F2F]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none tracking-wide">The Gilead</h1>
                        <p className="text-xs text-gray-300 mt-1 font-medium">Medical Unit Portal</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // Fallback match for root path styling
                        const isActive = pathname === item.href || (item.href === "/in" && pathname === "/");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${isActive
                                    ? "bg-[#D32F2F] text-white"
                                    : "text-gray-600 hover:bg-[#D32F2F]/70 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-white" : "text-gray-600"} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions Area */}
            <div className="space-y-3">
                {/* Emergency Entry Button */}
                <button className="w-full hover:bg-[#991B1B] font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 shadow-md transition-colors border border-red-700">
                    <Siren size={20} className="animate-pulse" />
                    <span>Emergency Entry</span>
                </button>

                <hr className="border-gray-600" />

                {/* Settings & Logout */}
                <div className="space-y-1">
                    <Link
                        href="/in/settings"
                        className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-[15px] font-medium hover:bg-[#666666] hover:text-white transition-colors"
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={() => console.log("Logging out...")}
                        className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-[15px] font-medium hover:bg-red-900/20 hover:text-red-400 transition-colors text-left"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}