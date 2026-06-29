"use client";

import React from "react";
import { FlaskConical, TrendingUp, TrendingDown } from "lucide-react";
import { LabRequestItem } from "@src/types/pharmacy";

interface LabRequestsProps {
    requests: LabRequestItem[];
    onLabAction: (id: string, status: LabRequestItem['status']) => Promise<void>;
}

export default function LabRequestsPanel({ requests, onLabAction }: LabRequestsProps) {
    return (
        <div className="space-y-4">
            {/* Upper Tracker Core panel */}
            <div className="bg-white border border-gray-200 rounded-sm shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                        <FlaskConical size={14} />
                        <span>Lab Requests</span>
                    </div>
                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-wider hover:text-[#C62828] transition-colors">
                        View All
                    </button>
                </div>

                {/* Dynamic Pipelines Stream Cards layout */}
                <div className="p-4 space-y-3">
                    {requests.map((lab) => (
                        <div key={lab.id} className="border border-gray-100 rounded-sm p-3 bg-white space-y-2 text-xs">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 tracking-tight">{lab.testName}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Patient: {lab.patientName}</p>
                                </div>

                                {/* Condition Contextual Badging system */}
                                <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-xs border ${lab.status === "PROCESSING" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                                        lab.status === "PENDING" ? "bg-gray-50 text-gray-500 border-gray-200" :
                                            "bg-green-50 text-green-700 border-green-200"
                                    }`}>
                                    • {lab.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <span className="text-[9px] font-mono text-gray-400 font-bold">ID: {lab.id}</span>

                                {/* Multi-state functional route buttons */}
                                {lab.status === "PROCESSING" && (
                                    <button
                                        onClick={() => onLabAction(lab.id, "COMPLETED")}
                                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[10px] px-2.5 py-1 rounded-xs tracking-wide"
                                    >
                                        Enter Results
                                    </button>
                                )}
                                {lab.status === "PENDING" && (
                                    <button
                                        onClick={() => onLabAction(lab.id, "PROCESSING")}
                                        className="bg-[#2D3134] hover:bg-black text-white font-bold text-[10px] px-3 py-1 rounded-xs tracking-wide uppercase"
                                    >
                                        Start Analysis
                                    </button>
                                )}
                                {lab.status === "COMPLETED" && (
                                    <span className="text-green-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer hover:underline">
                                        ↓ Result Ready
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lower Summary Analytics Panel */}
            <div className="bg-[#1A1C1E] text-white p-5 rounded-sm shadow-2xs space-y-5">
                <span className="text-[10px] font-black tracking-wider uppercase text-gray-500 block">Daily Summary</span>

                <div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-4xl font-black font-sans tracking-tight">142</span>
                        <span className="text-[11px] font-bold text-green-400 font-mono flex items-center gap-0.5">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">Prescriptions Filled</p>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-4xl font-black font-sans tracking-tight">38</span>
                        <span className="text-[11px] font-bold text-red-400 font-mono flex items-center gap-0.5">
                            <TrendingDown size={12} /> -5%
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">Lab Tests Run</p>
                </div>
            </div>
        </div>
    );
}