"use client";

import DashboardHeader from "@src/components/dashboard/Header";
import StatCards from "@src/components/dashboard/StatCards";
import PatientFlow from "@src/components/dashboard/PatientFlow";
import AlertsPanel from "@src/components/dashboard/AlertsPanel";

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-full justify-between space-y-6">
            <div>
                {/* Header Title Section */}
                <DashboardHeader />

                {/* Global Four metrics layout */}
                <StatCards />

                {/* Inner layout split grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Main tracking element table */}
                    <div className="lg:col-span-2">
                        <PatientFlow />
                    </div>

                    {/* Contextual warning side panels */}
                    <div className="lg:col-span-1">
                        <AlertsPanel />
                    </div>
                </div>
            </div>

            {/* Status Footer Metrics Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-500 font-mono pt-4 border-t border-gray-200 gap-2">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                        System Latency: 4ms
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                        Biometric Sync: Active
                    </span>
                </div>
                <span className="text-gray-400 select-none">
                    GILEAD_PORTAL_SECURE_V4.2.0 // UNIT_CMD_ALPHA_0
                </span>
            </div>
        </div>
    );
}