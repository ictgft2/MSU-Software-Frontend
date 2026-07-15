"use client";

import React, { useState } from "react";
import DispensingQueue from "@src/components/pharmacy/DispensingQueue";
import ProtocolHandover from "@src/components/pharmacy/ProtocolHandover";
import LabRequestsPanel from "@src/components/pharmacy/LabRequests";
import { DispenseQueueItem, LabRequestItem, HandoverBatch } from "@src/types/pharmacy";

const initialDispenseQueue: DispenseQueueItem[] = [
    { id: "1", patientName: "Kalu Okafor", patientId: "GL-11204", medicationName: "Amoxicillin/Clavulanate", dosageDetails: "625mg • BID • 7 Days", isUrgentStat: false },
    { id: "2", patientName: "Elena Rodriguez", patientId: "GL-10992", medicationName: "Metformin", dosageDetails: "500mg • QD • 30 Days", isUrgentStat: false },
    { id: "3", patientName: "Samuel Thompson", patientId: "GL-11588", medicationName: "Epinephrine (Auto-Injector)", dosageDetails: "EMERGENCY STAT", isUrgentStat: true },
    { id: "4", patientName: "Chinua Achebe", patientId: "GL-11301", medicationName: "Lisinopril", dosageDetails: "10mg • QD • 90 Days", isUrgentStat: false },
];

const initialLabRequests: LabRequestItem[] = [
    { id: "LAB-77291", testName: "Fasting Blood Sugar", patientName: "Michael K. (GL-11440)", patientId: "GL-11440", status: "PROCESSING" },
    { id: "LAB-77295", testName: "Malaria Parasite (MP)", patientName: "Amara O. (GL-11502)", patientId: "GL-11502", status: "PENDING" },
    { id: "LAB-77288", testName: "Full Blood Count", patientName: "David L. (GL-10887)", patientId: "GL-10887", status: "COMPLETED" },
];

const initialHandoverBatches: HandoverBatch[] = [
    { id: "#PH-882", timestamp: "14:20 PM", patientName: "Sarah Williams", patientId: "GL-11005", itemsDescription: "Artemether-Lumefantrine + Vitamin C", isConfirmed: false },
    { id: "#PH-883", timestamp: "14:45 PM", patientName: "John Doe", patientId: "GL-10221", itemsDescription: "Salbutamol Inhaler (x2)", isConfirmed: false },
];

export default function PharmacyAndLabPage() {
    const [dispenseQueue, setDispenseQueue] = useState<DispenseQueueItem[]>(initialDispenseQueue);
    const [labRequests, setLabRequests] = useState<LabRequestItem[]>(initialLabRequests);
    const [handoverBatches, setHandoverBatches] = useState<HandoverBatch[]>(initialHandoverBatches);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Dispensing Action Handler
    const handleDispenseAction = async (id: string, isUrgent: boolean) => {
        try {
            console.log(`Executing dispensing sequence for prescription entry target reference: ${id}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            setDispenseQueue(prev => prev.filter(item => item.id !== id));
            alert(isUrgent ? "CRITICAL DISPATCH COMPLETED. Log updated." : "Verification pass complete. Item dispensed.");
        } catch (err) {
            console.error(err);
        }
    };

    // Lab Progression Action Handler
    const handleLabAction = async (id: string, nextStatus: LabRequestItem['status']) => {
        try {
            console.log(`Mutating lab status trajectory for target block [${id}] to: ${nextStatus}`);
            await new Promise(resolve => setTimeout(resolve, 500));
            setLabRequests(prev => prev.map(req => req.id === id ? { ...req, status: nextStatus } : req));
        } catch (err) {
            console.error(err);
        }
    };

    // Handover Box Validation Toggles
    const handleToggleHandoverConfirm = (id: string) => {
        setHandoverBatches(prev => prev.map(b => b.id === id ? { ...b, isConfirmed: !b.isConfirmed } : b));
    };

    // Dispatch Handover Packet
    const handleSubmitProtocolHandover = async () => {
        setIsSubmitting(true);
        try {
            console.log("🚀 Dispatched secured handovers to central transport logic system:", handoverBatches);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHandoverBatches([]);
            alert("All verified packages cleared and pushed to terminal grid.");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 flex flex-col justify-between min-h-full">
            <div>
                {/* Contextual System Action Row Headers */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pharmacy & Lab Management</h1>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Session Active: Unit 04-B | Station 02</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <button className="px-4 py-2 bg-white border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-sm shadow-2xs">
                            Print Queue Report
                        </button>
                        <button className="px-4 py-2 bg-[#B71C1C] text-white font-bold hover:bg-[#991B1B] transition-colors rounded-sm flex items-center gap-1 shadow-2xs">
                            <span>+ New Dispensing Order</span>
                        </button>
                    </div>
                </div>

                {/* Primary Screen Framework Grids Layout split block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <DispensingQueue queue={dispenseQueue} onAction={handleDispenseAction} />
                        <ProtocolHandover
                            batches={handoverBatches}
                            onToggleConfirm={handleToggleHandoverConfirm}
                            onSubmitHandover={handleSubmitProtocolHandover}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <LabRequestsPanel requests={labRequests} onLabAction={handleLabAction} />
                    </div>
                </div>
            </div>

            {/* Core Lower Telemetry Base status labels */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 font-mono pt-4 border-t border-gray-200 gap-2 select-none">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        System Online
                    </span>
                    <span>Server: AF-WST-01</span>
                </div>
                <div className="flex items-center gap-4 font-bold">
                    <span>Last Sync: 15:02:11</span>
                    <span>v2.4.0-STABLE</span>
                </div>
            </div>
        </div>
    );
}