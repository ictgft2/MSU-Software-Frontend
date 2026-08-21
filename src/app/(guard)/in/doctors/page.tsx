"use client";

import { useCallback, useEffect, useState, ChangeEvent } from "react";
import {
  Stethoscope,
  ClipboardList,
  Clock3,
  UserRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "@src/components/ui/page-header";
import { Button } from "@src/components/ui/button";
import { KpiCard } from "@src/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardFooter } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import PatientBanner from "@src/components/consultation/PatientBanner";
import ConsultationWorkspace from "@src/components/consultation/ConsultationWorkspace";
import type { Encounter, EncounterVitals, LabTestPlanDTO } from "@src/dto/encounter";
import type { LabResult } from "@src/dto/lab";
import type { ServiceWindow } from "@src/dto/operations";
import type {
  DiagnosticOrders,
  MedicationPrescription,
  ReferralFlags,
  SoapNotes,
} from "@src/types/consultation";
import encountersService from "@src/services/encounters.service";
import labService from "@src/services/lab.service";
import operationsService from "@src/services/operations.service";
import { getApiErrorMessage } from "@src/utils/api-error";
import { requireStaffId } from "@src/utils/staff";
import { isServiceWindowOpen } from "@src/utils/service-window";

const initialSoap: SoapNotes = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

const emptyReferral: ReferralFlags = {
  requiresDressing: false,
  dressingInstructions: "",
  isReferral: false,
  referralFacility: "",
  referralReason: "",
};

function isEmergencyEncounter(item: Encounter) {
  return String(item.admissionType || "").toLowerCase().includes("emergency");
}

function mergeEncounters(lists: Encounter[][]) {
  const map = new Map<string, Encounter>();
  lists.flat().forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export default function DoctorsPage() {
  const [emergencyBoard, setEmergencyBoard] = useState<Encounter[]>([]);
  const [coldBoard, setColdBoard] = useState<Encounter[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [vitals, setVitals] = useState<EncounterVitals | null>(null);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [windowInfo, setWindowInfo] = useState<ServiceWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soapNotes, setSoapNotes] = useState<SoapNotes>(initialSoap);
  const [prescriptions, setPrescriptions] = useState<MedicationPrescription[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticOrders>({
    cbc: false,
    lipidProfile: false,
    ecg12Lead: false,
    kft: false,
    additionalInstructions: "",
  });
  const [referral, setReferral] = useState<ReferralFlags>(emptyReferral);

  const windowOpen = isServiceWindowOpen(windowInfo);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [emergencies, admitted, inTreatment, queued, inConsult, currentWindow] =
        await Promise.all([
          encountersService.list({ type: "Emergency" }).catch(() => []),
          encountersService.listByStatus("Admitted").catch(() => []),
          encountersService.listByStatus("InTreatment").catch(() => []),
          encountersService.listByStatus("Queued").catch(() => []),
          encountersService.listByStatus("InConsultation").catch(() => []),
          operationsService.getServiceWindow().catch(() => null),
        ]);
      setWindowInfo(currentWindow);
      setEmergencyBoard(
        mergeEncounters([emergencies || [], admitted || [], inTreatment || []]).filter(
          isEmergencyEncounter
        )
      );
      setColdBoard(
        mergeEncounters([queued || [], inConsult || []]).filter(
          (item) => !isEmergencyEncounter(item)
        )
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load doctor board"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openEncounter = async (encounterId: string) => {
    setSelectedId(encounterId);
    try {
      const [detail, consultation, latestVitals, results] = await Promise.all([
        encountersService.getById(encounterId).catch(() => null),
        encountersService.getConsultation(encounterId).catch(() => null),
        encountersService.getLatestVitals(encounterId).catch(() => null),
        labService.getEncounterLabResults(encounterId).catch(() => []),
      ]);
      setVitals(latestVitals);
      setLabResults(results || []);
      setSoapNotes({
        subjective: consultation?.clinicalNotes || detail?.chiefComplaint || "",
        objective: "",
        assessment: (consultation?.diagnosis || []).join(", "),
        plan: "",
      });
      setPrescriptions(
        (consultation?.treatmentPlan?.prescriptions || []).map((rx, idx) => ({
          id: `rx-${idx}`,
          name: rx.drugName || "",
          dosage: rx.dosage || "",
          frequency: rx.frequency || "",
          durationDays: Number(String(rx.duration || "").replace(/\D/g, "")) || 3,
          route: rx.route || "Oral",
          instructions: rx.instructions || "",
        }))
      );
      setReferral({
        requiresDressing: Boolean(consultation?.treatmentPlan?.requiresDressing),
        dressingInstructions: consultation?.treatmentPlan?.dressingInstructions || "",
        isReferral: Boolean(consultation?.treatmentPlan?.isReferral),
        referralFacility: consultation?.treatmentPlan?.referralFacility || "",
        referralReason: consultation?.treatmentPlan?.referralReason || "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load encounter"));
    }
  };

  const selected =
    emergencyBoard.find((row) => row.id === selectedId) ||
    coldBoard.find((row) => row.id === selectedId);
  const selectedIsEmergency = selected ? isEmergencyEncounter(selected) : false;
  const canConsult = Boolean(selected) && (selectedIsEmergency || windowOpen);

  const handleFinalize = async () => {
    if (!selectedId) {
      toast.error("Select an encounter first");
      return;
    }
    if (!canConsult) {
      toast.error("Cold-case consultation window is closed.");
      return;
    }
    setIsSubmitting(true);
    try {
      const labTests: LabTestPlanDTO[] = [];
      if (diagnostics.cbc) {
        labTests.push({
          testName: "Full Blood Count",
          clinicalIndication: diagnostics.additionalInstructions || "CBC requested",
        });
      }
      if (diagnostics.lipidProfile) {
        labTests.push({
          testName: "Lipid Profile",
          clinicalIndication: diagnostics.additionalInstructions || "Lipid profile requested",
        });
      }
      if (diagnostics.ecg12Lead) {
        labTests.push({
          testName: "ECG 12-Lead",
          clinicalIndication: diagnostics.additionalInstructions || "ECG requested",
        });
      }
      if (diagnostics.kft) {
        labTests.push({
          testName: "Kidney Function Test",
          clinicalIndication: diagnostics.additionalInstructions || "KFT requested",
        });
      }

      const namedRx = prescriptions.filter((rx) => rx.name);
      await encountersService.createConsultation(selectedId, {
        doctorId: requireStaffId("doctor", "doctorId"),
        diagnosis: [soapNotes.assessment || "Clinical review"].filter(Boolean),
        clinicalNotes: [soapNotes.subjective, soapNotes.objective, soapNotes.plan]
          .filter(Boolean)
          .join("\n\n"),
        treatmentPlan: {
          prescriptions: namedRx.map((rx) => ({
            drugName: rx.name,
            dosage: rx.dosage,
            frequency: rx.frequency,
            duration: `${rx.durationDays} days`,
            route: rx.route,
            instructions: rx.instructions || null,
          })),
          labTests,
          requiresDressing: referral.requiresDressing,
          dressingInstructions: referral.dressingInstructions || null,
          isReferral: referral.isReferral,
          referralFacility: referral.referralFacility || null,
          referralReason: referral.referralReason || null,
        },
      });

      try {
        if (referral.isReferral) {
          await encountersService.updateStatus(selectedId, { status: "Referred" });
        } else if (namedRx.length) {
          await encountersService.updateStatus(selectedId, { status: "PharmacyPending" });
        } else if (labTests.length) {
          await encountersService.updateStatus(selectedId, { status: "LabPending" });
        } else if (referral.requiresDressing) {
          await encountersService.updateStatus(selectedId, { status: "DressingPending" });
        }
      } catch {
        // Status patch may 500; consultation still posted.
      }

      toast.success("Consultation submitted. Pharmacy is next if drugs were ordered.");
      void load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save consultation"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Doctors Station"
        description="Emergencies any time. Cold cases only while the consult window is open."
        actions={
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Emergency ward"
          value={isLoading ? "—" : String(emergencyBoard.length).padStart(2, "0")}
          hint="Seen immediately"
          icon={ClipboardList}
          accent
        />
        <KpiCard
          label="Cold-case board"
          value={isLoading ? "—" : String(coldBoard.length).padStart(2, "0")}
          hint={windowOpen ? "Window open" : "Window closed"}
          icon={Stethoscope}
        />
        <KpiCard
          label="Lab results"
          value={String(labResults.length).padStart(2, "0")}
          hint="Selected encounter"
          icon={Clock3}
        />
        <KpiCard
          label="Latest BP"
          value={
            vitals
              ? `${vitals.bloodPressureSystolic ?? "—"}/${vitals.bloodPressureDiastolic ?? "—"}`
              : "—"
          }
          hint="Nurses chart"
          icon={UserRound}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Emergency — any time</CardTitle>
            <Badge variant="live">WARD</Badge>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="border-0">
                <TableHead>Patient</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {emergencyBoard.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No emergency encounters.</TableCell>
                </TableRow>
              )}
              {emergencyBoard.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.patientName || row.fullName || row.id.slice(0, 8)}</TableCell>
                  <TableCell>{row.chiefComplaint || "—"}</TableCell>
                  <TableCell>{row.status || "—"}</TableCell>
                  <TableCell>
                    <Button size="xs" onClick={() => void openEncounter(row.id)}>
                      See now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Cold cases — service window</CardTitle>
            <Badge variant={windowOpen ? "live" : "priority"}>{windowOpen ? "OPEN" : "CLOSED"}</Badge>
          </CardHeader>
          {!windowOpen && (
            <p className="px-4 py-2 text-xs text-amber-800 bg-amber-50 border-b border-amber-100">
              Cold-case consultation starts after 1st service and ends at the last sermon. Emergencies continue.
            </p>
          )}
          <Table>
            <TableHeader>
              <TableRow className="border-0">
                <TableHead>Patient</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {coldBoard.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No cold-case patients waiting.</TableCell>
                </TableRow>
              )}
              {coldBoard.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.patientName || row.fullName || row.id.slice(0, 8)}</TableCell>
                  <TableCell>{row.chiefComplaint || "—"}</TableCell>
                  <TableCell>{row.status || "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      disabled={!windowOpen}
                      onClick={() => void openEncounter(row.id)}
                    >
                      Consult
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CardFooter>
            <span>Queued and InConsultation only</span>
          </CardFooter>
        </Card>
      </div>

      {selectedId && (
        <div className="space-y-4">
          <PatientBanner
            patient={{
              id: selected?.patientId || selectedId,
              name: selected?.patientName || selected?.fullName || "Patient",
              dob: "—",
              age: 0,
              gender: "Other",
              bloodType: "—",
              phone: "—",
              lastVisit: selected?.createdAt
                ? new Date(selected.createdAt).toLocaleDateString()
                : "—",
            }}
            referral={referral}
            onReferralChange={setReferral}
          />
          {vitals && (
            <p className="text-xs text-surface-muted">
              Vitals: BP {vitals.bloodPressureSystolic ?? "—"}/{vitals.bloodPressureDiastolic ?? "—"} · Temp{" "}
              {vitals.temperature ?? "—"} · SpO2 {vitals.spo2 ?? "—"}
            </p>
          )}
          {labResults.length > 0 && (
            <p className="text-xs text-surface-muted">
              Lab: {labResults.map((r) => r.testName || r.conclusion || "result").join(", ")}
            </p>
          )}
          <ConsultationWorkspace
            soapNotes={soapNotes}
            onSoapNotesChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setSoapNotes((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            prescriptions={prescriptions}
            onAddPrescription={() =>
              setPrescriptions((prev) => [
                ...prev,
                {
                  id: `p-${Date.now()}`,
                  name: "",
                  dosage: "",
                  frequency: "As directed",
                  durationDays: 5,
                  route: "Oral",
                  instructions: "",
                },
              ])
            }
            onRemovePrescription={(id) =>
              setPrescriptions((prev) => prev.filter((d) => d.id !== id))
            }
            onPrescriptionChange={(id, patch) =>
              setPrescriptions((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
              )
            }
            diagnostics={diagnostics}
            onDiagnosticToggle={(field) =>
              setDiagnostics((prev) => ({ ...prev, [field]: !prev[field] }))
            }
            onInstructionsChange={(e) =>
              setDiagnostics((prev) => ({
                ...prev,
                additionalInstructions: e.target.value,
              }))
            }
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={isSubmitting || !canConsult}
              onClick={() => void handleFinalize()}
            >
              {isSubmitting ? "Submitting..." : "Finalize consultation"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
