"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Bed,
  UserRoundCheck,
  FlaskConical,
} from "lucide-react";
import { KpiCard } from "@src/components/ui/kpi-card";
import encountersService from "@src/services/encounters.service";
import operationsService from "@src/services/operations.service";
import pharmacyService from "@src/services/pharmacy.service";

export default function StatCards() {
  const [emergency, setEmergency] = useState("—");
  const [queued, setQueued] = useState("—");
  const [inConsult, setInConsult] = useState("—");
  const [pharmacy, setPharmacy] = useState("—");

  useEffect(() => {
    let active = true;

    async function load() {
      const [queue, consult, pharmacyPending, prescriptions] = await Promise.all([
        operationsService.getQueue().catch(() => []),
        encountersService.listByStatus("InConsultation").catch(() => []),
        encountersService.listByStatus("PharmacyPending").catch(() => []),
        pharmacyService.listPrescriptions("Pending").catch(() => []),
      ]);

      if (!active) return;

      const queueList = queue || [];
      const emergencyCount = queueList.filter((item) =>
        String(item.admissionType || "")
          .toLowerCase()
          .includes("emergency")
      ).length;

      setEmergency(String(emergencyCount).padStart(2, "0"));
      setQueued(String(queueList.length).padStart(2, "0"));
      setInConsult(String((consult || []).length).padStart(2, "0"));
      setPharmacy(
        String(
          Math.max((pharmacyPending || []).length, (prescriptions || []).length)
        ).padStart(2, "0")
      );
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Active Emergency"
        value={emergency}
        hint="Emergency cases in queue"
        icon={HeartPulse}
        accent
      />
      <KpiCard
        label="Cold Cases"
        value={queued}
        hint="Live queue size"
        icon={Bed}
      />
      <KpiCard
        label="In Consultation"
        value={inConsult}
        hint="Active consult encounters"
        icon={UserRoundCheck}
      />
      <KpiCard
        label="Pharma/Lab Hub"
        value={pharmacy}
        hint="Pharmacy pending"
        icon={FlaskConical}
      />
    </div>
  );
}
