"use client";

import { RefreshCw, Download } from "lucide-react";

export default function DashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Facility Command Overview</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Real-time status tracking for Medical Unit Head • Last updated: <span className="font-medium">14:22:08</span>
                </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm">
                    <RefreshCw size={14} />
                    <span>Sync Grid</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2B2B2B] text-white rounded hover:bg-black font-medium transition-colors shadow-sm">
                    <Download size={14} />
                    <span>Export Log</span>
                </button>
            </div>
        </div>
    );
}