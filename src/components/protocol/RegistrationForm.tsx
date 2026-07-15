"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { RegistrationFormData, CaseType } from "@src/types/protocol";
import { staffIds } from "@src/constants/api";
import patientsService from "@src/services/patients.service";
import encountersService from "@src/services/encounters.service";
import operationsService from "@src/services/operations.service";
import { getApiErrorMessage } from "@src/utils/api-error";

const initialFormState: RegistrationFormData = {
  fullName: "",
  age: "",
  sex: "F",
  phone: "",
  address: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
  nextOfKinRelationship: "",
  chiefComplaint: "",
  arrivalMode: "WalkedIn",
  caseType: "STANDARD",
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaseTypeChange = (type: CaseType) => {
    setFormData((prev) => ({ ...prev, caseType: type }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!formData.fullName || !formData.chiefComplaint || !formData.phone) {
      setSubmitError("Full name, phone, and chief complaint are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const patient = await patientsService.register({
        fullName: formData.fullName,
        age: Number(formData.age) || 0,
        sex: formData.sex,
        phone: formData.phone,
        address: formData.address,
        nextOfKinName: formData.nextOfKinName,
        nextOfKinPhone: formData.nextOfKinPhone,
        nextOfKinRelationship: formData.nextOfKinRelationship,
      });

      if (!patient?.id) {
        throw new Error("Patient created but no id was returned.");
      }

      const encounter = await encountersService.open({
        patientId: patient.id,
        admissionType:
          formData.caseType === "EMERGENCY" ? "Emergency" : "ColdCase",
        arrivalMode: formData.arrivalMode,
        chiefComplaint: formData.chiefComplaint,
        registeredBy: staffIds.registrar || "protocol-desk",
      });

      if (encounter?.id) {
        try {
          await operationsService.joinQueue(encounter.id);
        } catch {
          // Encounter may already be queued by backend.
        }
      }

      toast.success("Patient registered and encounter opened");
      setFormData(initialFormState);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to register patient");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-[#C62828]" />
          <h2 className="text-base font-bold text-gray-800">
            Patient Registration
          </h2>
        </div>

        <div className="bg-gray-100 p-0.5 rounded flex border border-gray-200 text-[10px] font-bold tracking-wider">
          <button
            type="button"
            onClick={() => handleCaseTypeChange("STANDARD")}
            className={`px-3 py-1 rounded-sm transition-all ${
              formData.caseType === "STANDARD"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-400"
            }`}
          >
            COLD CASE
          </button>
          <button
            type="button"
            onClick={() => handleCaseTypeChange("EMERGENCY")}
            className={`px-3 py-1 rounded-sm transition-all ${
              formData.caseType === "EMERGENCY"
                ? "bg-[#C62828] text-white shadow-sm"
                : "text-gray-400"
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

      <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} />
          <Field label="Age" name="age" value={formData.age} onChange={handleInputChange} disabled={isSubmitting} placeholder="44" />
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sex</label>
            <select name="sex" value={formData.sex} onChange={handleInputChange} disabled={isSubmitting} className="w-full p-2.5 border border-gray-300 rounded-sm text-sm">
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </div>
          <Field label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
          <Field label="Address" name="address" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} />
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Arrival Mode</label>
            <select name="arrivalMode" value={formData.arrivalMode} onChange={handleInputChange} disabled={isSubmitting} className="w-full p-2.5 border border-gray-300 rounded-sm text-sm">
              <option value="WalkedIn">Walked In</option>
              <option value="BroughtIn">Brought In</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <Field label="Next of Kin Name" name="nextOfKinName" value={formData.nextOfKinName} onChange={handleInputChange} disabled={isSubmitting} />
          <Field label="Next of Kin Phone" name="nextOfKinPhone" value={formData.nextOfKinPhone} onChange={handleInputChange} disabled={isSubmitting} />
          <Field label="Next of Kin Relationship" name="nextOfKinRelationship" value={formData.nextOfKinRelationship} onChange={handleInputChange} disabled={isSubmitting} />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Chief Complaint
          </label>
          <textarea
            rows={4}
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleInputChange}
            className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 text-sm resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-bold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 tracking-wide uppercase text-xs disabled:bg-gray-400"
          >
            <UserPlus size={16} />
            {isSubmitting ? "Processing..." : "Register & Open Encounter"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              setSubmitError(null);
            }}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-sm text-gray-500 hover:bg-gray-50 font-bold uppercase text-xs disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 text-sm"
      />
    </div>
  );
}
