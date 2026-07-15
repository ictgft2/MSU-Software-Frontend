"use client";

import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import { Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import PatientBanner from "@src/components/consultation/PatientBanner";
import VitalTelemetry from "@src/components/consultation/VitalTelemetry";
import ConsultationWorkspace from "@src/components/consultation/ConsultationWorkspace";
import {
  SoapNotes,
  MedicationPrescription,
  DiagnosticOrders,
  VitalMetrics,
  PatientHeaderInfo,
} from "@src/types/consultation";
import { staffIds } from "@src/constants/api";
import type { Encounter } from "@src/dto/encounter";
import encountersService from "@src/services/encounters.service";
import { getApiErrorMessage } from "@src/utils/api-error";

const initialSoap: SoapNotes = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

const initialPrescriptions: MedicationPrescription[] = [
  {
    id: "p-1",
    name: "Paracetamol",
    dosage: "500 mg",
    durationDays: 3,
  },
];

export default function NursesStationPage() {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [patient, setPatient] = useState<PatientHeaderInfo | null>(null);
  const [vitals, setVitals] = useState<VitalMetrics | null>(null);
  const [soapNotes, setSoapNotes] = useState<SoapNotes>(initialSoap);
  const [prescriptions, setPrescriptions] =
    useState<MedicationPrescription[]>(initialPrescriptions);
  const [diagnostics, setDiagnostics] = useState<DiagnosticOrders>({
    cbc: false,
    lipidProfile: false,
    ecg12Lead: false,
    kft: false,
    additionalInstructions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBoard = useCallback(async () => {
    try {
      const [inConsult, queued] = await Promise.all([
        encountersService.listByStatus("InConsultation").catch(() => []),
        encountersService.listByStatus("Queued").catch(() => []),
      ]);
      const list = [...(inConsult || []), ...(queued || [])];
      setEncounters(list);
      if (!selectedId && list[0]?.id) {
        setSelectedId(list[0].id);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load encounters"));
    }
  }, [selectedId]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;

    async function hydrate() {
      try {
        const detail = await encountersService.getById(selectedId);
        if (!active) return;
        setPatient({
          id: detail.patientId || detail.id,
          name: detail.patientName || detail.fullName || "Patient",
          dob: "—",
          age: 0,
          gender: "Other",
          bloodType: "—",
          lastVisit: detail.createdAt
            ? new Date(detail.createdAt).toLocaleDateString()
            : "—",
        });
        setSoapNotes({
          subjective: detail.chiefComplaint || "",
          objective: "",
          assessment: "",
          plan: "",
        });

        try {
          const latest = await encountersService.getLatestVitals(selectedId);
          if (!active || !latest) return;
          setVitals({
            bloodPressure: `${latest.bloodPressureSystolic ?? "—"}/${latest.bloodPressureDiastolic ?? "—"}`,
            temperatureCelsius: latest.temperature ?? 0,
            weightKg: latest.weight ?? 0,
            bmi: 0,
            o2SaturationPercent: latest.spo2 ?? 0,
          });
        } catch {
          setVitals(null);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load encounter"));
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [selectedId]);

  const handleSoapChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSoapNotes((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDrug = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        name: "New medication",
        dosage: "1 tab",
        durationDays: 5,
      },
    ]);
  };

  const handleRemoveDrug = (id: string) => {
    setPrescriptions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDiagnosticToggle = (
    field: keyof Omit<DiagnosticOrders, "additionalInstructions">
  ) => {
    setDiagnostics((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInstructionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDiagnostics((prev) => ({
      ...prev,
      additionalInstructions: e.target.value,
    }));
  };

  const handleSaveVitals = async () => {
    if (!selectedId) return;
    try {
      await encountersService.recordVitals(selectedId, {
        recordedBy: staffIds.nurse || "nurse",
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        pulseRate: 78,
        temperature: vitals?.temperatureCelsius || 36.8,
        spo2: vitals?.o2SaturationPercent || 98,
        respiratoryRate: 18,
        weight: vitals?.weightKg || 70,
        notes: "Recorded from nurses station",
      });
      toast.success("Vitals recorded");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record vitals"));
    }
  };

  const handleFinalizeConsultation = async (isDraft: boolean) => {
    if (!selectedId) {
      toast.error("Select an encounter first");
      return;
    }
    setIsSubmitting(true);
    try {
      const labTests: string[] = [];
      if (diagnostics.cbc) labTests.push("Full Blood Count");
      if (diagnostics.lipidProfile) labTests.push("Lipid Profile");
      if (diagnostics.ecg12Lead) labTests.push("ECG 12-Lead");
      if (diagnostics.kft) labTests.push("Kidney Function Test");

      await encountersService.createConsultation(selectedId, {
        doctorId: staffIds.doctor || "doctor",
        diagnosis: [soapNotes.assessment || "Clinical review"].filter(Boolean),
        clinicalNotes: [
          soapNotes.subjective,
          soapNotes.objective,
          soapNotes.plan,
          isDraft ? "[DRAFT]" : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        treatmentPlan: {
          prescriptions: prescriptions.map((rx) => ({
            drugName: rx.name,
            dosage: rx.dosage,
            frequency: "As directed",
            duration: `${rx.durationDays} days`,
            route: "Oral",
            instructions: "Take as prescribed",
          })),
          labTests,
          requiresDressing: false,
          dressingInstructions: null,
          isReferral: false,
          referralFacility: null,
          referralReason: null,
        },
      });

      toast.success(isDraft ? "Consultation draft saved" : "Consultation submitted");
      void loadBoard();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Unable to save consultation"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col justify-between min-h-full">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="text-xl font-bold">Nurses / Consultation Station</h1>
            <p className="text-xs text-surface-muted">
              Select an encounter, record vitals, then submit consultation
            </p>
          </div>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-surface-border rounded-lg px-3 py-2 text-sm bg-white min-w-[240px]"
          >
            <option value="">Select encounter</option>
            {encounters.map((item) => (
              <option key={item.id} value={item.id}>
                {(item.patientName || item.fullName || item.id.slice(0, 8)) +
                  ` · ${item.status || "—"}`}
              </option>
            ))}
          </select>
        </div>

        <PatientBanner patient={patient || undefined} />
        <VitalTelemetry vitals={vitals || undefined} />
        <button
          type="button"
          onClick={() => void handleSaveVitals()}
          className="px-4 py-2 text-xs font-bold uppercase border border-gray-300 rounded-sm hover:bg-gray-50"
        >
          Record Vitals Snapshot
        </button>

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

        <div className="flex gap-4 justify-end pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleFinalizeConsultation(true)}
            className="px-6 py-3 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase rounded-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleFinalizeConsultation(false)}
            className="px-10 py-3 bg-[#B71C1C] hover:bg-[#991B1B] text-white font-black text-xs uppercase rounded-sm disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Finalize Consultation"}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-500 font-mono pt-4 border-t border-gray-200 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock size={12} /> Encounter-linked workflow
          </span>
          <button
            type="button"
            onClick={() => void loadBoard()}
            className="flex items-center gap-1 hover:text-gray-800"
          >
            <RefreshCw size={12} /> Refresh board
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50/50 border border-amber-200/50 px-2 py-0.5 font-sans font-bold">
          <ShieldCheck size={12} />
          Uses /encounters/:id/vitals and /consultation
        </div>
      </div>
    </div>
  );
}
