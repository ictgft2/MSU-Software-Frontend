"use client";

import React, { useState, ChangeEvent } from "react";
import { Clock, RefreshCw, ShieldCheck } from "lucide-react";
import PatientBanner from "@src/components/consultation/PatientBanner";
import VitalTelemetry from "@src/components/consultation/VitalTelemetry";
import ConsultationWorkspace from "@src/components/consultation/ConsultationWorkspace";
import { SoapNotes, MedicationPrescription, DiagnosticOrders } from "@src/types/consultation";

const initialSoap: SoapNotes = {
    subjective: "Patient reports persistent headaches and occasional dizziness since 3 days...",
    objective: "BP 152/94 (L arm), HR 82bpm. Mild edema noted in lower extremities...",
    assessment: "Likely Essential Hypertension. Ruling out secondary causes...",
    plan: "Start Amodiopine 5mg OD. Schedule ECG and Labs...",
};

const initialPrescriptions: MedicationPrescription[] = [
    { id: "p-1", name: "Amlodipine Besylate 5mg", dosage: "1 Tablet Daily (OD)", durationDays: 30 },
    { id: "p-2", name: "Lisinopril 10mg", dosage: "1 Tablet Nightly (ON)", durationDays: 30 },
];

export default function NursesStationPage() {
    const [soapNotes, setSoapNotes] = useState<SoapNotes>(initialSoap);
    const [prescriptions, setPrescriptions] = useState<MedicationPrescription[]>(initialPrescriptions);
    const [diagnostics, setDiagnostics] = useState<DiagnosticOrders>({
        cbc: false,
        lipidProfile: false,
        ecg12Lead: true,
        kft: true,
        additionalInstructions: "",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // SOAP State Change router
    const handleSoapChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSoapNotes((prev) => ({ ...prev, [name]: value }));
    };

    // Prescription Modifiers
    const handleAddDrug = () => {
        const newDrug: MedicationPrescription = {
            id: `p-${Date.now()}`,
            name: "New Assigned Agent Placeholder",
            dosage: "1 Tab Generic Route",
            durationDays: 7,
        };
        setPrescriptions((prev) => [...prev, newDrug]);
    };

    const handleRemoveDrug = (id: string) => {
        setPrescriptions((prev) => prev.filter((d) => d.id !== id));
    };

    // Diagnostics Checkbox Toggles
    const handleDiagnosticToggle = (field: keyof Omit<DiagnosticOrders, "additionalInstructions">) => {
        setDiagnostics((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInstructionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDiagnostics((prev) => ({ ...prev, additionalInstructions: e.target.value }));
    };

    // Submission pipeline route handlers
    const handleFinalizeConsultation = async (isDraft: boolean) => {
        setIsSubmitting(true);
        const finalPayload = {
            patientId: "GIL-992-04",
            soapNotes,
            prescriptions,
            diagnostics,
            isDraft,
            finalizedAt: new Date().toISOString(),
        };

        try {
            console.log(`🚀 Dispatching consultation packet [Draft Mode: ${isDraft}]`, finalPayload);
            await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate async network call
            alert(isDraft ? "Consultation draft updated successfully." : "Consultation finalized. Records locked.");
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 flex flex-col justify-between min-h-full">
            <div className="space-y-6">
                {/* Core demographic metadata panels */}
                <PatientBanner />

                {/* Real-time vitals monitoring charts row */}
                <VitalTelemetry />

                {/* Workspace interface execution center split */}
                <ConsultationWorkspace
                    soapNotes={soapNotes}
                    onSoapNotesChange={handleSoapChange}
                    prescriptions={prescriptions}
                    onAddPrescription={handleAddDrug}
                    onRemovePrescription={handleRemoveDrug}
                    diagnostics={diagnostics}
                    onDiagnosticToggle={handleDiagnosticToggle}
                    onInstructionsChange={handleInstructionsChange}
                />

                {/* Workspace Finalize Actions Footer Button Group Row */}
                <div className="flex gap-4 justify-end pt-2">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleFinalizeConsultation(true)}
                        className="px-6 py-3 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase rounded-sm transition-colors tracking-wide disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleFinalizeConsultation(false)}
                        className="px-10 py-3 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-black text-xs uppercase rounded-sm transition-colors tracking-wider shadow-sm disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Locking Session..." : "Finalize Consultation"}
                    </button>
                </div>
            </div>

            {/* Footer System Status Strip bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-500 font-mono pt-4 border-t border-gray-200 gap-2">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> Elapsed: 12:45s</span>
                    <span className="flex items-center gap-1"><RefreshCw size={12} /> Autosaved 2m ago</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50/50 border border-amber-200/50 px-2 py-0.5 rounded-xs font-sans font-bold">
                    <ShieldCheck size={12} className="stroke-[2.5]" />
                    Patient has active drug allergies: Penicillin
                </div>
            </div>
        </div>
    );
}