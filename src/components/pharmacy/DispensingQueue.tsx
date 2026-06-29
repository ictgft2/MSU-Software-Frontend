"use client";

import React from "react";
import { ClipboardCheck } from "lucide-react";
import { DispenseQueueItem } from "@src/types/pharmacy";

interface DispensingQueueProps {
    queue: DispenseQueueItem[];
    onAction: (id: string, isUrgent: boolean) => Promise<void>;
}

export default function DispensingQueue({ queue, onAction }: DispensingQueueProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-2xs overflow-hidden">
            {/* Container Title Header */}
            <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-[#C62828]" />
                    <h2 className="text-sm font-bold text-gray-800">Dispensing Queue</h2>
                </div>
                <span className="bg-[#C62828] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">
                    {queue.length} PENDING
                </span>
            </div>

            {/* Grid Columns Titles */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-[#FAFAFA] border-b border-gray-200 text-gray-400 font-bold text-[9px] uppercase tracking-wider">
                            <th className="p-3 pl-6 w-1/3">Patient Information</th>
                            <th className="p-3 w-5/12">Prescription Details</th>
                            <th className="p-3 pr-6 text-right w-1/4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {queue.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                                {/* Patient Information Column */}
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-2">
                                        {item.isUrgentStat && <span className="text-[#C62828] font-bold text-sm">✦</span>}
                                        <div>
                                            <div className="font-bold text-gray-900">{item.patientName}</div>
                                            <div className="text-[10px] text-gray-400 font-mono font-semibold">{item.patientId}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Prescription Details Column */}
                                <td className="p-4">
                                    <div className="font-bold text-gray-800 tracking-tight">{item.medicationName}</div>
                                    <div className={`text-[10px] font-bold mt-0.5 ${item.isUrgentStat ? "text-[#C62828] tracking-wider animate-pulse" : "text-gray-400"}`}>
                                        {item.dosageDetails}
                                    </div>
                                </td>

                                {/* Dispatch Trigger Operations */}
                                <td className="p-4 pr-6 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onAction(item.id, item.isUrgentStat)}
                                        className={`text-[10px] font-bold px-4 py-2 rounded-sm uppercase tracking-wide transition-colors shadow-2xs ${item.isUrgentStat
                                                ? "bg-[#B71C1C] hover:bg-[#991B1B] text-white font-extrabold"
                                                : "bg-[#2D3134] hover:bg-black text-white"
                                            }`}
                                    >
                                        {item.isUrgentStat ? "Urgent Dispense" : "Dispense & Verify"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}