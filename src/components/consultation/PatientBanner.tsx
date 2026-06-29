"use client";

import React from "react";
import { Pill, Activity, Users } from "lucide-react";
import { PatientHeaderInfo } from "@src/types/consultation";

const mockPatient: PatientHeaderInfo = {
    id: "GIL-992-04",
    name: "ELIAS THORNE",
    dob: "12 May 1968",
    age: 56,
    gender: "Male",
    bloodType: "O Positive",
    lastVisit: "14 Oct 2023",
};

export default function PatientBanner() {
    const handleReferral = (dept: string) => {
        console.log(`Routing operational dynamic referral vector to: ${dept}`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* Patient Demographic Card */}
            <div className="lg:col-span-2 bg-white border border-gray-200 p-4 rounded-sm flex gap-4 items-center shadow-2xs">
                {/* Profile Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt={mockPatient.name}
                    className="w-16 h-16 rounded-md border border-gray-300 object-cover"
                />
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-xs">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">{mockPatient.name}</h2>
                            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm font-mono text-[9px] font-bold">
                                ID: {mockPatient.id}
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wide mt-0.5">Primary Subject Profile</p>
                    </div>
                    <div className="col-span-2 text-right self-start hidden sm:block">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Last Visit</span>
                        <span className="font-bold text-gray-800 text-xs">{mockPatient.lastVisit}</span>
                    </div>

                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">DOB / Age</span>
                        <span className="font-bold text-gray-800">{mockPatient.dob} ({mockPatient.age}Y)</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Gender</span>
                        <span className="font-bold text-gray-800">{mockPatient.gender}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Blood Type</span>
                        <span className="font-bold text-[#C62828] text-sm tracking-tight">{mockPatient.bloodType}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Actions Routing Grid panel */}
            <div className="lg:col-span-1 bg-[#2D3134] p-3 rounded-sm flex flex-col justify-between gap-2 shadow-2xs">
                <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 px-1">Emergency & Referral</span>
                <div className="space-y-1.5">
                    <button
                        onClick={() => handleReferral("Injection")}
                        className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold py-2 px-3 rounded-sm flex items-center justify-between transition-colors"
                    >
                        <span className="flex items-center gap-2"><Pill size={14} /> Refer to Injection</span>
                        <span>→</span>
                    </button>
                    <button
                        onClick={() => handleReferral("Dressing")}
                        className="w-full bg-transparent border border-gray-600 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-3 rounded-sm flex items-center justify-between transition-colors"
                    >
                        <span className="flex items-center gap-2"><Activity size={14} /> Refer to Dressing</span>
                        <span>→</span>
                    </button>
                    <button
                        onClick={() => handleReferral("Specialist")}
                        className="w-full bg-transparent border border-gray-600 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-3 rounded-sm flex items-center justify-between transition-colors"
                    >
                        <span className="flex items-center gap-2"><Users size={14} /> Specialist Referral</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}