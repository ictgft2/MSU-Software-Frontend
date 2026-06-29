"use client";

import { Siren, Users, Stethoscope, Microscope } from "lucide-react";

export default function StatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Active Emergency Card */}
            <div className="bg-white border-y border-r border-l-4 border-l-[#C62828] border-gray-200 p-4 shadow-sm flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold tracking-wider text-[#C62828] uppercase leading-tight">
                        Active<br />Emergency
                    </span>
                    <Siren size={18} className="text-[#C62828]" />
                </div>
                <div>
                    <span className="text-4xl font-extrabold text-[#C62828]">04</span>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Critically unstable cases</p>
                </div>
            </div>

            {/* Cold Cases Card */}
            <div className="bg-white border border-gray-200 p-4 shadow-sm flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase leading-tight">
                        Cold Cases
                    </span>
                    <Users size={18} className="text-gray-400" />
                </div>
                <div>
                    <span className="text-4xl font-extrabold text-gray-800">28</span>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Waiting in queue</p>
                </div>
            </div>

            {/* Doctors Available Card */}
            <div className="bg-white border border-gray-200 p-4 shadow-sm flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase leading-tight">
                        Doctors<br />Available
                    </span>
                    <Stethoscope size={18} className="text-gray-400" />
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-gray-800">12</span>
                        <span className="text-lg font-semibold text-gray-400">/18</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-medium">6 currently in surgery</p>
                </div>
            </div>

            {/* Pharma/Lab Hub Card */}
            <div className="bg-white border border-gray-200 p-4 shadow-sm flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase leading-tight">
                        Pharma/Lab<br />Hub
                    </span>
                    <Microscope size={18} className="text-gray-400" />
                </div>
                <div>
                    <span className="text-4xl font-extrabold text-gray-800">15</span>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Patients in processing</p>
                </div>
            </div>

        </div>
    );
}