"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { RegistrationFormData, CaseType } from "@src/types/protocol";

const initialFormState: RegistrationFormData = {
    legalFullName: "",
    dateOfBirth: "",
    contactNumber: "",
    identificationId: "",
    mainComplaint: "",
    caseType: "STANDARD",
};

export default function RegistrationForm() {
    const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Strongly typed generic input change handler
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Dedicated case switcher toggle handler
    const handleCaseTypeChange = (type: CaseType) => {
        setFormData((prev) => ({
            ...prev,
            caseType: type,
        }));
    };

    // Submit Handler pipeline
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Basic Validation Check
        if (!formData.legalFullName || !formData.mainComplaint) {
            setSubmitError("Please fill out the Legal Full Name and Main Complaint fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            console.log("🚀 Payload dispatch initiated:", formData);

            // PLACEHOLDER: Connect your endpoint handler here
            // const response = await fetch('/api/v1/patients/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // });
            // if (!response.ok) throw new Error("Server rejected entry");

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Registration completed successfully!");
            setFormData(initialFormState); // Reset to baseline on success
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "An unexpected execution fault occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setSubmitError(null);
    };

    return (
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-[#C62828]" />
                    <h2 className="text-base font-bold text-gray-800">Patient Cold Case Registration</h2>
                </div>

                {/* Case Toggle Switch */}
                <div className="bg-gray-100 p-0.5 rounded flex border border-gray-200 text-[10px] font-bold tracking-wider">
                    <button
                        type="button"
                        onClick={() => handleCaseTypeChange("STANDARD")}
                        className={`px-3 py-1 rounded-sm transition-all ${formData.caseType === "STANDARD" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
                            }`}
                    >
                        STANDARD
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCaseTypeChange("EMERGENCY")}
                        className={`px-3 py-1 rounded-sm transition-all ${formData.caseType === "EMERGENCY" ? "bg-[#C62828] text-white shadow-sm" : "text-gray-400"
                            }`}
                    >
                        EMERGENCY
                    </button>
                </div>
            </div>

            {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs font-semibold text-[#C62828]">
                    {submitError}
                </div>
            )}

            {/* Form Fields Grid */}
            <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Legal Full Name</label>
                        <input
                            type="text"
                            name="legalFullName"
                            value={formData.legalFullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Johnathan Doe"
                            className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-300 text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date of Birth / Age</label>
                        <input
                            type="text"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            placeholder="DD/MM/YYYY or Years"
                            className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-300 text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-300 text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Identification ID</label>
                        <input
                            type="text"
                            name="identificationId"
                            value={formData.identificationId}
                            onChange={handleInputChange}
                            placeholder="SSN or Gov ID"
                            className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-300 text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Main Complaint / Symptoms</label>
                    <textarea
                        rows={4}
                        name="mainComplaint"
                        value={formData.mainComplaint}
                        onChange={handleInputChange}
                        placeholder="Describe the primary reason for visit..."
                        className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-300 text-sm resize-none"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-bold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 tracking-wide uppercase text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <UserPlus size={16} />
                        {isSubmitting ? "Processing..." : "Complete Registration"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-gray-300 rounded-sm text-gray-500 hover:bg-gray-50 font-bold transition-colors uppercase text-xs disabled:opacity-50"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}