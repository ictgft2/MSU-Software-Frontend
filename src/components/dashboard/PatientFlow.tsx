"use client";

const data = [
    { id: "GL-88219", name: "J. Henderson", type: "EMERGENCY", status: "Waiting for Vitals", statusColor: "bg-[#C62828]", time: "00:42:15", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60" },
    { id: "GL-90332", name: "S. Richardson", type: "COLD", status: "In Consultation", statusColor: "bg-gray-400", time: "02:18:44", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60" },
    { id: "GL-77120", name: "M. Aris", type: "COLD", status: "In Ward", statusColor: "bg-gray-400", time: "08:05:22", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60" },
    { id: "GL-11204", name: "L. Thompson", type: "EMERGENCY", status: "Stabilizing", statusColor: "bg-[#C62828]", time: "00:12:31", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60" }
];

export default function PatientFlow() {
    return (
        <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col h-full">
            {/* Header Banner */}
            <div className="bg-[#2D3134] text-white p-3 px-4 flex justify-between items-center rounded-t">
                <span className="text-sm font-semibold tracking-wide">Live Patient Flow</span>
                <span className="bg-[#C62828] text-[9px] font-extrabold tracking-widest px-1.5 py-0.5 rounded animate-pulse">LIVE FEED</span>
            </div>

            {/* Grid Content */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-[#EFEFEF] border-b border-gray-200 text-gray-600 font-bold tracking-wider uppercase text-[10px]">
                            <th className="p-3 pl-4">Patient ID</th>
                            <th className="p-3">Case Type</th>
                            <th className="p-3">Current Status</th>
                            <th className="p-3 pr-4">Time In System</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                                {/* ID & Name Block */}
                                <td className="p-3 pl-4 flex items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={row.img} alt="" className="w-8 h-8 rounded-md object-cover border border-gray-300" />
                                    <div>
                                        <div className="font-bold text-gray-900 tracking-tight">{row.id}</div>
                                        <div className="text-[10px] text-gray-500 font-medium">{row.name}</div>
                                    </div>
                                </td>

                                {/* Badge Trigger Type */}
                                <td className="p-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide border ${row.type === "EMERGENCY"
                                            ? "bg-red-50 border-red-200 text-[#C62828]"
                                            : "bg-gray-50 border-gray-200 text-gray-500"
                                        }`}>
                                        {row.type === "EMERGENCY" ? "✦ EMERGENCY" : "☤ COLD"}
                                    </span>
                                </td>

                                {/* Status indicator badge */}
                                <td className="p-3 text-gray-700 font-medium">
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${row.statusColor}`} />
                                        {row.status}
                                    </span>
                                </td>

                                {/* Timer text */}
                                <td className="p-3 pr-4 font-mono font-bold text-gray-700">
                                    {row.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Pagination Control Footer */}
            <div className="bg-[#FAFAFA] border-t border-gray-200 p-3 px-4 flex justify-between items-center text-[11px] text-gray-500 font-medium rounded-b">
                <span>Showing 4 of 32 active flows</span>
                <div className="flex gap-1">
                    <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400">‹</button>
                    <button className="w-6 h-6 rounded flex items-center justify-center bg-[#2B2B2B] text-white font-bold">1</button>
                    <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700">2</button>
                    <button className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400">›</button>
                </div>
            </div>
        </div>
    );
}