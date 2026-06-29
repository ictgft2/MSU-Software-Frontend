"use client";

import React, { useState } from "react";
import { Activity, Hourglass, ShieldAlert } from "lucide-react";
import { QueueItem, ConsultationItem } from "@src/types/protocol";

const initialVitalsQueue: QueueItem[] = [
    { id: "Q-1", name: "Cassian Thorne", estimatedWaitMinutes: 12, isStatPriority: false },
    { id: "Q-2", name: "Lydia Moore", estimatedWaitMinutes: 18, isStatPriority: false },
    { id: "Q-3", name: "Arthur Dent", estimatedWaitMinutes: 0, isStatPriority: true },
];

const doctorConsultations: ConsultationItem[] = [
    { id: "C-1", name: "Rebecca White", assignedDoctor: "Dr. Aris" },
    { id: "C-2", name: "Tom Chandler", assignedDoctor: "Dr. Aris" },
    { id: "C-3", name: "Mina Harker", assignedDoctor: "Dr. Van Helsing" },
];

export default function WaitlistTerminal() {
    const [queue, setQueue] = useState<QueueItem[]>(initialVitalsQueue);

    // Strongly typed action processing pipeline
    const handleAdmitPatient = async (id: string, name: string) => {
        try {
            console.log(`Processing intake admittance vector for target: ${name} (${id})`);

            // Simulate patch mutation network layer
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Filter admitted patient out of client state view
            setQueue((prevQueue) => prevQueue.filter((item) => item.id !== id));
            alert(`Patient ${name} successfully dispatched to vital profiling.`);
        } catch (err) {
            console.error("Admittance vector fault:", err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Waitlist Terminal</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Live Unit Status</p>
                    </div>
                    <span className="bg-[#B71C1C] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">
                        {queue.length + doctorConsultations.length} ACTIVE
                    </span>
                </div>

                <div className="p-4 space-y-5">
                    {/* Subsection: Nurse Vitals */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <Activity size={12} />
                            <span>Nurse Vitals Queue ({queue.length})</span>
                        </div>

                        {queue.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white border p-2.5 rounded-sm flex justify-between items-center shadow-2xs ${item.isStatPriority ? "border-y border-r border-l-4 border-l-[#C62828]" : "border-gray-200"
                                    }`}
                            >
                                <div>
                                    <h4 className={`text-xs font-bold ${item.isStatPriority ? "text-[#C62828]" : "text-gray-900"}`}>
                                        {item.isStatPriority && "⚠️ "}{item.name}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                        {item.isStatPriority ? "STAT Priority" : `Est. Wait: ${item.estimatedWaitMinutes} min`}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAdmitPatient(item.id, item.name)}
                                    className={`rounded-sm tracking-wide uppercase transition-colors text-[10px] font-bold ${item.isStatPriority
                                            ? "bg-[#B71C1C] hover:bg-[#991B1B] text-white px-2.5 py-1.5 font-extrabold tracking-wider"
                                            : "bg-[#5A5A5A] hover:bg-black text-white px-2.5 py-1"
                                        }`}
                                >
                                    {item.isStatPriority ? "Urgent Admit" : "Admit"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Subsection: Doctor Consultation */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <Hourglass size={11} />
                            <span>Doctor Consultation ({doctorConsultations.length})</span>
                        </div>

                        {doctorConsultations.map((item) => (
                            <div key={item.id} className="bg-[#F5F6F7] border border-gray-200 p-2.5 rounded-sm flex justify-between items-center">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-700">{item.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Awaiting {item.assignedDoctor}</p>
                                </div>
                                <Hourglass size={14} className="text-gray-400 stroke-[1.5]" />
                            </div>
                        ))}
                    </div>

                    {/* Desk Efficiency Section */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            <span>Desk Efficiency</span>
                            <span className="text-gray-800 text-sm font-black font-sans">88%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#B71C1C] h-full rounded-full" style={{ width: "88%" }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#B71C1C] text-white p-4 rounded-sm flex gap-3 shadow-sm border border-red-800">
                <div className="mt-0.5">
                    <ShieldAlert size={20} className="text-white fill-transparent stroke-[2]" />
                </div>
                <div>
                    <h4 className="text-xs font-bold tracking-wide">Data Privacy Protocol</h4>
                    <p className="text-[11px] text-red-100 mt-1 leading-relaxed font-medium">
                        Ensure all patient records are locked after registration. Do not leave the terminal unattended with sensitive medical data visible on-screen.
                    </p>
                </div>
            </div>
        </div>
    );
}