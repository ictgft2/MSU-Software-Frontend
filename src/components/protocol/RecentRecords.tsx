"use client";

import { FileSpreadsheet, ArrowUpRight, FileText } from "lucide-react";

const records = [
    { id: "#GLD-8821", name: "Marcus Vane", date: "02 Oct 2023", status: "DISCHARGED" },
    { id: "#GLD-9012", name: "Elena Rodriguez", date: "15 Jan 2024", status: "ONGOING" },
    { id: "#GLD-4451", name: "Sarah Jenkins", date: "20 Dec 2023", status: "DISCHARGED" }
];

export default function RecentRecords() {
    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            {/* Table Header Section bar */}
            <div className="bg-[#2D3134] text-white p-3.5 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <FileSpreadsheet size={16} />
                    <span>Recent Patient Records</span>
                </div>
                <button className="text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                    View All Archive <ArrowUpRight size={12} />
                </button>
            </div>

            {/* Table Grid core list layout */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-[#1A1C1E] text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                            <th className="p-3 pl-4">Patient ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Last Visit</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                                <td className="p-3 pl-4 font-mono text-gray-500 font-semibold">{item.id}</td>
                                <td className="p-3 font-bold text-gray-800">{item.name}</td>
                                <td className="p-3 text-gray-600 font-medium whitespace-pre-line leading-tight">
                                    {item.date}
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-extrabold tracking-wide ${item.status === "DISCHARGED"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 pr-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors inline-flex items-center">
                                        <FileText size={15} />
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