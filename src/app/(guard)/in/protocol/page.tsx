"use client";

import RegistrationForm from "@src/components/protocol/RegistrationForm";
import RecentRecords from "@src/components/protocol/RecentRecords";
import WaitlistTerminal from "@src/components/protocol/WaitlistTerminal";

export default function ProtocolPage() {
    return (
        <div className="space-y-6">
            {/* Top Section contextual headers */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Protocol & Registration Desk</h1>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Unit 04: Central Medical Processing</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-3 py-1 rounded text-[11px] font-bold text-gray-700 shadow-3xs self-start sm:self-center">
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                    System Active: Terminal #7A
                </div>
            </div>

            {/* Core split structural grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Segment: Forms and history charts */}
                <div className="lg:col-span-2 space-y-6">
                    <RegistrationForm />
                    <RecentRecords />
                </div>

                {/* Right Segment: Live monitoring sidebar streams */}
                <div className="lg:col-span-1">
                    <WaitlistTerminal />
                </div>
            </div>
        </div>
    );
}