"use client";

import { AlertTriangle, ShieldAlert, Activity, MapPin } from "lucide-react";

export default function AlertsPanel() {
    return (
        <div className="space-y-4 flex flex-col h-full">

            {/* Urgent Warning Block Container */}
            <div className="border border-gray-200 rounded bg-white shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="bg-[#B71C1C] text-white p-3 px-4 flex items-center gap-2 font-bold text-sm tracking-wide">
                    <AlertTriangle size={16} className="text-white" />
                    <span>URGENT CRITICAL ALERTS</span>
                </div>

                {/* Dynamic Inner Alert list stream */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">

                    {/* Card Alert item 1 */}
                    <div className="bg-red-50/80 border-l-4 border-l-[#C62828] border border-red-200/60 p-3 rounded relative">
                        <div className="flex gap-2.5 items-start">
                            <div className="bg-[#C62828] text-white p-1.5 rounded">
                                <Activity size={16} />
                            </div>
                            <div className="flex-1 pr-10">
                                <h4 className="font-bold text-gray-900 text-xs tracking-tight">Cardiac Arrest Risk</h4>
                                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                                    Patient GL-11204 vital drop detected. Red alert triggered in Ward 4B.
                                </p>
                            </div>
                            <span className="absolute top-3 right-3 text-[9px] font-extrabold text-[#C62828] tracking-widest">STAT</span>
                        </div>
                        <button className="w-full mt-3 bg-[#C62828] hover:bg-[#B71C1C] text-white text-[11px] font-bold py-1.5 rounded transition-colors tracking-wide">
                            RESPOND NOW
                        </button>
                    </div>

                    {/* Card Alert item 2 */}
                    <div className="bg-gray-50 border-l-4 border-l-[#C62828] border border-gray-200 p-3 rounded relative">
                        <div className="flex gap-2.5 items-start">
                            <div className="bg-[#B71C1C] text-white p-1.5 rounded">
                                <ShieldAlert size={16} />
                            </div>
                            <div className="flex-1 pr-12">
                                <h4 className="font-bold text-gray-900 text-xs tracking-tight">Hypertensive Crisis</h4>
                                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                                    Patient GL-88219 awaiting arterial line insertion. Doctor R. Vasquez notified.
                                </p>
                            </div>
                            <span className="absolute top-3 right-3 text-[9px] font-extrabold text-red-700 tracking-wider text-right leading-none">
                                PRIORITY<br />1
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-200 my-2" />

                    {/* Facility Log Section notes */}
                    <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Facility Notes</h5>
                        <ul className="text-xs text-gray-700 font-semibold space-y-2 list-disc pl-4 marker:text-gray-400">
                            <li>MRI Scanner 2 undergoing maintenance.</li>
                            <li>O-Negative blood supply at 15% threshold.</li>
                            <li>Shift change in 37 minutes.</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Unit Heatmap Widget */}
            <div className="bg-[#23272A] text-white p-4 rounded border border-gray-800 flex justify-between items-center relative overflow-hidden shadow-md">
                <div className="space-y-2 z-10">
                    <div>
                        <h4 className="text-xs font-bold tracking-wide">Unit Heatmap</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium">High traffic in Trauma A</p>
                    </div>
                    <button className="border border-gray-600 hover:bg-gray-800 text-white text-[10px] font-bold py-1 px-3 rounded transition-colors bg-transparent">
                        Full Map View
                    </button>
                </div>
                <MapPin size={42} className="text-red-900/30 absolute right-4 bottom-2 -rotate-12 stroke-[1.5]" />
            </div>

        </div>
    );
}