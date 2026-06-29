"use client";

import React, { useState, ChangeEvent } from "react";
import { Plus, Trash2, FileEdit, ClipboardList, Beaker } from "lucide-react";
import { SoapNotes, MedicationPrescription, DiagnosticOrders } from "@src/types/consultation";

interface WorkspaceProps {
    soapNotes: SoapNotes;
    onSoapNotesChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    prescriptions: MedicationPrescription[];
    onAddPrescription: () => void;
    onRemovePrescription: (id: string) => void;
    diagnostics: DiagnosticOrders;
    onDiagnosticToggle: (field: keyof Omit<DiagnosticOrders, "additionalInstructions">) => void;
    onInstructionsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ConsultationWorkspace({
    soapNotes,
    onSoapNotesChange,
    prescriptions,
    onAddPrescription,
    onRemovePrescription,
    diagnostics,
    onDiagnosticToggle,
    onInstructionsChange,
}: WorkspaceProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Left Column: SOAP Notes Panel Form */}
            <div className="bg-white border border-gray-200 rounded-sm shadow-2xs overflow-hidden">
                <div className="bg-[#2D3134] text-white p-3 px-4 flex items-center gap-2 text-xs font-bold tracking-wide">
                    <FileEdit size={14} />
                    <span>SOAP Clinical Notes</span>
                    <span className="ml-auto text-[9px] font-mono text-gray-400 font-normal">ENTRY 2024-05-18-1022</span>
                </div>
                <div className="p-4 space-y-4 text-xs">
                    {/* Subjective input block */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-[#C62828] uppercase tracking-wide">Subjective</label>
                        <textarea
                            name="subjective"
                            value={soapNotes.subjective}
                            onChange={onSoapNotesChange}
                            rows={3}
                            className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700 leading-relaxed font-medium resize-none"
                        />
                    </div>
                    {/* Objective input block */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-[#C62828] uppercase tracking-wide">Objective</label>
                        <textarea
                            name="objective"
                            value={soapNotes.objective}
                            onChange={onSoapNotesChange}
                            rows={3}
                            className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700 leading-relaxed font-medium resize-none"
                        />
                    </div>
                    {/* Assessment input block */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-[#C62828] uppercase tracking-wide">Assessment</label>
                        <textarea
                            name="assessment"
                            value={soapNotes.assessment}
                            onChange={onSoapNotesChange}
                            rows={3}
                            className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700 leading-relaxed font-medium resize-none"
                        />
                    </div>
                    {/* Plan input block */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-[#C62828] uppercase tracking-wide">Plan</label>
                        <textarea
                            name="plan"
                            value={soapNotes.plan}
                            onChange={onSoapNotesChange}
                            rows={3}
                            className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700 leading-relaxed font-medium resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Prescription and Lab Modules */}
            <div className="space-y-6">

                {/* Prescription Tray Component section */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-2xs overflow-hidden">
                    <div className="bg-gray-100 p-3 px-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <ClipboardList size={14} /> Digital Prescription
                        </span>
                        <button
                            type="button"
                            onClick={onAddPrescription}
                            className="bg-[#2B2B2B] hover:bg-black text-white font-extrabold text-[9px] px-2 py-1 rounded-xs tracking-wider uppercase flex items-center gap-1 transition-colors"
                        >
                            <Plus size={10} /> Add Drug
                        </button>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-[#1A1C1E] text-gray-400 font-bold text-[9px] uppercase tracking-wider border-b border-gray-200">
                                <th className="p-2.5 pl-4">Medication Name</th>
                                <th className="p-2.5">Dosage</th>
                                <th className="p-2.5">Duration</th>
                                <th className="p-2.5 pr-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {prescriptions.map((drug) => (
                                <tr key={drug.id} className="hover:bg-gray-50/50">
                                    <td className="p-2.5 pl-4 font-bold text-gray-800">{drug.name}</td>
                                    <td className="p-2.5 text-gray-600 font-medium">{drug.dosage}</td>
                                    <td className="p-2.5 text-gray-600 font-mono font-bold">{drug.durationDays} Days</td>
                                    <td className="p-2.5 pr-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onRemovePrescription(drug.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors inline-flex"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Labs & Diagnostic Orders Component Card */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-2xs overflow-hidden">
                    <div className="bg-gray-100 p-3 px-4 border-b border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Beaker size={14} /> Lab & Diagnostic Orders
                    </div>
                    <div className="p-4 space-y-4 text-xs">
                        {/* Custom Grid Toggles matching original frame assets layout */}
                        <div className="grid grid-cols-2 gap-3 font-semibold text-gray-800">
                            <label className="flex items-center gap-2.5 p-2 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={diagnostics.cbc}
                                    onChange={() => onDiagnosticToggle("cbc")}
                                    className="accent-[#C62828] w-3.5 h-3.5"
                                />
                                <span>Complete Blood Count (CBC)</span>
                            </label>
                            <label className="flex items-center gap-2.5 p-2 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={diagnostics.lipidProfile}
                                    onChange={() => onDiagnosticToggle("lipidProfile")}
                                    className="accent-[#C62828] w-3.5 h-3.5"
                                />
                                <span>Lipid Profile</span>
                            </label>
                            <label className={`flex items-center gap-2.5 p-2 border rounded-sm cursor-pointer transition-colors ${diagnostics.ecg12Lead ? "bg-[#C62828] text-white border-transparent" : "border-gray-200 hover:bg-gray-50"
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={diagnostics.ecg12Lead}
                                    onChange={() => onDiagnosticToggle("ecg12Lead")}
                                    className="accent-white w-3.5 h-3.5"
                                />
                                <span>12-Lead ECG</span>
                            </label>
                            <label className={`flex items-center gap-2.5 p-2 border rounded-sm cursor-pointer transition-colors ${diagnostics.kft ? "bg-[#C62828] text-white border-transparent" : "border-gray-200 hover:bg-gray-50"
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={diagnostics.kft}
                                    onChange={() => onDiagnosticToggle("kft")}
                                    className="accent-white w-3.5 h-3.5"
                                />
                                <span>Kidney Function Test (KFT)</span>
                            </label>
                        </div>

                        <div className="space-y-1">
                            <textarea
                                value={diagnostics.additionalInstructions}
                                onChange={onInstructionsChange}
                                rows={3}
                                placeholder="Additional instructions for lab technician..."
                                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-sm placeholder-gray-400 resize-none"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}