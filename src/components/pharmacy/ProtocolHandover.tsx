"use client";

import React from "react";
import { Layers, Send } from "lucide-react";
import { HandoverBatch } from "@src/types/pharmacy";

interface ProtocolHandoverProps {
    batches: HandoverBatch[];
    onToggleConfirm: (id: string) => void;
    onSubmitHandover: () => Promise<void>;
    isSubmitting: boolean;
}

export default function ProtocolHandover({
    batches,
    onToggleConfirm,
    onSubmitHandover,
    isSubmitting,
}: ProtocolHandoverProps) {
    const allConfirmed = batches.every(b => b.isConfirmed) && batches.length > 0;

    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-2xs p-4 space-y-4">
            {/* Section Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                    <Layers size={14} />
                    <span>Ready For Protocol Handover</span>
                </div>
                <span className="bg-gray-800 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-sm">
                    {batches.length} SECURED BATCHES
                </span>
            </div>

            {/* Grid Sub-items list layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((batch) => (
                    <div key={batch.id} className="border border-gray-200 rounded-sm p-4 bg-white space-y-3 relative">
                        <div className="flex justify-between items-start text-[10px]">
                            <span className="bg-gray-100 border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm font-mono font-bold">
                                Batch {batch.id}
                            </span>
                            <span className="font-mono text-gray-400 font-bold">{batch.timestamp}</span>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-900">{batch.patientName} ({batch.patientId})</h4>
                            <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">{batch.itemsDescription}</p>
                        </div>

                        {/* Verification Checkbox Toggle */}
                        <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-gray-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={batch.isConfirmed}
                                onChange={() => onToggleConfirm(batch.id)}
                                disabled={isSubmitting}
                                className="accent-[#B71C1C] w-3.5 h-3.5 border border-gray-300 rounded-xs"
                            />
                            <span className={batch.isConfirmed ? "text-gray-900 font-bold" : ""}>Handover Confirmed</span>
                        </label>
                    </div>
                ))}
            </div>

            {/* Primary Execution Hub Submit */}
            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={onSubmitHandover}
                    disabled={isSubmitting || !allConfirmed}
                    className="bg-[#2D3134] hover:bg-black text-white font-bold text-xs uppercase px-6 py-3 rounded-sm flex items-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed tracking-wide shadow-2xs"
                >
                    <span>{isSubmitting ? "Processing Handovers..." : "Submit to Protocol Team"}</span>
                    <Send size={13} />
                </button>
            </div>
        </div>
    );
}