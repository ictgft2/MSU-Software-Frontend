"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DispensingQueue from "@src/components/pharmacy/DispensingQueue";
import ProtocolHandover from "@src/components/pharmacy/ProtocolHandover";
import LabRequestsPanel from "@src/components/pharmacy/LabRequests";
import {
  DispenseQueueItem,
  LabRequestItem,
  HandoverBatch,
} from "@src/types/pharmacy";
import { staffIds } from "@src/constants/api";
import pharmacyService from "@src/services/pharmacy.service";
import labService from "@src/services/lab.service";
import { getApiErrorMessage } from "@src/utils/api-error";

function mapPrescriptions(
  rows: Awaited<ReturnType<typeof pharmacyService.listPrescriptions>>
): DispenseQueueItem[] {
  return (rows || []).map((row) => ({
    id: row.id,
    patientName: row.patientName || "Unknown patient",
    patientId: row.patientId || row.encounterId || row.id,
    medicationName: row.drugName || "Prescription",
    dosageDetails: [row.dosage, row.frequency, row.duration]
      .filter(Boolean)
      .join(" · ") || "Pending details",
    isUrgentStat: Boolean(row.isUrgent),
  }));
}

export default function PharmacyAndLabPage() {
  const [dispenseQueue, setDispenseQueue] = useState<DispenseQueueItem[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequestItem[]>([]);
  const [handoverBatches, setHandoverBatches] = useState<HandoverBatch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prescriptions, handovers, labs] = await Promise.all([
        pharmacyService.listPrescriptions("Pending").catch(() => []),
        pharmacyService.listHandovers("Pending").catch(() => []),
        labService.listRequests("Pending").catch(() => []),
      ]);

      setDispenseQueue(mapPrescriptions(prescriptions));
      setHandoverBatches(
        (handovers || []).map((row) => ({
          id: row.id,
          timestamp: row.createdAt
            ? new Date(row.createdAt).toLocaleTimeString()
            : "—",
          patientName: row.patientName || "Unknown",
          patientId: row.patientId || row.encounterId || row.id,
          itemsDescription: row.itemsDescription || "Medication package",
          isConfirmed: false,
        }))
      );
      setLabRequests(
        (labs || []).map((row) => ({
          id: row.id,
          testName: row.testName || "Lab request",
          patientName: row.patientName || "Unknown",
          patientId: row.patientId || row.encounterId || row.id,
          status: (row.status?.toUpperCase() as LabRequestItem["status"]) || "PENDING",
        }))
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load pharmacy board"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDispenseAction = async (id: string, isUrgent: boolean) => {
    try {
      await pharmacyService.dispense(id, {
        pharmacistId: staffIds.pharmacist || "pharmacist",
        quantityDispensed: 1,
        batchNumber: `UI-${Date.now()}`,
        expiryDate: "2027-12-31",
        notes: isUrgent ? "Urgent dispense from UI" : "Dispensed from UI",
      });
      setDispenseQueue((prev) => prev.filter((item) => item.id !== id));
      toast.success(isUrgent ? "Urgent prescription dispensed" : "Prescription dispensed");
      void load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Unable to dispense prescription"));
    }
  };

  const handleLabAction = async (id: string, nextStatus: LabRequestItem["status"]) => {
    try {
      if (nextStatus === "COMPLETED") {
        const current = labRequests.find((req) => req.id === id);
        await labService.submitResult(id, {
          scientistId: staffIds.scientist || "scientist",
          testName: current?.testName || "Lab Test",
          findings: "Result entered from UI",
          values: [
            {
              parameter: "Result",
              value: "See findings",
              unit: "-",
              referenceRange: "-",
            },
          ],
          conclusion: "Completed from pharmacy/lab board",
        });
      }
      setLabRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: nextStatus } : req))
      );
      toast.success("Lab request updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Unable to update lab request"));
    }
  };

  const handleToggleHandoverConfirm = (id: string) => {
    setHandoverBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isConfirmed: !b.isConfirmed } : b))
    );
  };

  const handleSubmitProtocolHandover = async () => {
    setIsSubmitting(true);
    try {
      const confirmed = handoverBatches.filter((b) => b.isConfirmed);
      for (const batch of confirmed) {
        await pharmacyService.confirmHandover(batch.id, {
          protocolOfficerId: staffIds.protocolOfficer || "protocol-officer",
          patientNameVerified: true,
          drugListVerified: true,
          dosageCounsellingDone: true,
          durationCounsellingDone: true,
          counsellingNotes: "Confirmed from UI",
        });
      }
      setHandoverBatches((prev) => prev.filter((b) => !b.isConfirmed));
      toast.success("Handovers confirmed");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Unable to confirm handovers"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col justify-between min-h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Pharmacy & Lab Management
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {isLoading ? "Loading live queues..." : "Live pending prescriptions, handovers, and lab requests"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="px-4 py-2 bg-white border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 rounded-sm text-xs"
          >
            Refresh Board
          </button>
        </div>

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
    </div>
  );
}
